using Amazon;
using Amazon.CloudFront;
using Amazon.S3;
using LmsService.Configuration;
using LmsService.Models;
using LmsService.Repositories;
using LmsService.Services;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using StackExchange.Redis;

namespace LmsService.Configuration;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddLmsServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Configure MongoDB to serialize enums as integers
        try
        {
            var pack = new ConventionPack();
            pack.Add(new EnumRepresentationConvention(BsonType.Int32));
            ConventionRegistry.Register("EnumAsInt32", pack, t => true);

            // Also register explicit enum serializers
            BsonSerializer.RegisterSerializer(new EnumSerializer<CourseStatus>(BsonType.Int32));
            BsonSerializer.RegisterSerializer(new EnumSerializer<CourseCategory>(BsonType.Int32));
            BsonSerializer.RegisterSerializer(new EnumSerializer<CourseLevel>(BsonType.Int32));
            BsonSerializer.RegisterSerializer(new EnumSerializer<LessonType>(BsonType.String));
        }
        catch { }

        // Configure settings
        services.Configure<MongoDbSettings>(configuration.GetSection("MongoDbSettings"));
        services.Configure<AwsSettings>(configuration.GetSection("AwsSettings"));
        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
        services.Configure<KafkaSettings>(configuration.GetSection("KafkaSettings"));
        services.Configure<RedisSettings>(configuration.GetSection("RedisSettings"));
        services.Configure<CertificateSettings>(configuration.GetSection("CertificateSettings"));

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
