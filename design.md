# UI/UX Design System — General Rules

A reusable set of design rules for a multi-section SaaS product. This document describes the **general visual + interaction language** only — every section of the app (dashboard, calendar, lists, forms, finance, etc.) should follow these rules, regardless of its specific content.

---

## 1. Design Principles

1. **Calm by default.** White backgrounds, soft tints, no gradients, minimal shadows. Color is reserved for meaning, not decoration.
2. **Information density without noise.** Generous whitespace at the section level; tighter rhythm inside data-heavy components.
3. **One primary action per surface.** A single solid-color button signals the main intent; everything else is ghost or secondary.
4. **Color = status, not style.** Hues encode state (success, in-progress, warning, info). Decorative coloring is avoided.
5. **Progressive disclosure.** Filters, advanced settings, and bulk actions live behind triggers, not in the default view.
6. **Consistency over cleverness.** The same component looks and behaves the same in every section.

---

## 2. Layout Rules

- **Two-pane shell:** Persistent left sidebar (~240px) + main content area. The sidebar and top bar stay fixed; content scrolls.
- **Top bar height:** ~64px. Always contains page title (left), global search (center), quick actions + user chip (right).
- **Page header:** Sits below the top bar; holds tabs, summary counts, and toolbar controls (filters, view toggles, primary CTA).
- **Content max-width:** Fluid — surfaces fill available width. Reading-heavy pages cap at 880px centered.
- **Section spacing:** 32px between major sections; 24px between cards; 16px between related controls.
- **Grid:** 4px base unit. All spacing snaps to multiples of 4 (4 / 8 / 12 / 16 / 24 / 32 / 48).

---

## 3. Color

### Neutrals (the base palette)

| Role                          | Approx. value |
| ----------------------------- | ------------- |
| App background                | `#FFFFFF`     |
| Sidebar / panel fill          | `#FAFAFB`     |
| Muted fill (inputs, hover)    | `#F4F5F7`     |
| Hairline / divider            | `#ECEEF1`     |
| Text — primary                | `#1A1D1F`     |
| Text — secondary              | `#6B7280`     |
| Text — tertiary / placeholder | `#9CA3AF`     |

### Brand

| Role                | Approx. value      |
| ------------------- | ------------------ |
| Primary             | `#5B5BFE` (indigo) |
| Primary — soft tint | `#EEF0FF`          |

### Status (always paired with a label or icon — never color-only)

| Status             | Foreground             | Soft fill |
| ------------------ | ---------------------- | --------- |
| Success / Finished | `#16A34A`              | `#E8F7EE` |
| Info / Registered  | `#2563EB`              | `#E6EEFC` |
| In-progress        | `#F59E0B`              | `#FEF3C7` |
| Critical / Alert   | `#E11D48`              | `#FCE7EB` |
| Warning (banner)   | `#D97706` on `#FEF3C7` | —         |

**Rules:**

- All accents share similar mid-saturation chroma so they harmonize.
- No gradients. No drop shadows on content cards.
- Whites are subtly cool-toned; saturation never exceeds ~0.02 on neutral surfaces.

---

## 4. Typography

- **Family:** One geometric humanist sans (e.g. Inter, Plus Jakarta Sans). Used everywhere.
- **Numerals:** Tabular figures for prices, times, counts.
- **Line-height:** 1.4–1.5 for body; 1.1–1.2 for large numerals.

### Scale

| Token             | Size / Weight                | Use                                  |
| ----------------- | ---------------------------- | ------------------------------------ |
| `display`         | 28 / 700                     | Hero numbers, empty-state titles     |
| `h1` / page title | 22 / 600                     | Page title in top bar                |
| `h2`              | 18 / 600                     | Card / section title                 |
| `h3`              | 15 / 600                     | Subsection, column header            |
| `body`            | 14 / 400                     | Default body                         |
| `body-strong`     | 14 / 600                     | Names, primary cells                 |
| `meta`            | 12 / 400                     | Timestamps, helper text              |
| `label-caps`      | 11 / 600, uppercase, +0.06em | Group labels (CLINIC, FINANCE, etc.) |
| `pill`            | 11 / 500                     | Status pills, badges                 |

---

## 5. Iconography

- **Style:** Single outline set (e.g. Lucide, Phosphor Light). 1.5px stroke, rounded line caps.
- **Sizes:** 20×20 in nav, 16×16 inline, 14×14 in chips/pills.
- **Treatment:** Outlined by default; filled glyphs only for the active brand mark and small status chips.
- **Color:** Inherits text color. Status icons inherit their status hue.

---

## 6. Components

### Buttons

- **Primary** — Solid indigo, white text/icon, 8px radius, ~40px tall. One per surface.
- **Secondary** — White fill, 1px gray border, primary text color.
- **Ghost / icon button** — 36–40px, transparent → soft gray on hover.
- **Pill toggle** (e.g. Day / Week, Today) — Inactive: transparent inside a gray track. Active: solid white card with subtle shadow.
- **FAB / quick-create** — Solid indigo circle, used for the single most-prominent global action.

### Inputs

- Pill-shaped search with leading icon, soft gray fill, no visible border.
- Standard inputs use 1px border, 8px radius, 40px tall.
- Dropdowns include a chevron and an optional leading glyph.
- Focus state: 2px indigo ring, 2px offset.

### Tabs

- Underline pattern. Active = brand-color text + 2px brand underline. No fill, no pill.

### Cards

- White fill, 1px hairline border OR 8px radius with no border on tinted surfaces.
- No drop shadow on content cards. Elevation is reserved for floating UI (menus, popovers, the FAB).
- Inner padding: 16px (compact) / 20px (default) / 24px (spacious).

### Pills / Chips / Tags

- Full-pill radius, 11–12px text, 4–8px vertical padding.
- Status pill: leading dot (•) + label, both in matching hue, on transparent ground.
- Tag chip: soft tinted fill, no border.

### Avatars

- Circular, photographic. 28px in cards, 36px in headers and the account chip.

### Banners (in-context alerts)

- Inline within the work surface, full-width of their container.
- Soft tinted fill keyed to severity, centered text, no icon required at small sizes.

### Patterns / Textures

- **Diagonal stripes** (~45°, 8px pitch, `#E5E7EB` on `#F3F4F6`) reserved for _unavailable / blocked_ states. Never decorative.

---

## 7. Sizing & Radius

- **Border radius:**
  - Inputs, cards, banners: **8px**
  - Buttons: **8px**
  - Pills, chips, tags: **999px** (full pill)
  - Avatars: **50%**
- **Component heights:**
  - Inputs / buttons: **40px**
  - Icon buttons: **36–40px**
  - Top bar: **64px**
  - Sidebar items: **40px**
  - Table / list rows: **48–56px**

---

## 8. Interaction & Motion

- **Easing:** `ease-out`, 80–180ms, for most state changes.
- **Hover:** Subtle background fill shift, cursor pointer. Never relies on color alone.
- **Active / pressed:** Slight darkening (~4%) of the hover fill.
- **Focus:** 2px indigo ring, 2px offset, on every interactive element.
- **Transitions between tabs / routes:** Content swaps instantly; only the underline / active indicator animates.
- **Drag & drop:** Drop targets show a dashed indigo outline.
- **Empty states:** Always include a short label (never a blank surface). Centered, muted text, optional small illustration.

---

## 9. Accessibility

- **Contrast:** All text meets WCAG AA on its container.
- **Color is never the sole signal:** Status always pairs with a label or icon.
- **Hit targets:** ≥ 36×36 desktop, ≥ 44×44 touch.
- **Keyboard:** Every interactive surface is reachable and operable. ⌘K opens global search.
- **Focus order:** Follows visual order top-to-bottom, left-to-right.
- **Reduced motion:** Respect `prefers-reduced-motion`; disable non-essential transitions.

---

## 10. Voice & Microcopy

- **Tone:** Plain, helpful, professional. No marketing voice inside the product.
- **Sentence case** for all UI labels and buttons (not Title Case).
- **Verbs over nouns** on buttons: "Add patient" not "New patient".
- **Counts** are explicit: "16 total appointments", "1/4" — never just "many".
- **Dates** spell out the weekday + month: "Fri, 16 May 2022". Times always show timezone where relevant.

---

## 11. Density Modes (recommended tweak)

Expose three densities so the same components scale to different sections:

- **Compact** — Row height 40px, card padding 12px. Lists, finance tables.
- **Comfortable** — Row height 48px, card padding 16px. Default.
- **Spacious** — Row height 56px, card padding 24px. Forms, settings.

---

## 12. What This System Avoids

- ❌ Multiple gradients or colored backgrounds
- ❌ Heavy drop shadows on content
- ❌ Mixing icon sets
- ❌ Title Case in UI
- ❌ Color-only status indicators
- ❌ Decorative illustration inside dense work surfaces
- ❌ More than one primary button on a surface
- ❌ Custom one-off components when an existing one fits
