# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Campus Maintenance
**Generated:** 2026-07-03 19:36:34
**Updated:** 2026-07-04 12:00:00
**Category:** Status Page / Incident Management

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#16A34A` | `--color-primary` |
| Primary Hover | `#15803D` | `--color-primary-hover` |
| Primary Light | `#DCFCE7` | `--color-primary-light` |
| Secondary | `#22C55E` | `--color-secondary` |
| Accent/CTA | `#DC2626` | `--color-accent` |
| Accent Hover | `#B91C1C` | `--color-accent-hover` |
| Accent Light | `#FEE2E2` | `--color-accent-light` |
| Warning | `#D97706` | `--color-warning` |
| Warning Hover | `#B45309` | `--color-warning-hover` |
| Warning Light | `#FEF3C7` | `--color-warning-light` |
| Info | `#2563EB` | `--color-info` |
| Info Light | `#DBEAFE` | `--color-info-light` |
| Background | `#F0FDF4` | `--color-bg-base` |
| Card Background | `#FFFFFF` | `--color-bg-card` |
| Foreground | `#0F172A` | `--color-fg-base` |
| Muted Text | `#475569` | `--color-fg-muted` |
| Secondary Text | `#64748B` | `--color-fg-light` |
| Border | `#0F172A` | `--color-border` |
| Subtle Border | `#CBD5E1` | `--color-border-subtle` |
| Card Shadow | `#0F172A` | `--color-card-shadow` |

**Color Notes:** Operational green + incident red + maintenance amber. Dark mode support included.

### Typography

- **Font Family:** Inter
- **Mood:** neo-brutalism, bold borders, flat shadows, high contrast, modern, energetic
- **Google Fonts:** [Inter](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
```

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `Inter` | Primary font family |
| `--border-width` | `3px` | Bold neo-brutalism borders |
| `--border-width-sm` | `2px` | Thinner borders |
| `--radius` | `12px` | Standard border radius |
| `--radius-sm` | `8px` | Small border radius |
| `--shadow-flat` | `6px 6px 0px 0px var(--color-card-shadow)` | Neo-brutalism flat shadow |
| `--shadow-flat-sm` | `4px 4px 0px 0px var(--color-card-shadow)` | Small flat shadow |
| `--shadow-flat-hover` | `2px 2px 0px 0px var(--color-card-shadow)` | Hover flat shadow |

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #16A34A;
  color: white;
  padding: 12px 24px;
  border: 3px solid #0F172A;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 4px 4px 0px 0px #0F172A;
  transition: all 150ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  box-shadow: 2px 2px 0px 0px #0F172A;
  transform: translate(2px, 2px);
}

/* Accent/Danger Button */
.btn-accent {
  background: #DC2626;
  color: white;
  padding: 12px 24px;
  border: 3px solid #0F172A;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 4px 4px 0px 0px #0F172A;
  transition: all 150ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FFFFFF;
  border: 3px solid #0F172A;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 6px 6px 0px 0px #0F172A;
  transition: all 150ms ease;
}

.card:hover {
  box-shadow: 4px 4px 0px 0px #0F172A;
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 3px solid #0F172A;
  border-radius: 12px;
  font-size: 16px;
  transition: all 150ms ease;
}

.input:focus {
  outline: none;
  box-shadow: 4px 4px 0px 0px #0F172A;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: #FFFFFF;
  border: 3px solid #0F172A;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 8px 8px 0px 0px #0F172A;
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Neo-Brutalism

**Keywords:** Bold, energetic, block layout, geometric shapes, high color contrast, flat shadows, bold borders, modern

**Best For:** Startups, creative agencies, gaming, social media, youth-focused, entertainment, consumer

**Key Effects:**
- Bold 3px borders with black (#0F172A)
- Flat drop shadows (6px 6px 0px 0px)
- Hover effect: reduce shadow + translate (2px, 2px)
- High contrast between background and foreground
- Vivid color accents (green, red, amber, blue)

### Page Pattern

**Pattern Name:** Dashboard Layout

- **Conversion Strategy:** Two-column grid. Left sidebar for list/navigation. Right panel for detail/actions.
- **CTA Placement:** Action boxes per role
- **Section Order:** 1. Role selector, 2. Main content area, 3. Detail panel

---

## Anti-Patterns (Do NOT Use)

- ❌ Neumorphism or soft UI shadows
- ❌ Low contrast text
- ❌ Text-heavy pages

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (inline)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] Neo-brutalism style: bold borders, flat shadows
