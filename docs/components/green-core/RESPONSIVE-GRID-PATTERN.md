# Responsive Grid Pattern (Project Standard)

This document describes the standard `GdsGrid` layout pattern every new page in this project should follow. Using this pattern ensures consistent responsive behavior across all screens (mobile, tablet, desktop) and avoids layout regressions.

Principles
- Use `GdsGrid` columns with the semicolon breakpoint shorthand to declare behavior per breakpoint.
- Prefer column counts per breakpoint over per-child `grid-column` overrides. This keeps layouts maintainable.
- Use `gap` and `padding` tokens for consistent spacing.
- Only use `auto-columns` when you need fluid columns with explicit minimum pixel widths. For most forms prefer the column-count approach.

Recommended grid patterns

1) Page main layout (left content + optional right sidebar)

Use this pattern for pages with a main column and a sidebar. On small screens the layout stacks, on medium it keeps a single column layout, and on large screens it becomes a multi-column layout.

Example:

GdsGrid attributes to use:

- `columns="1; m{1}; l{10}"` — top-level container
- On the main content area: `grid-column="s{1} m{1} l{1 / 8}"` (or `l{1 / 8}` equivalent) to span 7–8 columns on large screens
- On the sidebar: `grid-column="s{1} m{1} l{8 / 11}"` to place the sidebar on the right on large screens

This yields:
- Small (mobile): single column stack
- Medium (tablet): single column stack unless you intentionally set `m{2}`
- Large (desktop): two-column layout approximating a 70/30 split

2) Two-column form sections (typical for inputs)

For internal grids that hold inputs and labels, use a simple 1 -> 2 columns pattern:

- `columns="1; m{2}" gap="m"`

Behavior:
- Small: 1 column (inputs stack)
- Medium+: 2 columns (inputs appear side-by-side)

3) Multi-column info blocks

For informational blocks where you want up to 4 columns on large screens:

- `columns="1; m{2}; l{4}" gap="m"`

Other tips
- When you need precise minimum widths, use `auto-columns` with pixel minima: `auto-columns="s{200} m{250}"`. This is useful for card grids where each card must maintain a minimum width.
- Avoid per-child `grid-column` unless absolutely required. Use it only for irregular cases like a wide hero card spanning multiple columns.
- Keep `gap` values consistent across pages (use `s`, `m`, `l` tokens). Use `padding` on cards for internal spacing.
- Test near breakpoint widths when implementing new pages — some wrapping issues happen around the breakpoint thresholds.

Checklist for new pages

- [ ] Use top-level `GdsGrid` with `columns="1; m{1}; l{10}"` for pages with sidebars
- [ ] Use `columns="1; m{2}"` for form field groups
- [ ] Use `columns="1; m{2}; l{4}"` for multi-column info lists
- [ ] Avoid `auto-columns` unless necessary; document why if used
- [ ] Validate layout at 320px, 768px and 1200px

Reference examples
- `src/pages/Dashboard.tsx` — main example using `columns="1; m{2}; l{3}"` for card grid
- `src/pages/PersonalInfoForm.tsx` — form example using `columns="1; m{2}"` for input groups
- `src/pages/PricingCalculatorForm.tsx` — complex page using `columns="1; m{1}; l{10}"` for main layout and `columns="1; m{2}; l{4}"` internally

If you want, I can add a short project template `PageTemplate.tsx` that wraps this pattern so new pages are scaffolded correctly.
