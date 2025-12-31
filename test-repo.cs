// Quick test to understand what's happening with MongoDB connection
using MongoDB.Driver;
using MongoDB.Bson;

var connectionString = "mongodb://mongo_user:mongo_pass_dev@localhost:27017/?authSource=admin";
var client = new MongoClient(connectionString);
var db = client.GetDatabase("lms_db");
var coursesCollection = db.GetCollection<dynamic>("courses");

// Test 1: Count all documents
var allCount = await coursesCollection.CountDocumentsAsync(Builders<dynamic>.Filter.Empty);
Console.WriteLine($"Total documents in courses: {allCount}");

// Test 2: Get one document
var oneCourse = await coursesCollection.Find(Builders<dynamic>.Filter.Empty).FirstOrDefaultAsync();
if (oneCourse != null)
{
    Console.WriteLine($"Found course: {oneCourse["title"]}");
    Console.WriteLine($"Status field: {oneCourse["status"]} (type: {oneCourse["status"].GetType().Name})");
}

// Test 3: Count documents where status == 2
var statusFilter = Builders<dynamic>.Filter.Eq("status", 2);
var statusCount = await coursesCollection.CountDocumentsAsync(statusFilter);
Console.WriteLine($"Documents with status==2: {statusCount}");

// Test 4: Try with enum
enum CourseStatus { Draft = 0, PendingReview = 1, Published = 2, Archived = 3 }
var enumFilter = Builders<dynamic>.Filter.Eq("status", (int)CourseStatus.Published);
var enumCount = await coursesCollection.CountDocumentsAsync(enumFilter);
Console.WriteLine($"Documents with enum status==Published(2): {enumCount}");
