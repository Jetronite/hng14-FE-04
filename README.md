# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits with local persistence and offline support.

## Project Overview

Habit Tracker PWA is a full-featured habit tracking application built with Next.js, React, TypeScript, and Tailwind CSS. It allows users to:

- **Sign up** with email and password
- **Log in** and **log out** securely
- **Create, edit, and delete** habits
- **Mark habits complete** for today
- **View current streaks** for each habit
- **Install as a PWA** for offline use
- **Persist data** across browser sessions using localStorage

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Persistence**: localStorage
- **Testing**: Vitest (unit/integration), Playwright (E2E)
- **PWA**: Service Worker + Web App Manifest

---

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository** and navigate to the project directory:

```bash
cd habit-tracker
```

2. **Install dependencies**:

```bash
npm install
```

3. **Install Playwright browsers** (required for E2E tests):

```bash
npx playwright install
```

---

## Run Instructions

### Development Mode

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build and start the production server:

```bash
npm run build
npm start
```

---

## Test Instructions

### Run All Tests

```bash
npm test
```

This executes unit tests, integration tests, and E2E tests in sequence.

### Unit Tests (with Coverage)

```bash
npm run test:unit
```

Generates a coverage report in the `coverage/` directory. Minimum 80% line coverage is required for files in `src/lib`.

### Integration Tests

```bash
npm run test:integration
```

Runs component and integration tests using Vitest and React Testing Library.

### End-to-End Tests

```bash
npm run test:e2e
```

Runs Playwright E2E tests against the development server.

---

## Local Persistence Structure

The application uses `localStorage` for all data persistence. Three storage keys are used:

### 1. Users Storage (`habit-tracker-users`)

Stores an array of registered users:

```json
[
  {
    "id": "uuid-string",
    "email": "user@example.com",
    "password": "hashed-password",
    "createdAt": "2026-01-10T00:00:00.000Z"
  }
]
```

### 2. Session Storage (`habit-tracker-session`)

Stores the currently logged-in user session:

```json
{
  "userId": "uuid-string",
  "email": "user@example.com"
}
```

Or `null` when no user is logged in.

### 3. Habits Storage (`habit-tracker-habits`)

Stores all habits (scoped by userId):

```json
[
  {
    "id": "uuid-string",
    "userId": "uuid-string",
    "name": "Drink Water",
    "description": "Drink 8 glasses of water daily",
    "frequency": "daily",
    "createdAt": "2026-01-10T00:00:00.000Z",
    "completions": ["2026-01-10", "2026-01-09"]
  }
]
```

### Storage Abstraction Layer

All storage operations are handled by `src/lib/storage.ts`, which provides:

- `getUsers()` / `saveUsers()` - User management
- `getSession()` / `setSession()` / `clearSession()` - Session management
- `getHabits()` / `saveHabits()` - Habit management
- `safeParse<T>()` / `safeStringify()` - Safe JSON handling with fallbacks

This abstraction ensures:
- No crashes from malformed JSON
- Consistent default values
- Deterministic behavior for tests

---

## PWA Support Implementation

### Web App Manifest (`public/manifest.json`)

The manifest configures the app for installation:

```json
{
  "name": "Habit Tracker",
  "short_name": "Habits",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- `display: standalone` enables "app mode" (removes browser chrome)
- `start_url: /` ensures correct boot route on install

### Service Worker (`public/sw.js`)

The service worker implements a cache-first strategy:

1. **Install Event**: Caches the app shell (all routes and assets)
2. **Activate Event**: Cleans up old caches
3. **Fetch Event**: Serves cached content first, falls back to network

This ensures:
- The app loads offline after the first visit
- No hard crashes when network is unavailable
- Fast load times from cache

### Service Worker Registration (`src/components/PwaRegister.tsx`)

The service worker is registered client-side in `layout.tsx` via the `PwaRegister` component, which runs on mount.

---

## Trade-offs and Limitations

### 1. Local-Only Authentication

- **Limitation**: No remote authentication or password recovery
- **Trade-off**: Simple to implement but limited security (passwords stored in plain text in localStorage)
- **Mitigation**: Suitable for demo/MVP purposes only

### 2. No Data Export/Import

- **Limitation**: Users cannot backup or transfer their data
- **Trade-off**: Simplicity in implementation
- **Future**: Could add JSON export/import feature

### 3. Single Device Usage

- **Limitation**: Data is stored in browser localStorage, not synced across devices
- **Trade-off**: No server infrastructure required
- **Future**: Could integrate cloud sync with a backend

### 4. Browser Storage Limits

- **Limitation**: localStorage has ~5-10MB limits depending on browser
- **Trade-off**: Sufficient for typical habit tracking but may limit power users
- **Mitigation**: IndexedDB could be used for larger datasets

### 5. No Real-Time Sync

- **Limitation**: Changes only reflect on the current device/browser
- **Trade-off**: Simplicity and offline-first approach
- **Future**: WebSocket or polling could enable multi-device sync

### 6. Service Worker Cache Limitations

- **Limitation**: Cache may become stale; dynamic content requires network
- **Trade-off**: App shell works offline, but fresh data requires connectivity
- **Mitigation**: Background sync could update cache when online

---

## Test File Mapping

This section maps each required test file to the behavior it verifies.

### Unit Tests

| Test File | What It Verifies |
|-----------|------------------|
| `tests/unit/slug.test.ts` | `getHabitSlug()` - Converts habit names to URL-friendly slugs (lowercase, hyphenated, trimmed) |
| `tests/unit/validators.test.ts` | `validateHabitName()` - Validates habit names (required, max 60 chars, trimmed) |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak()` - Calculates consecutive day streaks from completion dates |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion()` - Toggles habit completion for a specific date (immutable, no duplicates) |

### Integration Tests

| Test File | What It Verifies |
|-----------|------------------|
| `tests/integration/auth-flow.test.tsx` | Signup form submission, duplicate email rejection, login form, invalid credentials error |
| `tests/integration/habit-form.test.tsx` | Habit form validation, creation, editing (immutable fields), deletion confirmation, completion toggle with streak update |

### End-to-End Tests

| Test File | What It Verifies |
|-----------|------------------|
| `tests/e2e/app.spec.ts` | Full user flows: splash screen, auth redirects, signup/login, habit CRUD, streak updates, persistence after reload, logout, offline loading |

---

## Project Structure

```
habit-tracker/
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── app/
│   │   ├── dashboard/page.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LogoutButton.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── habits/
│   │   │   ├── HabitCard.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   └── HabitList.tsx
│   │   └── shared/
│   │       ├── ProtectedRoute.tsx
│   │       └── SplashScreen.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── constants.ts
│   │   ├── habits.ts
│   │   ├── slug.ts
│   │   ├── storage.ts
│   │   ├── streaks.ts
│   │   └── validators.ts
│   └── types/
│       ├── auth.ts
│       └── habit.ts
├── tests/
│   ├── e2e/app.spec.ts
│   ├── integration/
│   │   ├── auth-flow.test.tsx
│   │   └── habit-form.test.tsx
│   └── unit/
│       ├── habits.test.ts
│       ├── slug.test.ts
│       ├── streaks.test.ts
│       └── validators.test.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── playwright.config.ts
```

---

## License

MIT