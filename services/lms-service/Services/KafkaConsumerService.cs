using Confluent.Kafka;
using Confluent.Kafka.Admin;
using LmsService.Configuration;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Linq;
using System.Collections.Generic;

namespace LmsService.Services;

public class KafkaConsumerService : BackgroundService
{
    private readonly IConsumer<string, string> _consumer;
    private readonly IServiceProvider _serviceProvider;
    private readonly KafkaSettings _settings;
    private readonly ILogger<KafkaConsumerService> _logger;

    public KafkaConsumerService(
        IServiceProvider serviceProvider,
        IOptions<KafkaSettings> settings,
        ILogger<KafkaConsumerService> logger)
    {
        _serviceProvider = serviceProvider;
        _settings = settings.Value;
        _logger = logger;

        var config = new ConsumerConfig
        {
            BootstrapServers = _settings.BootstrapServers,
            GroupId = _settings.GroupId,
            AutoOffsetReset = AutoOffsetReset.Earliest,
            EnableAutoCommit = true
        };

        _consumer = new ConsumerBuilder<string, string>(config).Build();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Yield();

        var topics = new[]
        {
            "payments.succeeded",
            "users.created"
        };

        // Ensure topics exist before subscribing. This uses the Admin client to create any missing topics
        try
        {
            var adminConfig = new AdminClientConfig { BootstrapServers = _settings.BootstrapServers };
            using var admin = new AdminClientBuilder(adminConfig).Build();
            var meta = admin.GetMetadata(TimeSpan.FromSeconds(10));
            var existing = new HashSet<string>(meta.Topics.Select(t => t.Topic));
            var missing = topics.Where(t => !existing.Contains(t)).ToList();

            if (missing.Any())
            {
                var specs = missing.Select(t =>
                {
                    var partitions = _settings.TopicPartitions != null && _settings.TopicPartitions.TryGetValue(t, out var p)
                        ? p
                        : _settings.DefaultNumPartitions;

                    return new TopicSpecification
                    {
                        Name = t,
                        NumPartitions = partitions,
                        ReplicationFactor = _settings.DefaultReplicationFactor
                    };
                }).ToList();

                try
                {
                    await admin.CreateTopicsAsync(specs);
                    _logger.LogInformation("Created missing Kafka topics: {Topics}", string.Join(", ", missing));
                }
                catch (CreateTopicsException cex)
                {
                    // If topics already exist due to race or another broker, log and continue
                    _logger.LogWarning(cex, "CreateTopicsAsync reported error (topics may already exist)");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to verify/create Kafka topics; consumer will still attempt to subscribe");
        }

        _consumer.Subscribe(topics);
        _logger.LogInformation("Kafka consumer started, subscribed to topics: {Topics}", string.Join(", ", topics));

        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var result = _consumer.Consume(stoppingToken);
                    if (result?.Message != null)
                    {
                        await ProcessMessageAsync(result.Topic, result.Message.Key, result.Message.Value);
                    }
                }
                catch (ConsumeException ex)
                {
                    _logger.LogError(ex, "Error consuming Kafka message");
                }
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("Kafka consumer stopping...");
        }
        finally
        {
            _consumer.Close();
        }
    }

    private async Task ProcessMessageAsync(string topic, string key, string value)
    {
        _logger.LogInformation("Received message from topic {Topic}: {Key}", topic, key);

        try
        {
            switch (topic)
            {
                case "payments.succeeded":
                    await HandlePaymentSucceededAsync(value);
                    break;

                case "users.created":
                    await HandleUserCreatedAsync(value);
                    break;

                default:
                    _logger.LogWarning("Unhandled topic: {Topic}", topic);
                    break;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing message from topic {Topic}", topic);
        }
    }

    private async Task HandlePaymentSucceededAsync(string message)
    {
        // Parse payment message and auto-enroll student if it's a course purchase
        var payment = JsonSerializer.Deserialize<PaymentMessage>(message);
        if (payment?.Type == "course_purchase" && !string.IsNullOrEmpty(payment.CourseId))
        {
            using var scope = _serviceProvider.CreateScope();
            var enrollmentService = scope.ServiceProvider.GetRequiredService<IEnrollmentService>();

            await enrollmentService.EnrollAsync(
                payment.StudentId,
                payment.StudentName,
                payment.StudentEmail,
                new DTOs.EnrollRequest(payment.CourseId, payment.PaymentId)
            );

            _logger.LogInformation("Auto-enrolled student {StudentId} in course {CourseId} after payment",
                payment.StudentId, payment.CourseId);
        }
    }

    private Task HandleUserCreatedAsync(string message)
    {
        // Handle new user creation - could send welcome course recommendations
        _logger.LogInformation("New user created: {Message}", message);
        return Task.CompletedTask;
    }

    public override void Dispose()
    {
        _consumer.Dispose();
        base.Dispose();
    }
}

public record PaymentMessage(
    string PaymentId,
    string Type,
    long StudentId,
    string StudentName,
    string StudentEmail,
    string? CourseId,
    decimal Amount
);
