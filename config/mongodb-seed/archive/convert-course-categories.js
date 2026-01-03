// Convert string enum fields in courses to integer enum ordinals matching CourseCategory, CourseLevel, CourseStatus
// Mapping must match the server-side C# enums in Models/Course.cs

db = db.getSiblingDB('lms_db');

const categoryMap = {
  'UiDesign': 0,
  'UxDesign': 1,
  'GraphicDesign': 2,
  'WebDevelopment': 3,
  'MobileDevelopment': 4,
  'Branding': 5,
  'Illustration': 6,
  'MotionGraphics': 7,
  'Photography': 8,
  'VideoEditing': 9,
  'Marketing': 10,
  'Business': 11,
  'Other': 12,
  // common alternative names -> map to 'Other' or best match
  'Design': 12,
  'DataScience': 12,
  'Full Stack': 12,
  'FullStack': 12
};

const levelMap = {
  'Beginner': 0,
  'Intermediate': 1,
  'Advanced': 2,
  'AllLevels': 3
};

const statusMap = {
  'Draft': 0,
  'PendingReview': 1,
  'Published': 2,
  'Archived': 3,
  'Published': 2
};

let updated = 0;
db.courses.find().forEach(function(doc) {
  const updates = {};
  // category
  if (doc.category && typeof doc.category === 'string') {
    const key = doc.category.replace(/\s+/g, '');
    const mapped = categoryMap[key] !== undefined ? categoryMap[key] : 12;
    updates['category'] = mapped;
  }
  // level
  if (doc.level && typeof doc.level === 'string') {
    const mappedLevel = levelMap[doc.level] !== undefined ? levelMap[doc.level] : 3;
    updates['level'] = mappedLevel;
  }
  // status: if missing, set to Published (2)
  if (doc.status === undefined) {
    updates['status'] = 2;
  } else if (typeof doc.status === 'string') {
    const mappedStatus = statusMap[doc.status] !== undefined ? statusMap[doc.status] : 0;
    updates['status'] = mappedStatus;
  }

  if (Object.keys(updates).length > 0) {
    db.courses.updateOne({ _id: doc._id }, { $set: updates });
    updated++;
    print('Updated', doc._id.valueOf(), JSON.stringify(updates));
  }
});
print('Total documents updated:', updated);
