# 🚀 Hackathon Starter Pack

A production-ready, full-stack authentication and file management system built with Next.js 16, Supabase, shadcn/ui, and Prisma. Perfect for hackathons and rapid application development!

## ✨ Features

### 🔐 Authentication System
- **Complete Auth Flow** - Login, signup, logout with Supabase Auth
- **Form Validation** - React Hook Form + Zod validation
- **Protected Routes** - Middleware-based route protection
- **Session Management** - Automatic session refresh and persistence
- **Beautiful UI** - shadcn/ui components with Tailwind CSS

### 💳 Payment System (NEW!)
- **Stripe Integration** - Complete payment processing
- **Subscription Management** - Recurring billing with multiple plans
- **Billing Portal** - Customer self-service portal
- **Invoice Management** - Automatic invoice generation and tracking
- **Webhook Handling** - Real-time payment event processing
- **Trial Periods** - Free trials for subscriptions
- **Multiple Plans** - Free, Pro, and Business tiers

### 📁 File Management System
- **Multi-format Upload** - Images, videos, documents
- **Drag & Drop** - Intuitive file upload interface
- **File Validation** - Type, size, and format validation
- **Supabase Storage** - Secure cloud file storage
- **Real-time Progress** - Upload progress tracking
- **Preview System** - Image previews before upload

### 👥 Role-Based Access Control (RBAC)
- **User Roles** - Admin, Moderator, User, Guest
- **Granular Permissions** - Fine-grained permission system
- **Permission Guards** - Component-level access control
- **Role Management** - Easy role assignment and management

### 🗄️ Database Schema
- **Prisma ORM** - Type-safe database access
- **User Management** - Full user profile system
- **File Metadata** - Track all file information
- **Folder System** - Organize files in folders
- **File Sharing** - Share files between users
- **Activity Logging** - Track user actions

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Auth**: Supabase Auth
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Supabase Storage
- **UI**: shadcn/ui + Tailwind CSS
- **Validation**: Zod + React Hook Form
- **TypeScript**: Full type safety
- **Icons**: Lucide React

## 📦 Quick Start

### 1. Install Dependencies

```bash
cd hackathon-starter
pnpm install
```

### 2. Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=your-database-url
```

### 3. Set Up Supabase

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your API credentials from Settings > API

#### Set Up Storage Buckets
Follow the guide in `SUPABASE_SETUP.md` to:
- Create storage buckets (images, videos, documents, avatars)
- Configure bucket policies
- Set up RLS (Row Level Security)

Quick setup:
```bash
# Run the SQL script in Supabase SQL Editor
# See SUPABASE_SETUP.md for the complete script
```

### 4. Set Up Database

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
pnpm prisma:studio
```

### 5. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Auth callback handlers
│   ├── dashboard/        # Protected dashboard
│   ├── files/            # File management page
│   ├── login/            # Login page
│   ├── profile/          # User profile
│   ├── signup/           # Signup page
│   └── page.tsx          # Home page
├── components/
│   ├── auth/             # Auth components
│   ├── ui/               # shadcn/ui components
│   ├── FileUpload.tsx    # Drag-n-drop upload
│   ├── Navbar.tsx        # Navigation
│   └── PermissionGuard.tsx
├── contexts/
│   └── AuthContext.tsx   # Auth state management
├── hooks/
│   └── usePermissions.ts # Permission hooks
├── lib/
│   ├── rbac/             # Role-based access control
│   ├── storage/          # File upload utilities
│   ├── supabase/         # Supabase clients
│   ├── validators/       # Zod schemas
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── middleware.ts         # Route protection
└── prisma/
    └── schema.prisma     # Database schema
```

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components:

- Button
- Card
- Form
- Input
- Label
- Alert
- Badge
- Tabs
- Separator

All components are customizable and follow best practices.

## 🔒 Authentication Features

### Login
- Email/password authentication
- Form validation with helpful error messages
- Remember me functionality
- Redirect to intended page after login

### Signup
- Strong password requirements
- Password confirmation
- Email validation
- Automatic login after signup

### Protected Routes
Routes automatically protected:
- `/dashboard`
- `/profile`
- `/files`

## 📤 File Upload Features

### Supported File Types

**Images** (up to 10MB):
- JPG, JPEG, PNG, GIF, WebP, SVG

**Videos** (up to 100MB):
- MP4, WebM, OGG, MOV

**Documents** (up to 50MB):
- PDF, DOC, DOCX, XLS, XLSX, TXT

### Upload Features
- ✅ Drag and drop interface
- ✅ Multiple file selection
- ✅ Client-side validation
- ✅ File type detection
- ✅ Size limit enforcement
- ✅ Image previews
- ✅ Upload progress tracking
- ✅ Error handling
- ✅ Success notifications

## 👥 Role-Based Access Control

### Default Roles

**ADMIN**
- Full system access
- User management
- Permission management
- Storage management

**MODERATOR**
- Content moderation
- View users
- Manage files
- View activity logs

**USER** (Default)
- Upload files
- Manage own files
- Create folders
- Share files

**GUEST**
- View public content only

### Using Permissions

```tsx
import { usePermissions } from '@/hooks/usePermissions'
import { PermissionGuard } from '@/components/PermissionGuard'

function MyComponent() {
  const { hasPermission, userRole } = usePermissions()
  
  // Check permission programmatically
  if (hasPermission('file:delete_any')) {
    // Show delete button
  }
  
  // Or use component guard
  return (
    <PermissionGuard permission="admin:access_panel">
      <AdminPanel />
    </PermissionGuard>
  )
}
```

## 🗄️ Database Schema

### Key Models

**User**
- Authentication info
- Profile data
- Role assignment
- Activity tracking

**File**
- File metadata
- Storage information
- Owner and permissions
- Thumbnails for images

**Folder**
- Hierarchical structure
- Sharing capabilities
- User organization

**SharedFile**
- File sharing
- Permission levels
- Expiration dates

**ActivityLog**
- User actions
- Audit trail
- Security monitoring

See `prisma/schema.prisma` for complete schema.

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push code to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables

Production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`

### Post-Deployment

1. Update Supabase redirect URLs:
   - Settings > Authentication > URL Configuration
   - Add: `https://your-domain.com/auth/callback`

2. Run database migrations:
   ```bash
   pnpm prisma migrate deploy
   ```

3. Test file uploads in production

## 📚 Documentation

- `QUICKSTART.md` - Fast 5-minute setup guide
- `SETUP.md` - Detailed setup instructions
- `SUPABASE_SETUP.md` - Storage configuration guide
- `prisma/schema.prisma` - Database schema documentation

## 🔧 Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run migrations
pnpm prisma:studio    # Open Prisma Studio

# Linting
pnpm lint             # Run ESLint
```

## 🎯 Best Practices

### Form Validation
- All forms use Zod schemas
- Client-side validation
- Server-side validation
- Clear error messages
- Accessible form controls

### Security
- Row-level security (RLS)
- User file isolation
- Input sanitization
- SQL injection prevention
- XSS protection

### Performance
- Server components by default
- Image optimization
- Code splitting
- Lazy loading
- Efficient queries

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Consistent naming
- Component modularity
- Clear file structure

## 🤝 Contributing

This is a starter template. Feel free to:
- Customize for your needs
- Add new features
- Improve existing code
- Share your improvements

## 📝 License

MIT License - feel free to use this for your hackathon projects!

## 🆘 Troubleshooting

### File Upload Issues
- Check Supabase storage buckets exist
- Verify bucket policies are set
- Ensure user is authenticated
- Check file size limits

### Auth Issues
- Verify environment variables
- Check Supabase project is active
- Ensure redirect URLs are configured
- Check for CORS issues

### Database Issues
- Run `pnpm prisma generate`
- Check DATABASE_URL format
- Verify database exists
- Run pending migrations

## 🌟 What's Next?

### Suggested Enhancements
- OAuth providers (Google, GitHub)
- Email verification flow
- Password reset functionality
- User profile editing
- File galleries with filtering
- Folder hierarchies
- Advanced file sharing
- Admin dashboard
- Activity feeds
- Notification system

## 📞 Support

- GitHub Issues for bugs
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- shadcn/ui Docs: [ui.shadcn.com](https://ui.shadcn.com)

---

**Built with ❤️ for hackathons**

Featuring: Next.js 16 • Supabase • Prisma • shadcn/ui • TypeScript
