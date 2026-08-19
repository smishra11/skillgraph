<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SkillGraph Agent Guide

SkillGraph is a Next.js App Router application for exploring frontend career paths. It uses TypeScript, React, CognoDB, the Neo4j JavaScript driver, and React Flow.

## Project Structure

```text
app/
├── api/
│   ├── analyze/route.ts
│   ├── health/route.ts
│   ├── learning-paths/route.ts
│   ├── roles/route.ts
│   ├── roles/[slug]/requirements/route.ts
│   └── skills/route.ts
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── analysis/
│   ├── analysis-results.tsx
│   ├── role-match-summary.tsx
│   └── skill-coverage.tsx
├── analyzer/
│   ├── analysis-workspace.tsx
│   ├── analyzer-hero.tsx
│   ├── profile-panel.tsx
│   └── workspace-empty-state.tsx
├── graph/
│   ├── build-skill-graph.ts
│   ├── graph-empty-state.tsx
│   ├── selected-node-details.tsx
│   ├── skill-graph.tsx
│   └── skill-node.tsx
├── ui/
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── command.tsx
│   ├── dialog.tsx
│   ├── input-group.tsx
│   ├── input.tsx
│   ├── popover.tsx
│   ├── select.tsx
│   └── textarea.tsx
├── analysis-form.tsx
├── role-selector.tsx
├── skill-selector.tsx
└── skillgraph-analyzer.tsx

lib/
├── db/
│   ├── driver.ts
│   ├── queries.ts
│   └── seed-data.ts
└── utils.ts

scripts/
├── seed.ts
├── verify-seed.ts
└── verify-traversal.ts

docs/
public/
```

## Ownership Boundaries

- `app/` contains the page shell and server-side API route handlers.
- `components/` contains client-facing UI, graph visualization, and reusable UI primitives.
- `lib/db/` owns CognoDB connection management, Cypher queries, and seed data.
- `scripts/` contains database seeding and verification utilities run with `tsx`.
- `docs/` is for project documentation and `public/` is for static assets.

Keep database access in `lib/db/` or an API route. Do not expose database credentials or call CognoDB directly from client components. Use parameterized query values rather than interpolating user input into Cypher.

## Development Commands

```text
npm run dev
npm run lint
npm run build
npm run seed
npm run verify-seed
npm run verify-traversal
```

Use `.env.example` as the template for local configuration. Never commit `.env.local` or database credentials.

## Change Guidance

- Follow the existing TypeScript and App Router patterns.
- Preserve the public API response shapes unless the task explicitly requires a contract change.
- Keep graph traversal and weighted role matching logic in the database/query layer.
- Add or update focused validation when changing API behavior, graph traversal, or matching calculations.
- Before changing Next.js APIs or conventions, read the relevant guide under `node_modules/next/dist/docs/` as required by the generated rules above.
