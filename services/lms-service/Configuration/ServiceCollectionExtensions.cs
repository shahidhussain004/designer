using Amazon;
using Amazon.CloudFront;
using Amazon.S3;
using LmsService.Configuration;
using LmsService.Repositories;
using LmsService.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using StackExchange.Redis;

namespace LmsService.Configuration;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddLmsServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Configure settings
        services.Configure<MongoDbSettings>(configuration.GetSection("MongoDB"));
        services.Configure<AwsSettings>(configuration.GetSection("AWS"));
        services.Configure<JwtSettings>(configuration.GetSection("JWT"));
        services.Configure<KafkaSettings>(configuration.GetSection("Kafka"));
        services.Configure<RedisSettings>(configuration.GetSection("Redis"));
        services.Configure<CertificateSettings>(configuration.GetSection("Certificate"));

        // MongoDB
        services.AddSingleton<IMongoClient>(sp =>
        {
            var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
            return new MongoClient(settings.ConnectionString);
        });

        services.AddSingleton(sp =>
        {
            var client = sp.GetRequiredService<IMongoClient>();
            var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
            return client.GetDatabase(settings.DatabaseName);
        });

        // AWS S3
        services.AddSingleton<IAmazonS3>(sp =>
        {
            var awsSettings = sp.GetRequiredService<IOptions<AwsSettings>>().Value;
            var config = new AmazonS3Config
            {
                RegionEndpoint = RegionEndpoint.GetBySystemName(awsSettings.Region)
            };
            return new AmazonS3Client(awsSettings.AccessKeyId, awsSettings.SecretAccessKey, config);
        });

        // AWS CloudFront
        services.AddSingleton<IAmazonCloudFront>(sp =>
        {
            var awsSettings = sp.GetRequiredService<IOptions<AwsSettings>>().Value;
            var config = new AmazonCloudFrontConfig
            {
                RegionEndpoint = RegionEndpoint.GetBySystemName(awsSettings.Region)
            };
            return new AmazonCloudFrontClient(awsSettings.AccessKeyId, awsSettings.SecretAccessKey, config);
        });

        // Redis
        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var settings = sp.GetRequiredService<IOptions<RedisSettings>>().Value;
            return ConnectionMultiplexer.Connect(settings.ConnectionString);
        });

        services.AddSingleton(sp =>
        {
            var multiplexer = sp.GetRequiredService<IConnectionMultiplexer>();
            return multiplexer.GetDatabase();
        });

        // Repositories
        services.AddScoped<ICourseRepository, CourseRepository>();
        services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
        services.AddScoped<IQuizRepository, QuizRepository>();
        services.AddScoped<ICertificateRepository, CertificateRepository>();

        // Services
        services.AddScoped<ICourseService, CourseService>();
        services.AddScoped<IEnrollmentService, EnrollmentService>();
        services.AddScoped<IQuizService, QuizService>();
        services.AddScoped<ICertificateService, CertificateService>();
        services.AddScoped<IVideoStreamingService, VideoStreamingService>();

        // Hosted Services
        services.AddHostedService<KafkaConsumerService>();

        return services;
    }
}
