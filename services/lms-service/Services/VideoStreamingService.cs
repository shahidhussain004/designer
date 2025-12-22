using Amazon.S3;
using Amazon.S3.Model;
using LmsService.Configuration;
using LmsService.DTOs;
using LmsService.Models;
using LmsService.Repositories;
using Microsoft.Extensions.Options;

namespace LmsService.Services;

public interface IVideoStreamingService
{
    Task<VideoUploadResponse> GetUploadUrlAsync(VideoUploadRequest request);
    Task<string> GetStreamingUrlAsync(string videoKey);
    Task<VideoUploadResponse> UploadCertificatePdfAsync(byte[] pdfBytes, string key);
    Task<bool> DeleteVideoAsync(string videoKey);
}

public class VideoStreamingService : IVideoStreamingService
{
    private readonly IAmazonS3 _s3Client;
    private readonly ICourseRepository _courseRepository;
    private readonly AwsSettings _settings;
    private readonly ILogger<VideoStreamingService> _logger;

    public VideoStreamingService(
        IAmazonS3 s3Client,
        ICourseRepository courseRepository,
        IOptions<AwsSettings> settings,
        ILogger<VideoStreamingService> logger)
    {
        _s3Client = s3Client;
        _courseRepository = courseRepository;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<VideoUploadResponse> GetUploadUrlAsync(VideoUploadRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(request.CourseId)
            ?? throw new InvalidOperationException("Course not found");

        // Find the lesson
        var lesson = course.Modules
            .SelectMany(m => m.Lessons)
            .FirstOrDefault(l => l.Id == request.LessonId)
            ?? throw new InvalidOperationException("Lesson not found");

        // Generate unique video key
        var videoKey = $"courses/{request.CourseId}/lessons/{request.LessonId}/{Guid.NewGuid()}/{request.FileName}";

        var presignedRequest = new GetPreSignedUrlRequest
        {
            BucketName = _settings.VideoBucketName,
            Key = videoKey,
            Verb = HttpVerb.PUT,
            ContentType = request.ContentType,
            Expires = DateTime.UtcNow.AddMinutes(_settings.PresignedUrlExpirationMinutes)
        };

        var uploadUrl = await _s3Client.GetPreSignedURLAsync(presignedRequest);
        var streamUrl = GetCloudFrontUrl(videoKey);

        // Update lesson with video key
        lesson.VideoKey = videoKey;
        lesson.VideoUrl = streamUrl;
        await _courseRepository.UpdateAsync(course);

        _logger.LogInformation("Generated upload URL for video: {VideoKey}", videoKey);

        return new VideoUploadResponse(
            uploadUrl,
            videoKey,
            streamUrl,
            DateTime.UtcNow.AddMinutes(_settings.PresignedUrlExpirationMinutes)
        );
    }

    public Task<string> GetStreamingUrlAsync(string videoKey)
    {
        // For CloudFront, we can use signed URLs for private content
        // For simplicity, we'll use the public CloudFront URL
        var streamUrl = GetCloudFrontUrl(videoKey);
        return Task.FromResult(streamUrl);
    }

    public async Task<VideoUploadResponse> UploadCertificatePdfAsync(byte[] pdfBytes, string key)
    {
        using var stream = new MemoryStream(pdfBytes);

        var putRequest = new PutObjectRequest
        {
            BucketName = _settings.CertificateBucketName,
            Key = key,
            InputStream = stream,
            ContentType = "application/pdf"
        };

        await _s3Client.PutObjectAsync(putRequest);

        var streamUrl = GetCloudFrontUrl(key);

        _logger.LogInformation("Uploaded certificate PDF: {Key}", key);

        return new VideoUploadResponse(
            string.Empty, // No upload URL needed
            key,
            streamUrl,
            DateTime.MaxValue
        );
    }

    public async Task<bool> DeleteVideoAsync(string videoKey)
    {
        try
        {
            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = _settings.VideoBucketName,
                Key = videoKey
            };

            await _s3Client.DeleteObjectAsync(deleteRequest);
            _logger.LogInformation("Deleted video: {VideoKey}", videoKey);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete video: {VideoKey}", videoKey);
            return false;
        }
    }

    private string GetCloudFrontUrl(string key)
    {
        return $"https://{_settings.CloudFrontDomain}/{key}";
    }
}
