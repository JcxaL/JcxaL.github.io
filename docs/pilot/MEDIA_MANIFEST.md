# Media Manifest — your shopping list

> This is the **owner's gathering checklist** for the JccL Line pilot. While the
> AI builds the media-independent design system, every place a real photo/video
> will go is registered here as a **slot**. Gather assets that match these specs;
> at the convergence pass we drop them in and the site fills itself.
>
> **Source of truth:** `src/lib/media/slots.registry.ts` (+ any co-located
> `defineSlot` calls). This table is regenerated from it — a `pnpm media:manifest`
> generator is a pending build unit; until then it is kept in sync by hand as
> slots land.

## How to hand off a real asset (at convergence)
1. Drop the file under `public/media/<surface>/…` (e.g. `public/media/paris/eiffel-sunrise.jpg`).
2. Add one entry to `src/lib/media/bindings.ts` keyed by the slot `id`, with
   `src`, place-specific `alt`, optional `credit` and `focal` point.
3. That's it — no component changes. The placeholder becomes the real asset,
   with the same aspect ratio (no layout shift).

## Slots (6 declared · 0 bound)

| id | surface | kind | aspect | orient. | min width | purpose / gathering notes |
|---|---|---|---|---|---|---|
| `concourse.hero.aerial` | concourse | image | 21:9 | landscape | 2560px | Wide aerial/skyline behind the 3D network map. **Dusk / blue-hour** reads best. |
| `travel.paris.cover` | travel/paris | image | 3:2 | landscape | 2000px | Cover for the Paris strip-map journey header. |
| `travel.paris.eiffel.sunrise` | travel/paris | image | 4:5 | portrait | 1600px | Eiffel Tower **at sunrise** — diorama window, station 02. 6–7am, low sun. |
| `travel.paris.montmartre.street` | travel/paris | image | 4:5 | portrait | 1600px | Montmartre cobblestones / Sacré-Cœur view — station 03. |
| `station.paris.hero` | station/paris | image | 16:9 | landscape | 2400px | Immersive hero for the Paris station exhibit room. |
| `station.paris.ambient.loop` | station/paris | **video** | 16:9 | landscape | — | Ambient loop (street life / trains), **silent, ≤8s, seamless**. Still-frame fallback ok. |

## Coverage
- **Bound:** 0 / 6 — the build phase intentionally ships placeholders.
- **Convergence gauge:** `boundCount()` in `bindings.ts`.
- As tracks build more surfaces, more slots appear here. Gather against whatever
  is listed at convergence time — the list only grows.
