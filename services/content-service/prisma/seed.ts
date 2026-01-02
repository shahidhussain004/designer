/**
 * Content Service Database Seed
 * Seeds initial data including Authors, Categories, Tags, and Content (Articles, Blogs, News)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting content service seeding...');

  try {
    // =====================================================
    // 1. CREATE CATEGORIES
    // =====================================================
    console.log('Creating categories...');

    const categories = await prisma.category.createMany({
      data: [
        {
          name: 'Java Programming',
          slug: 'java-programming',
          description: 'Tutorials and articles about Java programming',
          isActive: true,
          sortOrder: 1,
        },
        {
          name: 'Web Development',
          slug: 'web-development',
          description: 'Web development guides and tutorials',
          isActive: true,
          sortOrder: 2,
        },
        {
          name: 'Spring Boot',
          slug: 'spring-boot',
          description: 'Spring Boot framework tutorials',
          isActive: true,
          sortOrder: 3,
        },
        {
          name: 'React.js',
          slug: 'reactjs',
          description: 'React.js tutorials and best practices',
          isActive: true,
          sortOrder: 4,
        },
        {
          name: 'Database Design',
          slug: 'database-design',
          description: 'Database design and optimization',
          isActive: true,
          sortOrder: 5,
        },
        {
          name: 'DevOps',
          slug: 'devops',
          description: 'DevOps tools and practices',
          isActive: true,
          sortOrder: 6,
        },
        {
          name: 'Cloud Computing',
          slug: 'cloud-computing',
          description: 'Cloud platforms and services',
          isActive: true,
          sortOrder: 7,
        },
        {
          name: 'Technology News',
          slug: 'technology-news',
          description: 'Latest technology news and updates',
          isActive: true,
          sortOrder: 8,
        },
      ],
      skipDuplicates: true,
    });

    console.log(`✓ Created/Updated ${categories.count} categories`);

    // =====================================================
    // 2. CREATE TAGS
    // =====================================================
    console.log('Creating tags...');

    const tags = await prisma.tag.createMany({
      data: [
        { name: 'Tutorial', slug: 'tutorial', color: '#3B82F6' },
        { name: 'Beginner', slug: 'beginner', color: '#10B981' },
        { name: 'Advanced', slug: 'advanced', color: '#F59E0B' },
        { name: 'Best Practices', slug: 'best-practices', color: '#8B5CF6' },
        { name: 'Performance', slug: 'performance', color: '#EF4444' },
        { name: 'Security', slug: 'security', color: '#DC2626' },
        { name: 'API', slug: 'api', color: '#06B6D4' },
        { name: 'Database', slug: 'database', color: '#14B8A6' },
        { name: 'Microservices', slug: 'microservices', color: '#F97316' },
        { name: 'Testing', slug: 'testing', color: '#6366F1' },
      ],
      skipDuplicates: true,
    });

    console.log(`✓ Created/Updated ${tags.count} tags`);

    // =====================================================
    // 3. CREATE AUTHORS
    // =====================================================
    console.log('Creating authors...');

    const authors = await prisma.author.createMany({
      data: [
        {
          userId: 'author-1',
          name: 'John Developer',
          email: 'john@designer.com',
          bio: 'Senior software engineer with 10+ years of experience in Java and Spring Boot',
          avatarUrl: 'https://api.example.com/avatars/john.jpg',
        },
        {
          userId: 'author-2',
          name: 'Sarah Frontend',
          email: 'sarah@designer.com',
          bio: 'Frontend expert specializing in React and modern web technologies',
          avatarUrl: 'https://api.example.com/avatars/sarah.jpg',
        },
        {
          userId: 'author-3',
          name: 'Mike DevOps',
          email: 'mike@designer.com',
          bio: 'DevOps engineer focused on cloud infrastructure and containerization',
          avatarUrl: 'https://api.example.com/avatars/mike.jpg',
        },
        {
          userId: 'author-4',
          name: 'Emily DataArchitect',
          email: 'emily@designer.com',
          bio: 'Database architect designing scalable data solutions',
          avatarUrl: 'https://api.example.com/avatars/emily.jpg',
        },
      ],
      skipDuplicates: true,
    });

    console.log(`✓ Created/Updated ${authors.count} authors`);

    // Get authors for content creation
    const authorList = await prisma.author.findMany();

    // =====================================================
    // 4. CREATE SAMPLE CONTENT (Articles, Blogs, News)
    // =====================================================
    console.log('Creating sample content...');

    const javaCat = await prisma.category.findUnique({
      where: { slug: 'java-programming' },
    });
    const springBootCat = await prisma.category.findUnique({
      where: { slug: 'spring-boot' },
    });
    const webDevCat = await prisma.category.findUnique({
      where: { slug: 'web-development' },
    });
    const techNewsCat = await prisma.category.findUnique({
      where: { slug: 'technology-news' },
    });

    const contentData = [
      {
        title: 'Getting Started with Java: A Comprehensive Guide',
        slug: 'getting-started-with-java',
        excerpt:
          'Learn the fundamentals of Java programming and set up your development environment.',
        body: `<h2>Introduction</h2>
<p>Java is one of the most popular programming languages in the world. It's used for building enterprise applications, Android apps, web applications, and more.</p>

<h2>Why Learn Java?</h2>
<ul>
<li>Object-oriented programming</li>
<li>Platform independence</li>
<li>Strong community support</li>
<li>High demand in job market</li>
</ul>

<h2>Setting Up Java</h2>
<p>Download the latest JDK from oracle.com and follow the installation guide for your operating system.</p>

<h2>Your First Program</h2>
<pre><code>public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}</code></pre>

<p>Compile and run your first Java program to get started with your programming journey.</p>`,
        contentType: 'article',
        status: 'published',
        authorId: authorList[0]?.id || '',
        categoryId: javaCat?.id || '',
        metaTitle: 'Getting Started with Java - Complete Guide',
        metaDescription:
          'Learn Java programming basics with our comprehensive guide for beginners.',
        metaKeywords: ['java', 'programming', 'beginner', 'tutorial'],
        publishedAt: new Date('2025-12-15'),
      },
      {
        title: 'Spring Boot Best Practices for 2025',
        slug: 'spring-boot-best-practices-2025',
        excerpt:
          'Discover the most important best practices for building robust Spring Boot applications.',
        body: `<h2>Spring Boot Best Practices</h2>
<p>Spring Boot has revolutionized Java application development. Here are the best practices to follow:</p>

<h2>1. Configuration Management</h2>
<p>Use application.yml or application.properties for configuration. Store sensitive data in environment variables or use Spring Cloud Config.</p>

<h2>2. Dependency Injection</h2>
<p>Leverage Spring's powerful dependency injection to create loosely coupled, testable code.</p>

<h2>3. Error Handling</h2>
<p>Implement global exception handling with @ControllerAdvice and @ExceptionHandler.</p>

<h2>4. Testing</h2>
<p>Write unit tests with JUnit 5 and integration tests with @SpringBootTest.</p>

<h2>5. Security</h2>
<p>Use Spring Security for authentication and authorization. Keep dependencies updated to avoid vulnerabilities.</p>`,
        contentType: 'article',
        status: 'published',
        authorId: authorList[0]?.id || '',
        categoryId: springBootCat?.id || '',
        metaTitle: 'Spring Boot Best Practices 2025',
        metaDescription:
          'Master Spring Boot development with essential best practices and patterns.',
        metaKeywords: ['spring boot', 'best practices', 'java', 'development'],
        publishedAt: new Date('2025-12-10'),
      },
      {
        title: 'Modern React Development: Hooks vs Classes',
        slug: 'modern-react-hooks-vs-classes',
        excerpt:
          'Understand the differences between React Hooks and Class Components in modern development.',
        body: `<h2>React Hooks Revolution</h2>
<p>Hooks were introduced in React 16.8 and changed how developers write React components.</p>

<h2>Class Components</h2>
<p>Class components are the traditional way to write React components. They have lifecycle methods and internal state.</p>

<h2>Functional Components with Hooks</h2>
<p>Functional components with hooks are simpler and more flexible. They use useState, useEffect, and other hooks.</p>

<h2>Common Hooks</h2>
<ul>
<li>useState - Manage component state</li>
<li>useEffect - Handle side effects</li>
<li>useContext - Use context without Consumer</li>
<li>useReducer - Complex state management</li>
<li>useCallback - Memoize functions</li>
</ul>

<h2>Migration Strategy</h2>
<p>Migrate gradually from class components to functional components with hooks.</p>`,
        contentType: 'blog',
        status: 'published',
        authorId: authorList[1]?.id || '',
        categoryId: webDevCat?.id || '',
        metaTitle: 'React Hooks: Modern Component Development',
        metaDescription: 'Learn modern React development patterns with Hooks.',
        metaKeywords: ['react', 'hooks', 'javascript', 'frontend'],
        publishedAt: new Date('2025-12-05'),
      },
      {
        title: 'Docker and Kubernetes: Container Orchestration Guide',
        slug: 'docker-kubernetes-guide',
        excerpt: 'Master containerization and orchestration with Docker and Kubernetes.',
        body: `<h2>Container Revolution</h2>
<p>Docker and Kubernetes have become essential tools for modern application deployment.</p>

<h2>Docker Basics</h2>
<p>Docker allows you to package applications into containers that run consistently across environments.</p>

<h2>Kubernetes Orchestration</h2>
<p>Kubernetes automates deployment, scaling, and management of containerized applications.</p>

<h2>Key Concepts</h2>
<ul>
<li>Images and Containers</li>
<li>Pods and Services</li>
<li>Deployments and StatefulSets</li>
<li>Networking and Storage</li>
</ul>`,
        contentType: 'article',
        status: 'published',
        authorId: authorList[2]?.id || '',
        categoryId: webDevCat?.id || '',
        metaTitle: 'Docker & Kubernetes: Container Guide',
        metaDescription: 'Complete guide to containerization with Docker and Kubernetes.',
        metaKeywords: ['docker', 'kubernetes', 'devops', 'containers'],
        publishedAt: new Date('2025-12-01'),
      },
      {
        title: 'AI Integration in Enterprise Applications - Latest Trends',
        slug: 'ai-integration-enterprise-2025',
        excerpt:
          'Explore the latest trends in integrating AI and machine learning into enterprise applications.',
        body: `<h2>AI in Enterprise</h2>
<p>Artificial intelligence is transforming how enterprises build applications and solve business problems.</p>

<h2>Latest Trends</h2>
<ul>
<li>LLM Integration</li>
<li>Generative AI</li>
<li>RAG Systems</li>
<li>Vector Databases</li>
</ul>

<h2>Practical Applications</h2>
<p>Chat bots, recommendation systems, predictive analytics, and more.</p>

<h2>Getting Started</h2>
<p>Learn how to integrate AI services into your applications using APIs and frameworks.</p>`,
        contentType: 'news',
        status: 'published',
        authorId: authorList[0]?.id || '',
        categoryId: techNewsCat?.id || '',
        metaTitle: 'AI Trends in Enterprise 2025',
        metaDescription: 'Latest AI and machine learning trends for enterprise applications.',
        metaKeywords: ['ai', 'machine learning', 'enterprise', 'technology'],
        publishedAt: new Date('2025-11-28'),
      },
      {
        title: 'Database Optimization: Indexing Strategies',
        slug: 'database-optimization-indexing',
        excerpt: 'Learn effective database indexing strategies to improve query performance.',
        body: `<h2>Database Performance</h2>
<p>Proper indexing is crucial for database performance.</p>

<h2>Index Types</h2>
<ul>
<li>Primary Key Index</li>
<li>Unique Index</li>
<li>Composite Index</li>
<li>Full-Text Index</li>
</ul>

<h2>Optimization Techniques</h2>
<p>Use EXPLAIN plans to analyze queries. Create indexes on frequently queried columns.</p>

<h2>Common Mistakes</h2>
<p>Avoid over-indexing and ensure indexes are maintained regularly.</p>`,
        contentType: 'article',
        status: 'published',
        authorId: authorList[3]?.id || '',
        categoryId: webDevCat?.id || '',
        metaTitle: 'Database Indexing Strategies',
        metaDescription: 'Master database optimization with effective indexing.',
        metaKeywords: ['database', 'optimization', 'indexing', 'sql'],
        publishedAt: new Date('2025-11-20'),
      },
      {
        title: 'Microservices Architecture: Designing Scalable Systems',
        slug: 'microservices-architecture-guide',
        excerpt: 'Design and implement microservices architecture for scalable applications.',
        body: `<h2>Microservices Explained</h2>
<p>Microservices architecture breaks down applications into smaller, independently deployable services.</p>

<h2>Benefits</h2>
<ul>
<li>Independent scaling</li>
<li>Technology flexibility</li>
<li>Easier testing</li>
<li>Faster deployment</li>
</ul>

<h2>Challenges</h2>
<p>Network latency, data consistency, operational complexity.</p>

<h2>Design Patterns</h2>
<p>API Gateway, Service Discovery, Event-Driven Architecture, Saga Pattern.</p>`,
        contentType: 'blog',
        status: 'published',
        authorId: authorList[0]?.id || '',
        categoryId: webDevCat?.id || '',
        metaTitle: 'Microservices Architecture Guide',
        metaDescription: 'Design scalable systems with microservices architecture.',
        metaKeywords: ['microservices', 'architecture', 'distributed systems'],
        publishedAt: new Date('2025-11-15'),
      },
    ];

    // Filter out content with missing author/category
    const validContent = contentData.filter((c) => c.authorId && c.categoryId);

    // Delete existing content and associations to avoid duplicates
    await prisma.contentTag.deleteMany({});
    await prisma.content.deleteMany({});

    // Create content and attach some tags
    console.log('Creating content and attaching tags...');

    for (const c of validContent) {
      const created = await prisma.content.create({ data: c });

      // Attach tags based on slug keywords for demo purposes
      const tagsToAttach: string[] = [];
      if (c.slug.includes('java') || c.metaKeywords?.includes('java'))
        tagsToAttach.push('tutorial', 'beginner');
      if (c.slug.includes('spring') || c.metaKeywords?.some((k) => k?.includes('best')))
        tagsToAttach.push('best-practices');
      if (c.slug.includes('docker') || c.metaKeywords?.includes('devops'))
        tagsToAttach.push('microservices', 'performance');
      if (c.slug.includes('react') || c.metaKeywords?.includes('react'))
        tagsToAttach.push('tutorial', 'advanced');

      if (tagsToAttach.length > 0) {
        const tagRecords = await prisma.tag.findMany({ where: { slug: { in: tagsToAttach } } });
        if (tagRecords.length > 0) {
          await prisma.contentTag.createMany({
            data: tagRecords.map((t) => ({ contentId: created.id, tagId: t.id })),
            skipDuplicates: true,
          });
          // Increment tag usage counts
          await prisma.tag.updateMany({
            where: { id: { in: tagRecords.map((t) => t.id) } },
            data: { usageCount: { increment: 1 } },
          });
        }
      }
    }

    console.log('✓ Created content and attached tags');

    // Invalidate category cache in Redis so categoryService.findAll() refreshes
    try {
      // Load dotenv and ioredis dynamically to avoid failing when dev deps are not installed
      try {
        require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
      } catch (e) {
        // dotenv not available — proceed with process.env as-is
      }

      let RedisClient: any;
      try {
        RedisClient = require('ioredis');
      } catch (e) {
        RedisClient = null;
      }

      if (RedisClient) {
        const redis = new RedisClient({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          password: process.env.REDIS_PASSWORD || undefined,
          db: parseInt(process.env.REDIS_DB || '0', 10),
        });
        const cachePrefix = process.env.CACHE_KEY_PREFIX || '';
        const keys = await redis.keys(`${cachePrefix}category*`);
        if (keys.length > 0) {
          await redis.del(...keys);
          console.log('✓ Cleared category cache keys in Redis');
        }
        await redis.disconnect();
      } else {
        console.warn('ioredis not installed; skipping cache clear');
      }
    } catch (err) {
      console.warn('Could not clear Redis cache:', err?.message || err);
    }

    console.log('\n✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
