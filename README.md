# Wyze Bundle Builder

A multi-step security system bundle builder built as a frontend take-home project.

## Stack

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4** (styling)
- **Zustand** (state management + localStorage persistence)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

### Builder (left column)
- 4-step accordion — Step 1 open by default, each step expands/collapses on click
- "N selected" counter per step reflects distinct products with qty > 0
- "Next: …" button advances to the next step
- Product cards with optional discount badge, color/variant selector, quantity stepper, compare-at pricing

### Variant selection
- Each color variant tracks its own quantity independently
- Switching active variant shows that variant's count in the stepper without affecting others
- Review panel shows every variant with qty > 0 as its own line item

### Review panel (right column)
- Live-updates as selections change
- Items grouped by category: Cameras, Sensors, Accessories, Plan
- Quantity steppers in the panel stay in sync with the builder cards
- Total recalculates on every quantity change (compare-at struck through, savings callout)
- Financing estimate shown ("as low as $X/mo")
- Free shipping line item

### Persistence
- "Save my system for later" writes state to `localStorage` via Zustand's `persist` middleware
- On page reload the full configuration is restored automatically (quantities, active variants, open step)

## Data

All products are defined in `src/features/bundle/data/products.json`. The app is fully data-driven — no per-product markup is hardcoded. Seeded initial state matches the design's pre-populated review panel (cameras selected, sensors/accessories/plan pre-loaded).

## Project structure

Organised **by feature**, not by file type, so everything one feature needs lives together and the rest of the app imports through a single public barrel (`@/features/bundle`).

```
src/
  features/
    bundle/                 self-contained feature module
      components/           AccordionStep, ProductCard, ReviewPanel
      store/                Zustand store + selector hooks
      selectors.ts          pure, framework-free domain logic (unit-testable)
      types.ts              domain types
      data/products.json    catalogue
      index.ts              public API — the only entry point consumers use
  components/
    ui/                     shared, app-agnostic primitives (QuantityStepper, icons)
  App.tsx                   composition root
```

- **`@/` path alias** (configured in `tsconfig.app.json` + `vite.config.ts`) avoids `../../..` import chains.
- **Barrel boundary:** `App` imports only from `@/features/bundle`; the feature's internal file layout can change without touching consumers.
- **`ui/` vs `features/`:** a component goes in `ui/` only if it has zero knowledge of the bundle domain (`QuantityStepper` takes callbacks, not store state); anything that reads the store lives in the feature.

## Architecture notes

- **State shape is the source of truth.** All UI is derived from a single normalised `steps` tree. Pure functions (`getReviewItems`, `computeTotals`, `getSelectedCount`) live in `selectors.ts`, fully decoupled from React/Zustand, and project that tree into what the review panel and counters render — so there is no duplicated/derived state to keep in sync, and the logic is trivially unit-testable.
- **Selector-based subscriptions.** Components subscribe to the narrowest slice of the store via dedicated hooks (`useSteps`, `useActiveStep`, `useBundleActions`, `useStep`). Actions are pulled out with `useShallow` for a stable reference. Bumping one product's quantity no longer re-renders the whole tree.
- **Memoised derivations.** `getReviewItems` / `computeTotals` run inside `useMemo`, and `ProductCard` / `AccordionStep` are wrapped in `React.memo`, so unrelated renders (e.g. the "saved" toast toggle) don't recompute totals.
- **Accessibility.** The accordion uses an `aria-expanded` / `aria-controls` header button paired with an `aria-labelledby` region; variant chips expose `aria-pressed`; the quantity steppers have labels.

## Decisions & Tradeoffs

- **Zustand over Redux**: lighter API for this scope; `persist` middleware handles localStorage in one line.
- **Custom `merge` on persist**: only quantities, active variants, and `activeStep` are re-hydrated from localStorage — product data (names, prices, images) always comes fresh from JSON, so a price change in the catalogue can never be masked by stale persisted state.
- **Tailwind CSS v4**: the new `@import "tailwindcss"` syntax with the Vite plugin — no separate config file. The whole app is Tailwind end-to-end (no inline style objects).
- **Responsive**: builder/review stack vertically below `lg`; the product grid collapses to one column on the narrowest screens; the review panel is sticky on desktop.
- **Images**: graceful fallback renders an inline SVG placeholder if a product image fails to load; images are lazy-loaded.
- **No backend**: JSON served as a local module import — adding a backend would mean swapping the import for a `fetch` call behind a query hook.

## What I'd add with more time

- Animate accordion open/close with a CSS grid-rows height transition.
- Step validation (warn if no camera is selected before advancing).
- "Learn More" modal/drawer with full product details.
- Unit tests (Vitest + RTL) for the pure selectors and a `ProductCard` interaction test.
- Roving-tabindex keyboard navigation between accordion headers.
