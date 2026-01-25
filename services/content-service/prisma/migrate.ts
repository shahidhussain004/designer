/**
 * Database Migration Script for Courses and Resources
 * Executes raw SQL to create missing tables
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Running database migration for Courses and Resources...');

  try {
    console.log('📝 Creating course_level enum...');
    // Create the CourseLevel enum
    try {
      await prisma.$executeRaw`
        CREATE TYPE "content"."course_level" AS ENUM ('Beginner', 'Intermediate', 'Advanced');
      `;
      console.log('✅ Created course_level enum');
    } catch (error: any) {
      if (error.code === 'P0001' || error.message?.includes('already exists')) {
        console.log('ℹ️  CourseLevel enum already exists');
      } else {
        throw error;
      }
    }

    // Check if courses table exists
    let coursesTableExists = false;
    try {
      const tableCheck = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = 'content' 
          AND table_name = 'courses'
        );
      `;
      coursesTableExists = (tableCheck as any[])[0]?.exists || false;
    } catch (error) {
      // If query fails, assume table doesn't exist
      coursesTableExists = false;
    }

    if (!coursesTableExists) {
      console.log('📝 Creating courses, lessons, and resources tables...');
      await prisma.$executeRaw`
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
      `;
      console.log('✅ Created courses table');

      // Create lessons table
      await prisma.$executeRaw`
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
      `;
      console.log('✅ Created lessons table');

      // Create resources table
      await prisma.$executeRaw`
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
      `;
      console.log('✅ Created resources table');

      // Create indexes
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "courses_slug_idx" ON "content"."courses"("slug");`;
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "courses_is_published_idx" ON "content"."courses"("is_published");`;
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "courses_category_idx" ON "content"."courses"("category");`;
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "courses_level_idx" ON "content"."courses"("level");`;

      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "lessons_course_id_idx" ON "content"."lessons"("course_id");`;
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "lessons_order_idx" ON "content"."lessons"("order");`;

      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "resources_slug_idx" ON "content"."resources"("slug");`;
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "resources_is_published_idx" ON "content"."resources"("is_published");`;
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "resources_category_idx" ON "content"."resources"("category");`;

      console.log('✅ Created all indexes');
      console.log('✅ Migration completed successfully!');
    } else {
      console.log('ℹ️  Courses table already exists. Skipping migration.');
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
