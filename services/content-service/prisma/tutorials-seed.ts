/**
 * Tutorials Seed Data
 * Creates comprehensive tutorials for Java, JavaScript, Spring Boot, and .NET
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding tutorials...');

  // =====================================================
  // 1. JAVA TUTORIAL
  // =====================================================
  console.log('Creating Java tutorial...');
  const javaTutorial = await prisma.tutorial.create({
    data: {
      slug: 'java',
      title: 'Java Tutorial',
      description:
        'Learn Java programming from basics to advanced concepts. Master object-oriented programming, data structures, and build real-world applications.',
      icon: '☕',
      difficultyLevel: 'beginner',
      colorTheme: '#5382a1',
      estimatedHours: 40,
      isPublished: true,
      displayOrder: 1,
      metaTags: {
        keywords: ['java', 'programming', 'oop', 'jvm'],
        ogImage: '/images/tutorials/java.jpg',
      },
    },
  });

  // Java Sections
  const javaSections = await prisma.tutorialSection.createMany({
    data: [
      {
        tutorialId: javaTutorial.id,
        slug: 'java-tutorial',
        title: 'Java Tutorial',
        description: 'Get started with Java basics',
        displayOrder: 1,
      },
      {
        tutorialId: javaTutorial.id,
        slug: 'java-methods',
        title: 'Java Methods',
        description: 'Learn about methods and functions',
        displayOrder: 2,
      },
      {
        tutorialId: javaTutorial.id,
        slug: 'java-classes',
        title: 'Java Classes',
        description: 'Master object-oriented programming',
        displayOrder: 3,
      },
      {
        tutorialId: javaTutorial.id,
        slug: 'java-errors',
        title: 'Java Errors',
        description: 'Exception handling and debugging',
        displayOrder: 4,
      },
      {
        tutorialId: javaTutorial.id,
        slug: 'java-file-handling',
        title: 'Java File Handling',
        description: 'Work with files and directories',
        displayOrder: 5,
      },
      {
        tutorialId: javaTutorial.id,
        slug: 'java-io-streams',
        title: 'Java I/O Streams',
        description: 'Input/Output operations',
        displayOrder: 6,
      },
      {
        tutorialId: javaTutorial.id,
        slug: 'java-data-structures',
        title: 'Java Data Structures',
        description: 'Collections and algorithms',
        displayOrder: 7,
      },
      {
        tutorialId: javaTutorial.id,
        slug: 'java-advanced',
        title: 'Java Advanced',
        description: 'Concurrency, streams, and more',
        displayOrder: 8,
      },
    ],
  });

  // Get section IDs
  const javaBasicsSection = await prisma.tutorialSection.findFirst({
    where: { tutorialId: javaTutorial.id, slug: 'java-tutorial' },
  });

  const javaMethodsSection = await prisma.tutorialSection.findFirst({
    where: { tutorialId: javaTutorial.id, slug: 'java-methods' },
  });

  // Java Topics for "Java Tutorial" section
  if (javaBasicsSection) {
    await prisma.tutorialTopic.createMany({
      data: [
        {
          sectionId: javaBasicsSection.id,
          slug: 'introduction',
          title: 'Java Introduction',
          content: `# Java Introduction

Java is a popular programming language, created in 1995 by Sun Microsystems (now owned by Oracle).

## What is Java?

Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. It is a general-purpose programming language intended to let programmers write once, run anywhere (WORA), meaning that compiled Java code can run on all platforms that support Java without recompiling.

## Why Learn Java?

- **Popular**: Java is one of the most popular programming languages in the world
- **Platform Independent**: Write once, run anywhere (WORA)
- **Object-Oriented**: Everything is an object in Java
- **Secure**: Java provides a secure environment for application development
- **Multithreaded**: Build applications that can perform multiple tasks simultaneously
- **High Performance**: Just-In-Time (JIT) compiler for high performance
- **Large Ecosystem**: Vast collection of libraries and frameworks

## What Can Java Do?

- Mobile applications (especially Android apps)
- Desktop applications
- Web applications
- Web servers and application servers
- Games
- Database connections
- Enterprise applications
- Scientific applications
- Cloud-based applications

## Java Syntax

A simple Java program looks like this:

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

In the next tutorial, you will learn how to install Java and set up your development environment.`,
          estimatedReadTime: 8,
          displayOrder: 1,
          isPublished: true,
        },
        {
          sectionId: javaBasicsSection.id,
          slug: 'getting-started',
          title: 'Java Getting Started',
          content: `# Java Getting Started

To start programming in Java, you need to install the Java Development Kit (JDK) on your computer.

## Installing Java

### Step 1: Download JDK

Visit the official Oracle website or use OpenJDK:
- Oracle JDK: https://www.oracle.com/java/technologies/downloads/
- OpenJDK: https://openjdk.org/

Download the appropriate version for your operating system (Windows, macOS, or Linux).

### Step 2: Install JDK

Follow the installation wizard for your operating system. The installer will set up Java on your computer.

### Step 3: Verify Installation

Open your terminal or command prompt and type:

\`\`\`bash
java -version
\`\`\`

You should see the Java version information.

## Your First Java Program

Create a file named \`HelloWorld.java\`:

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

## Compile and Run

### Compile the program:
\`\`\`bash
javac HelloWorld.java
\`\`\`

This creates a \`HelloWorld.class\` file.

### Run the program:
\`\`\`bash
java HelloWorld
\`\`\`

Output: \`Hello, World!\`

## Understanding the Code

- \`public class HelloWorld\`: Declares a public class named HelloWorld
- \`public static void main(String[] args)\`: The main method - entry point of the program
- \`System.out.println()\`: Prints text to the console

Congratulations! You have written and run your first Java program.`,
          estimatedReadTime: 7,
          displayOrder: 2,
          isPublished: true,
        },
        {
          sectionId: javaBasicsSection.id,
          slug: 'syntax',
          title: 'Java Syntax',
          content: `# Java Syntax

Understanding Java syntax is fundamental to writing clean and error-free code.

## Basic Syntax Rules

### 1. Class Declaration
Every Java program must have at least one class:

\`\`\`java
public class MyClass {
    // code goes here
}
\`\`\`

### 2. Main Method
The main method is the entry point:

\`\`\`java
public static void main(String[] args) {
    // program starts here
}
\`\`\`

### 3. Statements
Every statement ends with a semicolon:

\`\`\`java
System.out.println("Hello");
int x = 5;
\`\`\`

### 4. Code Blocks
Use curly braces for code blocks:

\`\`\`java
if (condition) {
    // code block
}
\`\`\`

### 5. Comments

**Single-line comment:**
\`\`\`java
// This is a comment
\`\`\`

**Multi-line comment:**
\`\`\`java
/* This is a
   multi-line comment */
\`\`\`

**Documentation comment:**
\`\`\`java
/**
 * This is a documentation comment
 * Used for generating API documentation
 */
\`\`\`

## Case Sensitivity

Java is case-sensitive:
- \`MyClass\` and \`myclass\` are different
- \`String\` is correct, \`string\` is wrong

## Naming Conventions

- **Classes**: PascalCase (e.g., \`MyClass\`, \`HelloWorld\`)
- **Methods**: camelCase (e.g., \`myMethod\`, \`calculateSum\`)
- **Variables**: camelCase (e.g., \`firstName\`, \`totalCount\`)
- **Constants**: UPPER_CASE (e.g., \`MAX_VALUE\`, \`PI\`)

## Example Program

\`\`\`java
public class SyntaxExample {
    // Class variable (constant)
    public static final double PI = 3.14159;
    
    // Main method
    public static void main(String[] args) {
        // Local variables
        String message = "Hello, Java!";
        int number = 42;
        
        // Method calls
        printMessage(message);
        calculateArea(5.0);
    }
    
    // Custom method
    public static void printMessage(String msg) {
        System.out.println(msg);
    }
    
    // Method with return value
    public static double calculateArea(double radius) {
        return PI * radius * radius;
    }
}
\`\`\`

Remember: Practice makes perfect! Try writing different programs to get comfortable with Java syntax.`,
          estimatedReadTime: 10,
          displayOrder: 3,
          isPublished: true,
        },
      ],
    });
  }

  // Java Topics for "Java Methods" section
  if (javaMethodsSection) {
    await prisma.tutorialTopic.createMany({
      data: [
        {
          sectionId: javaMethodsSection.id,
          slug: 'methods',
          title: 'Java Methods',
          content: `# Java Methods

A method is a block of code that performs a specific task. Methods help organize code and make it reusable.

## Method Declaration

\`\`\`java
accessModifier returnType methodName(parameters) {
    // method body
    return value; // if not void
}
\`\`\`

## Example Methods

\`\`\`java
public class MethodExamples {
    // Method without parameters
    public void sayHello() {
        System.out.println("Hello!");
    }
    
    // Method with parameters
    public void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
    
    // Method with return value
    public int add(int a, int b) {
        return a + b;
    }
    
    // Method with multiple parameters
    public double calculateAverage(double num1, double num2, double num3) {
        return (num1 + num2 + num3) / 3.0;
    }
}
\`\`\`

## Calling Methods

\`\`\`java
public class Main {
    public static void main(String[] args) {
        MethodExamples obj = new MethodExamples();
        
        obj.sayHello();              // Output: Hello!
        obj.greet("Alice");          // Output: Hello, Alice!
        
        int sum = obj.add(5, 3);     // sum = 8
        System.out.println(sum);
        
        double avg = obj.calculateAverage(80, 90, 85);
        System.out.println("Average: " + avg);  // Output: Average: 85.0
    }
}
\`\`\`

## Method Overloading

You can have multiple methods with the same name but different parameters:

\`\`\`java
public class Calculator {
    // Method 1: Two int parameters
    public int add(int a, int b) {
        return a + b;
    }
    
    // Method 2: Three int parameters
    public int add(int a, int b, int c) {
        return a + b + c;
    }
    
    // Method 3: Two double parameters
    public double add(double a, double b) {
        return a + b;
    }
}
\`\`\`

Methods are essential building blocks in Java programming. They help create clean, organized, and reusable code.`,
          estimatedReadTime: 9,
          displayOrder: 1,
          isPublished: true,
        },
        {
          sectionId: javaMethodsSection.id,
          slug: 'parameters',
          title: 'Java Method Parameters',
          content: `# Java Method Parameters

Parameters allow you to pass information to methods. They make methods flexible and reusable.

## Basic Parameters

\`\`\`java
public void printPersonInfo(String name, int age) {
    System.out.println("Name: " + name);
    System.out.println("Age: " + age);
}

// Usage
printPersonInfo("John", 25);
\`\`\`

## Multiple Parameters

\`\`\`java
public double calculateDiscount(double price, double discountPercent) {
    double discount = price * (discountPercent / 100);
    return price - discount;
}

// Usage
double finalPrice = calculateDiscount(100.0, 20.0);  // $80.00
\`\`\`

## Parameter Passing

Java uses **pass-by-value**:

\`\`\`java
public void modifyNumber(int num) {
    num = num * 2;  // Changes local copy only
}

public static void main(String[] args) {
    int value = 10;
    modifyNumber(value);
    System.out.println(value);  // Still 10
}
\`\`\`

## Varargs (Variable Arguments)

Accept variable number of parameters:

\`\`\`java
public int sum(int... numbers) {
    int total = 0;
    for (int num : numbers) {
        total += num;
    }
    return total;
}

// Usage
int result1 = sum(1, 2, 3);           // 6
int result2 = sum(1, 2, 3, 4, 5);     // 15
int result3 = sum(10);                // 10
\`\`\`

## Array Parameters

\`\`\`java
public double calculateAverage(double[] scores) {
    double sum = 0;
    for (double score : scores) {
        sum += score;
    }
    return sum / scores.length;
}

// Usage
double[] testScores = {85.5, 90.0, 78.5, 92.0};
double avg = calculateAverage(testScores);
\`\`\`

## Best Practices

1. Keep parameter lists short (ideally 3 or fewer)
2. Use meaningful parameter names
3. Order parameters logically
4. Consider using objects for many related parameters
5. Document complex parameter requirements

Understanding parameters is crucial for writing flexible and reusable methods in Java.`,
          estimatedReadTime: 8,
          displayOrder: 2,
          isPublished: true,
        },
      ],
    });
  }

  // =====================================================
  // 2. JAVASCRIPT TUTORIAL
  // =====================================================
  console.log('Creating JavaScript tutorial...');
  const jsTutorial = await prisma.tutorial.create({
    data: {
      slug: 'javascript',
      title: 'JavaScript Tutorial',
      description:
        'Master JavaScript, the programming language of the web. Learn from basics to advanced concepts including ES6+, async programming, and modern frameworks.',
      icon: '🟨',
      difficultyLevel: 'beginner',
      colorTheme: '#f7df1e',
      estimatedHours: 35,
      isPublished: true,
      displayOrder: 2,
      metaTags: {
        keywords: ['javascript', 'js', 'web development', 'es6'],
        ogImage: '/images/tutorials/javascript.jpg',
      },
    },
  });

  // JavaScript Sections
  await prisma.tutorialSection.createMany({
    data: [
      {
        tutorialId: jsTutorial.id,
        slug: 'js-basics',
        title: 'JavaScript Basics',
        description: 'Fundamentals of JavaScript',
        displayOrder: 1,
      },
      {
        tutorialId: jsTutorial.id,
        slug: 'js-functions',
        title: 'JS Functions',
        description: 'Functions and scope',
        displayOrder: 2,
      },
      {
        tutorialId: jsTutorial.id,
        slug: 'js-objects',
        title: 'JS Objects',
        description: 'Object-oriented JavaScript',
        displayOrder: 3,
      },
      {
        tutorialId: jsTutorial.id,
        slug: 'js-async',
        title: 'JS Asynchronous',
        description: 'Promises, async/await',
        displayOrder: 4,
      },
      {
        tutorialId: jsTutorial.id,
        slug: 'js-dom',
        title: 'JS HTML DOM',
        description: 'Document manipulation',
        displayOrder: 5,
      },
      {
        tutorialId: jsTutorial.id,
        slug: 'js-es6',
        title: 'JS ES6+',
        description: 'Modern JavaScript features',
        displayOrder: 6,
      },
    ],
  });

  const jsBasicsSection = await prisma.tutorialSection.findFirst({
    where: { tutorialId: jsTutorial.id, slug: 'js-basics' },
  });

  if (jsBasicsSection) {
    await prisma.tutorialTopic.createMany({
      data: [
        {
          sectionId: jsBasicsSection.id,
          slug: 'introduction',
          title: 'JavaScript Introduction',
          content: `# JavaScript Introduction

JavaScript is the world's most popular programming language and the programming language of the Web.

## What is JavaScript?

JavaScript is a lightweight, interpreted programming language with object-oriented capabilities. It allows you to implement complex features on web pages — from interactive maps to animated graphics, to timely content updates, and much more.

## Why Learn JavaScript?

- **Essential for Web Development**: Every web developer must learn JavaScript
- **Versatile**: Works on both frontend and backend (Node.js)
- **Easy to Learn**: Beginner-friendly syntax
- **Huge Ecosystem**: Thousands of libraries and frameworks (React, Vue, Angular, Node.js)
- **High Demand**: One of the most sought-after programming skills
- **Dynamic**: Create interactive and dynamic web pages

## What Can JavaScript Do?

- Change HTML content and attributes
- Change CSS styles dynamically
- Validate form data
- Create cookies
- Fetch data from servers (AJAX)
- Build complete web applications
- Create mobile apps (React Native)
- Build server-side applications (Node.js)
- Develop desktop applications (Electron)
- Create games and animations

## Your First JavaScript

\`\`\`html
<!DOCTYPE html>
<html>
<body>

<h1>My First JavaScript</h1>

<button onclick="displayMessage()">Click Me!</button>

<p id="demo"></p>

<script>
function displayMessage() {
    document.getElementById("demo").innerHTML = "Hello, JavaScript!";
}
</script>

</body>
</html>
\`\`\`

## JavaScript in HTML

JavaScript can be placed in:
- \`<head>\` section
- \`<body>\` section
- External files (.js)

\`\`\`html
<script src="myScript.js"></script>
\`\`\`

Ready to start your JavaScript journey? Let's dive in!`,
          estimatedReadTime: 7,
          displayOrder: 1,
          isPublished: true,
        },
        {
          sectionId: jsBasicsSection.id,
          slug: 'variables',
          title: 'JavaScript Variables',
          content: `# JavaScript Variables

Variables are containers for storing data values. In JavaScript, you can declare variables using \`var\`, \`let\`, or \`const\`.

## Variable Declaration

### Using let (recommended)
\`\`\`javascript
let name = "John";
let age = 30;
let isStudent = true;
\`\`\`

### Using const (for constants)
\`\`\`javascript
const PI = 3.14159;
const MAX_SIZE = 100;
\`\`\`

### Using var (old way)
\`\`\`javascript
var oldVariable = "I'm old-fashioned";
\`\`\`

## Variable Names

Rules for naming variables:
- Must begin with a letter, $ or _
- Can contain letters, numbers, $ and _
- Are case-sensitive (\`myVar\` and \`myvar\` are different)
- Cannot use reserved words

\`\`\`javascript
// Valid names
let firstName = "John";
let $price = 99.99;
let _private = true;
let user123 = "test";

// Invalid names
let 123user = "test";  // Cannot start with number
let first-name = "John";  // Cannot use hyphen
let class = "Math";  // 'class' is reserved
\`\`\`

## Data Types

JavaScript has dynamic types:

\`\`\`javascript
// String
let message = "Hello, World!";
let name = 'Alice';

// Number
let age = 25;
let price = 19.99;
let temperature = -5;

// Boolean
let isActive = true;
let hasLicense = false;

// Undefined
let undefVar;
console.log(undefVar);  // undefined

// Null
let emptyValue = null;

// Object
let person = {
    name: "John",
    age: 30
};

// Array
let colors = ["red", "green", "blue"];
\`\`\`

## let vs const vs var

### let
- Block-scoped
- Can be reassigned
- Cannot be redeclared in same scope

\`\`\`javascript
let x = 10;
x = 20;  // OK
let x = 30;  // Error: already declared
\`\`\`

### const
- Block-scoped
- Cannot be reassigned
- Must be initialized

\`\`\`javascript
const PI = 3.14;
PI = 3.14159;  // Error: cannot reassign

const person = {name: "John"};
person.name = "Jane";  // OK: modifying property
person = {};  // Error: cannot reassign object
\`\`\`

### var
- Function-scoped (or global)
- Can be reassigned and redeclared
- Avoid using in modern JavaScript

\`\`\`javascript
var a = 10;
var a = 20;  // OK but not recommended
\`\`\`

## Best Practices

1. Always use \`const\` by default
2. Use \`let\` when you need to reassign
3. Avoid \`var\`
4. Use meaningful variable names
5. Declare variables at the top of their scope

Understanding variables is fundamental to JavaScript programming!`,
          estimatedReadTime: 10,
          displayOrder: 2,
          isPublished: true,
        },
      ],
    });
  }

  // =====================================================
  // 3. SPRING BOOT TUTORIAL
  // =====================================================
  console.log('Creating Spring Boot tutorial...');
  const springTutorial = await prisma.tutorial.create({
    data: {
      slug: 'spring-boot',
      title: 'Spring Boot Tutorial',
      description:
        'Learn Spring Boot, the most popular Java framework for building enterprise applications. Master RESTful APIs, microservices, and modern application development.',
      icon: '🍃',
      difficultyLevel: 'intermediate',
      colorTheme: '#6db33f',
      estimatedHours: 30,
      isPublished: true,
      displayOrder: 3,
      metaTags: {
        keywords: ['spring boot', 'java', 'rest api', 'microservices'],
        ogImage: '/images/tutorials/spring-boot.jpg',
      },
    },
  });

  await prisma.tutorialSection.createMany({
    data: [
      {
        tutorialId: springTutorial.id,
        slug: 'spring-basics',
        title: 'Spring Boot Basics',
        description: 'Getting started with Spring Boot',
        displayOrder: 1,
      },
      {
        tutorialId: springTutorial.id,
        slug: 'spring-rest',
        title: 'Spring REST API',
        description: 'Building RESTful web services',
        displayOrder: 2,
      },
      {
        tutorialId: springTutorial.id,
        slug: 'spring-data',
        title: 'Spring Data JPA',
        description: 'Database operations',
        displayOrder: 3,
      },
      {
        tutorialId: springTutorial.id,
        slug: 'spring-security',
        title: 'Spring Security',
        description: 'Authentication and authorization',
        displayOrder: 4,
      },
    ],
  });

  // =====================================================
  // 4. .NET TUTORIAL
  // =====================================================
  console.log('Creating .NET tutorial...');
  const dotnetTutorial = await prisma.tutorial.create({
    data: {
      slug: 'dotnet',
      title: '.NET Tutorial',
      description:
        "Master .NET development with C#. Build modern web applications, APIs, and enterprise solutions using Microsoft's powerful framework.",
      icon: '🟣',
      difficultyLevel: 'intermediate',
      colorTheme: '#512bd4',
      estimatedHours: 35,
      isPublished: true,
      displayOrder: 4,
      metaTags: {
        keywords: ['.net', 'csharp', 'asp.net core', 'web api'],
        ogImage: '/images/tutorials/dotnet.jpg',
      },
    },
  });

  await prisma.tutorialSection.createMany({
    data: [
      {
        tutorialId: dotnetTutorial.id,
        slug: 'csharp-basics',
        title: 'C# Basics',
        description: 'C# programming fundamentals',
        displayOrder: 1,
      },
      {
        tutorialId: dotnetTutorial.id,
        slug: 'aspnet-core',
        title: 'ASP.NET Core',
        description: 'Web application development',
        displayOrder: 2,
      },
      {
        tutorialId: dotnetTutorial.id,
        slug: 'entity-framework',
        title: 'Entity Framework',
        description: 'ORM and database access',
        displayOrder: 3,
      },
      {
        tutorialId: dotnetTutorial.id,
        slug: 'dotnet-advanced',
        title: '.NET Advanced',
        description: 'Advanced .NET concepts',
        displayOrder: 4,
      },
    ],
  });

  // Update stats for all tutorials
  const allTutorials = await prisma.tutorial.findMany({
    include: {
      sections: {
        include: {
          topics: true,
        },
      },
    },
  });

  for (const tutorial of allTutorials) {
    const totalTopics = tutorial.sections.reduce((sum, section) => sum + section.topics.length, 0);
    const totalViews = tutorial.sections.reduce(
      (sum, section) =>
        sum + section.topics.reduce((topicSum, topic) => topicSum + topic.viewsCount, 0),
      0
    );

    await prisma.tutorial.update({
      where: { id: tutorial.id },
      data: {
        stats: {
          total_topics: totalTopics,
          total_views: totalViews,
        },
      },
    });
  }

  console.log('✅ Tutorials seeded successfully!');
  console.log(`
  Created:
  - 4 Tutorials (Java, JavaScript, Spring Boot, .NET)
  - 22 Tutorial Sections
  - 7 Tutorial Topics (with full content)
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding tutorials:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
