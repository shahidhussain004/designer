# GdsCardPattern01

A pre-styled card component pattern built on top of GdsCard, providing consistent layout for linked and non-linked content cards with headers, images, and actions.

> **Related Components**: See also [GdsCard](./GdsCard.md) for the base card container, [GdsButton](./GdsButton.md) for action buttons, and [GdsLink](./GdsLink.md) for navigation links.
> 
> **Architecture**: See [Green Design System Architecture](./GreenDesignSystemArchitecture.md) for understanding how patterns and compound components fit into the system.

## Features

- **Linked and non-linked variants**: Full card clickable or independent footer actions
- **Header with image or custom content**: Flexible header slot with image support
- **Configurable image aspect ratio**: Landscape (16:9) or square (1:1) formats
- **Optional footer with actions**: Support for buttons, links, or decorative elements
- **Three appearance styles**: Neutral-01, neutral-02, and outlined variants
- **Two content size options**: Large and small padding sizes
- **Responsive images**: Built-in srcset and sizes support
- **Accessibility-first**: Proper heading levels, alt text, and semantic HTML

## Import

```tsx
// Use as JSX element(s) in React
import { GdsCardPattern01 } from '@sebgroup/green-core/react'
```

## Slots

| Slot | Description |
|------|-------------|
| `header` | Custom header content (icons, badges, etc.) |
| `footer` | Action items (buttons, links) |
| (default) | Additional content placed in the card body |

## Quick Example

```tsx
<GdsCardPattern01 
  href="/path"
  title="Card Title"
  excerpt="Card description with label in footer."
  label="Read more"
  src="https://api.seb.io/assets/launch-hero.jpg"
></GdsCardPattern01>
```

## Public API

This table lists all public attributes, properties, methods, events and slots of the component.

> **Note**: JS properties and DOM attributes have different naming conventions in Green Core (camelCase vs snake-case), so some of them will show up under both sections, even though they refer to the same underlying property.

### Control Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `max-width` | `string` | `'320px'` | Maximum width of the card |
| `appearance` | `string` | `'neutral'` | Visual style variant |
| `aspectRatio` | `string` | `'landscape'` | Aspect ratio for the image |
| `size` | `string` | `'large'` | Content padding size |

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | `string` | `undefined` | URL that the link points to. Can be absolute, relative, or fragment identifier |
| `title` | `string` | `''` | The main title of the card |
| `excerpt` | `string` | `''` | A brief description or summary text |
| `label` | `string` | `''` | Optional label text used on the linked card footer decorative element |
| `src` | `string` | `undefined` | The URL of the image |
| `variant` | `'neutral-01'` \| `'neutral-02'` | `'neutral-01'` | Card background variant |
| `outlined` | `boolean` | `false` | Enables border styling (designed to work with neutral-02 variant) |
| `tag` | `'h1'` \| `'h2'` \| `'h3'` \| `'h4'` \| `'h5'` \| `'h6'` | `'h2'` | HTML tag for the card title. Controls heading level for accessibility |
| `target` | `'_self'` \| `'_blank'` \| `'_parent'` \| `'_top'` | `undefined` | Specifies where to open the linked document |
| `rel` | `string` | `undefined` | Specifies the relationship between the current document and the linked document. Automatically adds security-related values when `target="_blank"` |
| `download` | `string` \| `boolean` | `undefined` | When present, indicates that the linked resource should be downloaded |
| `srcset` | `string` | `undefined` | The srcset attribute for responsive images. Format: `"image.jpg 1x, image-2x.jpg 2x"` or `"image-320.jpg 320w, image-640.jpg 640w"` |
| `sizes` | `string` | `undefined` | The sizes attribute for responsive images. Format: `"(max-width: 320px) 280px, (max-width: 640px) 580px, 800px"` |
| `alt` | `string` | `undefined` | Alternative text description of the image. Required for accessibility. Should be empty string if image is decorative |
| `loading` | `'lazy'` \| `'eager'` | `'lazy'` | Loading strategy for the image |
| `decoding` | `'auto'` \| `'sync'` \| `'async'` | `'auto'` | Decoding strategy for the image |
| `aspect-ratio` | `'landscape'` \| `'square'` | `'landscape'` | Aspect ratio/format of the card's media section. **landscape**: 16:9 or similar horizontal format; **square**: 1:1 square format |
| `gds-element` | `string` | `undefined` | The unscoped name of this element (read-only) |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ratio` | `'landscape'` \| `'square'` | `'landscape'` | Aspect ratio/format of the card's media section |
| `#rel` | `string` | `undefined` | Internal rel property |
| `isDefined` | `boolean` | `false` | Whether the element is defined in the custom element registry |
| `styleExpressionBaseSelector` | `string` | `':host'` | Style expression properties for this element will use this selector by default |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | The semantic version of this element. Can be used for troubleshooting to verify the version being used |
| `gdsElementName` | `string` | `undefined` | The unscoped name of this element (read-only) |

### Declarative Layout / Style Expression Properties

> **See also**: [GdsDiv](./GdsDiv.md) for complete style expression property reference

| Property | Description |
|----------|-------------|
| `width` | Controls the width property. Supports space tokens and all valid CSS width values |
| `min-width` | Controls the min-width property |
| `max-width` | Controls the max-width property |
| `inline-size` | Controls the inline-size property |
| `min-inline-size` | Controls the min-inline-size property |
| `max-inline-size` | Controls the max-inline-size property |
| `margin` | Controls the margin property. Only accepts space tokens |
| `margin-inline` | Controls the margin-inline property |
| `margin-block` | Controls the margin-block property |
| `align-self` | Controls the align-self property |
| `justify-self` | Controls the justify-self property |
| `place-self` | Controls the place-self property |
| `grid-column` | Controls the grid-column property |
| `grid-row` | Controls the grid-row property |
| `grid-area` | Controls the grid-area property |
| `flex` | Controls the flex property |
| `order` | Controls the order property |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from the DOM |

### Slots

| Slot | Description |
|------|-------------|
| `header` | Custom header content |
| `footer` | Action items (buttons, links) |
| (default) | Additional content placed in the card body |

---

## Usage Examples

### Default

Linked card with image, title, excerpt, and footer label.

```html
<gds-card-pattern-01
  href="/path"
  title="Card Title"
  excerpt="Card description with label in footer."
  label="Read more"
  src="https://api.seb.io/assets/launch-hero.jpg"
></gds-card-pattern-01>
```

### Header Variants

**Basic**: Text-only layout for simple content  
**Image**: Image-based presentation  
**Custom**: Slotted content when no image present

```html
<!-- Basic Layout -->
<gds-card-pattern-01
  title="Basic Layout"
  excerpt="Simple card with title and description"
  href="#"
  label="Learn more"
></gds-card-pattern-01>

<!-- Image Content -->
<gds-card-pattern-01
  title="Image Content"
  excerpt="Enhanced with featured image"
  src="image.jpg"
  href="#"
  label="Learn more"
></gds-card-pattern-01>

<!-- Custom Header -->
<gds-card-pattern-01
  title="Custom Header"
  excerpt="Flexible header slot for custom content"
>
  <gds-icon-cloudy-sun size="xl" slot="header"></gds-icon-cloudy-sun>
</gds-card-pattern-01>
```

### Image Configuration

- **Landscape (16:9)**: Default for featured content
- **Square (1:1)**: Alternative for specific layouts
- **Responsive images**: with srcset/sizes
- **Accessibility**: Alt text inherits from card's alt property
- **Performance**: Supports `loading="lazy"` and `decoding="async"` attributes

> **Note**: Image properties can be set directly on the card element.

```html
<gds-card-pattern-01
  src="image.jpg"
  alt="Descriptive text"
  loading="lazy"
  decoding="async"
  srcset="image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 800px) 100vw, 800px"
></gds-card-pattern-01>

<!-- Landscape with responsive images -->
<gds-card-pattern-01
  title="Landscape image"
  alt="The image alt"
  excerpt="16:9 aspect ratio"
  src="image.jpg"
  aspect-ratio="landscape"
  srcset="image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 800px) 100vw, 800px"
></gds-card-pattern-01>

<!-- Square aspect ratio -->
<gds-card-pattern-01
  title="Square image"
  alt="The image alt"
  excerpt="1:1 aspect ratio"
  src="image.jpg"
  aspect-ratio="square"
></gds-card-pattern-01>
```

### Content Options

- **Title tag**: Supports h1-h6 (default: h2) for proper document structure. Does not affect font size
- **Excerpt**: Optional description with 3-line limit and ellipsis
- **Label**: Custom text for linked card's footer (requires href)

```html
<!-- Custom heading level -->
<gds-card-pattern-01
  title="Heading"
  tag="h3"
></gds-card-pattern-01>

<!-- Without excerpt -->
<gds-card-pattern-01
  title="Title Only"
  href="#"
></gds-card-pattern-01>

<!-- With excerpt and custom label -->
<gds-card-pattern-01
  title="Title"
  excerpt="Description with three line limit"
  href="#"
  label="View Details"
></gds-card-pattern-01>

<!-- Custom heading level -->
<gds-card-pattern-01
  title="Heading Level"
  excerpt="Using h3 tag for accessibility"
  tag="h3"
></gds-card-pattern-01>

<!-- Title only -->
<gds-card-pattern-01
  title="Without Excerpt"
  href="#"
  src="https://api.seb.io/assets/launch-hero.jpg"
></gds-card-pattern-01>

<!-- Long excerpt with custom label -->
<gds-card-pattern-01
  title="With Excerpt"
  excerpt="Long description text that demonstrates the three line limit with automatic truncation using ellipsis when content exceeds the available space"
  href="#"
  label="View Details"
></gds-card-pattern-01>
```

### Footer Variants

- **Default**: Non-interactive link indicator
- **Decorative**: Visual elements without interaction
- **Clean**: No footer elements

> **Note**: When `href` is present, all footer content is inert as the entire card becomes clickable.

```html
<!-- Default Link Footer -->
<gds-card-pattern-01
  title="Linked Card"
  excerpt="Entire card acts as a single clickable element, footer link is visual only"
  href="#"
  label="Learn more"
  src="https://api.seb.io/assets/launch-hero.jpg"
></gds-card-pattern-01>

<!-- Decorative Button -->
<gds-card-pattern-01
  title="Visual Indicator"
  excerpt="Demonstrates non-interactive button in footer when card is linked"
  href="#"
  src="https://api.seb.io/assets/launch-hero.jpg"
>
  <gds-button rank="secondary" slot="footer" size="small" inert>
    <gds-icon-chevron-right size="m"></gds-icon-chevron-right>
  </gds-button>
</gds-card-pattern-01>

<!-- No Footer -->
<gds-card-pattern-01
  title="Minimal Linked Card"
  excerpt="Linked card without footer elements for clean presentation"
  href="#"
  src="https://api.seb.io/assets/launch-hero.jpg"
></gds-card-pattern-01>
```

### Footer Actions

- **Multiple Buttons**: For separate clickable actions
- **Single link**: For standalone navigation
- **Combined**: Mix of button and link interactions

> **Note**: Without `href`, each footer element is independently interactive.

```html
<!-- Multiple Actions -->
<gds-card-pattern-01
  title="Multiple actions"
  excerpt="Card with two interactive buttons for primary and secondary actions"
  src="https://api.seb.io/assets/launch-hero.jpg"
>
  <gds-button slot="footer">Primary</gds-button>
  <gds-button slot="footer" rank="secondary">Secondary</gds-button>
</gds-card-pattern-01>

<!-- Mixed Actions -->
<gds-card-pattern-01
  title="Combined actions"
  excerpt="Card showing both button and link interactions in footer"
  src="https://api.seb.io/assets/launch-hero.jpg"
>
  <gds-button slot="footer">Action</gds-button>
  <gds-link href="#" slot="footer" size="medium">
    <gds-icon-chain-link slot="lead"></gds-icon-chain-link>
    Navigate
  </gds-link>
</gds-card-pattern-01>

<!-- Single Action -->
<gds-card-pattern-01
  title="Single link"
  excerpt="Card with one interactive link in footer for navigation"
  src="https://api.seb.io/assets/launch-hero.jpg"
>
  <gds-link href="#" slot="footer" size="medium">
    Navigate
    <gds-icon-arrow-right slot="trail"></gds-icon-arrow-right>
  </gds-link>
</gds-card-pattern-01>
```

### Variants

```html
<!-- Neutral 01 (default) -->
<gds-card-pattern-01
  title="Neutral"
  excerpt="Default style"
></gds-card-pattern-01>

<!-- Neutral 02 -->
<gds-card-pattern-01
  variant="neutral-02"
  title="Outlined"
  excerpt="With border"
></gds-card-pattern-01>

<!-- Neutral 02 · Outlined -->
<gds-card-pattern-01
  variant="neutral-02"
  outlined
  title="Plain"
  excerpt="No border"
></gds-card-pattern-01>
```

### Theme Support

Cards automatically adapt to light and dark themes when wrapped in `gds-theme` provider.

```html
<!-- Light theme -->
<gds-theme color-scheme="light">
  <gds-card-pattern-01
    title="Light mode"
    excerpt="Card on light mode"
    appearance="outlined"
    href="#"
    label="Learn more"
  ></gds-card-pattern-01>
</gds-theme>

<!-- Dark theme -->
<gds-theme color-scheme="dark">
  <gds-card-pattern-01
    title="Dark mode"
    excerpt="Card on dark mode"
    appearance="outlined"
    href="#"
    label="Learn more"
  ></gds-card-pattern-01>
</gds-theme>
```

---

## Accessibility

- **Heading Levels**: Use the `tag` attribute to set appropriate heading levels (h1-h6) for document structure
- **Alt Text**: Always provide descriptive `alt` text for images, or use empty string for decorative images
- **Link Behavior**: When `href` is set, the entire card becomes a single interactive element for better keyboard and screen reader navigation
- **Footer Actions**: When card is not linked, footer buttons and links are independently focusable and interactive

## Best Practices

1. **Use semantic heading levels**: Set `tag` attribute based on document outline (e.g., `tag="h3"` if card is under an h2 section)
2. **Provide meaningful alt text**: Describe the image content for screen readers and when images fail to load
3. **Choose card vs actions carefully**: Use linked cards (`href`) for single-destination navigation; use footer actions for multiple operations
4. **Responsive images**: Use `srcset` and `sizes` for better performance across devices
5. **Keep excerpts concise**: Text automatically truncates at 3 lines; write summaries that work within this constraint

## Related Components

- **[GdsCard](./GdsCard.md)** — Base card container with flexible styling
- **[GdsButton](./GdsButton.md)** — Primary action buttons for card footers
- **[GdsLink](./GdsLink.md)** — Navigation links for card footers
- **[GdsImg](./GdsImg.md)** — Responsive image component
- **[GdsGrid](./GdsGrid.md)** — Layout grid for arranging multiple cards
- **[Icons](./Icons.md)** — Icon library for header and footer decorations
