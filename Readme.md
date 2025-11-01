# 🌐 CampusConnect – The University Talent Finder App

**CampusConnect** is a modern web platform that bridges the gap between students within a university — enabling them to **discover talent**, **post opportunities**, and **collaborate** on projects, startups, hackathons, and part-time work.

Built for **Surge ’25 Web Hackathon**, CampusConnect aims to deliver a **premium, scalable, and AI-powered platform** with a beautiful **Glassmorphic UI** and robust **Supabase + Prisma backend**.

---

## 🚀 Overview

CampusConnect empowers students to:
- **Post** academic, startup, or freelance opportunities.
- **Browse and apply** for campus-based gigs.
- **Collaborate and chat** in real-time.
- **Track applications** and analytics for their posts.
- **Get personalized recommendations** powered by smart matching algorithms.

Every user can act as both:
- 🧑‍💼 **Talent Finder** – Post jobs or opportunities.
- 🧑‍🎓 **Talent Seeker** – Discover and apply to them.

---

## 🧱 Core Features

| Category | Description |
|-----------|--------------|
| 🔐 **Authentication** | Supabase Auth with Google, GitHub, and Email login. Profiles managed via Prisma. |
| 👥 **Role-based Dashboard** | Seamless switch between “Finder” and “Seeker” modes without logout. |
| 💼 **Job Management** | Create, edit, delete, and mark posts as filled or draft. |
| 🧾 **Applications** | Upload resumes, send proposals, and track status (Pending, Shortlisted, Accepted, Rejected). |
| 💬 **Chat System** | Real-time messaging between finders and seekers using Supabase Realtime. |
| 🔍 **Smart Recommendations** | Suggests jobs that best match a user’s skills and interests. |
| 📈 **Analytics Dashboard** | View total views, applications, and engagement metrics for each job. |
| 🧠 **Match Score AI** | Calculates how well a user’s skills align with a job’s tags (e.g., “You match 82% of this opportunity”). |
| ⭐ **Bookmarks & Notifications** | Save opportunities for later and get updates for new messages or status changes. |

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 15 (App Router) + TypeScript + TailwindCSS + Shadcn/UI + Framer Motion |
| **Backend** | Prisma ORM + Supabase PostgreSQL |
| **Auth** | Supabase Auth (OAuth + Email) |
| **Realtime** | Supabase Realtime for chat and notifications |
| **Hosting** | Vercel (Frontend + API) |
| **AI Logic** | Match score algorithm (skills-to-tags similarity model) |

---

## 🎨 Design System — *Premium Glassmorphism*

CampusConnect uses a **modern glassmorphic aesthetic** inspired by Apple’s macOS design language, combined with bold gradients and subtle depth.

### ✨ Visual Language
- Transparent layers with **blurred backgrounds**.
- **Soft gradients**: Yellow → Blue tones for positivity and energy.
- **Rounded edges** and **subtle shadows** for visual depth.
- **Minimal typography** (Inter + Poppins) for clean readability.
- Dynamic **Framer Motion animations** for fluid transitions.

### 🧭 Core UI Principles
| Principle | Description |
|------------|-------------|
| 🧊 **Glass Layers** | Every card, modal, and sidebar is semi-transparent with backdrop blur. |
| 🌈 **Gradient Accents** | Buttons and highlights use smooth linear gradients. |
| 💫 **Depth & Motion** | Hover lift, fade transitions, and parallax scrolling used for interactivity. |
| ⚙️ **Consistency** | Centralized design configuration via `/design/design.json` and Tailwind theme extension. |

### 🎨 Color & Style Reference
| Element | Light Mode | Dark Mode |
|----------|-------------|-----------|
| Background | rgba(255,255,255,0.75) | rgba(17,25,40,0.85) |
| Card | rgba(255,255,255,0.25) | rgba(255,255,255,0.05) |
| Accent | #3B82F6 | #38BDF8 |
| Gradient | Yellow → Blue | Amber → Cyan |

> 💡 See [`design/design.json`](./design/design.json) for the full theme configuration file defining global blur, shadows, and typography.

---

## 🧬 Database Schema (Prisma + Supabase)

CampusConnect’s data model is optimized for scalability and hackathon-level innovation.

### 🗂️ Key Models
- **Profile** – extends Supabase Auth with skills, interests, and role.
- **Job** – stores all postings with analytics.
- **Application** – manages job applications with status and match score.
- **Message** – real-time chat system between users.
- **Bookmark** – saved jobs per user.
- **Notification** – in-app alerts and push events.
- **JobAnalytics** – per-view engagement tracking.

### 🧩 Enums
- `Role`: FINDER | SEEKER  
- `JobType`: Academic Project | Startup | Part-time | Competition | Other  
- `ApplicationStatus`: Pending | Shortlisted | Accepted | Rejected  

> See [`prisma/schema.prisma`](./prisma/schema.prisma) for full relational schema.

---

## 🧠 Engineering Logic

CampusConnect integrates algorithmic thinking for the *Engineering Logic* judging criteria:

### 🧩 Smart Match Score
Compares user `skills` with `job.tags` using set overlap and weighting logic:
match = (commonSkills / totalJobTags) * 100

Displayed visually on each job card.

### ⚙️ Recommendation Engine
Suggests relevant opportunities using interest-based filtering and skill similarity.

---

## 🛡️ Admin System & Job Approval

CampusConnect includes a robust admin system with job approval workflow:

### Admin Access
Admin access is controlled by hardcoded email addresses in `/src/lib/admin/config.ts`:

```typescript
export const ADMIN_EMAILS = [
  'admin@campusconnect.com',
  // Add more admin emails here
];
```

**Default Admin Credentials:**
- Email: `admin@campusconnect.com`
- Password: `Admin@123456` (change in production!)

### Setup Steps

#### Quick Start (3 steps):

1. **Create Admin User in Supabase:**
   - Go to your Supabase Dashboard → Authentication → Users
   - Click "Add user" → "Create new user"
   - Email: `admin@campusconnect.com`
   - Password: `Admin@123456`
   - ✅ Check "Auto Confirm User"
   - Click "Create user"

2. **Run Database Migration:**
   ```bash
   npx prisma migrate dev --name add_admin_and_job_approval
   npx prisma generate
   ```
   This adds job approval fields (`status`, `rejectionReason`, etc.)

3. **Uncomment Code (After Migration):**
   In `/src/app/api/jobs/route.ts`, uncomment these lines:
   - **Line 104:** `status: 'PENDING',` 
   - **Line 169:** `status: 'POSTED',`

**Done!** Login with admin email and go to `/admin`

### Alternative: Modify Admin Email
Don't want to use the default admin email? Just update `/src/lib/admin/config.ts`:

```typescript
export const ADMIN_EMAILS = [
  'youremail@university.edu', // Change to your email
];
```

Then create a Supabase user with that email!

### Job Approval Workflow

1. **User Creates Job** → Status: `PENDING`
2. **Admin Reviews** → Can approve or reject with reason
3. **If Approved** → Status: `APPROVED` → Job visible to public
4. **If Rejected** → Status: `REJECTED` → User notified with reason

### Admin Features
- ✅ View all registered users with stats
- ✅ Search users by name/email
- ✅ View, filter, and manage all jobs (PENDING, APPROVED, REJECTED, POSTED)
- ✅ Approve/reject jobs with optional rejection reasons
- ✅ Real-time statistics dashboard
- ✅ User activity tracking (jobs created, applications, messages)

### Adding More Admins
Simply add their email to the `ADMIN_EMAILS` array in `/src/lib/admin/config.ts`:

```typescript
export const ADMIN_EMAILS = [
  'admin@campusconnect.com',
  'admin2@university.edu',
  'supervisor@campusconnect.com',
];
```

No database changes or scripts needed - just add the email and they'll have instant admin access once they create an account!

---


