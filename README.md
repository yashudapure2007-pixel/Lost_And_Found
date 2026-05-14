# 📍 Campus Lost & Found Platform

A fully-featured, production-ready Lost and Found web application tailored for campus environments (Universities, Hostels, Departments). Built with modern web technologies to simplify recovering lost belongings through intelligent matching, secure claims, and real-time communication.

---

## 🌟 Core Features

### 1. Smart Reporting & Matching Engine
- **Report Items:** Users can report items they have lost or found, categorizing them and adding descriptive tags, locations, and images.
- **Automated Matching:** The system calculates a similarity score between Lost and Found items based on categories, descriptions, and dates, suggesting potential matches to users automatically.

### 2. Secure Claiming System
- When a user believes a "Found" item is theirs, they can submit a **Claim** requiring proof of ownership (e.g., serial numbers, receipts, specific scratch marks).
- The finder (or an admin) reviews the claim proof before accepting it, ensuring items are only returned to their rightful owners.

### 3. Real-Time Communication ⚡
- **Instant Messaging:** Built-in chat system allowing finders and claimants to coordinate handovers safely without sharing personal phone numbers publicly.
- **Global Live Notifications:** Powered by **Supabase Realtime WebSockets**, users receive instant toast notifications and unread badge updates across the entire app whenever they receive a message or their item is claimed.

### 4. Anti-Exploit Gamification 🏆
- **Trust Badges:** Users are rewarded with badges (e.g., "Honest Finder") for successfully returning items.
- **Exploit Prevention:** The point system strictly verifies that a return was legitimate (requiring an accepted match or an approved claim) to prevent users from artificially farming reputation points with fake reports.

### 5. Advanced Administration & Moderation 👑
- **Super Admin Root Access:** A hardcoded, immutable Super Admin account that cannot be deleted or suspended.
- **Moderation Panel:** Admins can view all registered users, track their platform activity, promote them to Admin status, or **Suspend** them.
- **Suspension Middleware:** Suspended users are globally locked out of creating reports, claiming items, or sending messages via secure Next.js Server Actions.

### 6. Data Privacy & Anonymization
- **Account Deletion:** Users can permanently delete their accounts. 
- **Graceful Anonymization:** To preserve the integrity of Admin Audit Logs, a deleted account hard-removes all personal posts/messages but scrambles the core profile into an anonymous "Deleted User" shell, ensuring privacy compliance without breaking database relations.

---

## 🛠️ Technical Architecture

This application is built using a modern, scalable, and type-safe stack:

*   **Frontend & API:** [Next.js 15](https://nextjs.org/) (App Router, React Server Components, Server Actions)
*   **Database:** PostgreSQL (Hosted on [Supabase](https://supabase.com/))
*   **ORM:** [Prisma](https://www.prisma.io/) (For type-safe database queries and migrations)
*   **Authentication & Storage:** Supabase Auth & Supabase Storage (Buckets)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
*   **Realtime:** Supabase Postgres Changes (WebSockets)

### 📂 Directory Structure

```text
Lost_And_Found/
├── prisma/                 # Database schema and migrations
│   └── schema.prisma       # Core PostgreSQL schema
├── public/                 # Static assets
└── src/
    ├── actions/            # Next.js Server Actions (Database mutations & business logic)
    ├── app/                # Next.js App Router pages and layouts
    ├── components/         # Reusable React components (UI, Forms, Realtime Listeners)
    └── lib/                # Utility functions, Prisma Client, and Supabase Clients
```

---

## 🚦 Application Flows

### The "Happy Path" (Reuniting an Item)
1. **User A** loses a pair of headphones and submits a "Lost" report.
2. **User B** finds the headphones and submits a "Found" report.
3. The **Matching Engine** detects the similarity and notifies both users.
4. User A clicks the match and submits a **Claim** detailing a unique scratch on the case as proof.
5. User B reviews the claim, verifies the scratch, and **Approves** it.
6. A **Real-time Chat** is automatically generated between User A and User B to coordinate the meetup.
7. Upon successful handover, User B marks the item as **Returned** and earns an "Honest Finder" badge!

### The Administration Flow
1. An Admin logs into the dashboard and navigates to the `/admin/users` panel.
2. The Admin notices a user spamming fake items.
3. The Admin clicks **Suspend User**.
4. The malicious user is instantly redirected to a `/suspended` page on their next click and prevented from accessing any Server Actions.

---

## 🚀 Deployment Guide (Vercel)

Deploying this platform is incredibly straightforward as it is heavily optimized for Vercel.

1. **Push to GitHub:** Ensure your `main` branch is up to date.
2. **Import to Vercel:** Create a Vercel project and import the repository. Vercel will automatically detect the Next.js framework.
3. **Environment Variables:** Add the following to your Vercel Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL` (Connection Pooling URL)
   - `DIRECT_URL` (Direct Postgres URL)
4. **Deploy:** Click Deploy.
5. **Supabase Auth Update:** Go to your Supabase Dashboard -> Authentication -> URL Configuration, and add your new Vercel domain to the **Site URL** and **Redirect URLs** to allow logins to work in production.

*(Note: Ensure that the `supabase_realtime` publication is enabled for the `messages` and `notifications` tables in your Supabase SQL Editor/Dashboard).*

---

## 🤖 Context for AI Assistants

If an AI agent is reading this repository in the future to implement new features or fix bugs, please note the following architectural rules established in this codebase:

1. **Server Actions for Mutations:** All database inserts/updates/deletes are handled via Server Actions inside `src/actions/`. Do not use `/api/` route handlers for mutations.
2. **Authentication Checks:** Always use `const user = await getCurrentUser();` at the top of Server Actions and verify they are not `user.status === "SUSPENDED"`.
3. **Prisma Schema Updates:** If you modify `schema.prisma`, you must run `npx prisma db push` and `npx prisma generate`.
4. **Realtime Broadcasts:** New notifications/messages are automatically picked up by the `GlobalRealtime` component. No extra client-side refetching logic is required for unread counts.
5. **UI Components:** Use the pre-configured `shadcn/ui` components located in `src/components/ui/` instead of writing raw HTML elements when possible.
