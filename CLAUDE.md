# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server
- `npm run build` — production build (runs Next compilation; `prisma generate` also runs on `npm install` via the `postinstall` script)
- `npm start` — run the production build
- `npm run lint` — ESLint (`next/core-web-vitals` + `@rocketseat/eslint-config/next`)
- `npm run lint:fix` — run ESLint with `--fix` across `.ts`/`.tsx`
- `npx prisma generate` — regenerate the Prisma client after editing `prisma/schema.prisma`
- `npx prisma db push` — push schema changes to MongoDB (no migrations because the datasource is MongoDB)

Formatting is governed by `.prettierrc.json` (with `prettier-plugin-tailwindcss` for class sorting).

Required env vars: `DATABASE_URL` (MongoDB connection string), `NEXTAUTH_SECRET`, `GITHUB_ID` / `GITHUB_SECRET`, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

There is no test runner configured.

## Architecture

Next.js 14 App Router + Prisma (MongoDB) + NextAuth + Tailwind/shadcn.

### Data model (`prisma/schema.prisma`)

Hierarchy: `Workspace` → `Project` → `Section` → `Task` → `SubTask`. Both `Workspace` and `Project` have many-to-many relations to `User` (via `userIds` / `workSpaceIds` / `projectIds` ObjectId arrays — MongoDB-specific). `Project.privacy` is `Public`/`Private`; private projects are only visible to connected members. `Section` and `Task` carry an `order: Int` used for drag-and-drop reordering.

### Routing

- `app/(dashboard)/(basePath)` — landing after login (no workspace selected yet).
- `app/(dashboard)/[workspaceId]/layout.tsx` — the main authenticated shell. It runs on the server, calls `getServerSession()`, redirects to `/signin` if unauthenticated, then fetches the **entire workspace tree** (workspaces → projects → sections → tasks → subTasks) filtered by membership + project privacy, plus all users, and passes them into `AppLayout`. This is the single source of truth for page data.
- `app/(dashboard)/[workspaceId]/{home,inbox,my-tasks,project/[projectId],team}` — dashboard sub-routes. Route-local components live under `_components/` inside each route.
- `app/api/auth/[...nextauth]` — NextAuth handler; config is in `providers/auth.ts`.

### Server actions (`actions/<Entity>/<Verb>/`)

Every mutation is a Next.js Server Action under `actions/`, grouped by entity (`Project`, `Section`, `Task`, `SubTask`, `Workspace`, `User`) then by verb. Each folder contains:

- `action.ts` — `'use server'`, calls `getServerSession()` for auth, validates input via the colocated Zod schema, talks to Prisma, calls `revalidatePath('/')`, and returns `{ data } | { error }`. Follow this shape when adding new actions.
- `schema.ts` — Zod schema + inferred type used by both the form and the action.

### Client state

- `context/WorkspaceContext.tsx` — holds `currentWorkspace` + `workspaceList` on the client. The server layout seeds these; client components read/update via `useWorkspaceContext()`.
- `context/UserContext.tsx` — current user info.
- Data fetched inside client components uses **SWR** (`swr`). Forms use **react-hook-form** + `@hookform/resolvers/zod` against the same `schema.ts` the server action uses.

### UI

shadcn/ui components are generated into `components/ui/` (see `components.json`, base color `slate`, CSS variables on). Shared cross-feature components live in `components/shared/`, chrome in `components/layout/`. Drag-and-drop uses `@hello-pangea/dnd` and reorders call the `ChangeSectionsOrder` / `ChangeTasksOrder` actions.

### Design system

Theme tokens live in `app/globals.css` (HSL triplets, light + `.dark`); Tailwind surfaces them as semantic colors in `tailwind.config.js`. Primary brand color is blue (`221 83% 53%`). Do not introduce raw hex values in components — read from tokens.

- **Status tokens** — `status-{todo|progress|done|blocked}` each with `DEFAULT`, `foreground`, and `soft` slots (e.g. `bg-status-done-soft text-status-done-foreground`).
- **Priority tokens** — `priority-{low|medium|high|urgent}` with the same `DEFAULT`/`foreground`/`soft` slots.
- **Gradient utilities** — `bg-brand-gradient` (solid fill), `bg-brand-radial` (decorative corners), `text-brand-gradient` (gradient text).
- **Shadows** — `shadow-soft`, `shadow-elevated`, `shadow-glow` for the ring-style focus halo.

Component variants to reuse rather than re-inventing:

- `Button` — `default | brand | soft | destructive | outline | secondary | ghost | link`; sizes `xs | sm | default | lg | icon | icon-sm`. SVG children auto-size to `h-4 w-4` via the `[&_svg]` selector.
- `Badge` — `default | secondary | destructive | outline | soft` plus the `status-*` and `priority-*` variants (which render a colored dot via `::before`).
- `Card` — pass `interactive` for a hover-lift + primary border treatment on clickable cards.

For per-entity accent colors (workspace/project avatars, sidebar items), hash the id into the shared `PROJECT_HUES` palette (see `components/layout/Sidebar.tsx`) rather than picking a new scheme.

### Path alias

`@/*` maps to the repo root (`tsconfig.json`). Note `strict: false` — don't assume strict-mode guarantees. Prefer importing types from `@/types/types` (e.g. `WorkspaceWithProjectsUsers`) rather than re-deriving Prisma include-shapes inline.
