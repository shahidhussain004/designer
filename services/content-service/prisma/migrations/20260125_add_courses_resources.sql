-- Add courses table
CREATE TABLE IF NOT EXISTS "content"."courses" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slug" VARCHAR(255) NOT NULL UNIQUE,
  "title" VARCHAR(255) NOT NULL,
  "short_description" TEXT,
  "description" TEXT,
  "instructor_id" VARCHAR(255) NOT NULL,
  "instructor_name" VARCHAR(255) NOT NULL,
  "price" INTEGER NOT NULL DEFAULT 0,
  "currency" VARCHAR(10) NOT NULL DEFAULT 'USD',
  "thumbnail_url" VARCHAR(500),
  "category" VARCHAR(100),
  "level" VARCHAR(50) NOT NULL DEFAULT 'Beginner',
  "total_duration_minutes" INTEGER NOT NULL DEFAULT 0,
  "total_lessons" INTEGER NOT NULL DEFAULT 0,
  "total_enrollments" INTEGER NOT NULL DEFAULT 0,
  "average_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "review_count" INTEGER NOT NULL DEFAULT 0,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "meta_tags" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

-- Add lessons table
CREATE TABLE IF NOT EXISTS "content"."lessons" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "course_id" UUID NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "video_url" VARCHAR(500),
  "video_duration" INTEGER,
  "content_url" VARCHAR(500),
  "order" INTEGER NOT NULL DEFAULT 0,
  "is_published" BOOLEAN NOT NULL DEFAULT true,
  "views_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("course_id") REFERENCES "content"."courses"("id") ON DELETE CASCADE
);

-- Add resources table
CREATE TABLE IF NOT EXISTS "content"."resources" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slug" VARCHAR(255) NOT NULL UNIQUE,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "content" TEXT NOT NULL,
  "category" VARCHAR(100),
  "tags" TEXT[] DEFAULT ARRAY[]::text[],
  "source_url" VARCHAR(500),
  "author_name" VARCHAR(255),
  "author_url" VARCHAR(500),
  "resource_type" VARCHAR(100),
  "difficulty" VARCHAR(50) DEFAULT 'Intermediate',
  "estimated_read_time" INTEGER,
  "views_count" INTEGER NOT NULL DEFAULT 0,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "meta_tags" JSONB,
  "thumbnail_url" VARCHAR(500),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

-- Add indexes
CREATE INDEX "courses_slug_idx" ON "content"."courses"("slug");
CREATE INDEX "courses_is_published_idx" ON "content"."courses"("is_published");
CREATE INDEX "courses_category_idx" ON "content"."courses"("category");
CREATE INDEX "courses_level_idx" ON "content"."courses"("level");

CREATE INDEX "lessons_course_id_idx" ON "content"."lessons"("course_id");
CREATE INDEX "lessons_order_idx" ON "content"."lessons"("order");

CREATE INDEX "resources_slug_idx" ON "content"."resources"("slug");
CREATE INDEX "resources_is_published_idx" ON "content"."resources"("is_published");
CREATE INDEX "resources_category_idx" ON "content"."resources"("category");
