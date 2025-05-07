# Hello Doc Project Documentation

## Project Overview
Hello Doc is a health consultation web application designed to provide users with AI-powered symptom analysis, doctor matching, and virtual health services. The app is built using modern web technologies to deliver a seamless and responsive user experience.

## Technologies Used
- **React** with **TypeScript** for building the user interface.
- **Vite** as the build tool and development server.
- **Tailwind CSS** for utility-first styling.
- **shadcn-ui** for reusable UI components.
- **React Router** for client-side routing.
- **React Query** for data fetching and caching.
- **Supabase** for backend services including authentication, database, and serverless functions.
- **Framer Motion** for animations.

## Key Features
- **Splash Screen:** Welcomes users and redirects to the symptom checker.
- **Symptom Checker:** Users input symptoms which are analyzed by an AI-powered backend function. The app provides recommendations and matches users with relevant doctors.
- **Home/Dashboard:** Displays symptom analysis results, recommended actions, and a curated list of doctors based on user symptoms.
- **Messaging:** Enables users to chat with doctors and healthcare professionals.
- **Appointments:** Manage and view upcoming and past appointments.
- **Profile Management:** Users can view and update personal and medical information.
- **Settings:** Customize app appearance, notifications, privacy, and account settings.
- **Video Consultation:** Supports virtual consultations with healthcare providers.
- **Health Records:** View and manage medical history and lab results.
- **Medications:** Track prescribed medications and dosages.

## Project Structure
- `src/main.tsx`: Application entry point, renders the main App component.
- `src/App.tsx`: Sets up providers (theme, query client, routing) and defines application routes.
- `src/pages/`: Contains page components corresponding to routes.
- `src/components/`: Reusable UI components organized by feature or UI type.
- `src/hooks/`: Custom React hooks used across the app.
- `src/utils/`: Utility functions and helpers.
- `supabase/functions/`: Serverless functions for backend logic, including symptom analysis.
- `public/`: Static assets like images and icons.
- Configuration files for Vite, Tailwind CSS, TypeScript, ESLint, and others.

## Running the Project Locally
1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. Open the app in your browser at the provided local URL.

## Deployment
The project can be deployed via the Lovable platform or other hosting services like Netlify. Refer to the README for deployment instructions.

## Additional Notes
- The app supports dark and light themes with user preferences saved.
- Notifications and toasts provide user feedback.
- The backend uses Supabase for authentication, database, and serverless functions.
- The symptom analysis function is a key AI-powered feature.

---

This documentation provides a comprehensive overview of the Hello Doc project to assist developers and contributors in understanding the app's architecture, features, and setup.
