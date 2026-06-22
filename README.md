# Stitchly — wireframes

Throwaway clickable prototype to clarify MVP scope for the knitting/crochet companion app. Mid-fi, not final design. The point is to **interact with the flows** before committing to a build.

> Working title. Real designs come from Melissa.

## What's here

| Flow | Route | Status |
|------|-------|--------|
| Home dashboard | `/` | Continue making, active projects, recents |
| Pattern library | `/library` | Grid + search + filters |
| Pattern detail | `/library/[id]` | Hero, parse summary, start-a-project CTA |
| **Upload PDF** | `/library/upload` | File-picker affordance, explainer |
| **Processing** | `/library/upload/processing` | Animated parse states |
| **Parse review** | `/library/upload/review` | The contentious flow — confidence chips per row, in-place edit |
| Projects list | `/projects` | Active + completed |
| Create project | `/projects/new` | Pattern picker, name, materials, notes |
| Project detail | `/projects/[id]` | Progress, materials, notes |
| **Pattern reader** | `/projects/[id]/reader` | Row-by-row card view, next/prev, note-per-row, autosave |

## The interesting flow

The **upload → parse-review → reader** flow is where most of the open product questions live. See the comment chain in the brief — the question is whether AI conversion is worth the per-upload cost vs. a deterministic parser for the most common pattern formats. The wireframe demos a hybrid: rows get a confidence chip, low-confidence rows are flagged for review, edits are inline.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind v4
- shadcn/ui (Base UI primitives)
- Deployed via Vercel — preview URL per push

## Running locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The phone frame on desktop is intentional — the app is mobile-first.
