# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Production build with Turbopack
pnpm start        # Start production server
```

### Code Quality

```bash
pnpm type-check   # Run TypeScript compiler check (no emit)
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix ESLint errors
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting without changes
```

### UI Components (shadcn/ui)

```bash
pnpm dlx shadcn@latest add <component-name>  # Add new shadcn component
# Example: pnpm dlx shadcn@latest add toast
```

**IMPORTANT:** Never manually create shadcn/ui components. Always use the CLI to add them. Components are configured with:

- Style: new-york
- Base color: neutral
- CSS variables enabled
- Icon library: lucide-react

## Architecture Overview

### State Management Strategy (CRITICAL)

This project uses a **strict separation** between client UI state and server data:

1. **Zustand** - Client UI state ONLY
   - Auth state (user, token, isAuthenticated) in `src/store/auth.store.ts`
   - UI state (modals, sidebar) in `src/store/ui.store.ts`
   - **Never use Zustand for server/API data**

2. **TanStack Query v5** - Server/API data ONLY
   - All server data fetching and caching
   - Mutations for POST/PUT/DELETE operations
   - Configured in `src/app/providers.tsx`
   - See `src/hooks/useAuth.ts` for example patterns

### Server vs Client Components

- **Default: Server Components** - No `'use client'` directive needed
- **Only use `'use client'` when you need:**
  - React hooks (useState, useEffect, etc.)
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - Zustand stores or TanStack Query hooks

### Environment Variables

- **Type-safe and validated** using `@t3-oss/env-nextjs` in `src/env.ts`
- **Never use `process.env` directly** - always import from `@/env`
- `next.config.ts` imports `src/env.ts` to validate at build time
- Client variables must start with `NEXT_PUBLIC_`
- Local environment: `.env.local` (git-ignored)
- Template: `.env.example` (committed)

**Adding new variables:**

1. Add schema to `src/env.ts` (server or client)
2. Add to `runtimeEnv` mapping
3. Add to `.env.local` with actual value
4. Add to `.env.example` without value

### API Client Architecture

Located in `src/lib/api/client.ts`:

- Axios instance with base URL from typed env
- **Request interceptor:** Auto-adds JWT token from localStorage
- **Response interceptor:** Auto-handles 401 (clears auth, redirects to /login)
- **Browser check:** Always checks `typeof window !== "undefined"` before localStorage access

**Usage pattern:**

```typescript
import { api } from "@/lib/api/client";

// In a TanStack Query hook
const { data } = await api.get("/endpoint");
```

### Authentication Flow

1. User logs in via `useLogin()` mutation (TanStack Query)
2. On success: Token stored in:
   - localStorage (key: `auth_token`) for API client
   - Zustand store (via `persist` middleware) for UI state
3. All subsequent API calls include token via interceptor
4. On 401: Auto-logout and redirect to /login

### File Structure Conventions

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout (wraps with Providers)
│   ├── page.tsx           # Homepage (Server Component)
│   ├── error.tsx          # Error boundary (Client Component)
│   ├── loading.tsx        # Loading UI (Server Component)
│   └── providers.tsx      # Client providers (TanStack Query setup)
├── components/
│   ├── ui/                # shadcn/ui components (CLI-generated)
│   └── layouts/           # Layout components (Header, Footer)
├── hooks/                 # Custom React hooks (TanStack Query patterns)
├── lib/
│   ├── utils.ts          # cn() utility for className merging
│   └── api/
│       └── client.ts     # Axios instance with interceptors
├── store/                # Zustand stores (client UI state only)
├── types/                # Shared TypeScript types
└── env.ts                # Environment validation (@t3-oss/env-nextjs)
```

### Import Aliases

- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/store` → `src/store`
- `@/types` → `src/types`
- `@/env` → `src/env.ts`

### TanStack Query Patterns

**Query keys convention:**

```typescript
['resource', id?, filters?]
// Examples:
['users']
['users', userId]
['users', userId, 'posts']
```

**Hook pattern (in `src/hooks/`):**

```typescript
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export function useResource() {
  return useQuery({
    queryKey: ["resource"],
    queryFn: async () => {
      const { data } = await api.get("/resource");
      return data;
    },
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/resource", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource"] });
    },
  });
}
```

### UI Component Patterns

**shadcn/ui components** (in `src/components/ui/`):

- Generated via CLI: `pnpm dlx shadcn@latest add <name>`
- Use `cn()` utility from `@/lib/utils` for className merging
- All use Radix UI primitives
- Styled with Tailwind CSS using CSS variables

**Custom components:**

- Use forwardRef for form integration
- Accept `className` prop and merge with `cn()`
- Follow TypeScript best practices (type inference)

### Pre-commit Hooks

Configured with Husky + lint-staged:

- Auto-runs ESLint with `--fix`
- Auto-runs Prettier formatting
- Only on staged files
- Blocks commit if checks fail

## Key Dependencies

- **Next.js 15.5.4** - App Router with Turbopack
- **React 19.1.0** - Server Components enabled
- **TypeScript 5** - Strict mode
- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - Radix UI + Tailwind components
- **TanStack Query v5** - Server state management
- **Zustand 5** - Client UI state management
- **@t3-oss/env-nextjs** - Type-safe environment variables
- **Zod 4** - Runtime validation
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Form management
- **lucide-react** - Icon library

## Critical Rules

1. **Never use Zustand for server data** - Use TanStack Query
2. **Never manually create shadcn components** - Use CLI
3. **Never use `process.env` directly** - Import from `@/env`
4. **Never access localStorage without browser check** - `typeof window !== "undefined"`
5. **Default to Server Components** - Only add `'use client'` when necessary
6. **Always use `cn()` utility** - For className merging with Tailwind
7. **Environment validation happens at build time** - via `next.config.ts` import
