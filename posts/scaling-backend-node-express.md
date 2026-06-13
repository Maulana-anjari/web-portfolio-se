---
title: "Scaling Backend Services: Lessons from Managing Application Development Projects"
date: "2026-02-22"
excerpt: "Reflections on backend engineering, ERD modeling, and API integration during my time as a Developer at Find IT! UGM and Sub-Manager at Technocorner."
tags: ["Backend", "Node.js", "MongoDB", "Architecture"]
img: "/images/blog/scaling-backend-node.png"
readingTime: "3 min read"
--- 

## Introduction

Building backend services means designing a robust, scalable foundation that authenticates users and communicates with the frontend. During my early career as a software engineering student at UGM, I took on roles as a **Back End Developer at Find IT! UGM** and later progressed to **Sub-Manager of Backend Services at Technocorner**.

These roles challenged me to move beyond simple prototypes and build production-grade architectures. The key technical lessons spanned database modeling and frontend integration.

![Technical architecture diagram of a microservices backend system](/images/blog/scaling-backend-node.png)

## The Foundation: Database Design and ERD

Before writing a single line of API code at Find IT! UGM, the most critical step was designing the Entity-Relationship Diagram (ERD). For a web application handling student registrations and user profiles, the database schema determines the performance and scalability of the entire system.

We opted for **MongoDB** as our primary datastore. While NoSQL databases like MongoDB are inherently schemaless, structuring the data conceptually via ERDs was still vital to understand data access patterns.

```

mermaid
erDiagram
    USER ||--o{ REGISTRATION : "submits"
    USER {
        ObjectId _id
        string email
        string hashed_password
        string role
    }
    REGISTRATION ||--|| COMPETITION : "belongs_to"
    REGISTRATION {
        ObjectId _id
        ObjectId user_id
        ObjectId competition_id
        string status
        date submitted_at
    }
    COMPETITION {
        ObjectId _id
        string name
        date deadline
    }

```

By explicitly mapping out these relationships, we optimized our queries using Mongoose (the MongoDB ORM for Node.js), avoiding unnecessary data duplication and expensive lookup operations.

## Securing Access: Authentication with JWT

Security is the bedrock of any backend system. At both Find IT! and Technocorner, we implemented robust authentication and authorization flows utilizing **JSON Web Tokens (JWT)**.

Instead of relying on stateful server sessions which can become bottlenecks as traffic grows, JWT allows for stateless authentication. 

### The JWT Flow Implementation

A user logs in, and the unified Node.js/Express.js server validates the credentials and issues a signed token.

```

javascript
// Example: Generating a JWT after successful login
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // Payload contains non-sensitive identification data
  const payload = {
    id: user._id,
    role: user.role
  };
  
  // Sign the token with a secret key and set an expiration
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d' // Token expires in 1 day
  });
};

```

The client then passes this token in the `Authorization` header for subsequent requests. We built custom middleware in Express.js to intercept requests and restrict access based on the user's role (e.g., standard user vs. admin).

## Seamless Integration: Connecting Node.js with Next.js

Transitioning to the Sub-Manager role at Technocorner expanded the scope from building APIs to ensuring they integrated with the Next.js frontend architecture.

The challenge was orchestrating the flow of web application data: handling complex CRUD (Create, Read, Update, Delete) operations without bottlenecking the user interface.

### Strategies for Next.js Integration:

1.  **CORS and Security Headers:** Configuring the Express server to securely accept requests from the Next.js frontend domain while blocking unauthorized origins.
2.  **Standardized API Responses:** Establishing a strict JSON response format (e.g., `{ success: true, data: {...}, message: "..." }`) so the frontend developers could build predictable state management and error-handling routines.
3.  **Data Fetching:** Leveraging Next.js's data fetching methods (like `getServerSideProps` or `getStaticProps`) to pre-fetch critical data from our Node.js APIs, improving the initial page load speed for end-users.

## Conclusion

Transitioning from a Back End Developer to a Sub-Manager shifted my perspective. I learned that writing code requires architectural design and clear communication contracts with the frontend team.

The hands-on experience with Node.js and MongoDB built a solid foundation that I continue to rely on when designing more complex, scalable microservices today.
