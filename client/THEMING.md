# Central Theme & Primitive System (`client/`)

This directory houses the unified light + dark theme system and primitive UI component library for Dr. Zaid Homeo Care.

## 1. Core Principles

> [!IMPORTANT]
> **CRITICAL RULE**: **Never use a raw Tailwind color utility in a component.**
> Always use semantic tokens (e.g. `bg-surface`, `text-text`, `text-text-muted`, `border-border`, `bg-primary`, `bg-primary-subtle`) or primitive UI components from `src/components/ui/`.
> Do NOT sprinkle `dark:` variants across components. The semantic tokens themselves invert automatically when the theme changes.

---

## 2. Two-Tier Token Model (`src/styles/theme.css`)

### Tier 1: Raw Primitives
Raw color scales that are theme-independent and never change:
- Brand teal ramp: `--brand-50` through `--brand-950` (`#0d9488` family)
- Neutral slate ramp: `--neutral-50` through `--neutral-950`
- Status ramps: `--success-*`, `--warning-*`, `--danger-*`, `--info-*`

### Tier 2: Semantic Tokens
The only tokens components are permitted to reference. Defined under `:root` for light mode and overridden under `[data-theme="dark"]` for dark mode.

| Token Category | Token Variable | Tailwind Utility | Light Value | Dark Value |
|---|---|---|---|---|
| **Surfaces** | `--color-bg` | `bg-bg` | `slate-50` | `slate-950` |
| | `--color-bg-subtle` | `bg-bg-subtle` | `slate-100` | `#090d16` |
| | `--color-surface` | `bg-surface` | `#ffffff` | `slate-900` |
| | `--color-surface-raised` | `bg-surface-raised` | `#ffffff` | `slate-800` |
| | `--color-surface-sunken` | `bg-surface-sunken` | `slate-100` | `slate-950` |
| | `--color-surface-hover` | `bg-surface-hover` | `slate-100` | `slate-800` |
| | `--color-overlay` | `bg-overlay` | `rgba(15,23,42,0.5)` | `rgba(2,6,23,0.75)` |
| **Sidebar** | `--color-sidebar-bg` | `bg-sidebar-bg` | `slate-950` | `slate-900` |
| | `--color-sidebar-text` | `text-sidebar-text` | `slate-100` | `slate-100` |
| | `--color-sidebar-border` | `border-sidebar-border` | `slate-800` | `slate-800` |
| **Text** | `--color-text` | `text-text` | `slate-900` | `slate-50` |
| | `--color-text-muted` | `text-text-muted` | `slate-600` | `slate-400` |
| | `--color-text-subtle` | `text-text-subtle` | `slate-500` | `slate-500` |
| | `--color-text-disabled` | `text-text-disabled` | `slate-400` | `slate-600` |
| | `--color-text-inverse` | `text-text-inverse` | `#ffffff` | `slate-900` |
| | `--color-text-on-brand` | `text-text-on-brand` | `#ffffff` | `#ffffff` |
| **Borders** | `--color-border` | `border-border` | `slate-200` | `slate-800` |
| | `--color-border-strong` | `border-border-strong` | `slate-300` | `slate-700` |
| | `--color-border-subtle` | `border-border-subtle` | `slate-100` | `slate-800` |
| | `--color-focus-ring` | `ring-focus-ring` | `brand-600` | `brand-400` |
| **Brand** | `--color-primary` | `bg-primary`, `text-primary` | `brand-600` | `brand-500` |
| | `--color-primary-hover` | `hover:bg-primary-hover` | `brand-700` | `brand-400` |
| | `--color-primary-subtle` | `bg-primary-subtle` | `brand-50` | `color-mix(15% brand)` |
| | `--color-primary-subtle-text` | `text-primary-subtle-text` | `brand-800` | `brand-300` |
| | `--color-primary-border` | `border-primary-border` | `brand-200` | `color-mix(30% brand)` |

---

## 3. UI Primitive Components (`src/components/ui/`)

All UI primitives forward refs, merge custom `className` using `cn()` (`clsx` + `tailwind-merge`), enforce visible focus rings, and consume only semantic tokens.

Available primitives:
- `Button`: Primary, secondary, outline, ghost, danger variants; sizes `sm/md/lg`; `isLoading`, `leftIcon`, `rightIcon`, `fullWidth`.
- `IconButton`: Accessible icon-only button enforcing `aria-label`.
- `Card`: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` with customizable padding and interactive hover.
- `Input`: Accessible form text/number/date input with labels, hints, errors, icons, and ARIA attributes.
- `Textarea`: Matching contract for multi-line inputs.
- `Select`: Native styled select dropdown with matching contract.
- `Badge`: Status badges (`neutral`, `primary`, `success`, `warning`, `danger`, `info`).
- `Table`: `Table`, `TableHead`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` with wrapper, zebra striping, and hover rows.
- `Modal`: Portal-rendered accessible modal with focus trap, body scroll lock, and ESC/backdrop dismissal.
- `Alert`: Accessible alert banner (`info`, `success`, `warning`, `danger`) with optional dismiss handler.
- `Spinner`: Loading spinner with `role="status"` and accessible screen-reader text.
- `EmptyState`: Clean empty state placeholder with icon, title, description, and action button.
- `Skeleton`: Animated loading shimmer.
- `PageHeader`: Reusable page heading layout with title, subtitle, back button, and actions.
- `ThemeToggle`: Sun/Moon/System theme toggle control.

---

## 4. Theme Manager & Hooks (`src/theme/`)

```tsx
import { useTheme } from '../theme';

function Header() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current: {resolvedTheme}
    </button>
  );
}
```

- **Persistence**: User setting saved in `localStorage` under `dz-theme` (`'light' | 'dark' | 'system'`).
- **OS Sync**: Automatically follows `prefers-color-scheme: dark` when set to `'system'`.
- **FOUC Prevention**: Inline `<script>` in `<head>` sets `data-theme` on `<html>` before initial paint.

---

## 5. How to Build a New Page

```tsx
import React from 'react';
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';

export default function MyNewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Page Title"
        subtitle="Manage your clinical records"
        actions={<Button variant="primary">Action</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle>Section Header</CardTitle>
        </CardHeader>
        <CardContent>
          <Input label="Field Name" placeholder="Enter text..." />
        </CardContent>
      </Card>
    </div>
  );
}
```
