# Campus Lost & Found Platform

A comprehensive, production-ready Lost and Found management system designed specifically for campus environments, universities, and large organizations. 

This platform streamlines the process of recovering lost belongings through intelligent matching algorithms, secure ownership verification, and real-time user communication, ensuring a trustworthy and efficient recovery workflow.

---

## Architecture & Tech Stack

This project is built on a modern, scalable, and type-safe architecture:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Database:** PostgreSQL hosted via [Supabase](https://supabase.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** Supabase Auth (Email & OAuth providers)
- **Real-Time Engine:** Supabase WebSockets (Postgres Changes)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)

---

## Key Features & Capabilities

### 1. Intelligent Matching Engine
The core of the platform is an automated matching engine. When a user reports a lost or found item, the system analyzes the item's category, descriptive tags, date occurred, and location. It then computes similarity scores against existing database entries to proactively suggest potential matches to both the loser and the finder, minimizing manual searching.

### 2. Secure Ownership Verification (Claims)
To prevent theft and fraudulent claims, the platform implements a strict verification workflow. When a user identifies a potential match, they must submit a formal "Claim." This claim requires providing unique proof of ownership (e.g., serial numbers, specific physical damage, internal receipts). The finder (or a designated administrator) reviews this proof before the item is handed over.

### 3. Real-Time Communication
The platform eliminates the need for users to exchange personal contact information. Once a claim is initiated or a match is accepted, a secure, dedicated chat room is instantiated. Powered by Supabase WebSockets, the messaging interface operates in real-time. Furthermore, global WebSocket listeners ensure that users receive instant notification updates and unread count badges across the entire application without requiring page reloads.

### 4. Reputation & Gamification
To encourage participation and honesty, the platform utilizes a Trust Badge system. Users earn reputation badges (such as "Honest Finder") for successfully returning items to their rightful owners. To prevent exploitation, the system algorithmically verifies that reputation points are only awarded upon the completion of an accepted match or an approved claim.

### 5. Administration & Moderation
The system includes robust moderation tools for campus administrators:
- **Immutable Root Access:** Support for a hardcoded Super Admin role that cannot be degraded or removed.
- **User Management Dashboard:** Administrators can view user activity metrics, escalate privileges, and enforce platform rules.
- **Suspension Controls:** Malicious or spamming users can be globally suspended. The application utilizes secure middleware and Server Action verification to instantly lock suspended accounts out of mutation endpoints.

### 6. Privacy & Data Anonymization
Compliance with data privacy standards is handled via a specialized deletion protocol. When a user deletes their account, the system hard-deletes all associated items, claims, and messages. However, to preserve the integrity of administrative audit logs, the core User record undergoes graceful anonymization—scrambling personal identifiers while maintaining foreign key relations for historical audits.

---

## Local Development

To run the platform locally, ensure you have Node.js installed, then execute:

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run the development server
npm run dev
```

Navigate to `http://localhost:3000` to interact with the application.
