# Typography

Typography plays a crucial role in shaping the look and feel of our design. It not only impacts readability but also establishes our brand identity.

This guide contains how to use font styles, sizes, and weights effectively across different elements, from headings and body text to small UI details.

## Font Family

Green Design System uses **SEB SanSerif** as its primary typeface, providing a cohesive and professional appearance across all interfaces.

## Weight

Font weight is an important tool in design that helps establish hierarchy, create emphasis, and improve readability of your design.

GDS – SEB SanSerif offers the weights:
- **Bold** (700)
- **Medium** (500)
- **Book** (450) - New weight
- **Regular** (400)
- **Light** (300)

Our styles primarily use the **middle spectrum** (Book 450 and Regular 400). Bold and light can be used in special cases for additional emphasis or subtlety.

## Size

Our type scale ranges from **82px down to 12px**, with each size serving a specific role in structuring information effectively.

## Style Hierarchy

Hierarchy is shown through changes in font weight, size, and colors. The type scale categorizes styles into five roles:

1. **Display** - Strong visual impact for hero content
2. **Heading** - Structural hierarchy (H1-H6)
3. **Preamble** - Summary text below headings
4. **Body** - Primary content text
5. **Detail** - UI elements and small text

---

## Typography Styles

### Display

Display text is meant to make a strong visual impact. This style is used sparingly, as they are designed for strong visual impact.

Display text is perfect when you need to raise the volume.

| Token | Font Size | Line Height | Weight |
|-------|-----------|-------------|--------|
| `display-2xl` | 82px | 90px | 450 (Book) |
| `display-xl` | 64px | 72px | 450 (Book) |
| `display-l` | 48px | 56px | 450 (Book) |
| `display-m` | 36px | 44px | 450 (Book) |
| `display-s` | 32px | 40px | 450 (Book) |

**Usage:**
- Hero sections
- Landing page headlines
- Marketing materials
- High-impact announcements

### Heading

Headings help establish a clear hierarchy in your layout. Heading levels range from H1 (largest) to H6 (smallest). Keep the size differences noticeable but balanced for a clean and cohesive design.

| Token | Font Size | Line Height | Weight |
|-------|-----------|-------------|--------|
| `heading-xl` | 32px | 44px | 450 (Book) |
| `heading-l` | 28px | 40px | 450 (Book) |
| `heading-m` | 24px | 32px | 450 (Book) |
| `heading-s` | 20px | 28px | 450 (Book) |
| `heading-xs` | 16px | 24px | 450 (Book) |
| `heading-2xs` | 14px | 20px | 450 (Book) |

**Usage:**
- Page titles (H1)
- Section headings (H2-H3)
- Component headers (H4-H5)
- Card titles (H6)

### Preamble

A preamble appears below a heading and serves as a summary for the content that follows. In terms of size, the preamble is generally larger than body text but smaller than headings.

| Token | Font Size | Line Height | Weight |
|-------|-----------|-------------|--------|
| `preamble-2xl` | 32px | 40px | 450 (Book) |
| `preamble-xl` | 28px | 36px | 450 (Book) |
| `preamble-l` | 24px | 32px | 450 (Book) |
| `preamble-m` | 20px | 28px | 450 (Book) |
| `preamble-s` | 18px | 26px | 450 (Book) |
| `preamble-xs` | 16px | 24px | 450 (Book) |

**Usage:**
- Article introductions
- Section summaries
- Lead paragraphs
- Subheadings with context

### Body

Body text is primarily used for longer passages of content, providing readability and clarity in paragraphs, articles, and other text-heavy contexts.

| Token | Font Size | Line Height | Weight |
|-------|-----------|-------------|--------|
| `body-medium-m` | 16px | 24px | 500 (Medium) |
| `body-medium-s` | 14px | 20px | 500 (Medium) |
| `body-book-m` | 16px | 24px | 450 (Book) |
| `body-book-s` | 14px | 20px | 450 (Book) |
| `body-regular-l` | 20px | 26px | 400 (Regular) |
| `body-regular-m` | 16px | 24px | 400 (Regular) |
| `body-italic-m` | 16px | 24px | 400 (Regular, Italic) |
| `body-italic-s` | 14px | 20px | 400 (Regular, Italic) |

**Usage:**
- Paragraph text
- Article content
- Descriptions
- Long-form content
- Emphasis (italic variants)

### Detail

The detail style is used for UI elements like buttons, form inputs, and tooltips. For size, detail text is set between 12px and 16px, depending on the component and context.

| Token | Font Size | Line Height | Weight |
|-------|-----------|-------------|--------|
| `detail-book-m` | 16px | 20px | 450 (Book) |
| `detail-book-s` | 14px | 20px | 450 (Book) |
| `detail-book-xs` | 12px | 16px | 450 (Book) |
| `detail-regular-m` | 16px | 20px | 400 (Regular) |
| `detail-regular-s` | 14px | 20px | 400 (Regular) |
| `detail-regular-xs` | 12px | 16px | 400 (Regular) |

**Usage:**
- Button labels
- Form labels
- Input placeholders
- Tooltips
- Captions
- Metadata
- Small UI text

---

## Pairings

Pairing the different text styles is key to creating a strong visual hierarchy. Equally important is proper spacing between these elements. It helps separate and define relationships between text styles, and ensures a natural reading rhythm.

### Common Pairings

#### Hero Section
```
Display (display-l or display-xl)
+ Preamble (preamble-l or preamble-xl)
+ Body (body-regular-m)
```

#### Article Page
```
Heading (heading-xl) - H1
+ Preamble (preamble-m)
+ Body (body-regular-m)
```

#### Card Component
```
Heading (heading-s) - Card title
+ Body (body-book-s) - Card description
+ Detail (detail-book-s) - Metadata
```

#### Form Section
```
Heading (heading-m) - Section title
+ Body (body-regular-m) - Instructions
+ Detail (detail-regular-s) - Field labels
```

---

## Using Typography Tokens

### Via CSS Custom Properties

Access typography tokens via CSS `var()` function:

```css
.my-heading {
  font-size: var(--gds-sys-text-heading-l-font-size);
  line-height: var(--gds-sys-text-heading-l-line-height);
  font-weight: var(--gds-sys-text-heading-l-font-weight);
}

.my-body {
  font-size: var(--gds-sys-text-body-regular-m-font-size);
  line-height: var(--gds-sys-text-body-regular-m-line-height);
  font-weight: var(--gds-sys-text-body-regular-m-font-weight);
}
```

### Via GdsText Component

Use the `GdsText` component with typography tokens:

```tsx
import { GdsText } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsText tag="h1" textStyle="heading-xl">Page Title</GdsText>
  <GdsText tag="p" textStyle="preamble-m">Introduction paragraph</GdsText>
  <GdsText tag="p" textStyle="body-regular-m">Body content</GdsText>
</GdsTheme>
```

### Via Style Expression Properties

Use typography properties on layout components:

```tsx
<GdsDiv 
  fontSize="heading-m"
  lineHeight="heading-m"
  fontWeight="heading-m"
>
  Section Title
</GdsDiv>
```

---

## Best Practices

### ✓ Do

- **Use semantic HTML**: Match heading styles with appropriate HTML tags (H1-H6)
- **Maintain hierarchy**: Use larger sizes for more important content
- **Consider line length**: Keep body text lines between 50-75 characters for optimal readability
- **Use spacing**: Add adequate spacing between typography elements (see [Spacing](./Spacing.md))
- **Pair consistently**: Use established pairings for consistency
- **Test readability**: Ensure sufficient contrast and legibility at all sizes

### ✗ Don't

- **Skip heading levels**: Don't jump from H1 to H3 without H2
- **Use too many styles**: Limit to 3-4 typography styles per page section
- **Make text too small**: Avoid detail styles for long-form content
- **Ignore line height**: Proper line height is crucial for readability
- **Use all caps excessively**: Reserve for specific UI elements like buttons

---

## Accessibility Considerations

### Font Size

- **Minimum size**: 12px for detail text, 14px for body text
- **Default body text**: 16px for optimal readability
- **Zoom support**: All typography should scale properly up to 200%

### Contrast

Ensure text meets WCAG contrast requirements:
- **Normal text** (< 18px): 4.5:1 contrast ratio
- **Large text** (≥ 18px or ≥ 14px bold): 3:1 contrast ratio

Use color tokens from [Colors](./Colors.md) to ensure proper contrast.

### Line Height

- **Body text**: 1.5 (24px for 16px text) for comfortable reading
- **Headings**: 1.2-1.4 for compact but readable headings
- **Detail text**: 1.2-1.4 for UI elements

### Semantic HTML

Always use semantic HTML elements:
- `<h1>` to `<h6>` for headings
- `<p>` for paragraphs
- `<strong>` for emphasis
- `<em>` for italic emphasis

---

## Examples

### Page Header

```tsx
import { GdsTheme, GdsText, GdsDiv } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsDiv marginBottom="5xl">
    <GdsText tag="h1" textStyle="display-l" marginBottom="m">
      Welcome to Green Banking
    </GdsText>
    <GdsText tag="p" textStyle="preamble-l" marginBottom="l">
      Experience modern banking with our comprehensive digital platform
    </GdsText>
    <GdsText tag="p" textStyle="body-regular-m">
      Get started by exploring our products and services designed to meet your financial needs.
    </GdsText>
  </GdsDiv>
</GdsTheme>
```

### Article Section

```tsx
<GdsTheme>
  <section>
    <GdsText tag="h2" textStyle="heading-xl" marginBottom="m">
      Section Title
    </GdsText>
    <GdsText tag="p" textStyle="preamble-s" marginBottom="l">
      A brief introduction to this section's content.
    </GdsText>
    <GdsText tag="p" textStyle="body-regular-m" marginBottom="m">
      This is the main body content. It provides detailed information about the topic
      and is designed for comfortable reading at length.
    </GdsText>
    <GdsText tag="p" textStyle="body-regular-m">
      Additional paragraphs continue with consistent spacing and typography.
    </GdsText>
  </section>
</GdsTheme>
```

### Card with Typography Hierarchy

```tsx
<GdsTheme>
  <GdsCard padding="l">
    <GdsText tag="h3" textStyle="heading-s" marginBottom="xs">
      Card Title
    </GdsText>
    <GdsText tag="p" textStyle="detail-book-s" marginBottom="m" 
             style={{ color: 'var(--gds-color-content-neutral-02)' }}>
      Published on January 15, 2025
    </GdsText>
    <GdsText tag="p" textStyle="body-book-s" marginBottom="l">
      Card description providing context and details about the content.
    </GdsText>
    <GdsButton>Read More</GdsButton>
  </GdsCard>
</GdsTheme>
```

### Form with Labels

```tsx
<GdsTheme>
  <GdsFlex direction="column" gap="l">
    <div>
      <GdsText tag="label" textStyle="detail-book-m" marginBottom="xs" display="block">
        Email Address
      </GdsText>
      <GdsInput type="email" placeholder="Enter your email" />
    </div>
    <div>
      <GdsText tag="label" textStyle="detail-book-m" marginBottom="xs" display="block">
        Password
      </GdsText>
      <GdsInput type="password" placeholder="Enter your password" />
      <GdsText tag="p" textStyle="detail-regular-xs" marginTop="xs"
               style={{ color: 'var(--gds-color-content-neutral-02)' }}>
        Must be at least 8 characters
      </GdsText>
    </div>
  </GdsFlex>
</GdsTheme>
```

---

## Related Documentation

- [Tokens](./Tokens.md) — Complete design token system including typography tokens
- [Colors](./Colors.md) — Color system for text colors and contrast
- [Spacing](./Spacing.md) — Spacing between typography elements
- [GdsText](./GdsText.md) — Typography component with built-in text styles
- [GdsRichText](./GdsRichText.md) — Rich text with automatic typography styling
- [Green Design System Architecture](./GreenDesignSystemArchitecture.md) — Overall system design principles
- [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md) — Style expression properties for typography
