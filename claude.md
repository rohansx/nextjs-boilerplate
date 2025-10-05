# Next.js 15 Project - Best Practices Guide (2025)

## Architecture Overview

This project follows modern Next.js 15 conventions with strict separation of concerns and optimal performance patterns.

---

## 1. Next.js 15 Specific Rules

### Server Components First

- ✅ **Default to Server Components** - No `'use client'` directive needed
- ✅ **Fetch data on the server** when possible (direct backend access)
- ✅ **Use async/await** patterns in Server Components
- ❌ **ONLY use `'use client'`** when you need:
  - React hooks (useState, useEffect, etc.)
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - Third-party libraries that use hooks

### App Router Conventions

- File-based routing in `src/app/`
- `layout.tsx` - Shared layouts
- `page.tsx` - Route pages
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundaries
- `not-found.tsx` - 404 pages

---

## 2. State Management Architecture

### Zustand - Client UI State ONLY

**Use for:** Auth state, modals, sidebar, theme, UI toggles

```typescript
// ✅ CORRECT - Client UI state
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

// ❌ WRONG - Don't store server/API data
const useUsersStore = create((set) => ({
  users: [], // This should be in TanStack Query!
  fetchUsers: async () => {
    /* ... */
  },
}));
```

**Principles:**

- Keep stores small and focused (single responsibility)
- Use middleware: `persist` for localStorage, `devtools` for debugging
- Separate concerns into different stores (auth, ui, etc.)

### TanStack Query - Server/API Data ONLY

**Use for:** ALL server data, API calls, caching

```typescript
// ✅ CORRECT - Server data fetching
const { data: users } = useQuery({
  queryKey: ["users"],
  queryFn: () => api.get("/users"),
});

// ✅ CORRECT - Mutations
const loginMutation = useMutation({
  mutationFn: (credentials) => api.post("/auth/login", credentials),
  onSuccess: (data) => {
    authStore.setAuth(data.user, data.token);
  },
});
```

**Principles:**

- Automatic caching, refetching, and error handling
- Consistent query key patterns: `['resource', id?, filters?]`
- Use mutations for POST/PUT/DELETE operations
- Configure sensible defaults (staleTime, refetchOnWindowFocus)

---

## 3. TypeScript Best Practices

### Type Inference First

```typescript
// ✅ CORRECT - Let TypeScript infer
const users = await getUsers(); // Type inferred from return type

// ❌ AVOID - Explicit types when not needed
const users: User[] = await getUsers();
```

### Shared Types

- All shared types in `src/types/index.ts`
- Use Zod for runtime validation
- Leverage discriminated unions for complex states

```typescript
// Discriminated union example
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; error: string };
```

---

## 4. Performance Optimization

### Server Components Strategy

- ✅ **Most components should be Server Components**
- ✅ **Use `'use client'` sparingly** - only when absolutely necessary
- ✅ **Fetch data on server** to reduce client bundle size
- ✅ **Use `React.lazy()`** for heavy client components

### Code Splitting

```typescript
// Dynamic imports for heavy components
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Spinner />,
  ssr: false, // Client-only component
});
```

### Bundle Size

- Minimize client-side JavaScript
- Use server actions when possible
- Import only what you need: `import { useQuery } from '@tanstack/react-query'`

---

## 5. Code Organization

### Feature-Based Structure

```
src/
├── app/              # Next.js App Router
├── components/
│   ├── ui/          # Reusable UI components
│   ├── layouts/     # Layout components
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utilities, API client, helpers
├── store/           # Zustand stores
├── types/           # TypeScript types
└── env.ts           # Environment validation
```

### Colocation

- Keep related files together
- Component + styles + tests in same directory
- Clear separation: UI components, business logic, API calls

---

## 6. Environment Variables

### Setup (using @t3-oss/env-nextjs)

```typescript
// src/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    // Add server-only vars here
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
```

### Usage

```typescript
import { env } from "@/env";

// ✅ Type-safe and validated
const apiUrl = env.NEXT_PUBLIC_API_URL;

// ❌ NEVER use process.env directly
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Not type-safe!
```

---

## 7. API Client Setup

### Axios Instance

```typescript
// src/lib/api/client.ts
import axios from "axios";
import { env } from "@/env";

// Check if running in browser
const isBrowser = typeof window !== "undefined";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  if (isBrowser) {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor - Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && isBrowser) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

---

## 8. Component Patterns

### Server Component (Default)

```typescript
// No 'use client' directive
export default async function UsersPage() {
  const users = await getUsers(); // Direct server fetch

  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
```

### Client Component (When Needed)

```typescript
'use client'; // ONLY when needed!

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### UI Component Pattern

```typescript
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded font-medium transition-colors',
          {
            'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
            'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
            'border border-gray-300 hover:bg-gray-50': variant === 'outline',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

---

## 9. TanStack Query Patterns

### Query Keys Convention

```typescript
// Consistent pattern: ['resource', id?, filters?]
const queryKeys = {
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
  userPosts: (id: string) => ["users", id, "posts"] as const,
};
```

### Query Hook Pattern

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const { data } = await api.post("/users", userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

---

## 10. Code Style Guidelines

### General Rules

```typescript
// ✅ Arrow functions for components
const MyComponent = () => { /* ... */ };

// ✅ const for everything (let only when necessary)
const user = getUser();

// ✅ Destructure props
const Button = ({ children, onClick, ...props }) => { /* ... */ };

// ✅ Template literals for strings with variables
const message = `Hello, ${user.name}!`;

// ✅ Early returns for guards
if (!user) return null;
if (isLoading) return <Spinner />;

// ✅ Keep functions small and focused (max 20 lines)
```

### Comments

- Add comments ONLY for complex logic
- Prefer self-documenting code (good naming)
- Use JSDoc for public APIs

---

## 11. Validation Checklist

Before committing, ensure:

```bash
# No TypeScript errors
pnpm type-check

# No ESLint errors
pnpm lint

# Code is formatted
pnpm format

# App runs without errors
pnpm dev
```

### Checklist:

- [ ] All imports resolve correctly
- [ ] Server vs Client components correctly marked
- [ ] State management properly separated (Zustand for client, TanStack Query for server)
- [ ] No `process.env` used directly (use typed `env`)
- [ ] No `localStorage` used without browser check
- [ ] Proper error and loading states
- [ ] TypeScript strict mode passing
- [ ] Components are accessible (ARIA, semantic HTML)

---

## 12. DO's and DON'Ts

### ✅ DO:

- Use Server Components by default
- Use `'use client'` ONLY when absolutely necessary
- Fetch data on server in Server Components
- Use TanStack Query for ALL server/API data
- Keep Zustand stores small and focused on client state
- Use proper TypeScript types everywhere
- Follow Tailwind utility-first approach
- Use `cn()` utility for className merging
- Add proper error handling everywhere
- Make components accessible
- Use React 19 features appropriately

### ❌ DON'T:

- Don't add `'use client'` to every component
- Don't store server/API data in Zustand
- Don't use `localStorage` without checking `window !== undefined`
- Don't create massive stores that violate single responsibility
- Don't use `process.env` directly (use typed env)
- Don't create deep nesting (max 3-4 levels)
- Don't ignore TypeScript errors
- Don't use inline styles (use Tailwind)
- Don't forget loading and error states
- Don't mix server state in Zustand

---

## 13. Common Patterns

### Loading State

```typescript
// loading.tsx (Server Component)
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
}
```

### Error Boundary

```typescript
// error.tsx (Client Component)
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
```

### Browser API Usage

```typescript
"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Check if running in browser
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

---

## 14. File Structure Reference

```
myclone-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Homepage (Server Component)
│   │   ├── loading.tsx         # Global loading state
│   │   ├── error.tsx           # Global error boundary
│   │   ├── providers.tsx       # Client providers (TanStack Query)
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── signup/
│   │       └── page.tsx        # Signup page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx      # Reusable button
│   │   │   └── Input.tsx       # Reusable input
│   │   └── layouts/
│   │       ├── Header.tsx      # Header (Client Component)
│   │       └── Footer.tsx      # Footer (Server Component)
│   ├── hooks/
│   │   └── useAuth.ts          # Auth hooks with TanStack Query
│   ├── lib/
│   │   ├── utils.ts            # cn() utility
│   │   └── api/
│   │       └── client.ts       # Axios instance
│   ├── store/
│   │   ├── auth.store.ts       # Auth Zustand store
│   │   └── ui.store.ts         # UI Zustand store
│   ├── types/
│   │   └── index.ts            # Shared TypeScript types
│   └── env.ts                  # Environment validation
├── .env.local                  # Local environment variables
├── .env.example                # Environment template
├── next.config.ts              # Next.js config (imports env.ts)
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies and scripts
```

---

## 15. Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [T3 Env Docs](https://env.t3.gg/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Last Updated:** 2025-10-05
**Next.js Version:** 15.5.4
**React Version:** 19.1.0
