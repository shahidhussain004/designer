# Colors

Color is a powerful tool in design, shaping hierarchy, guiding attention, and reinforcing brand identity. In Green, colors work alongside whitespace and typography to create clarity and balance.

## Designing with Colors

Based on our brand colors, we have developed a comprehensive palette of tints for each one. These extended palettes allow for greater versatility and nuance, ensuring consistency and depth across all visual elements.

Colors in Green are translated to work in both **light and dark mode**. This adaptation preserves contrast, readability, and the overall visual integrity of the interface.

## GDS Color Structure

The colors are structured into four groups:
- **Background** (divided into three levels: L1, L2, L3)
- **Content**
- **Border**
- **State**

This structured approach ensures clear visual hierarchy, making it easy to design interfaces with depth and contrast while maintaining flexibility across different layouts.

## Background Colors and Levels

Background colors are grouped by their level in the interface:

- **L1** – The base layer of the screen
- **L2** – Structural layers like cards and modals
- **L3** – Backgrounds for components like buttons and inputs

This structure supports clarity, consistency, and a clear visual hierarchy.

## Content Colors

Content colors are used for text, icons, and other foreground elements. They guarantee readability and clear contrast against the background.

## Border Colors

Border colors are used to define the edges of components and layout sections. They help separate content and add structure to the interface.

## State Colors

State colors provide visual feedback for interactions. We have defined an extensive set of tokens to support customization across components. For example: primary, secondary, and tertiary buttons.

---

## Color Tokens Reference

### Background · L1

Base layer of the screen.

| Token | Light | Dark |
|-------|-------|------|
| `neutral-01` | `#FFFFFF` | `#0A0B0B` |
| `neutral-02` | `#F4F5F5` | `#0A0B0B` |
| `brand-01` | `#003824` | `#003824` |
| `inversed` | `#0A0B0B` | `#FFFFFF` |

### Background · L2

Structural layers like cards and modals.

| Token | Light | Dark |
|-------|-------|------|
| `neutral-01` | `#F7F8F7` | `#191A1A` |
| `neutral-02` | `#FFFFFF` | `#191A1A` |
| `neutral-03` | `#0A0B0B` | `#3B3F3E` |
| `brand-01` | `#003824` | `#003824` |
| `brand-02` | `#F8F6F1` | `#231D10` |
| `positive-01` | `#F1F9F1` | `#003D26` |
| `negative-01` | `#FEF7F6` | `#451207` |
| `warning-01` | `#FEF8F1` | `#482A05` |
| `information-01` | `#F7F8F7` | `#1E201F` |
| `notice-01` | `#F5FAFF` | `#00294D` |

### Background · L3

Backgrounds for components like buttons and inputs.

| Token | Light | Dark |
|-------|-------|------|
| `brand-01` | `#003824` | `#D5D7D7` |
| `brand-02` | `#EFE9DC` | `#EFE9DC` |
| `brand-03` | `#E7DDCB` | `#E7DDCB` |
| `neutral-01` | `#0A0B0B` | `#D5D7D7` |
| `neutral-02` | `#EAEBEB` | `#282A29` |
| `neutral-03` | `#D5D7D7` | `#3B3F3E` |
| `neutral-04` | `#FFFFFF` | `#3B3F3E` |
| `neutral-05` | `#FFFFFF` | `#003824` |
| `positive-01` | `#027839` | `#026436` |
| `positive-02` | `#DCEFDC` | `#015130` |
| `positive-03` | `#CCEACC` | `#003D26` |
| `negative-01` | `#B92F13` | `#A22911` |
| `negative-02` | `#FDEBE8` | `#731D0C` |
| `negative-03` | `#FAD8D1` | `#5C170A` |
| `notice-01` | `#005FB3` | `#005FB3` |
| `notice-02` | `#E6F3FF` | `#004480` |
| `notice-03` | `#CCE7FF` | `#003666` |
| `warning-01` | `#8F530A` | `#F19E38` |
| `warning-02` | `#FCE8CF` | `#774508` |
| `warning-03` | `#FADCB7` | `#5F3707` |
| `information-01` | `#0A0B0B` | `#D5D7D7` |
| `information-02` | `#EAEBEB` | `#313533` |
| `information-03` | `#DFE1E1` | `#595F5D` |
| `disabled-01` | `#EFF0F0` | `#595F5D` |
| `disabled-02` | `#A0A6A4` | `#595F5D` |
| `disabled-03` | `#EFF0F0` | `#818886` |

### Content

Content colors for text, icons, and other foreground elements.

| Token | Light | Dark |
|-------|-------|------|
| `neutral-01` | `#0A0B0B` | `#F7F8F7` |
| `neutral-02` | `#636967` | `#ABB0AE` |
| `neutral-03` | `#FFFFFF` | `#0A0B0B` |
| `neutral-04` | `#A0A6A4` | `#595F5D` |
| `inversed` | `#FFFFFF` | `#F7F8F7` |
| `brand-01` | `#003824` | `#003824` |
| `brand-02` | `#685631` | `#D6C7A8` |
| `positive-01` | `#027839` | `#8AE58D` |
| `positive-02` | `#EAF6EA` | `#027839` |
| `positive-03` | `#026436` | `#8AE58D` |
| `negative-01` | `#B92F13` | `#F08975` |
| `negative-02` | `#FDEBE8` | `#F5B0A3` |
| `warning-01` | `#8F530A` | `#F5B970` |
| `warning-02` | `#FCE8CF` | `#FCE8CF` |
| `notice-01` | `#005FB3` | `#66B8FF` |
| `notice-02` | `#E6F3FF` | `#99CFFF` |
| `disabled-01` | `#A0A6A4` | `#CACECC` |
| `disabled-02` | `#F7F8F7` | `#CACECC` |

### Border

Border colors to define edges of components and layout sections.

| Token | Light | Dark |
|-------|-------|------|
| `interactive` | `#777E7C` | `#A0A6A4` |
| `subtle-01` | `#DFE1E1` | `#454A48` |
| `subtle-02` | `#EFF0F0` | `#282A29` |
| `strong` | `#0A0B0B` | `#F7F8F7` |
| `inverse` | `#FFFFFF` | `#FFFFFF` |
| `information-01` | `#0A0B0B` | `#636967` |
| `positive-01` | `#027839` | `#8AE58D` |
| `negative-01` | `#B92F13` | `#F08975` |
| `warning-01` | `#8F530A` | `#F5B970` |
| `notice-01` | `#005FB3` | `#66B8FF` |
| `information-02` | `rgba(10, 11, 11, 0.4)` | `rgba(99, 105, 103, 0.4)` |
| `positive-02` | `rgba(2, 120, 57, 0.4)` | `rgba(138, 229, 141, 0.4)` |
| `negative-02` | `rgba(185, 47, 19, 0.4)` | `rgba(240, 137, 117, 0.4)` |
| `warning-02` | `rgba(143, 83, 10, 0.4)` | `rgba(245, 185, 112, 0.4)` |
| `notice-02` | `rgba(0, 95, 179, 0.4)` | `rgba(102, 184, 255, 0.4)` |

### State

State colors for visual feedback during interactions.

| Token | Light | Dark |
|-------|-------|------|
| `brand-01` | `rgba(255, 255, 255, 0.2)` | `rgba(0, 0, 0, 0.2)` |
| `brand-02` | `rgba(255, 255, 255, 0.35)` | `rgba(0, 0, 0, 0.3)` |
| `brand-03` | `rgba(0, 56, 36, 0.06)` | `rgba(0, 56, 36, 0.3)` |
| `brand-04` | `rgba(0, 56, 36, 0.14)` | `rgba(0, 56, 36, 0.7)` |
| `brand-05` | `rgba(0, 56, 36, 0.06)` | `rgba(0, 56, 36, 0.5)` |
| `brand-06` | `rgba(0, 56, 36, 0.14)` | `rgba(0, 56, 36, 0.9)` |
| `neutral-01` | `rgba(255, 255, 255, 0.2)` | `rgba(0, 0, 0, 0.2)` |
| `neutral-02` | `rgba(255, 255, 255, 0.35)` | `rgba(0, 0, 0, 0.35)` |
| `neutral-03` | `rgba(0, 0, 0, 0.06)` | `rgba(255, 255, 255, 0.2)` |
| `neutral-04` | `rgba(0, 0, 0, 0.14)` | `rgba(255, 255, 255, 0.3)` |
| `neutral-05` | `rgba(0, 0, 0, 0.06)` | `rgba(255, 255, 255, 0.12)` |
| `neutral-06` | `rgba(0, 0, 0, 0.14)` | `rgba(255, 255, 255, 0.25)` |
| `positive-01` | `rgba(255, 255, 255, 0.12)` | `rgba(0, 0, 0, 0.12)` |
| `positive-02` | `rgba(255, 255, 255, 0.23)` | `rgba(0, 0, 0, 0.23)` |
| `positive-03` | `rgba(2, 120, 57, 0.08)` | `rgba(255, 255, 255, 0.08)` |
| `positive-04` | `rgba(2, 120, 57, 0.16)` | `rgba(255, 255, 255, 0.14)` |
| `positive-05` | `rgba(2, 120, 57, 0.08)` | `rgba(2, 120, 57, 0.3)` |
| `positive-06` | `rgba(2, 120, 57, 0.16)` | `rgba(2, 120, 57, 0.5)` |
| `negative-01` | `rgba(255, 255, 255, 0.08)` | `rgba(0, 0, 0, 0.15)` |
| `negative-02` | `rgba(255, 255, 255, 0.16)` | `rgba(0, 0, 0, 0.3)` |
| `negative-03` | `rgba(185, 47, 19, 0.08)` | `rgba(255, 255, 255, 0.08)` |
| `negative-04` | `rgba(185, 47, 19, 0.16)` | `rgba(255, 255, 255, 0.14)` |
| `negative-05` | `rgba(185, 47, 19, 0.08)` | `rgba(185, 47, 19, 0.3)` |
| `negative-06` | `rgba(185, 47, 19, 0.16)` | `rgba(185, 47, 19, 0.45)` |
| `notice-01` | `rgba(255, 255, 255, 0.2)` | `rgba(0, 0, 0, 0.12)` |
| `notice-02` | `rgba(255, 255, 255, 0.35)` | `rgba(0, 0, 0, 0.2)` |
| `notice-03` | `rgba(0, 95, 179, 0.08)` | `rgba(255, 255, 255, 0.06)` |
| `notice-04` | `rgba(0, 95, 179, 0.16)` | `rgba(255, 255, 255, 0.1)` |
| `notice-05` | `rgba(0, 95, 179, 0.08)` | `rgba(0, 95, 179, 0.4)` |
| `notice-06` | `rgba(0, 95, 179, 0.16)` | `rgba(0, 95, 179, 0.6)` |
| `warning-01` | `rgba(255, 255, 255, 0.2)` | `rgba(0, 0, 0, 0.06)` |
| `warning-02` | `rgba(255, 255, 255, 0.35)` | `rgba(0, 0, 0, 0.14)` |
| `warning-03` | `rgba(143, 83, 10, 0.08)` | `rgba(255, 255, 255, 0.08)` |
| `warning-04` | `rgba(143, 83, 10, 0.16)` | `rgba(255, 255, 255, 0.14)` |
| `warning-05` | `rgba(143, 83, 10, 0.08)` | `rgba(241, 158, 56, 0.12)` |
| `warning-06` | `rgba(143, 83, 10, 0.16)` | `rgba(241, 158, 56, 0.2)` |

## Usage Guidelines

### Hierarchy and Contrast

Use the three-level background system to create clear visual hierarchy:
- **L1** for the base canvas
- **L2** for elevated surfaces (cards, panels)
- **L3** for interactive elements (buttons, inputs)

### Accessibility

Always ensure sufficient contrast between content colors and their backgrounds. The token system is designed to maintain WCAG-compliant contrast ratios in both light and dark modes.

### State Feedback

Use state colors consistently to provide visual feedback:
- **Brand** states for primary actions
- **Positive** for success states
- **Negative** for error states
- **Warning** for caution states
- **Notice** for informational states

### Dark Mode

All color tokens automatically adapt to dark mode when used within a `<gds-theme>` component. The system preserves visual hierarchy and contrast while adapting to the user's preference.

## Examples

### Using Background Levels

```tsx
import { GdsTheme, GdsCard, GdsButton } from '@sebgroup/green-core/react'

<GdsTheme>
  {/* L1: Base layer */}
  <div style={{ backgroundColor: 'var(--gds-color-l1-background-neutral-01)' }}>
    {/* L2: Card/Modal layer */}
    <GdsCard style={{ backgroundColor: 'var(--gds-color-l2-background-neutral-01)' }}>
      <h2>Card Title</h2>
      {/* L3: Component layer */}
      <GdsButton>Action</GdsButton>
    </GdsCard>
  </div>
</GdsTheme>
```

### Using Content Colors

```tsx
<GdsTheme>
  <h1 style={{ color: 'var(--gds-color-content-neutral-01)' }}>Primary Heading</h1>
  <p style={{ color: 'var(--gds-color-content-neutral-02)' }}>Secondary text</p>
</GdsTheme>
```

### Using State Colors

```tsx
<GdsTheme>
  <GdsButton 
    variant="primary"
    style={{
      backgroundColor: 'var(--gds-color-l3-background-brand-01)',
      '--hover-bg': 'var(--gds-color-state-brand-03)'
    }}
  >
    Brand Action
  </GdsButton>
</GdsTheme>
```

## Related Documentation

- [Tokens](./Tokens.md) — Complete design token system including spacing, typography, and shadows
- [GdsTheme](./GdsTheme.md) — Theme provider for light/dark mode and color scheme switching
- [Green Design System Architecture](./GreenDesignSystemArchitecture.md) — Overall system design principles
- [GdsButton](./GdsButton.md) — Button component using color tokens
- [GdsCard](./GdsCard.md) — Card component demonstrating L2 background usage
- [GdsAlert](./GdsAlert.md) — Alert component using state colors
