# Hello Doc - Healthcare Platform Documentation

## Project Overview
Hello Doc is a comprehensive healthcare platform that connects patients with healthcare providers through AI-powered symptom analysis, appointment scheduling, messaging, and video consultations. Built with modern web technologies and a robust backend infrastructure.

## 🚀 Live Demo
**URL**: https://lovable.dev/projects/a00b6544-1bc1-46dc-8c56-d76a951ad945

## 🛠️ Technology Stack

### Frontend
- **React 18** with **TypeScript** for type-safe development
- **Vite** for fast build tooling and hot reload
- **Tailwind CSS** with custom design system for consistent styling
- **shadcn/ui** components for modern, accessible UI elements
- **React Router v6** for client-side routing
- **React Query (TanStack Query)** for server state management
- **Framer Motion** for smooth animations
- **React Hook Form** with Zod validation

### Backend & Infrastructure
- **Supabase** as the backend-as-a-service platform
  - PostgreSQL database with Row Level Security (RLS)
  - Real-time subscriptions
  - Edge Functions for serverless computing
  - Built-in authentication with social providers
  - File storage capabilities

### Authentication Providers
- Email/Password authentication
- Google OAuth
- GitHub OAuth  
- Discord OAuth

## 🏗️ Architecture Overview

### Database Schema
The application uses a normalized PostgreSQL database with the following key tables:

**Core Tables:**
- `profiles` - Extended user information
- `doctors` - Healthcare provider profiles
- `appointments` - Appointment scheduling and management
- `messages` & `conversations` - Real-time messaging system
- `health_records` - Medical history and records
- `medications` - Prescription and medication tracking
- `lab_results` - Laboratory test results
- `vitals` - Patient vital signs
- `notifications` - In-app notification system

**Reference Tables:**
- `specializations` - Medical specialties
- `medical_conditions` - Medical conditions catalog
- `appointment_statuses` - Appointment status types

### Security Implementation
- **Row Level Security (RLS)** on all tables
- **JWT-based authentication** with automatic token refresh
- **Role-based access control** (patients, doctors, admins)
- **Secure API endpoints** with proper authorization

## 🎯 Core Features

### 1. AI-Powered Symptom Analysis
- Natural language symptom input
- OpenAI integration for intelligent analysis
- Personalized doctor recommendations
- Risk assessment and urgency levels

### 2. Advanced Appointment System
- **Visual Calendar Interface** - Monthly/weekly views with availability
- **Smart Time Slot Management** - Real-time availability checking
- **Doctor Schedule Integration** - Working hours and unavailability periods
- **Appointment Status Tracking** - Pending, approved, completed, cancelled
- **Automated Notifications** - Email and in-app reminders

### 3. Real-Time Messaging Platform
- **Patient-Doctor Communication** - Secure, HIPAA-compliant messaging
- **Conversation Management** - Threaded conversations with history
- **Attachment Support** - File sharing capabilities
- **Read Receipts** - Message delivery confirmation
- **Real-time Updates** - Instant message delivery

### 4. Video Consultation System
- **WebRTC Integration** - Browser-based video calling
- **Screen Sharing** - For document review
- **Recording Capabilities** - Session recording with consent
- **Consultation Notes** - Integrated note-taking during calls

### 5. Comprehensive Health Records
- **Medical History Tracking** - Chronic conditions, past procedures
- **Lab Results Management** - Test results with reference ranges
- **Vital Signs Monitoring** - Blood pressure, weight, temperature tracking
- **Medication Management** - Current prescriptions and dosage tracking

### 6. Advanced Search & Discovery
- **Global Search** - Find doctors, appointments, records across the platform
- **Filter & Sort Options** - By specialty, rating, availability, location
- **Recommendation Engine** - AI-driven doctor matching

### 7. Responsive Design System
- **Mobile-First Approach** - Optimized for all device sizes
- **Dark/Light Themes** - User preference-based theming
- **Accessibility Features** - WCAG 2.1 compliant interface
- **Progressive Web App** - Offline capabilities and app-like experience

## 📁 Project Structure Deep Dive

### Frontend Architecture
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── layout/          # Layout components (headers, sidebars)
│   ├── appointments/    # Appointment-related components
│   ├── messages/        # Messaging system components  
│   ├── profile/         # User profile components
│   ├── symptom-checker/ # AI symptom analysis components
│   └── video-consultation/ # Video calling components
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx     # Authentication state management
│   ├── useAppointments.ts # Appointment data fetching
│   ├── useMessages.ts  # Real-time messaging hooks
│   └── useDoctors.ts   # Doctor data management
├── pages/              # Route-level components
│   ├── Index.tsx       # Landing page
│   ├── Auth.tsx        # Login/signup with social auth
│   ├── Dashboard.tsx   # Patient dashboard
│   ├── Appointments.tsx # Appointment management
│   ├── Messages.tsx    # Messaging interface
│   └── Profile.tsx     # User profile management
├── types/              # TypeScript type definitions
├── utils/              # Helper functions and utilities
└── integrations/       # Third-party integrations
    └── supabase/       # Supabase client and types
```

### Backend Functions
```
supabase/functions/
├── analyze-symptoms/   # AI symptom analysis using OpenAI
├── book-appointment/   # Appointment booking logic
├── get-messages/       # Message retrieval with pagination
├── send-message/       # Real-time message sending
└── video-consultation/ # Video call session management
```

## 🔧 Development Setup

### Prerequisites
- **Node.js** 18+ and npm
- **Supabase Account** for backend services
- **OpenAI API Key** for symptom analysis

### Environment Configuration
Create a `.env.local` file with:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://pjlfdlejeimqxluebweb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Required for Edge Functions
OPENAI_API_KEY=sk-...
```

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd hello-doc

# Install dependencies
npm install

# Start development server
npm run dev

# Access the app at http://localhost:8080
```

## 🔐 Authentication Flow

### Multi-Provider Authentication
The app supports multiple authentication methods:

1. **Email/Password** - Traditional signup with email verification
2. **Social OAuth** - Google, GitHub, Discord integration
3. **Magic Links** - Passwordless authentication option

### Session Management
- JWT tokens with automatic refresh
- Persistent sessions across browser restarts  
- Role-based access control (patient/doctor/admin)
- Secure logout with token invalidation

## 🗄️ Database Design Principles

### Row Level Security (RLS)
Every table implements RLS policies ensuring:
- Users only access their own data
- Doctors only see assigned patients
- Proper authorization for all operations

### Data Relationships
- **One-to-Many**: User → Appointments, Messages, Health Records
- **Many-to-Many**: Doctors ↔ Specializations, Users ↔ Medical Conditions
- **Hierarchical**: Conversations → Messages, Appointments → Notes

### Performance Optimizations
- Indexed foreign keys for fast joins
- Pagination for large datasets
- Real-time subscriptions for live updates
- Optimized queries with proper filtering

## 🚀 API & Edge Functions

### Core Edge Functions

**`analyze-symptoms`**
- Processes natural language symptom descriptions
- Integrates with OpenAI GPT for intelligent analysis
- Returns doctor recommendations and urgency levels
- Includes safety checks for emergency conditions

**`book-appointment`**
- Validates doctor availability
- Checks for scheduling conflicts
- Sends confirmation notifications
- Updates calendar integrations

**`send-message`**
- Real-time message delivery
- File attachment handling
- Read receipt management
- Notification triggers

### API Security
- JWT validation on protected endpoints
- Rate limiting to prevent abuse
- Input sanitization and validation
- CORS configuration for web access

## 🎨 Design System

### Theme Architecture
The app uses a semantic token system defined in:
- `src/index.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind configuration
- Component variants for consistent styling

### Responsive Design
- Mobile-first approach with breakpoints
- Adaptive layouts for tablet and desktop
- Touch-friendly interface elements
- Accessibility-focused design patterns

## 📱 Real-Time Features

### WebSocket Integration
- Live message updates using Supabase Realtime
- Appointment status changes
- Notification delivery
- Online presence indicators

### Offline Capabilities
- Service worker for offline access
- Local data caching with React Query
- Optimistic updates for better UX
- Background sync when connection returns

## 🧪 Testing Strategy

### Component Testing
- React Testing Library for component tests
- Jest for unit testing utilities and hooks
- Cypress for end-to-end user flows
- Accessibility testing with axe-core

### Database Testing
- Supabase local development environment
- RLS policy validation
- Edge function testing with Deno
- Performance testing for complex queries

## 📊 Monitoring & Analytics

### Error Tracking
- Comprehensive error boundaries
- Client-side error logging
- Edge function error monitoring
- Performance metrics collection

### User Analytics
- Page view tracking
- Feature usage metrics
- Appointment conversion rates
- User engagement patterns

## 🚢 Deployment & DevOps

### Continuous Integration
- Automated testing on pull requests
- Code quality checks with ESLint/Prettier
- TypeScript compilation validation
- Security vulnerability scanning

### Production Deployment
- **Lovable Platform** - One-click deployment with custom domains
- **Netlify/Vercel** - Alternative hosting options
- **Supabase Edge Functions** - Automatic serverless deployment
- **CDN Integration** - Global asset delivery

### Monitoring
- Uptime monitoring with alerts
- Performance monitoring with Core Web Vitals
- Database performance tracking
- Edge function execution metrics

## 🤝 Contributing Guidelines

### Development Workflow
1. Fork the repository
2. Create feature branch (`feature/amazing-feature`)
3. Follow existing code patterns and conventions
4. Add tests for new functionality
5. Submit pull request with detailed description

### Code Standards
- **TypeScript** for all new code
- **ESLint + Prettier** for consistent formatting
- **Semantic commit messages** following conventional commits
- **Component documentation** with JSDoc comments

### Pull Request Process
- Ensure all tests pass
- Update documentation for new features
- Add screenshots for UI changes
- Request review from maintainers

## 📞 Support & Resources

### Developer Resources
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Guide](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

### Getting Help
- Check existing GitHub issues
- Create detailed bug reports with reproduction steps
- Join the project Discord for real-time help
- Review the FAQ section for common questions

---

## 📄 License & Legal

This project is licensed under the MIT License. See the LICENSE file for details.

**Healthcare Compliance**: This application is designed with healthcare privacy in mind but requires additional HIPAA compliance measures for production use in regulated environments.

---

*Last Updated: January 2025*
*Version: 2.0.0*

This comprehensive documentation provides developers with everything needed to understand, contribute to, and extend the Hello Doc healthcare platform.
