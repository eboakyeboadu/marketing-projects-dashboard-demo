# Marketing Projects Dashboard (Demo)

A centralized hub to discover, filter, and replicate successful marketing projects across regions. Built solo, zero to one.

**Portfolio demo using sample data created for demonstration, replacing private information from the original project.** The original repository remains private. All bundled projects, people, regions, and metrics are generated sample data. Metrics are illustrative, not real results.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Set `GEMINI_API_KEY` in `.env.local` (see `.env.example`)
3. Run the app: `npm run dev`

## Build & verification notes

- `npm run build` passes (with `NODE_OPTIONS=--max-old-space-size=1536` on ~2GB machines).
- `npm run lint` (`tsc --noEmit`) passes.
- The dashboard ships with 4 sample projects; card images are stock photos loaded from Unsplash at runtime, so the images need internet access.
- Region filters (North America, LATAM, EMEA, APAC) were rebuilt to match the sample projects, and the sample lessons and import samples were replaced with generic sample content.
- Checked in a headless browser: dashboard load, region filter counts, search, project detail view, and Add Project form open.
- Also checked (local, in-memory, no backend): adding a project via the manual form, editing it (with the overwrite confirmation) and deleting it. Mobile 390px has no horizontal overflow. Note: the form has many required fields and Target Audience starts with "Users" selected.
- Not checked: voting/favorites persistence and AI document import (needs `GEMINI_API_KEY`, not exercised).
