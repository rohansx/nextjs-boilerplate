# Documentation

Welcome to the MyClone project documentation! This folder contains comprehensive guides for understanding and working with this codebase.

---

## 📚 Available Documentation

### [ARCHITECTURE.md](./ARCHITECTURE.md)

**Complete architectural overview of the application**

Topics covered:

- Technology stack overview
- Architecture patterns (Server Components, State Management, etc.)
- Type-safe environment variables
- API client architecture
- Authentication flow
- Component architecture
- Data fetching patterns
- File organization
- Styling architecture
- Error handling
- Performance optimizations
- Security considerations
- Testing strategy
- Deployment
- Scalability considerations

**Read this to understand:** The "why" and "how" of the project's architecture.

---

### [TECH_STACK.md](./TECH_STACK.md)

**Detailed breakdown of every library and tool used**

Topics covered:

- Next.js 15 & React 19 features
- TypeScript & Zod configuration
- Tailwind CSS & shadcn/ui setup
- State management (Zustand & TanStack Query)
- HTTP client (Axios)
- Form handling (React Hook Form)
- Environment variables (@t3-oss/env-nextjs)
- UI primitives (Radix UI)
- Notifications (Sonner)
- Developer tools (ESLint, Prettier, Husky)
- Package management (pnpm)
- Build tools (Turbopack)
- Why each technology was chosen

**Read this to understand:** What each dependency does and why it's included.

---

### [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)

**Practical guide for day-to-day development**

Topics covered:

- Getting started & initial setup
- Available commands
- Development workflow
- Creating new features
- Adding environment variables
- Adding UI components
- State management patterns
- Code style guidelines
- Common tasks (forms, toasts, protected routes)
- Debugging tips
- Performance optimization
- Troubleshooting

**Read this to learn:** How to actually write code and build features.

---

## 🎯 Quick Start

**New to the project?** Read in this order:

1. **[TECH_STACK.md](./TECH_STACK.md)** - Understand what technologies we use
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Understand how they fit together
3. **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Learn how to build features

**Need a quick reference?**

- Commands → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md#available-commands)
- Adding components → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md#adding-ui-components)
- State management → [ARCHITECTURE.md](./ARCHITECTURE.md#2-state-management-strategy)
- API calls → [ARCHITECTURE.md](./ARCHITECTURE.md#4-api-client-architecture)

---

## 🏗️ Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Zustand    │  │   TanStack   │  │   shadcn/ui  │ │
│  │  (UI State)  │  │    Query     │  │ (Components) │ │
│  │              │  │ (Server Data)│  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                  │                            │
│         └──────────┬───────┘                            │
│                    │                                     │
│            ┌───────▼────────┐                           │
│            │  React 19      │                           │
│            │  (UI Layer)    │                           │
│            └───────┬────────┘                           │
│                    │                                     │
│            ┌───────▼────────┐                           │
│            │  Next.js 15    │                           │
│            │  (App Router)  │                           │
│            └───────┬────────┘                           │
│                    │                                     │
└────────────────────┼─────────────────────────────────────┘
                     │ HTTP (Axios)
┌────────────────────▼─────────────────────────────────────┐
│                   Backend API                            │
│              (Your API Server)                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Principles

### 1. **Server-First Architecture**

- Server Components by default
- Only use `'use client'` when necessary
- Reduce JavaScript sent to browser

### 2. **Clear State Separation**

- **Zustand** for client UI state (modals, sidebar, theme)
- **TanStack Query** for ALL server/API data
- Never mix them!

### 3. **Type Safety Everywhere**

- TypeScript strict mode
- Zod for runtime validation
- Type-safe environment variables

### 4. **Component Quality**

- Use shadcn/ui CLI (never manual creation)
- Accessible by default (Radix UI)
- Customizable with Tailwind

### 5. **Developer Experience**

- Fast refresh with Turbopack
- Auto-formatting with Prettier
- Pre-commit hooks catch errors early

---

## 📖 Documentation Structure

```
docs/
├── README.md              # This file - documentation overview
├── ARCHITECTURE.md        # System design & architectural patterns
├── TECH_STACK.md         # Technology choices & explanations
└── DEVELOPMENT_GUIDE.md  # Practical development guide
```

---

## 🤝 Contributing to Documentation

When adding new features or patterns:

1. **Update ARCHITECTURE.md** if it changes how things work
2. **Update TECH_STACK.md** if you add new dependencies
3. **Update DEVELOPMENT_GUIDE.md** with new workflows/commands
4. Keep examples up-to-date

---

## 🔗 External Resources

### Official Documentation

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Libraries

- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Zod](https://zod.dev)
- [React Hook Form](https://react-hook-form.com)

### Tools

- [pnpm Docs](https://pnpm.io)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)

---

## ❓ Need Help?

1. **Search the docs** - Use Ctrl+F in the markdown files
2. **Check examples** - Look at existing code in the project
3. **Read error messages** - They usually point to the problem
4. **Check library docs** - Official docs are always best
5. **Ask the team** - Don't hesitate to reach out

---

## 📝 Note

These docs are living documents. As the project evolves, so should this documentation. Keep it accurate and up-to-date!

**Last Updated:** 2025-10-05
