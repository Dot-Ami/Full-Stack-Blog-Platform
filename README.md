# Blogify - Modern Blog Platform

A modern full-stack blog platform built with Next.js 14, PostgreSQL, and Prisma.

![Blogify](https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop)

## ✨ Features

- **User Authentication**: Email/password signup and login with NextAuth.js
- **Rich Text Editor**: Write posts with Tiptap editor - formatting, images, links
- **Comments System**: Nested comments with replies
- **Categories**: Organize posts by topics
- **Search**: Find posts by title or content
- **User Profiles**: Public author pages
- **Dashboard**: Manage your posts and settings
- **Responsive Design**: Works beautifully on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Editor**: Tiptap
- **Styling**: Tailwind CSS
- **File Uploads**: Uploadthing
- **Icons**: Lucide React
- **Validation**: Zod
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or hosted)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd blog-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase Database**

   a. Go to [supabase.com](https://supabase.com) and create a new project
   
   b. Once created, go to **Project Settings** → **Database**
   
   c. Copy the connection strings:
      - **Transaction mode** (for app): `postgresql://postgres.[ref]:[password]@...pooler.supabase.com:6543/postgres`
      - **Session mode** (for migrations): `postgresql://postgres.[ref]:[password]@...pooler.supabase.com:5432/postgres`

4. **Set up Google OAuth** (optional but recommended)

   a. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   
   b. Create a new project or select existing
   
   c. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
   
   d. Application type: **Web application**
   
   e. Add Authorized redirect URIs:
      - `http://localhost:3000/api/auth/callback/google` (development)
      - `https://your-domain.com/api/auth/callback/google` (production)
   
   f. Copy the **Client ID** and **Client Secret**

5. **Set up environment variables**
   
   Create a `.env.local` file:
   ```env
   # Supabase Database
   DATABASE_URL="postgresql://postgres.[your-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[your-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Uploadthing (optional - for image uploads)
   UPLOADTHING_SECRET=""
   UPLOADTHING_APP_ID=""
   ```

6. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

7. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

8. **Start the development server**
   ```bash
   npm run dev
   ```

9. Open [http://localhost:3000](http://localhost:3000)

### Demo Account

After seeding, you can login with:
- **Email**: demo@example.com
- **Password**: Demo1234

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (main)/            # Main app pages
│   │   ├── dashboard/     # User dashboard
│   │   ├── posts/         # Post pages
│   │   └── profile/       # User profiles
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/              # Auth components
│   ├── comments/          # Comment components
│   ├── editor/            # Rich text editor
│   ├── layout/            # Layout components
│   ├── posts/             # Post components
│   ├── shared/            # Shared components
│   └── ui/                # UI primitives
├── lib/                   # Utilities and config
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Prisma client
│   ├── utils.ts           # Helper functions
│   └── validations/       # Zod schemas
├── hooks/                 # React hooks
└── types/                 # TypeScript types
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

## 📝 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/[...nextauth]` | NextAuth handler |
| GET/POST | `/api/posts` | List/Create posts |
| GET/PUT/DELETE | `/api/posts/[id]` | Single post CRUD |
| GET | `/api/posts/search` | Search posts |
| POST | `/api/comments` | Create comment |
| DELETE | `/api/comments/[id]` | Delete comment |
| POST | `/api/users` | Register user |
| GET/PUT | `/api/users/[id]` | User profile |

## 🎨 Design System

- **Primary Color**: Indigo (#4F46E5)
- **Typography**: Inter font family
- **Border Radius**: 8px (rounded-lg)
- **Shadows**: Subtle shadows for depth

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Database Hosting

- [Railway](https://railway.app) - Easy PostgreSQL hosting
- [Supabase](https://supabase.com) - PostgreSQL with extras
- [Neon](https://neon.tech) - Serverless PostgreSQL

## 📚 What You'll Learn

Building this project teaches you:

- Next.js 14 App Router and Server Components
- Database schema design with relationships
- Authentication and authorization patterns
- Building rich text editors
- File upload handling
- API route development
- TypeScript best practices
- Tailwind CSS styling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js 14
