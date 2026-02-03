---
trigger: always_on
glob:
description: Next.js project conventions and best practices for file organization, component structure, and development patterns
---

# Next.js Project Conventions

## Project Structure

This project uses **Next.js App Router** with the following structure:

```
app/                    # App Router pages and layouts
├── (group)/            # Route groups (e.g., (landing), (auth))
├── admin/              # Admin section routes
├── layout.tsx          # Root layout
├── globals.css         # Global styles
└── page.tsx            # Home page

components/             # React components
├── features/           # Feature-specific components (organized by domain)
├── layout/             # Layout components (Header, Footer, Sidebar)
├── providers/          # Context providers (Theme, Auth, etc.)
├── shared/             # Shared/reusable components
├── ui/                 # Base UI components (Button, Input, Modal)
└── templates/          # Page templates

hooks/                  # Custom React hooks
lib/                    # Utility functions and helpers
lib/api-v2/             # API clients (all API code goes here)
types/                  # TypeScript type definitions
public/                 # Static assets
```

---

## File Naming Conventions

### Components
- Use **PascalCase** for component files: `ArticleCard.tsx`, `UserProfile.tsx`
- Use **kebab-case** for directories: `article-card/`, `user-profile/`
- Co-locate related files: `ArticleCard.tsx`, `ArticleCard.module.css`, `ArticleCard.test.tsx`

### Pages (App Router)
- Use lowercase with hyphens for route segments: `app/blog-posts/page.tsx`
- Special files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`

### Utilities & Hooks
- Use **camelCase** for utility files: `formatDate.ts`, `useDebounce.ts`
- Prefix hooks with `use`: `useAuth.ts`, `useArticle.ts`

---

## Component Organization

### Feature Components
Place domain-specific components in `components/features/{domain}/`:
```
components/features/
├── admin/
│   ├── articles/
│   │   ├── ArticleList.tsx
│   │   ├── ArticleEditorModal.tsx
│   │   └── ArticleFilters.tsx
│   └── users/
│       └── UserTable.tsx
├── landing/
│   ├── LandingHero.tsx
│   └── FeaturedArticles.tsx
└── articles/
    ├── ArticleCard.tsx
    └── ArticleContent.tsx
```

### Shared Components
Reusable layout components and wrappers go in `components/shared/`:
```
components/shared/
├── Container.tsx
├── Section.tsx
├── PageWrapper.tsx
├── Grid.tsx
└── Divider.tsx
```

### UI Components (shadcn only)
`components/ui/` is **exclusively for shadcn/ui components**. Do not place custom components here:
```
components/ui/
├── button.tsx      # shadcn Button
├── input.tsx       # shadcn Input
├── dialog.tsx      # shadcn Dialog
├── card.tsx        # shadcn Card
└── skeleton.tsx    # shadcn Skeleton
```

> **Note**: For custom UI components that are not from shadcn, place them in `components/shared/` instead.

---

## Creating New Files

### New Page
1. Create route directory in `app/`: `app/new-feature/`
2. Add `page.tsx` for the page component
3. Add `layout.tsx` if custom layout needed
4. Add `loading.tsx` for loading state
5. Add `error.tsx` for error handling

### New Component
1. Determine component type:
   - **Feature-specific**: `components/features/{domain}/ComponentName.tsx`
   - **Reusable layouts/wrappers/custom UI**: `components/shared/ComponentName.tsx`
   - **shadcn components only**: `components/ui/ComponentName.tsx`
   - **App-level layout**: `components/layout/ComponentName.tsx`
2. Use named exports for components
3. Add TypeScript interfaces for props

### New Hook
1. Create in `hooks/`: `hooks/useHookName.ts`
2. Follow React hooks naming convention: `use{HookName}`
3. Export hook and any related types

---

## Hooks for Complex State Management

Extract complex state logic into custom hooks in `hooks/` to keep components clean and readable.

### When to Create a Hook
- Component has **5+ related state variables**
- State logic is **reused across components**
- Complex **derived state or side effects**
- Logic involves **API calls with loading/error states**

### Hook File Structure
```typescript
'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';

// ============================================================
// Types
// ============================================================

/** Configuration options for the hook */
interface UseExampleConfig {
  initialValue?: string;
  onSuccess?: (data: ExampleData) => void;
}

/** Data structure returned by the hook */
interface ExampleData {
  id: string;
  name: string;
}

/** Return type for the hook */
interface UseExampleReturn {
  // State
  data: ExampleData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchData: (id: string) => Promise<void>;
  updateData: (updates: Partial<ExampleData>) => void;
  reset: () => void;
}

// ============================================================
// Hook Implementation
// ============================================================

/**
 * Hook for managing example data with fetch and update capabilities.
 * 
 * @example
 * const { data, isLoading, fetchData, updateData } = useExample({
 *   initialValue: 'default',
 *   onSuccess: (data) => console.log('Loaded:', data),
 * });
 */
export function useExample(config: UseExampleConfig = {}): UseExampleReturn {
  const { initialValue, onSuccess } = config;

  // ----------------------
  // State
  // ----------------------
  const [data, setData] = useState<ExampleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ----------------------
  // Actions
  // ----------------------
  const fetchData = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getData(id);
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess]);

  const updateData = useCallback((updates: Partial<ExampleData>) => {
    setData(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // ----------------------
  // Return
  // ----------------------
  return {
    data,
    isLoading,
    error,
    fetchData,
    updateData,
    reset,
  };
}
```

### Hook Naming Patterns

| Pattern | Example | Use Case |
|---------|---------|----------|
| `use{Entity}` | `useArticle` | Single entity CRUD operations |
| `use{Entity}s` | `useArticles` | Collection management |
| `use{Feature}` | `useUrlFilters` | Feature-specific logic |
| `use{Action}` | `usePagination` | Reusable action patterns |

### Best Practices

1. **Group by concern** - Organize hook internals with comment sections: Types, State, Actions, Effects, Return
2. **Type everything** - Define interfaces for config, return type, and internal state
3. **Document with JSDoc** - Add `@example` blocks showing typical usage
4. **Use `useCallback`** - Wrap all action functions to prevent unnecessary re-renders
5. **Return stable references** - Keep return object structure consistent
6. **Handle loading/error states** - Always include `isLoading` and `error` for async operations

### New Utility
1. Create in `lib/`: `lib/utilityName.ts`
2. Group related utilities in subdirectories: `lib/utils/`

### New API Function
1. **All API code must go in `lib/api-v2/`** - Do not create API functions elsewhere
2. Group by domain: `lib/api-v2/articles.ts`, `lib/api-v2/auth.ts`
3. Export from `lib/api-v2/index.ts` for clean imports

---

## Code Patterns

### Server vs Client Components
```tsx
// Server Component (default) - No directive needed
export default async function ServerComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component - Requires 'use client' directive
'use client';
import { useState } from 'react';

export default function ClientComponent() {
  const [state, setState] = useState(false);
  return <button onClick={() => setState(!state)}>Toggle</button>;
}
```

### Data Fetching
```tsx
// Server Component - Direct fetch
async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);
  return <ArticleContent article={article} />;
}

// Client Component - Use hooks or React Query
'use client';
function ArticleList() {
  const { data, isLoading } = useArticles();
  if (isLoading) return <Skeleton />;
  return <>{data.map(article => <ArticleCard key={article.id} article={article} />)}</>;
}
```

### Dynamic Imports
```tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const Editor = dynamic(() => import('@/components/Editor'), {
  loading: () => <EditorSkeleton />,
  ssr: false, // Disable SSR if needed
});
```

---

## Import Aliases

Use the `@/` alias for imports:
```tsx
// ✅ Good
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-v2';

// ❌ Avoid relative imports for cross-directory
import { Button } from '../../../components/ui/Button';
```

---

## Checklist for New Features

- [ ] Create page in `app/` directory following route conventions
- [ ] Add feature components in `components/features/{domain}/`
- [ ] Extract reusable layouts to `components/shared/`
- [ ] Extract base UI primitives to `components/ui/`
- [ ] Create custom hooks in `hooks/` for complex state logic
- [ ] Add API functions in `lib/api-v2/`
- [ ] Define TypeScript types in component files or `types/`
- [ ] Add loading and error states
- [ ] Test on development server with `npm run dev`
- [ ] Verify build passes with `npm run build`
