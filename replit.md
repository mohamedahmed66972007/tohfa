# مسابقات تحفة (Tohfa Competitions)

## Overview

This is an Arabic quiz competition application inspired by "من سيربح المليون" (Who Wants to Be a Millionaire). The application allows users to create contestants, design custom questions, and conduct interactive quiz competitions with a theatrical, high-stakes atmosphere featuring dramatic visual effects, timers, and lifelines.

The application is a full-stack TypeScript solution with a React frontend and Express backend, currently using in-memory storage with planned database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling and development server
- TanStack Query (React Query) for state management
- Tailwind CSS with custom design system
- shadcn/ui component library (Radix UI primitives)
- RTL (Right-to-Left) support for Arabic language

**Key Design Decisions:**
- **Component-Based Architecture**: Reusable components for contestants, questions, and quiz interface
- **Client-Side Routing**: Simple state-based navigation between home, add-contestant, and quiz screens (no React Router)
- **In-App State Management**: Uses React useState for app-level state, with contestants stored in memory during runtime
- **Arabic-First Design**: RTL layout with Cairo/Tajawal fonts from Google Fonts
- **Millionaire-Style UI**: Dark gradient backgrounds, radial spotlight effects, diamond-shaped answer buttons with glow effects

**Component Structure:**
- Pages: Home (contestant selection), Add/Edit Contestant, Quiz
- Forms: AddContestantForm, AddQuestionForm
- UI Components: ContestantCard, QuizQuestion, QuizResult, Header
- Complete shadcn/ui library integration for base components

### Backend Architecture

**Technology Stack:**
- Express.js with TypeScript
- ESM (ES Modules) throughout
- Drizzle ORM configured for PostgreSQL
- Session management setup (connect-pg-simple)

**Current Implementation:**
- **In-Memory Storage**: MemStorage class implementing IStorage interface
- **Storage Interface**: Defines CRUD operations for contestants (get, getAll, create, delete)
- **Data Models**: Contestants contain name, questions array, randomization flags, and timer settings
- **Server Setup**: Express server with JSON parsing, logging middleware, and route registration structure

**Planned Database Integration:**
- Drizzle ORM configured for PostgreSQL via Neon serverless
- Schema defined in `shared/schema.ts` with Zod validation
- Migration setup ready via drizzle-kit

**API Design:**
- RESTful endpoints prefixed with `/api`
- Shared schema between client and server via `@shared` path alias
- Type-safe data validation using Zod schemas

### Data Models

**Contestant Schema:**
- `id`: Unique identifier
- `name`: Contestant name (Arabic text)
- `questions`: Array of Question objects
- `randomizeQuestions`: Boolean flag for question order randomization
- `randomizeOptions`: Boolean flag for answer option randomization
- `enableTimer`: Boolean for timer feature
- `timerMinutes`: Timer duration (1-60 minutes)

**Question Schema:**
- `id`: Unique identifier
- `text`: Question text (Arabic)
- `options`: Array of 4 answer options
- `correctAnswer`: Index (0-3) of correct option

### Design System

**Visual Theme:**
- Dark mode with deep blue/purple gradients
- Primary color: Blue (`hsl(210 100% 50%)`)
- Accent color: Purple (`hsl(265 100% 55%)`)
- Radial spotlight effects and glow animations
- Diamond/parallelogram-shaped answer buttons
- Color-coded feedback (green for correct, red for wrong)

**Typography:**
- Primary: Cairo font (Arabic)
- Secondary: Tajawal font (Arabic)
- Sizes: 2xl-4xl for headers, xl-2xl for questions, base-lg for UI elements

**Spacing & Layout:**
- Tailwind spacing utilities (2, 4, 6, 8, 12, 16)
- Responsive grid layouts (1/2/3 columns)
- Full viewport quiz screens with centered content
- Max-width containers (4xl) for admin panels

### Quiz Features

**Game Mechanics:**
- Sequential question progression
- Optional question/answer randomization per contestant
- Real-time answer validation with visual feedback
- Score tracking and percentage calculation
- Result screen with performance feedback

**Lifelines (Planned):**
- 50/50: Remove two incorrect answers
- Phone a Friend: 30-second timer overlay

**Timer System:**
- Optional per-contestant timer
- Configurable duration (1-60 minutes)
- Countdown display during quiz
- Auto-fail on timer expiration

## External Dependencies

**Database:**
- PostgreSQL via Neon serverless (`@neondatabase/serverless`)
- Drizzle ORM for type-safe database queries
- Migration system via drizzle-kit

**UI Components:**
- Radix UI primitives (dialogs, dropdowns, popover, etc.)
- Lucide React for icons
- Tailwind CSS for styling
- class-variance-authority for component variants
- embla-carousel-react for potential carousel features

**Development Tools:**
- Vite for fast development and optimized builds
- Replit-specific plugins (cartographer, dev-banner, runtime-error-modal)
- tsx for TypeScript execution
- esbuild for production builds

**Session & Authentication:**
- connect-pg-simple for PostgreSQL-backed sessions
- Express session middleware (configured but not actively used)

**Validation:**
- Zod for schema validation
- drizzle-zod for database schema validation
- @hookform/resolvers for form validation integration

**Build & Deployment:**
- Production build: Vite bundles client, esbuild bundles server
- Development: Concurrent Vite dev server with Express middleware
- Static file serving from dist/public in production