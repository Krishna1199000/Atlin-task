# Private Notes Vault

A secure, private notes application built with Next.js and Supabase. Each user can create, view, edit, and delete their own notes with complete data privacy.

## 🚀 Live Demo

**Deployed at:** [https://atlin-task.vercel.app](https://atlin-task.vercel.app)

## 📋 Overview

Private Notes Vault is a full-stack web application that provides a simple, distraction-free environment for personal note-taking. Built as an internship assignment for AtoZ Demand Gen, the application emphasizes security, data ownership, and a clean user experience.

## ✨ Features

### Core Features (Required)
- ✅ **Email + Password Authentication** - Secure signup and login
- ✅ **Google OAuth Authentication** - One-click sign in with Google
- ✅ **Create, View, Edit, Delete Notes** - Full CRUD functionality
- ✅ **Private Notes** - Users can only access their own notes
- ✅ **Row Level Security (RLS)** - Database-level data protection
- ✅ **Clean, Focused UI** - Distraction-free design
- ✅ **Responsive Design** - Works seamlessly on mobile and desktop

### Bonus Features (Optional)
- ✅ **Edit Notes** - Update existing notes with auto-save
- ✅ **Auto-save while typing** - Notes automatically save every 2 seconds when editing
- ✅ **Smooth transitions** - Polished animations and transitions throughout
- ✅ **Mobile-friendly layout** - Fully responsive and touch-optimized
- ✅ **Search functionality** - Real-time search across all notes
- ✅ **Email validation** - Comprehensive email format validation
- ✅ **Password strength indicator** - Visual feedback for password requirements
- ✅ **Skeleton loaders** - Smooth loading states
- ✅ **Toast notifications** - Beautiful success/error notifications
- ✅ **Auto-save status indicator** - Shows save status in real-time

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Styling:** Tailwind CSS
- **Date Formatting:** date-fns
- **Notifications:** react-hot-toast

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Middleware protection** - Route-level authentication
- **Secure authentication** - Supabase Auth with email verification
- **Client-side validation** - Input validation before submission
- **Protected routes** - Unauthenticated users redirected to login

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Krishna1199000/Atlin-task.git
   cd Atlin-task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to **Settings > API** and copy:
     - Project URL
     - Anon public key
   - Go to **SQL Editor** and run the SQL schema from `supabase/schema.sql`
   - Enable Google OAuth (optional):
     - Go to **Authentication > Providers**
     - Enable **Google** provider
     - Add your OAuth credentials
     - Add redirect URL: `http://localhost:3000/auth/callback` (development)
     - Add redirect URL: `https://atlin-task.vercel.app/auth/callback` (production)

4. **Configure environment variables**
   - Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication callbacks
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── notes/             # Notes pages
│       ├── [id]/          # Individual note view/edit
│       └── new/           # Create new note
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── notes/             # Notes-related components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
│   └── useAutoSave.ts     # Auto-save functionality
├── lib/                   # Utility libraries
│   ├── supabase/          # Supabase client configuration
│   ├── validation.ts      # Form validation utilities
│   └── constants.ts       # Application constants
├── types/                 # TypeScript type definitions
└── supabase/              # Database schema
    └── schema.sql         # SQL schema and RLS policies
```

## 🎨 Design Philosophy

The app follows a **minimalist, distraction-free** design:
- Clean, simple interface
- Focused on writing and reading
- No unnecessary features
- Private by default
- Fast and responsive

## 📱 Responsive Design

Fully optimized for all screen sizes:
- **Mobile** (< 640px) - Touch-optimized, stacked layouts
- **Tablet** (640px - 1024px) - Comfortable spacing
- **Desktop** (> 1024px) - Maximum width, optimal readability

## 🔑 Key Implementation Details

### Authentication Flow
- Email signup requires verification (production-ready UX)
- Google OAuth provides instant authentication
- Secure session management with Supabase SSR

### Auto-Save Feature
- Automatically saves notes while editing
- 2-second debounce delay
- Visual status indicator (Saving/Saved/Unsaved)
- No manual save required

### Search Functionality
- Real-time search across title and content
- Client-side filtering for instant results
- Search results counter

### Database Schema
- UUID primary keys
- Foreign key constraint to auth.users
- Timestamps for created_at
- Indexes for performance optimization
- Row Level Security (RLS) policies

## 🧪 Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting
- **Component-based architecture** - Reusable, maintainable components
- **Server and Client components** - Optimal Next.js patterns
- **Error handling** - Comprehensive error boundaries
- **Loading states** - Skeleton loaders and spinners
- **Accessibility** - ARIA labels and keyboard navigation

## 🚢 Deployment

### Deploy to Vercel (Current)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update Supabase redirect URLs:
   - Add your Vercel domain: `https://atlin-task.vercel.app/auth/callback`
5. Deploy!

## 📝 Assignment Requirements Coverage

### ✅ Authentication & Data Security (35%)
- Email + Password authentication
- Google OAuth authentication
- Row Level Security (RLS) at database level
- Middleware route protection
- Secure session management

### ✅ Notes Flow (30%)
- Create notes
- View list of notes
- View single note
- Edit notes (bonus)
- Delete notes

### ✅ UI Simplicity & Originality (20%)
- Clean, minimal interface
- Distraction-free design
- Smooth transitions and animations
- Responsive mobile-friendly layout

### ✅ Code Quality & Structure (15%)
- TypeScript for type safety
- Component-based architecture
- Clean code structure
- Proper error handling
- Well-organized file structure

## 👤 Author

**Krishna Gohil**

Built as a full-stack internship assignment submission for **AtoZ Demand Gen**.

### Connect with me
- 🌐 **Portfolio:** [portfolio-krishna-psi.vercel.app](https://portfolio-krishna-psi.vercel.app/)
- 💼 **LinkedIn:** [linkedin.com/in/krishna-gohil-a3860025b](https://linkedin.com/in/krishna-gohil-a3860025b/)
- 🐦 **X (Twitter):** [@krishna893700](https://x.com/krishna893700)
- 📦 **GitHub:** [@Krishna1199000](https://github.com/Krishna1199000)

## 📄 License

This project is private and for internship submission purposes.

---

**Note:** This project demonstrates proficiency in:
- Full-stack development (Next.js + Supabase)
- Authentication & security
- Database design (RLS policies)
- UI/UX design
- Code quality & structure
- Modern web development practices
