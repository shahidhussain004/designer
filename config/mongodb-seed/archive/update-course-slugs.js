// Update missing or null slugs in courses collection and ensure uniqueness
db = db.getSiblingDB('lms_db');

function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const cursor = db.courses.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
let updated = 0;
cursor.forEach(function(doc) {
  const base = doc.title ? makeSlug(doc.title) : ('course-' + doc._id.toString().slice(-6));
  let candidate = base;
  // If candidate is empty, use id suffix
  if (!candidate) candidate = 'course-' + doc._id.toString().slice(-6);
  // Ensure uniqueness
  let i = 0;
  while (db.courses.countDocuments({ slug: candidate, _id: { $ne: doc._id } }) > 0) {
    i++;
    candidate = base + '-' + i;
  }

  db.courses.updateOne({ _id: doc._id }, { $set: { slug: candidate } });
  print('Updated slug for', doc._id.valueOf(), '->', candidate);
  updated++;
});
print('Total slugs updated:', updated);

// Report any remaining null slugs
const nullCount = db.courses.countDocuments({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
print('Remaining docs with missing/empty slug:', nullCount);
