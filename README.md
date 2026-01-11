# NexusFS Universal File System - Frontend

Modern React frontend for NexusFS, a universal file system API that provides unified access to multiple storage providers (Local, S3, FTP, WebDAV, Google Drive).

## Features

- **File Explorer**: Browse, upload, download, and manage files across multiple providers
- **Shared Files**: Internal and public file sharing with granular permissions
- **Provider Management**: Configure and manage storage providers
- **Admin Panel**: System monitoring, user management, audit logs
- **Settings**: Profile, security, notifications, API keys, and more

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **TailwindCSS 4** for styling
- **Radix UI** components (shadcn/ui)
- **Axios** for API calls
- **React Router** for navigation
- **Vitest** + **Testing Library** for tests

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- NexusFS backend API running (see backend repository)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your backend URL
echo "VITE_BACKEND_LINK=http://localhost:5000" > .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Backend API URL (required)
VITE_BACKEND_LINK=http://localhost:5000

# Optional: Enable debug mode
# VITE_DEBUG=true

# Optional: API timeout in milliseconds
# VITE_API_TIMEOUT=30000
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── auth/        # Authentication components
│   ├── dashboard/   # Dashboard widgets
│   ├── settings/    # Settings components
│   └── layout/      # Layout components (Header, Sidebar)
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Settings.tsx
│   └── FileExplorer.tsx (coming soon)
├── services/        # API service layer
│   ├── fileOperations.ts  # File CRUD operations
│   ├── streaming.ts       # Upload/download streams
│   ├── credentials.ts     # Credential management
│   ├── users.ts           # User management
│   ├── sharing.ts         # File sharing
│   └── admin.ts           # Admin operations
├── hooks/           # Custom React hooks
├── context/         # React context providers
├── types/           # TypeScript type definitions
├── lib/             # Utilities and helpers
└── features/        # Feature-specific components

```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Build
npm run build        # Type-check and build for production
npm run preview      # Preview production build

# Testing
npm test             # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## API Integration

The frontend integrates with the NexusFS backend API. All API services are located in `src/services/`:

### File Operations
- Read, write, delete files
- List directories
- Copy, move, rename files
- Create directories
- Stream upload/download for large files

### Provider Management
- Connect/disconnect providers
- Configure provider credentials
- Test connections
- View provider health

### User Management (Admin)
- CRUD operations for users
- Role management
- Session management

### Credential Rotation
- Rotate provider credentials
- Test new credentials
- View rotation history

### File Sharing (In Progress)
- Create public share links
- Share files with specific users
- Manage permissions
- Track access

## Development

### Adding New Features

1. **Types**: Add TypeScript types in `src/types/index.ts`
2. **API Service**: Create or update service in `src/services/`
3. **Hook**: Create custom hook in `src/hooks/`
4. **Component**: Build UI component in `src/components/`
5. **Page**: Create page in `src/pages/`
6. **Route**: Add route in `src/App.tsx`
7. **Tests**: Write tests alongside components

### Code Style

- Use TypeScript for type safety
- Follow React functional component patterns
- Use custom hooks for business logic
- Keep components small and focused
- Write tests for critical functionality

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
