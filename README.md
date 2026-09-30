# Niramaya Mobile App

Niramaya is a wellness-focused mobile application built with React Native and Expo. The application provides users with personalized wellness features based on their profile, health information, goals, lifestyle, and preferences.

The mobile application communicates with the Niramaya backend API for authentication, user data, wellness content, goals, progress tracking, consultations, notifications, and profile management.

---

## Features

### Authentication

- User registration
- User login
- Persistent authentication
- Logout
- Access token management
- Refresh token handling
- Protected application routes
- Authentication state management

### Onboarding

The onboarding flow collects information required to personalize the user's Niramaya experience.

It includes:

- About You
- Physical Health
- Lifestyle
- Nutrition
- Sleep
- Fitness & Yoga
- Wellbeing
- Preferences

The collected information is used throughout the application to provide relevant wellness information and recommendations.

### Dashboard

The Home/Dashboard screen provides an overview of the user's wellness information.

It includes:

- Personalized health information
- Goals overview
- Progress access
- Health profile access
- Consultation access
- Wellness recommendations

### Goals

Users can manage their personal wellness goals.

Features include:

- View goals
- Create goals
- View goal details
- Track goal progress
- Update goal information

### Explore Wellness

The Explore section provides access to different wellness resources.

It includes:

- Recommendations
- Ayurveda
- Yoga
- Search
- Favorites

### Ayurveda

Users can explore Ayurvedic wellness content and recommendations.

Features include:

- Ayurvedic recommendations
- Ayurvedic content
- Search and discovery
- Detailed Ayurvedic information
- Personalized recommendations based on available user information

### Yoga

Users can explore yoga practices and recommendations.

Features include:

- Yoga recommendations
- Yoga categories
- Yoga search
- Yoga practice details
- Personalized yoga recommendations

### Favorites

Users can save wellness content for later access.

Supported content includes:

- Ayurveda
- Yoga
- Other supported wellness recommendations

### Progress Tracking

Users can track their wellness progress over time.

Features include:

- Progress history
- Add progress
- Progress summary
- Progress details

### Health Profile

Users can view and update their health information.

Features include:

- View health profile
- Edit health profile
- Update health information

### Consultation

The application provides access to Ayurvedic consultation functionality.

Features include:

- Consultation information
- Book/request consultation
- Consultation history
- Consultation details

### Notifications

Users can manage application notifications.

Features include:

- Notification list
- View notification details
- Mark notification as read
- Mark all notifications as read
- Unread notification count
- Delete notifications

### Profile & Settings

Users can manage their account and application preferences.

Features include:

- View profile
- Edit profile
- Account information
- Change password
- Notification settings
- Reminder settings
- Appearance preferences
- Privacy preferences
- Language and timezone preferences
- Account deactivation
- Logout

---

## Technology Stack

### Mobile Application

- React Native
- Expo
- Expo Router
- TypeScript
- NativeWind
- Tailwind CSS

### State & Application Management

- React Context API
- Custom React hooks

### Networking

- Axios
- REST API

### Authentication Storage

- Expo Secure Store

### Backend

The mobile application communicates with the Niramaya backend built using:

- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Project Structure

```text
mobile/
│
├── assets/
│   ├── expo.icon/
│   └── images/
│
├── scripts/
│   └── reset-project.js
│
├── src/
│   │
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── ayurveda/
│   │   │   │   └── [id].tsx
│   │   │   ├── consultation/
│   │   │   │   └── [id].tsx
│   │   │   ├── goals/
│   │   │   │   └── [id].tsx
│   │   │   ├── progress/
│   │   │   │   └── [id].tsx
│   │   │   ├── yoga/
│   │   │   │   └── [id].tsx
│   │   │   │
│   │   │   ├── _layout.tsx
│   │   │   ├── ayurveda.tsx
│   │   │   ├── change-password.tsx
│   │   │   ├── consultation-book.tsx
│   │   │   ├── consultation-history.tsx
│   │   │   ├── consultation.tsx
│   │   │   ├── explore.tsx
│   │   │   ├── favorites.tsx
│   │   │   ├── goal-create.tsx
│   │   │   ├── goals.tsx
│   │   │   ├── health-profile-edit.tsx
│   │   │   ├── health-profile.tsx
│   │   │   ├── home.tsx
│   │   │   ├── notifications.tsx
│   │   │   ├── profile-edit.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── progress-create.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── search.tsx
│   │   │   ├── settings.tsx
│   │   │   └── yoga.tsx
│   │   │
│   │   ├── (onboarding)/
│   │   │   ├── _layout.tsx
│   │   │   ├── about-you.tsx
│   │   │   ├── fitness-yoga.tsx
│   │   │   ├── lifestyle.tsx
│   │   │   ├── nutrition.tsx
│   │   │   ├── physical-health.tsx
│   │   │   ├── preferences.tsx
│   │   │   ├── sleep.tsx
│   │   │   └── wellbeing.tsx
│   │   │
│   │   ├── (public)/
│   │   │   ├── _layout.tsx
│   │   │   ├── landing.tsx
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   │
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   │
│   ├── components/
│   │   ├── cards/
│   │   ├── common/
│   │   ├── explore/
│   │   ├── forms/
│   │   ├── home/
│   │   ├── onboarding/
│   │   └── ui/
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── goals.ts
│   │   └── theme.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── OnboardingContext.tsx
│   │
│   ├── hooks/
│   │   ├── use-color-scheme.ts
│   │   ├── use-color-scheme.web.ts
│   │   └── use-theme.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── consultation.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── explore.service.ts
│   │   ├── goal.service.ts
│   │   ├── healthProfile.service.ts
│   │   ├── notification.service.ts
│   │   ├── profile.service.ts
│   │   └── progress.service.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── consultation.ts
│   │   ├── dashboard.ts
│   │   ├── explore.ts
│   │   ├── goal.ts
│   │   ├── healthProfile.ts
│   │   ├── notification.ts
│   │   ├── profile.ts
│   │   └── progress.ts
│   │
│   ├── utils/
│   │   └── tokenStorage.ts
│   │
│   └── global.css
│
├── .gitignore
├── AGENTS.md
├── app.json
├── babel.config.js
├── metro.config.js
├── nativewind-env.d.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Application Architecture

The mobile application follows a feature-oriented architecture using Expo Router for navigation and separate service, type, context, and component layers.

```text
                    NIRAMAYA MOBILE APP
                            │
                            ▼
                    Expo Router
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
          Public        Onboarding        Main
           Routes          Routes         Routes
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                     React Context
                     ┌──────┴──────┐
                     │             │
                     ▼             ▼
                AuthContext   OnboardingContext
                     │
                     ▼
                  Services
                     │
                     ▼
                  Axios API
                     │
                     ▼
              Niramaya Backend
                     │
                     ▼
                  MongoDB
```

---

## Route Groups

Expo Router organizes the application into three primary route groups.

### Public Routes

```text
src/app/(public)/
```

Contains screens accessible before authentication:

- Landing
- Login
- Signup

### Onboarding Routes

```text
src/app/(onboarding)/
```

Contains the user onboarding process:

- About You
- Physical Health
- Lifestyle
- Nutrition
- Sleep
- Fitness & Yoga
- Wellbeing
- Preferences

### Main Routes

```text
src/app/(main)/
```

Contains authenticated application functionality:

- Home
- Goals
- Explore
- Ayurveda
- Yoga
- Favorites
- Search
- Progress
- Health Profile
- Consultation
- Notifications
- Profile
- Settings

---

## Authentication

Authentication is managed through `AuthContext`.

The authentication flow is:

```text
Signup / Login
      │
      ▼
Backend Authentication API
      │
      ▼
Access + Refresh Tokens
      │
      ▼
Secure Storage
      │
      ▼
AuthContext
      │
      ▼
Authenticated Application
```

The application uses Expo Secure Store for token persistence.

Authentication-related files:

```text
src/context/AuthContext.tsx
src/services/auth.service.ts
src/utils/tokenStorage.ts
```

---

## API Communication

API communication is centralized through:

```text
src/services/api.ts
```

Feature-specific API requests are separated into service modules:

```text
auth.service.ts
dashboard.service.ts
explore.service.ts
goal.service.ts
healthProfile.service.ts
consultation.service.ts
notification.service.ts
progress.service.ts
profile.service.ts
```

This keeps API communication separate from UI components.

---

## TypeScript Types

Application data structures are maintained inside:

```text
src/types/
```

Types are organized by feature:

```text
auth.ts
consultation.ts
dashboard.ts
explore.ts
goal.ts
healthProfile.ts
notification.ts
profile.ts
progress.ts
```

This provides type safety between screens, services, contexts, and API responses.

---

## UI & Styling

The application uses:

- NativeWind
- Tailwind CSS
- Reusable UI components
- Centralized color constants
- Shared theme configuration

Important styling files:

```text
src/constants/colors.ts
src/constants/theme.ts
src/global.css
tailwind.config.js
```

Reusable UI components are located under:

```text
src/components/
```

---

## Installation

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Expo CLI / Expo tooling
- Android Studio or a physical Android device for Android development
- Xcode for iOS development on macOS

---

## Setup

Navigate to the mobile application:

```bash
cd mobile
```

Install dependencies:

```bash
npm install
```

---

## Environment Configuration

Configure the API base URL used by the mobile application.

The API configuration is maintained in:

```text
src/services/api.ts
```

Make sure the mobile application points to the running Niramaya backend server.

For Android emulator development, remember that `localhost` refers to the emulator itself rather than the development machine. Use the appropriate host address for your development environment.

---

## Running the Application

Start the Expo development server:

```bash
npx expo start
```

You can then run the application using:

```bash
npx expo start
```

or use the available Expo development options to open the application on:

- Android emulator
- Physical Android device
- iOS simulator
- Physical iOS device
- Web browser

---

## Useful Commands

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Start with cache cleared:

```bash
npx expo start -c
```

Run Android:

```bash
npx expo start --android
```

Run iOS:

```bash
npx expo start --ios
```

Run web:

```bash
npx expo start --web
```

Check Expo project configuration:

```bash
npx expo config
```

---

## Backend Requirement

The mobile application requires the Niramaya backend API to be running for features that depend on server data.

Backend location:

```text
../backend
```

Backend stack:

```text
Node.js
Express.js
MongoDB
Mongoose
```

Start the backend from the backend directory:

```bash
cd ../backend
npm run dev
```

Then start the mobile application:

```bash
cd ../mobile
npx expo start
```

---

## Main User Flow

The intended application flow is:

```text
Landing
   │
   ▼
Signup / Login
   │
   ▼
Authentication
   │
   ▼
Onboarding
   │
   ├── About You
   ├── Physical Health
   ├── Lifestyle
   ├── Nutrition
   ├── Sleep
   ├── Fitness & Yoga
   ├── Wellbeing
   └── Preferences
   │
   ▼
Home / Dashboard
   │
   ├── Goals
   ├── Explore Wellness
   │     ├── Recommendations
   │     ├── Ayurveda
   │     ├── Yoga
   │     ├── Search
   │     └── Favorites
   │
   ├── Progress
   ├── Health Profile
   ├── Consultation
   ├── Notifications
   └── Profile & Settings
```

---

## Account Deactivation

The application currently uses **account deactivation** rather than permanent account deletion.

When a user deactivates their account:

- The account is marked inactive by the backend.
- Authentication tokens are invalidated.
- User settings are removed.
- The user document remains stored in the backend database.

A deactivated account should not be allowed to authenticate again unless the backend provides an account reactivation flow.

---

## Project Status

The major application modules are implemented:

```text
Auth                         ✅
Onboarding                   ✅
Dashboard                   ✅
Goals                        ✅
Explore Wellness             ✅
Progress                     ✅
Health Profile               ✅
Consultation                 ✅
Notifications                ✅
Profile & Settings           ✅
```

The remaining development phase is focused on:

- End-to-end testing
- Bug fixing
- Authentication flow verification
- API error handling
- Loading and empty states
- Navigation verification
- UI consistency
- Android/iOS testing
- Performance checks
- Production build preparation

---

## Development Guidelines

When adding new features:

1. Keep screens inside the appropriate Expo Router route group.
2. Keep API calls inside `src/services/`.
3. Keep TypeScript interfaces inside `src/types/`.
4. Reuse existing components where possible.
5. Keep authentication logic inside `AuthContext`.
6. Keep token handling inside `tokenStorage.ts`.
7. Avoid placing API/business logic directly inside UI components.
8. Follow the existing Niramaya visual style and color system.
9. Use NativeWind/Tailwind for styling where practical.
10. Keep the application accessible to a single user type: `user`.

---

## Folder Responsibilities

| Directory        | Responsibility                            |
| ---------------- | ----------------------------------------- |
| `src/app`        | Screens and Expo Router navigation        |
| `src/components` | Reusable UI components                    |
| `src/constants`  | Colors, themes, and application constants |
| `src/context`    | Global application state                  |
| `src/hooks`      | Reusable React hooks                      |
| `src/services`   | Backend API communication                 |
| `src/types`      | TypeScript data models                    |
| `src/utils`      | Utility functions                         |
| `assets`         | Images, icons, and other static assets    |

---

## Related Project

The backend for this mobile application is located in:

```text
../backend
```

The backend provides the REST API used by the Niramaya mobile application.

---

## License

This project is developed as part of an MCA Final Year Project.

See the project `LICENSE` file for licensing information.

### Recommended placement

Save this as:

```text
Full-Stack Niramaya App/
└── mobile/
    └── README.md   ← this file
```

This README matches the **current mobile folder structure you provided** and documents the implemented Modules 1–10 without adding a fictional feature such as an admin/consultant role.
