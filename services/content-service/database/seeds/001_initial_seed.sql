-- Seed data for content schema
-- Run manually: npm run db:seed

-- Clear existing data (in correct order due to foreign keys)
TRUNCATE content.content_likes CASCADE;
TRUNCATE content.content_views CASCADE;
TRUNCATE content.comments CASCADE;
TRUNCATE content.content_tags CASCADE;
TRUNCATE content.tutorial_progress CASCADE;
TRUNCATE content.tutorial_bookmarks CASCADE;
TRUNCATE content.tutorial_media CASCADE;
TRUNCATE content.tutorial_topics CASCADE;
TRUNCATE content.tutorial_sections CASCADE;
TRUNCATE content.tutorials CASCADE;
TRUNCATE content.resources CASCADE;
TRUNCATE content.content CASCADE;
TRUNCATE content.tags CASCADE;
TRUNCATE content.categories CASCADE;
TRUNCATE content.authors CASCADE;
TRUNCATE content.media_assets CASCADE;

-- Reset sequences
ALTER SEQUENCE content.authors_id_seq RESTART WITH 1;
ALTER SEQUENCE content.categories_id_seq RESTART WITH 1;
ALTER SEQUENCE content.tags_id_seq RESTART WITH 1;
ALTER SEQUENCE content.content_id_seq RESTART WITH 1;
ALTER SEQUENCE content.comments_id_seq RESTART WITH 1;
ALTER SEQUENCE content.content_views_id_seq RESTART WITH 1;
ALTER SEQUENCE content.content_likes_id_seq RESTART WITH 1;
ALTER SEQUENCE content.tutorials_id_seq RESTART WITH 1;
ALTER SEQUENCE content.tutorial_sections_id_seq RESTART WITH 1;
ALTER SEQUENCE content.tutorial_topics_id_seq RESTART WITH 1;
ALTER SEQUENCE content.tutorial_progress_id_seq RESTART WITH 1;
ALTER SEQUENCE content.tutorial_bookmarks_id_seq RESTART WITH 1;
ALTER SEQUENCE content.tutorial_media_id_seq RESTART WITH 1;
ALTER SEQUENCE content.resources_id_seq RESTART WITH 1;
ALTER SEQUENCE content.media_assets_id_seq RESTART WITH 1;

-- Insert Authors (matching V001 schema: user_id, name, email, bio, avatar_url, website, social_links)
INSERT INTO content.authors (user_id, name, email, bio, avatar_url, website, social_links) VALUES
(1, 'Alex Thompson', 'alex.thompson@example.com', 'Full-stack developer with 10+ years of experience in web technologies.', 'https://randomuser.me/api/portraits/men/1.jpg', 'https://alexthompson.dev', '{"twitter": "@alexthompson", "github": "alexthompson"}'),
(2, 'Sarah Chen', 'sarah.chen@example.com', 'UI/UX designer and front-end developer passionate about accessible design.', 'https://randomuser.me/api/portraits/women/2.jpg', 'https://sarahchen.design', '{"dribbble": "sarahchen", "behance": "sarahchen"}'),
(3, 'Michael Rodriguez', 'michael.rodriguez@example.com', 'Backend architect specializing in microservices and cloud infrastructure.', 'https://randomuser.me/api/portraits/men/3.jpg', 'https://mrodriguez.tech', '{"github": "mrodriguez", "linkedin": "michaelrodriguez"}'),
(4, 'Emily Davis', 'emily.davis@example.com', 'Mobile developer and tech educator with a focus on React Native.', 'https://randomuser.me/api/portraits/women/4.jpg', 'https://emilydavis.io', '{"youtube": "emilydevs", "twitter": "@emilydavis"}'),
(5, 'James Wilson', 'james.wilson@example.com', 'DevOps engineer and automation enthusiast.', 'https://randomuser.me/api/portraits/men/5.jpg', 'https://jwilson.cloud', '{"github": "jwilson"}');

-- Insert Categories (matching V002 schema: name, slug, description, parent_id, icon, color, sort_order, is_active)
INSERT INTO content.categories (name, slug, description, icon, color, parent_id, sort_order, is_active) VALUES
('Programming', 'programming', 'Programming tutorials and articles', 'code', '#3B82F6', NULL, 1, true),
('Design', 'design', 'UI/UX and graphic design content', 'palette', '#EC4899', NULL, 2, true),
('DevOps', 'devops', 'DevOps and infrastructure content', 'server', '#10B981', NULL, 3, true),
('Mobile', 'mobile', 'Mobile app development', 'smartphone', '#8B5CF6', NULL, 4, true),
('Web Development', 'web-development', 'Web development tutorials', 'globe', '#3B82F6', 1, 1, true),
('Database', 'database', 'Database design and management', 'database', '#F59E0B', 1, 2, true),
('UI Design', 'ui-design', 'User interface design', 'layout', '#EC4899', 2, 1, true),
('UX Research', 'ux-research', 'User experience research', 'search', '#EC4899', 2, 2, true);

-- Insert Tags (matching V003 schema: name, slug, description, usage_count)
INSERT INTO content.tags (name, slug, description, usage_count) VALUES
('JavaScript', 'javascript', 'JavaScript programming language', 45),
('TypeScript', 'typescript', 'TypeScript programming language', 38),
('React', 'react', 'React.js library', 52),
('Node.js', 'nodejs', 'Node.js runtime', 41),
('Python', 'python', 'Python programming language', 33),
('CSS', 'css', 'Cascading Style Sheets', 28),
('Docker', 'docker', 'Docker containerization', 22),
('AWS', 'aws', 'Amazon Web Services', 19),
('PostgreSQL', 'postgresql', 'PostgreSQL database', 15),
('Git', 'git', 'Git version control', 35),
('API', 'api', 'API development', 27),
('Testing', 'testing', 'Software testing', 18),
('Security', 'security', 'Application security', 12),
('Performance', 'performance', 'Performance optimization', 14),
('Beginner', 'beginner', 'Beginner-friendly content', 40);

-- Insert Content (matching V004 schema - using correct enum values: blog, article, news)
INSERT INTO content.content (author_id, category_id, title, slug, excerpt, body, featured_image, content_type, status, published_at, reading_time, view_count, like_count, comment_count, is_featured, meta_title, meta_description) VALUES
(1, 5, 'Getting Started with React 18', 'getting-started-react-18', 'Learn the new features in React 18 including concurrent rendering and automatic batching.', '# Getting Started with React 18

React 18 introduces several exciting features that improve performance and user experience.

## Concurrent Rendering

Concurrent rendering allows React to prepare multiple versions of the UI at the same time. This means React can start rendering an update, pause in the middle, and continue later if something more important comes up.

## Automatic Batching

React 18 automatically batches state updates, even inside promises, setTimeout, and event handlers. This means fewer re-renders and better performance.

## New Hooks

- `useId` - for generating unique IDs
- `useTransition` - for marking updates as non-urgent
- `useDeferredValue` - for deferring a value

## Getting Started

```bash
npm install react@18 react-dom@18
```

Then update your root to use the new createRoot API:

```jsx
import { createRoot } from ''react-dom/client'';
const root = createRoot(document.getElementById(''root''));
root.render(<App />);
```

Happy coding!', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee', 'article', 'published', NOW() - INTERVAL '5 days', 12, 1523, 89, 12, true, 'React 18 Tutorial - Getting Started Guide', 'Complete guide to React 18 features including concurrent rendering, automatic batching, and transitions'),

(2, 7, 'Modern CSS Layout Techniques', 'modern-css-layout-techniques', 'Master CSS Grid and Flexbox for responsive layouts.', '# Modern CSS Layout Techniques

Learn how to create beautiful, responsive layouts using modern CSS.

## CSS Grid

CSS Grid is a powerful layout system that allows you to create complex two-dimensional layouts.

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

## Flexbox

Flexbox is perfect for one-dimensional layouts and component alignment.

```css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## When to Use What

- Use Grid for page layouts
- Use Flexbox for component layouts
- Combine both for maximum flexibility', 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2', 'article', 'published', NOW() - INTERVAL '3 days', 15, 987, 67, 8, true, 'CSS Grid and Flexbox Tutorial', 'Learn modern CSS layout techniques with Grid and Flexbox'),

(3, 3, 'Docker Best Practices for Production', 'docker-best-practices-production', 'Learn how to optimize your Docker containers for production deployments.', '# Docker Best Practices

Optimizing Docker for production requires attention to security, performance, and maintainability.

## Use Multi-Stage Builds

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["node", "server.js"]
```

## Security Best Practices

1. Never run as root
2. Use specific image tags
3. Scan images for vulnerabilities
4. Keep images minimal

## Performance Tips

- Use .dockerignore
- Layer caching optimization
- Use appropriate base images', 'https://images.unsplash.com/photo-1605745341112-85968b19335b', 'article', 'published', NOW() - INTERVAL '7 days', 18, 2341, 156, 23, true, 'Docker Production Guide', 'Best practices for running Docker in production'),

(4, 4, 'React Native Performance Tips', 'react-native-performance-tips', 'Optimize your React Native apps for better performance.', '# React Native Performance

Performance is crucial for mobile applications. Here are key tips to optimize your React Native app.

## Use FlatList for Long Lists

```jsx
<FlatList
  data={items}
  renderItem={({ item }) => <Item item={item} />}
  keyExtractor={item => item.id}
  windowSize={5}
/>
```

## Memoization

Use React.memo and useMemo to prevent unnecessary re-renders.

## Image Optimization

- Use appropriate image sizes
- Implement lazy loading
- Use FastImage library for caching', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', 'article', 'published', NOW() - INTERVAL '10 days', 10, 876, 45, 6, false, 'React Native Performance', 'Tips for optimizing React Native app performance'),

(1, 5, 'Building REST APIs with Node.js', 'building-rest-apis-nodejs', 'Complete guide to building RESTful APIs with Node.js and Express.', '# Building REST APIs

Learn how to design and implement robust REST APIs with Node.js.

## Project Setup

```bash
npm init -y
npm install express cors helmet morgan
```

## Basic Server

```javascript
const express = require(''express'');
const app = express();

app.use(express.json());

app.get(''/api/users'', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000);
```

## Best Practices

1. Use proper HTTP methods
2. Return appropriate status codes
3. Implement proper error handling
4. Add input validation
5. Use pagination for lists', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c', 'blog', 'published', NOW() - INTERVAL '14 days', 25, 3456, 234, 45, true, 'Node.js REST API Tutorial', 'Build REST APIs with Node.js and Express'),

(2, 8, 'User Research Fundamentals', 'user-research-fundamentals', 'Introduction to UX research methods and best practices.', '# User Research Fundamentals

Understanding your users is the foundation of great design.

## Research Methods

### Qualitative Methods
- User interviews
- Usability testing
- Contextual inquiry

### Quantitative Methods
- Surveys
- A/B testing
- Analytics review

## Key Principles

1. Recruit the right participants
2. Ask open-ended questions
3. Observe behavior, not just opinions
4. Document everything
5. Synthesize findings into actionable insights', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd', 'article', 'published', NOW() - INTERVAL '2 days', 8, 543, 32, 4, false, 'UX Research Guide', 'Learn the basics of user research'),

(3, 6, 'PostgreSQL Query Optimization', 'postgresql-query-optimization', 'Advanced techniques for optimizing PostgreSQL queries.', '# PostgreSQL Optimization

Learn how to analyze and optimize slow queries in PostgreSQL.

## Using EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = ''test@example.com'';
```

## Indexing Strategies

1. B-tree indexes for equality and range queries
2. GIN indexes for full-text search
3. Partial indexes for filtered queries

## Common Optimizations

- Add missing indexes
- Rewrite subqueries as JOINs
- Use connection pooling
- Tune memory settings', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d', 'article', 'published', NOW() - INTERVAL '8 days', 20, 1234, 78, 15, false, 'PostgreSQL Performance Tuning', 'Optimize your PostgreSQL queries'),

(5, 3, 'CI/CD Pipeline with GitHub Actions', 'cicd-pipeline-github-actions', 'Set up automated testing and deployment with GitHub Actions.', '# CI/CD with GitHub Actions

Automate your development workflow with GitHub Actions.

## Basic Workflow

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

## Deployment

Add deployment steps for staging and production environments.

## Best Practices

1. Use caching for dependencies
2. Run tests in parallel
3. Use environment secrets
4. Implement manual approval for production', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb', 'blog', 'published', NOW() - INTERVAL '6 days', 22, 1876, 112, 18, true, 'GitHub Actions CI/CD Tutorial', 'Build CI/CD pipelines with GitHub Actions'),

(1, 1, 'Understanding JavaScript Closures', 'understanding-javascript-closures', 'Deep dive into JavaScript closures and their practical applications.', '# JavaScript Closures

Closures are one of the most powerful features in JavaScript.

## What is a Closure?

A closure is a function that has access to its outer function''s scope even after the outer function has returned.

```javascript
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

## Practical Use Cases

1. Data privacy
2. Function factories
3. Event handlers
4. Callbacks

## Common Pitfalls

Watch out for closures in loops - use let instead of var!', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a', 'article', 'published', NOW() - INTERVAL '12 days', 14, 2567, 189, 28, false, 'JavaScript Closures Explained', 'Learn JavaScript closures with examples'),

(4, 4, 'Building a Mobile App from Scratch', 'building-mobile-app-scratch', 'Step-by-step guide to creating your first mobile application.', '# Your First Mobile App

Get started with mobile development using React Native.

## Prerequisites

- Node.js installed
- React basics knowledge
- Xcode (Mac) or Android Studio

## Setup

```bash
npx create-expo-app MyFirstApp
cd MyFirstApp
npx expo start
```

## Project Structure

```
MyFirstApp/
├── App.js
├── components/
├── screens/
└── assets/
```

## Your First Component

```jsx
import { View, Text, StyleSheet } from ''react-native'';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello, World!</Text>
    </View>
  );
}
```

Happy building!', 'https://images.unsplash.com/photo-1551650975-87deedd944c3', 'blog', 'published', NOW() - INTERVAL '4 days', 30, 987, 56, 9, false, 'Mobile App Development Guide', 'Build your first mobile app');

-- Insert Content Tags (junction table)
INSERT INTO content.content_tags (content_id, tag_id) VALUES
(1, 3), (1, 1), (1, 15), -- React 18 article: React, JavaScript, Beginner
(2, 6), (2, 15), -- CSS article: CSS, Beginner
(3, 7), (3, 13), (3, 14), -- Docker article: Docker, Security, Performance
(4, 3), (4, 14), -- React Native article: React, Performance
(5, 4), (5, 11), (5, 1), -- Node.js API article: Node.js, API, JavaScript
(6, 15), -- UX Research article: Beginner
(7, 9), (7, 14), -- PostgreSQL article: PostgreSQL, Performance
(8, 7), (8, 10), (8, 12), -- GitHub Actions article: Docker, Git, Testing
(9, 1), (9, 15), -- JavaScript Closures: JavaScript, Beginner
(10, 15); -- Mobile App article: Beginner

-- Insert Comments (matching V005 schema: is_approved instead of status)
INSERT INTO content.comments (content_id, user_id, author_name, author_email, body, is_approved, parent_id, likes) VALUES
(1, 101, 'John Doe', 'john@example.com', 'Great article! The concurrent rendering explanation really helped me understand the concept.', true, NULL, 12),
(1, 102, 'Jane Smith', 'jane@example.com', 'Could you explain more about automatic batching?', true, NULL, 5),
(1, 101, 'John Doe', 'john@example.com', 'Automatic batching groups multiple state updates into a single re-render for better performance.', true, 2, 8),
(3, 103, 'Mike Johnson', 'mike@example.com', 'This helped me optimize my production containers. Thanks!', true, NULL, 23),
(5, 104, 'Sarah Williams', 'sarah@example.com', 'Best Node.js API tutorial I have found. Very comprehensive!', true, NULL, 45),
(5, 105, 'Tom Brown', 'tom@example.com', 'How do you handle authentication in this setup?', true, NULL, 11),
(8, 106, 'Lisa Anderson', 'lisa@example.com', 'GitHub Actions has really improved our deployment workflow.', true, NULL, 18),
(2, NULL, 'Anonymous', 'anon@example.com', 'Great CSS tips!', false, NULL, 0);

-- Insert Tutorials (matching V007 schema)
INSERT INTO content.tutorials (slug, title, description, featured_image, difficulty_level, estimated_time, author_id, category_id, is_published, is_featured, view_count, published_at) VALUES
('complete-react-course', 'Complete React Course', 'Master React from basics to advanced concepts including hooks, context, and state management.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee', 'intermediate', 480, 1, 5, true, true, 5678, NOW() - INTERVAL '30 days'),
('docker-mastery', 'Docker Mastery', 'Learn Docker from scratch to production-ready deployments.', 'https://images.unsplash.com/photo-1605745341112-85968b19335b', 'intermediate', 360, 3, 3, true, true, 4321, NOW() - INTERVAL '20 days'),
('css-deep-dive', 'CSS Deep Dive', 'Advanced CSS techniques for modern web development.', 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2', 'advanced', 300, 2, 7, true, false, 2345, NOW() - INTERVAL '15 days'),
('nodejs-fundamentals', 'Node.js Fundamentals', 'Learn the core concepts of Node.js and build your first server.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c', 'beginner', 240, 1, 5, true, true, 3456, NOW() - INTERVAL '25 days'),
('typescript-essentials', 'TypeScript Essentials', 'Master TypeScript for type-safe JavaScript development.', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea', 'intermediate', 300, 1, 1, true, false, 2890, NOW() - INTERVAL '18 days');

-- Insert Tutorial Sections
INSERT INTO content.tutorial_sections (tutorial_id, slug, title, description, sort_order, estimated_time) VALUES
(1, 'getting-started', 'Getting Started', 'Introduction to React and development setup', 1, 60),
(1, 'fundamentals', 'React Fundamentals', 'Core React concepts and JSX', 2, 90),
(1, 'hooks', 'React Hooks', 'Master React hooks for state and effects', 3, 120),
(1, 'advanced-patterns', 'Advanced Patterns', 'Advanced React patterns and optimization', 4, 120),
(2, 'docker-basics', 'Docker Basics', 'Introduction to containerization', 1, 90),
(2, 'docker-compose', 'Docker Compose', 'Multi-container applications', 2, 120),
(2, 'production', 'Production Deployment', 'Deploying Docker in production', 3, 150),
(3, 'modern-layout', 'Modern Layout', 'CSS Grid and Flexbox', 1, 150),
(3, 'animations', 'Animations', 'CSS animations and transitions', 2, 150),
(4, 'nodejs-intro', 'Introduction', 'What is Node.js and why use it', 1, 60),
(4, 'modules-npm', 'Modules and NPM', 'Understanding the module system', 2, 90),
(5, 'ts-basics', 'TypeScript Basics', 'Types, interfaces, and configuration', 1, 100),
(5, 'advanced-types', 'Advanced Types', 'Generics, utility types, and more', 2, 100);

-- Insert Tutorial Topics
INSERT INTO content.tutorial_topics (section_id, slug, title, content, video_url, estimated_time, sort_order) VALUES
(1, 'intro-to-react', 'Introduction to React', '# Introduction to React

React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and a community of developers.

## Why React?

- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: React makes it painless to create interactive UIs
- **Learn Once, Write Anywhere**: You can develop new features without rewriting existing code', 'https://example.com/videos/react-intro', 15, 1),
(1, 'setup-environment', 'Setting Up Your Environment', '# Development Setup

Let us set up your development environment for React development.

## Prerequisites

- Node.js 18 or later
- A code editor (VS Code recommended)

## Creating a New Project

```bash
npx create-react-app my-app
cd my-app
npm start
```', 'https://example.com/videos/react-setup', 20, 2),
(2, 'jsx-basics', 'JSX Basics', '# JSX Fundamentals

JSX is a syntax extension for JavaScript that looks similar to HTML. It is used with React to describe what the UI should look like.

```jsx
const element = <h1>Hello, world!</h1>;
```

## JSX Expressions

You can embed JavaScript expressions in JSX:

```jsx
const name = "World";
const element = <h1>Hello, {name}!</h1>;
```', 'https://example.com/videos/jsx', 25, 1),
(2, 'components-props', 'Components and Props', '# Components

Components are the building blocks of React applications. They let you split the UI into independent, reusable pieces.

## Function Components

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

## Props

Props are inputs to components. They are passed from parent to child components.', 'https://example.com/videos/components', 30, 2),
(3, 'usestate', 'useState Hook', '# useState Hook

The useState hook lets you add state to functional components.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```', 'https://example.com/videos/usestate', 20, 1),
(3, 'useeffect', 'useEffect Hook', '# useEffect Hook

The useEffect hook lets you perform side effects in function components.

```jsx
import { useEffect, useState } from "react";

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return <div>{data ? JSON.stringify(data) : "Loading..."}</div>;
}
```', 'https://example.com/videos/useeffect', 25, 2),
(5, 'what-is-docker', 'What is Docker?', '# Docker Introduction

Docker is a platform for developing, shipping, and running applications in containers.

## What are Containers?

Containers are lightweight, standalone packages that include everything needed to run an application.

## Benefits

- Consistency across environments
- Isolation
- Efficient resource usage
- Fast deployment', 'https://example.com/videos/docker-intro', 15, 1),
(5, 'first-container', 'Your First Container', '# First Container

Let us create your first Docker container.

## Pull an Image

```bash
docker pull nginx
```

## Run a Container

```bash
docker run -d -p 8080:80 nginx
```

Now visit http://localhost:8080 to see your running container!', 'https://example.com/videos/first-container', 20, 2);

-- Insert Resources (matching V008 schema)
INSERT INTO content.resources (slug, title, description, content, resource_type, category, tags, file_url, file_size, file_type, thumbnail_url, author_id, is_published, is_featured, download_count, view_count) VALUES
('react-cheat-sheet', 'React Cheat Sheet', 'Quick reference for React hooks, lifecycle methods, and common patterns.', 'A comprehensive cheat sheet covering all React essentials.', 'cheatsheet', 'Programming', ARRAY['React', 'JavaScript', 'Reference'], '/downloads/react-cheatsheet.pdf', 245760, 'pdf', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee', 1, true, true, 3456, 5678),
('css-grid-templates', 'CSS Grid Template Collection', 'Ready-to-use CSS Grid layout templates for common UI patterns.', 'Collection of 20+ CSS Grid templates for various layouts.', 'template', 'Design', ARRAY['CSS', 'Grid', 'Templates'], '/downloads/css-grid-templates.zip', 1048576, 'zip', 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2', 2, true, true, 2341, 4567),
('docker-compose-examples', 'Docker Compose Examples', 'Collection of Docker Compose files for popular tech stacks.', 'Docker Compose configurations for MERN, PERN, and more.', 'template', 'DevOps', ARRAY['Docker', 'DevOps'], '/downloads/docker-compose-examples.zip', 524288, 'zip', 'https://images.unsplash.com/photo-1605745341112-85968b19335b', 3, true, false, 1876, 3456),
('typescript-types-guide', 'TypeScript Type Definitions Guide', 'Comprehensive guide to TypeScript types with examples.', 'Everything you need to know about TypeScript types.', 'guide', 'Programming', ARRAY['TypeScript', 'JavaScript'], '/downloads/typescript-guide.pdf', 512000, 'pdf', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c', 1, true, false, 2156, 3890),
('react-native-starter', 'React Native Starter Kit', 'Boilerplate project with navigation, state management, and common utilities.', 'A complete React Native starter kit with best practices.', 'template', 'Mobile', ARRAY['React Native', 'Mobile'], '/downloads/rn-starter.zip', 2097152, 'zip', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', 4, true, true, 987, 2345),
('api-design-guide', 'REST API Design Guide', 'Best practices for designing RESTful APIs.', 'Comprehensive guide covering endpoints, versioning, error handling, and more.', 'guide', 'Programming', ARRAY['API', 'REST', 'Backend'], '/downloads/api-design-guide.pdf', 389120, 'pdf', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c', 3, true, false, 1567, 2890),
('figma-ui-kit', 'Figma UI Component Kit', 'A comprehensive UI kit for rapid prototyping in Figma.', 'Over 100 reusable components for web and mobile design.', 'template', 'Design', ARRAY['Figma', 'UI', 'Design'], '/downloads/figma-ui-kit.fig', 4194304, 'fig', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd', 2, true, true, 4532, 7890);

-- Insert Media Assets (matching V009 schema: original_filename, file_path are required, no thumbnail_url or size column)
INSERT INTO content.media_assets (filename, original_filename, file_path, url, mime_type, file_size, width, height, uploaded_by, folder, alt_text) VALUES
('react-18-hero.jpg', 'react-18-hero.jpg', '/uploads/articles/react-18-hero.jpg', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee', 'image/jpeg', 245760, 1920, 1080, 1, 'articles', 'React 18 features illustration'),
('css-layout.jpg', 'modern-css-layout.jpg', '/uploads/articles/css-layout.jpg', 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2', 'image/jpeg', 198400, 1920, 1080, 2, 'articles', 'CSS Grid layout example'),
('docker-containers.jpg', 'docker-production.jpg', '/uploads/articles/docker-containers.jpg', 'https://images.unsplash.com/photo-1605745341112-85968b19335b', 'image/jpeg', 312576, 1920, 1080, 3, 'articles', 'Docker containers visualization'),
('nodejs-api.jpg', 'rest-api-design.jpg', '/uploads/tutorials/nodejs-api.jpg', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c', 'image/jpeg', 287744, 1920, 1080, 1, 'tutorials', 'Node.js API development'),
('mobile-dev.jpg', 'react-native-app.jpg', '/uploads/tutorials/mobile-dev.jpg', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', 'image/jpeg', 256000, 1920, 1080, 4, 'tutorials', 'Mobile app development');

-- Insert some content views (for analytics)
INSERT INTO content.content_views (content_id, user_id, session_id, ip_address, user_agent) VALUES
(1, 101, 'sess-001', '192.168.1.1', 'Mozilla/5.0'),
(1, 102, 'sess-002', '192.168.1.2', 'Mozilla/5.0'),
(1, NULL, 'sess-003', '192.168.1.3', 'Mozilla/5.0'),
(3, 103, 'sess-004', '192.168.1.4', 'Mozilla/5.0'),
(5, 104, 'sess-005', '192.168.1.5', 'Mozilla/5.0');

-- Insert content likes
INSERT INTO content.content_likes (content_id, user_id) VALUES
(1, 101), (1, 102), (1, 103),
(3, 101), (3, 104),
(5, 102), (5, 103), (5, 105);

COMMIT;
