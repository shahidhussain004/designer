# GdsImg

An image component that displays media with configurable dimensions, styling properties, and responsive behavior.

## Overview

GdsImg is a specialized image component that extends standard HTML image capabilities with Green Core's design system integration. It provides responsive image loading, aspect ratio control, object-fit styling, and full style expression property support.

**Key Features:**
- **Responsive Images**: srcset and sizes support for optimal loading
- **Aspect Ratio Control**: Token-based aspect ratios with responsive breakpoints
- **Object Fit**: Control how images fill their containers
- **Lazy Loading**: Built-in lazy loading support
- **Design Tokens**: Integrated border-radius, spacing, and sizing
- **Style Expressions**: Full style expression property support
- **Accessibility**: Required alt text for proper accessibility

## Import

```tsx
// Use as JSX element in React
import { GdsImg } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsImg 
    src="https://example.com/image.jpg"
    alt="Descriptive text"
  />
</GdsTheme>
```

## Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | `string` | `undefined` | The URL of the image. |
| `alt` | `string` | `undefined` | Alternative text description of the image. **Required for accessibility.** Should be empty string if image is decorative. |
| `srcset` | `string` | `undefined` | The srcset attribute for responsive images. Format: `"image.jpg 1x, image-2x.jpg 2x"` or `"image-320.jpg 320w, image-640.jpg 640w"` |
| `sizes` | `string` | `undefined` | The sizes attribute for responsive images. Format: `"(max-width: 320px) 280px, (max-width: 640px) 580px, 800px"` |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Loading strategy for the image. |
| `decoding` | `'auto' \| 'sync' \| 'async'` | `'auto'` | Decoding strategy for the image. |
| `gds-element` | `string` | `undefined` | The unscoped name of this element (read-only). |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `aspect-ratio` | `string` | `undefined` | Controls the aspect ratio of the image. Supports common ratios like `'16/9'`, `'4/3'`, `'1/1'`, etc. Can apply different ratios for different breakpoints: `"l{16/9} m{4/3} s{1/1}"` |
| `object-fit` | `string` | `undefined` | Controls the object-fit property of the image. Values: `'cover'`, `'contain'`, `'fill'`, `'none'`, `'scale-down'` |
| `object-position` | `string` | `undefined` | Controls the object-position of the image. Supports all CSS values like `'center'`, `'top left'`, `'50% 50%'` |
| `border-radius` | `string` | `undefined` | Controls border-radius using size tokens. Can apply per-corner: `"none none m m"` or per-breakpoint: `"s{xs} m{xs} l{s}"` |
| `opacity` | `string` | `undefined` | Controls the opacity of the image. Values from `'0'` to `'1'` |
| `isDefined` | `boolean` | `false` | Whether the element is defined in the custom element registry (read-only). |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only). |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of this element (read-only). |
| `gdsElementName` | `string` | `undefined` | Unscoped element name (read-only). |

### Style Expression Properties

| Property | Description |
|----------|-------------|
| `inset` | Controls the inset property. Supports all valid CSS inset values. |
| `position` | Controls the position property. Supports all valid CSS position values. |
| `transform` | Controls the transform property. Supports all valid CSS transform values. |
| `margin` | Controls the margin property. Only accepts space tokens. |
| `margin-inline` | Controls the margin-inline property. Only accepts space tokens. |
| `margin-block` | Controls the margin-block property. Only accepts space tokens. |
| `width` | Controls the width property. Supports space tokens and all valid CSS width values. |
| `min-width` | Controls the min-width property. Supports space tokens and all valid CSS values. |
| `max-width` | Controls the max-width property. Supports space tokens and all valid CSS values. |
| `inline-size` | Controls the inline-size property. Supports space tokens and all valid CSS values. |
| `min-inline-size` | Controls the min-inline-size property. Supports space tokens and all valid CSS values. |
| `max-inline-size` | Controls the max-inline-size property. Supports space tokens and all valid CSS values. |
| `height` | Controls the height property. Supports space tokens and all valid CSS height values. |
| `min-height` | Controls the min-height property. Supports space tokens and all valid CSS values. |
| `max-height` | Controls the max-height property. Supports space tokens and all valid CSS values. |
| `block-size` | Controls the block-size property. Supports space tokens and all valid CSS values. |
| `min-block-size` | Controls the min-block-size property. Supports space tokens and all valid CSS values. |
| `max-block-size` | Controls the max-block-size property. Supports space tokens and all valid CSS values. |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from the DOM. |

## Examples

### Basic Image

```tsx
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Product photo"
/>
```

### With Aspect Ratio

```tsx
// Fixed aspect ratio
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Landscape photo"
  aspect-ratio="16/9"
/>

// Responsive aspect ratios
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Adaptive image"
  aspect-ratio="l{16/9} m{4/3} s{1/1}"
/>
```

### Object Fit and Position

```tsx
// Cover - fills container, may crop
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Cover image"
  aspect-ratio="16/9"
  object-fit="cover"
/>

// Contain - fits within container, may show space
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Contained image"
  aspect-ratio="16/9"
  object-fit="contain"
/>

// With custom position
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Positioned image"
  aspect-ratio="16/9"
  object-fit="cover"
  object-position="top center"
/>
```

### Border Radius

```tsx
// Uniform radius
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Rounded image"
  border-radius="m"
/>

// Per-corner radius (top-left, top-right, bottom-right, bottom-left)
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Custom corners"
  border-radius="none none m m"
/>

// Responsive radius
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Responsive corners"
  border-radius="s{xs} m{s} l{m}"
/>
```

### Responsive Images with srcset

```tsx
// Basic responsive images
<GdsImg
  src="https://example.com/image-800.jpg"
  srcset="
    https://example.com/image-320.jpg 320w,
    https://example.com/image-480.jpg 480w,
    https://example.com/image-800.jpg 800w,
    https://example.com/image-1200.jpg 1200w
  "
  sizes="
    (max-width: 320px) 280px,
    (max-width: 480px) 440px,
    (max-width: 800px) 760px,
    100vw
  "
  alt="Responsive image example"
  aspect-ratio="16/9"
  object-fit="cover"
/>
```

### High-DPI Displays

```tsx
// Provide 2x and 3x versions for Retina displays
<GdsImg
  src="https://example.com/image.jpg"
  srcset="
    https://example.com/image.jpg 1x,
    https://example.com/image-2x.jpg 2x,
    https://example.com/image-3x.jpg 3x
  "
  alt="High-DPI image"
  aspect-ratio="16/9"
/>
```

### Lazy Loading

```tsx
// Lazy load (default)
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Lazy loaded image"
  loading="lazy"
/>

// Eager load for above-the-fold images
<GdsImg 
  src="https://example.com/hero.jpg"
  alt="Hero image"
  loading="eager"
/>
```

### Sizing and Spacing

```tsx
// Fixed width
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Fixed width"
  width="400px"
/>

// Max width with margin
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Constrained image"
  max-width="600px"
  margin="m"
/>

// Responsive sizing
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Responsive sizing"
  width="100%"
  max-width="800px"
  margin-inline="auto"
/>
```

### In Card Layouts

```tsx
<GdsCard>
  <GdsImg 
    src="https://example.com/product.jpg"
    alt="Product photo"
    aspect-ratio="16/9"
    object-fit="cover"
    border-radius="m m none none"
  />
  <GdsFlex flex-direction="column" gap="s" padding="m">
    <GdsText tag="h3" font="heading-m">Product Name</GdsText>
    <GdsText>Product description goes here...</GdsText>
    <GdsButton rank="primary">View Details</GdsButton>
  </GdsFlex>
</GdsCard>
```

### Image Gallery

```tsx
<GdsGrid columns="2" columns-md="3" columns-lg="4" gap="m">
  <GdsImg 
    src="https://example.com/gallery-1.jpg"
    alt="Gallery image 1"
    aspect-ratio="1/1"
    object-fit="cover"
    border-radius="s"
  />
  <GdsImg 
    src="https://example.com/gallery-2.jpg"
    alt="Gallery image 2"
    aspect-ratio="1/1"
    object-fit="cover"
    border-radius="s"
  />
  <GdsImg 
    src="https://example.com/gallery-3.jpg"
    alt="Gallery image 3"
    aspect-ratio="1/1"
    object-fit="cover"
    border-radius="s"
  />
  <GdsImg 
    src="https://example.com/gallery-4.jpg"
    alt="Gallery image 4"
    aspect-ratio="1/1"
    object-fit="cover"
    border-radius="s"
  />
</GdsGrid>
```

### Avatar/Profile Image

```tsx
<GdsImg 
  src="https://example.com/avatar.jpg"
  alt="User avatar"
  aspect-ratio="1/1"
  object-fit="cover"
  border-radius="max"
  width="64px"
  height="64px"
/>
```

### With Icon Placeholder

```tsx
<GdsFlex flex-direction="column" gap="s" align-items="center">
  <GdsImg 
    src="https://example.com/image.jpg"
    alt="User photo"
    aspect-ratio="1/1"
    object-fit="cover"
    border-radius="m"
    width="200px"
  />
  <GdsFlex gap="xs" align-items="center">
    <IconCamera size="s" color="secondary" />
    <GdsText font="detail-m" color="secondary">
      Upload new photo
    </GdsText>
  </GdsFlex>
</GdsFlex>
```

### Hero Image

```tsx
<GdsImg 
  src="https://example.com/hero.jpg"
  srcset="
    https://example.com/hero-800.jpg 800w,
    https://example.com/hero-1200.jpg 1200w,
    https://example.com/hero-1600.jpg 1600w,
    https://example.com/hero-2400.jpg 2400w
  "
  sizes="100vw"
  alt="Hero banner"
  aspect-ratio="21/9"
  object-fit="cover"
  loading="eager"
/>
```

### Decorative Image

```tsx
// Empty alt for decorative images
<GdsImg 
  src="https://example.com/decoration.jpg"
  alt=""
  aspect-ratio="16/9"
  object-fit="cover"
  opacity="0.3"
/>
```

## TypeScript Types

```tsx
// GdsImg props interface
interface GdsImgProps {
  // Required attributes
  src: string
  alt: string  // Required for accessibility
  
  // Optional attributes
  srcset?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'auto' | 'sync' | 'async'
  
  // Properties
  'aspect-ratio'?: string
  'object-fit'?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  'object-position'?: string
  'border-radius'?: string
  opacity?: string
  
  // Style expression properties
  inset?: string
  position?: string
  transform?: string
  margin?: string
  'margin-inline'?: string
  'margin-block'?: string
  width?: string
  'min-width'?: string
  'max-width'?: string
  'inline-size'?: string
  'min-inline-size'?: string
  'max-inline-size'?: string
  height?: string
  'min-height'?: string
  'max-height'?: string
  'block-size'?: string
  'min-block-size'?: string
  'max-block-size'?: string
}

// Usage example
const ProductImage = ({ product }: { product: Product }) => {
  return (
    <GdsImg 
      src={product.imageUrl}
      srcset={`${product.imageUrl} 1x, ${product.imageUrl2x} 2x`}
      alt={product.name}
      aspect-ratio="16/9"
      object-fit="cover"
      border-radius="m"
      width="100%"
      max-width="600px"
    />
  )
}
```

## Common Aspect Ratios

| Ratio | Use Case |
|-------|----------|
| `1/1` | Square - avatars, thumbnails, social media |
| `4/3` | Classic - standard photos, presentations |
| `16/9` | Widescreen - videos, modern displays, hero images |
| `21/9` | Ultra-wide - cinematic banners |
| `3/2` | Photography - DSLR camera standard |
| `2/3` | Portrait - vertical content |

## Best Practices

### Accessibility
- **Always provide alt text**: Use descriptive `alt` attributes for meaningful images
- **Empty alt for decorative**: Use `alt=""` for purely decorative images
- **Descriptive text**: Describe what's important, not just what's visible
- **Avoid "image of"**: Screen readers already announce it's an image

```tsx
// Good
<GdsImg src="..." alt="Woman presenting financial charts to team" />

// Bad
<GdsImg src="..." alt="Image of woman" />

// Decorative (empty alt)
<GdsImg src="..." alt="" />
```

### Performance
- **Use lazy loading**: Default `loading="lazy"` for below-the-fold images
- **Eager load hero images**: Use `loading="eager"` for above-the-fold content
- **Optimize file sizes**: Compress images appropriately
- **Responsive images**: Use `srcset` and `sizes` for optimal loading
- **Modern formats**: Consider WebP or AVIF for better compression

### Responsive Images
- **Width descriptors**: Use `srcset` with `w` descriptors for fluid images
- **Pixel density**: Use `1x`, `2x`, `3x` for fixed-size images
- **Sizes attribute**: Tell browser which size to use at different viewports
- **Breakpoint alignment**: Match `sizes` to your layout breakpoints

### Styling
- **Aspect ratios**: Use token-based ratios for consistency
- **Object fit**: `cover` for filling space, `contain` for showing entire image
- **Border radius**: Use size tokens (`xs`, `s`, `m`, `l`, `xl`) for consistency
- **Spacing**: Use margin properties with space tokens

## Related Components

- [GdsVideo](./GdsVideo.md) — Video component with similar aspect ratio and object-fit controls
- [GdsMask](./GdsMask.md) — Gradient overlays over images
- [GdsCard](./GdsCard.md) — Card containers with images
- [GdsGrid](./GdsGrid.md) — Grid layouts for image galleries
- [GdsFlex](./GdsFlex.md) — Flexible layouts with images
- [GdsDiv](./GdsDiv.md) — Generic container component
- [Icons](./Icons.md) — Icon components for image placeholders

## Accessibility Guidelines

### Required Alt Text
All images must have an `alt` attribute. This is not optional for accessibility compliance.

```tsx
// Content image - descriptive alt
<GdsImg 
  src="account-summary.png"
  alt="Account balance summary showing available funds"
/>

// Decorative image - empty alt
<GdsImg 
  src="decorative-pattern.png"
  alt=""
/>

// Linked image - describe destination
<a href="/products">
  <GdsImg 
    src="products.jpg"
    alt="View all products"
  />
</a>
```

### Color Contrast
- Ensure text overlays on images meet WCAG contrast requirements
- Use overlays or gradients to improve contrast when needed
- Test with actual content, not placeholder images

### Loading States
- Consider loading indicators for slow connections
- Provide dimensions to prevent layout shifts
- Use `aspect-ratio` to reserve space before image loads

## Notes

- **Lazy loading default**: Images use `loading="lazy"` by default for performance
- **Aspect ratio preserves space**: Setting `aspect-ratio` prevents layout shift during load
- **Style expressions**: Full support for Green Core style expression properties
- **Responsive**: Use `srcset` and `sizes` for optimal image delivery
- **Token-based styling**: Use size tokens for consistent spacing and border radius
- **Object fit behavior**: `cover` may crop, `contain` may show space
- **Breakpoint syntax**: Use format `"l{value} m{value} s{value}"` for responsive properties
- **Alt text required**: Always provide `alt` attribute for accessibility compliance

---

*Last updated: November 12, 2025*  
*Green Core version: 2.12.0+*  
*Documentation source: [Storybook Image Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-image--docs)*
