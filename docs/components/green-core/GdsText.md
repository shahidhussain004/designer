# GdsText````markdown

# GdsText Component Reference

A typography component that extends GdsDiv with the ability to set an internal tag name (h1, h2, p, span, etc.), apply font styles from the design system, and control text-specific properties like line clamping, decoration, and wrapping behavior.

> **Declarative Layout**: See [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md) for understanding style expression properties available on this component.

## Official Green Core API Documentation

Style expression properties apply to the outer element unless otherwise specified.

This document provides a quick reference for the `GdsText` component based on the official Green Core API.

## Import

---

```typescript

import { GdsText } from '@sebgroup/green-core/react'## Key Properties

```

### `tag` (string, default: 'span')

## Basic UsageControls the HTML tag of the text element. Supports all valid HTML tags.



```tsx**Common values:**

import { GdsText, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings

- `p` - Paragraph

<GdsTheme>- `span` - Inline text

  <GdsFlex flex-direction="column" gap="m">- `em`, `mark`, `strong`, `small` - Text formatting

    <GdsText font="display-l">display-l</GdsText>

    <GdsText font="body-regular-m">body-regular-m</GdsText>**Note:** When using heading tags (`h1`-`h6`), the component automatically applies predefined sizes based on design tokens:

    <GdsText font="detail-regular-s">detail-regular-s</GdsText>- `h1` → `heading-xl`

  </GdsFlex>- `h2` → `heading-l`

</GdsTheme>- `h3` → `heading-m`

```- And so on...



## Public API### `font` (string)

Style Expression Property that controls the font style based on design tokens.

### Attributes

**Available font tokens:**

| Name | Type | Default | Description |- **Display:** `display-l`, `display-m`, `display-s`

|------|------|---------|-------------|- **Heading:** `heading-xl`, `heading-l`, `heading-m`, `heading-s`, `heading-xs`

| `tag` | `string` | `'span'` | Controls the tag of the text. Supports all valid HTML tags like h1, h2, h3, h4, h5, h6, p, span, em, mark, strong, small, etc. |- **Body:** `body-regular-l`, `body-regular-m`, `body-regular-s`, `body-semibold-l`, `body-semibold-m`, `body-semibold-s`

| `level` | `GdsColorLevel` | `'2'` | The level of the container used to resolve color tokens. Default for gds-div is level 2. Check Color System documentation for more information. |- **Detail:** `detail-regular-l`, `detail-regular-m`, `detail-regular-s`, `detail-semibold-l`, `detail-semibold-m`, `detail-semibold-s`

| `gds-element` | `string` | `undefined` | The unscoped element name (read-only, set automatically) |

**Example:**

### Properties```tsx

<GdsText tag="h1" font="heading-xl">Main Title</GdsText>

| Name | Type | Default | Description |<GdsText tag="p" font="body-regular-m">Body text</GdsText>

|------|------|---------|-------------|<GdsText tag="span" font="detail-semibold-s">Small detail</GdsText>

| `font` | `string` | `undefined` | Style Expression Property that controls the font property. Supports all font tokens from the design system. |```

| `text-transform` | `string` | `undefined` | Controls the text-transform property of the text. Supports all valid CSS text-transform values. |

| `text-decoration` | `string` | `undefined` | Controls the text-decoration property of the inner element. Supports all valid CSS text-decoration values. |### `level` (GdsColorLevel, default: '2')

| `lines` | `number` | `undefined` | Controls the number of lines to show (line clamping). Can be any number value. |The level of the container used to resolve color tokens from the corresponding level. Check the Color System documentation for more information.

| `overflow-wrap` | `string` | `undefined` | Style Expression Property for overflow-wrap. Supports all valid CSS overflow-wrap values (normal, anywhere, break-word). |

| `white-space` | `string` | `undefined` | Style Expression Property for white-space. Supports all valid CSS white-space values (normal, nowrap, pre, pre-wrap, pre-line, wrap, collapse, preserve, etc.). |**Example:**

| `aspect-ratio` | `string` | `undefined` | Style Expression Property for aspect-ratio. Supports all valid CSS aspect-ratio values. |```tsx

| `cursor` | `string` | `undefined` | Style Expression Property for cursor. Supports all valid CSS cursor values. |<GdsDiv level="1">

| `pointer-events` | `string` | `undefined` | Style Expression Property for pointer-events. Supports all valid CSS pointer-events values. |  <GdsText level="1" color="neutral-01">Level 1 text</GdsText>

| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry (read-only) |</GdsDiv>

| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only) |

| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of this element (read-only) |<GdsDiv level="2">

| `gdsElementName` | `string` | `undefined` | Unscoped name of this element (read-only) |  <GdsText level="2" color="neutral-01">Level 2 text</GdsText>

</GdsDiv>

### Style Expression Properties```



GdsText extends GdsDiv and supports all style expression properties:---



#### Typography### Inline usage inside paragraphs

- `font` — Font style based on design tokens (display-l, body-regular-m, etc.)

- `font-weight` — Font weight from typography weight tokensWhen embedding a `GdsText` element inside another `GdsText` (for example a `strong` element inside a paragraph), the nested element may render as a block depending on the default `tag` or styling. To ensure the nested text stays on the same line, set `display="inline"` on the nested `GdsText`.



#### SizingExample:

- `width` — Width with space tokens or CSS values```tsx

- `min-width` — Minimum width with space tokens or CSS values<GdsText tag="p">This is a paragraph with an inline <GdsText tag="strong" display="inline">important phrase</GdsText> that remains on the same line.</GdsText>

- `max-width` — Maximum width with space tokens or CSS values```

- `inline-size` — Inline size with space tokens or CSS values

- `min-inline-size` — Minimum inline size with space tokens or CSS values---

- `max-inline-size` — Maximum inline size with space tokens or CSS values

- `height` — Height with space tokens or CSS values---

- `min-height` — Minimum height with space tokens or CSS values

- `max-height` — Maximum height with space tokens or CSS values### `lines` (number)

- `block-size` — Block size with space tokens or CSS valuesControls the number of lines to show (useful for text truncation).

- `min-block-size` — Minimum block size with space tokens or CSS values

- `max-block-size` — Maximum block size with space tokens or CSS values**Example:**

```tsx

#### Spacing<GdsText lines={3} font="body-regular-m">

- `margin` — All margins (space tokens only)  This text will be truncated after 3 lines...

- `margin-inline` — Inline margins (space tokens only)</GdsText>

- `margin-block` — Block margins (space tokens only)```

- `padding` — All padding (space tokens only)

- `padding-inline` — Inline padding (space tokens only)## Text Styling Properties

- `padding-block` — Block padding (space tokens only)

### `text-transform` (string)

#### Positioning & LayoutControls the text-transform CSS property.

- `align-self` — Alignment within parent flex/grid container

- `justify-self` — Justification within parent grid container**Valid values:** `uppercase`, `lowercase`, `capitalize`, `none`

- `place-self` — Shorthand for align-self and justify-self

- `position` — CSS position property**Example:**

- `transform` — CSS transform property```tsx

- `inset` — CSS inset property<GdsText text-transform="uppercase">uppercase text</GdsText>

```

#### Grid Layout

- `grid-column` — Grid column placement### `text-decoration` (string)

- `grid-row` — Grid row placementControls the text-decoration CSS property.

- `grid-area` — Grid area placement

**Valid values:** `underline`, `overline`, `line-through`, `underline dotted`, etc.

#### Flexbox

- `flex` — Flex grow, shrink, and basis**Example:**

- `order` — Order in flex container```tsx

<GdsText text-decoration="underline">Underlined text</GdsText>

#### Display & Appearance<GdsText text-decoration="line-through">Strikethrough text</GdsText>

- `display` — CSS display property```

- `color` — Text color (color tokens with optional transparency: tokenName/transparency)

- `background` — Background color (color tokens with optional transparency)### `font-weight` (string)

- `border` — Border property (format: "size solid color/transparency", size accepts space tokens, color accepts color tokens)Controls the font-weight CSS property.

- `border-color` — Border color (color tokens with optional transparency)

- `border-width` — Border width (space tokens only)**Valid values:** `light`, `normal`, `medium`, `bold`, or numeric values

- `border-style` — Border style (CSS values)

- `border-radius` — Border radius (space tokens only)---

- `box-shadow` — Shadow tokens (xs, s, m, l, xl)

- `opacity` — CSS opacity values## Layout Style Expression Properties

- `overflow` — CSS overflow values

- `box-sizing` — CSS box-sizing valuesThese properties use kebab-case naming (e.g., `margin-bottom`, not `marginBottom`):

- `z-index` — CSS z-index values

### Margin & Padding

#### Text Layout- `margin`, `margin-top`, `margin-right`, `margin-bottom`, `margin-left`

- `text-align` — Text alignment- `padding`, `padding-top`, `padding-right`, `padding-bottom`, `padding-left`

- `text-wrap` — Text wrapping behavior (wrap, nowrap, pretty, balance, stable)

- `gap` — Gap between flex/grid items (space tokens only)**Token values:** `4xs`, `3xs`, `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl`, `4xl`



#### Flexbox Container**Example:**

- `align-items` — Flex/grid item alignment```tsx

- `align-content` — Flex/grid content alignment<GdsText margin-bottom="m" padding="s">Text with spacing</GdsText>

- `justify-content` — Flex/grid content justification```

- `justify-items` — Grid item justification

- `flex-direction` — Flex direction### Display & Layout

- `flex-wrap` — Flex wrapping- `display` - Controls CSS display property

- `place-items` — Shorthand for align-items and justify-items- `width`, `height`, `max-width`, `max-height`, `min-width`, `min-height`

- `place-content` — Shorthand for align-content and justify-content- `aspect-ratio` - Controls aspect ratio

- `overflow-wrap` - Controls overflow wrapping

### Events- `white-space` - Controls white-space CSS property



| Name | Type | Description |### Positioning & Behavior

|------|------|-------------|- `cursor` - Controls cursor style

| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from DOM |- `pointer-events` - Controls pointer events



## Examples---



### Font Variants## Color System



```tsxUse the `level` property to resolve color tokens from the design system's color levels.

import { GdsText, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'

**Example:**

<GdsTheme>```tsx

  <GdsFlex flex-direction="column" gap="m"><GdsDiv level="1">

    <GdsText font="display-l">display-l</GdsText>  <GdsText level="1" color="neutral-01">Level 1 text</GdsText>

    <GdsText font="body-regular-m">body-regular-m</GdsText></GdsDiv>

    <GdsText font="detail-regular-s">detail-regular-s</GdsText>

  </GdsFlex><GdsDiv level="2">

</GdsTheme>  <GdsText level="2" color="neutral-01">Level 2 text</GdsText>

```</GdsDiv>

```

### HTML Tag Variants

---

The `tag` property controls the inner element tag name. Different tags have default styles that can be overridden with font and other style properties:

## Events

```tsx

import { GdsText, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'### `gds-element-disconnected`

Fired when the element is disconnected from the DOM.

<GdsTheme>

  <GdsFlex flex-direction="column" gap="2xl">**Type:** `CustomEvent`

    <GdsFlex flex-direction="column" gap="m">

      <GdsText>Span (Default)</GdsText>---

      <GdsText tag="p">Paragraph</GdsText>

      <GdsText tag="em">Em</GdsText>## Usage Examples

      <GdsText tag="mark">Mark</GdsText>

      <GdsText tag="strong">Strong</GdsText>### Basic Heading with Custom Font

      <GdsText tag="small">Small</GdsText>```tsx

    </GdsFlex><GdsText tag="h1" font="heading-xl" margin-bottom="m">

      SEB Banking Forms

    <GdsFlex flex-direction="column" gap="m"></GdsText>

      <GdsText tag="h1">H1</GdsText>```

      <GdsText tag="h2">H2</GdsText>

      <GdsText tag="h3">H3</GdsText>### Paragraph with Color Level

      <GdsText tag="h4">H4</GdsText>```tsx

      <GdsText tag="h5">H5</GdsText><GdsText tag="p" font="body-regular-l" level="2" margin-bottom="l">

      <GdsText tag="h6">H6</GdsText>  Welcome to the application.

    </GdsFlex></GdsText>

  </GdsFlex>```

</GdsTheme>

```### Truncated Text

```tsx

### Headings with Predefined Sizes<GdsText lines={2} font="body-regular-m" text-decoration="none">

  This is a long text that will be truncated after 2 lines with an ellipsis...

Headings in GdsText come with predefined sizes based on design tokens. The `tag` property defines the heading level, and the appropriate size is automatically applied:</GdsText>

```

- `h1` → `heading-xl`

- `h2` → `heading-l`### Styled Inline Text

- `h3` → `heading-m````tsx

- `h4` → `heading-s`<GdsText 

- `h5` → `heading-xs`  tag="span" 

- `h6` → `heading-2xs`  font="detail-semibold-s" 

  text-transform="uppercase"

The `font` property can still be used to override the default size:  text-decoration="underline"

>

```tsx  Important Note

import { GdsText, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'</GdsText>

```

<GdsTheme>

  <GdsFlex flex-direction="column" gap="m">### Text with Custom Width

    <GdsText tag="h6">H6: heading-2xs</GdsText>```tsx

    <GdsText tag="h5">H5: heading-xs</GdsText><GdsText 

    <GdsText tag="h4">H4: heading-s</GdsText>  tag="p" 

    <GdsText tag="h3">H3: heading-m</GdsText>  font="body-regular-m" 

    <GdsText tag="h2">H2: heading-l</GdsText>  max-width="600px"

    <GdsText tag="h1">H1: heading-xl</GdsText>  overflow-wrap="break-word"

  </GdsFlex>>

</GdsTheme>  This text has a maximum width and will wrap long words.

```</GdsText>

```

### Color with Level System

---

The `color` property changes text color based on specified color token. Use `level` property to resolve color tokens from the design system:

## Important Notes

```tsx

import { GdsText, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'1. **Naming Convention:**

   - DOM attributes use kebab-case: `margin-bottom`, `text-transform`

<GdsTheme>   - JS properties use camelCase (when accessing via JS): `marginBottom`, `textTransform`

  <GdsFlex flex-direction="column" gap="m">

    <GdsTheme color-scheme="dark">2. **Heading Auto-sizing:**

      <GdsFlex    - When using heading tags (`h1`-`h6`), the component automatically applies appropriate font sizes

        level="1"    - You can override these with the `font` property if needed

        background="neutral-01" 

        border-radius="xs" 3. **Style Expression Properties:**

        padding="xl"    - Most layout and styling properties are "Style Expression Properties"

        display="flex"    - They support design tokens (like `m`, `l`, `xl`) or standard CSS values

        flex-direction="column"   - Use kebab-case in TSX/JSX: `margin-bottom="m"`

      >

        <GdsText level="1" color="neutral-01" font="body-s">4. **Default Tag:**

          Color: Content 01   - Default is `span` with `body-m` size

        </GdsText>   - Always specify `tag` for semantic HTML

      </GdsFlex>

      ---

      <GdsFlex 

        level="1" ## Design System Integration

        background="neutral-02" 

        border-radius="xs" For complete design token reference, check:

        padding="xl" - Studio on seb.io

        display="flex" - Storybook: https://storybook.seb.io/latest/core/

        flex-direction="column"- Color System documentation

      >

        <GdsText level="1" color="neutral-02" font="body-m">---

          Color: Content Secondary

        </GdsText>*Last updated: October 23, 2025*

      </GdsFlex>*Green Core version: 2.12.0*

      

      <GdsFlex ````

        level="1" ````markdown

        background="neutral-03" # GdsText Component Reference

        border-radius="xs" 

        padding="xl" ## Official Green Core API Documentation

        display="flex" 

        flex-direction="column"This document provides a quick reference for the `GdsText` component based on the official Green Core API.

      >

        <GdsText level="1" color="neutral-03" font="body-l">---

          Color: Content Tertiary

        </GdsText>## Key Properties

      </GdsFlex>

    </GdsTheme>### `tag` (string, default: 'span')

  </GdsFlex>Controls the HTML tag of the text element. Supports all valid HTML tags.

</GdsTheme>

```**Common values:**

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings

### Text Decoration- `p` - Paragraph

- `span` - Inline text

The `text-decoration` property supports all CSS text-decoration values including underline, overline, line-through, dotted, and wavy styles:- `em`, `mark`, `strong`, `small` - Text formatting



```tsx**Note:** When using heading tags (`h1`-`h6`), the component automatically applies predefined sizes based on design tokens:

import { GdsText, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'- `h1` → `heading-xl`

- `h2` → `heading-l`

<GdsTheme>- `h3` → `heading-m`

  <GdsFlex flex-direction="column" gap="m">- And so on...

    <GdsText text-decoration="underline">Underline</GdsText>

    <GdsText text-decoration="overline">Overline</GdsText>### `font` (string)

    <GdsText text-decoration="line-through">Line Through</GdsText>Style Expression Property that controls the font style based on design tokens.

    <GdsText text-decoration="underline dotted">Dotted</GdsText>

    <GdsText text-decoration="currentcolor wavy underline">**Available font tokens:**

      Wavy Underline- **Display:** `display-l`, `display-m`, `display-s`

    </GdsText>- **Heading:** `heading-xl`, `heading-l`, `heading-m`, `heading-s`, `heading-xs`

  </GdsFlex>- **Body:** `body-regular-l`, `body-regular-m`, `body-regular-s`, `body-semibold-l`, `body-semibold-m`, `body-semibold-s`

</GdsTheme>- **Detail:** `detail-regular-l`, `detail-regular-m`, `detail-regular-s`, `detail-semibold-l`, `detail-semibold-m`, `detail-semibold-s`

```

**Example:**

### Line Clamping```tsx

<GdsText tag="h1" font="heading-xl">Main Title</GdsText>

The `lines` property clamps text to the specified number of lines. It can be any number value:<GdsText tag="p" font="body-regular-m">Body text</GdsText>

<GdsText tag="span" font="detail-semibold-s">Small detail</GdsText>

```tsx```

import { GdsText, GdsTheme, GdsFlex, GdsDivider } from '@sebgroup/green-core/react'

### `level` (GdsColorLevel, default: '2')

<GdsTheme>The level of the container used to resolve color tokens from the corresponding level. Check the Color System documentation for more information.

  <GdsFlex flex-direction="column" gap="2xl">

    <GdsFlex flex-direction="column" gap="m">**Example:**

      <GdsDivider />```tsx

      <GdsText font="body-s">Lines: 2</GdsText><GdsDiv level="1">

      <GdsText font="display-s" lines={2}>  <GdsText level="1" color="neutral-01">Level 1 text</GdsText>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</GdsDiv>

        eiusmod tempor incididunt ut labore et dolore magna aliqua.

      </GdsText><GdsDiv level="2">

    </GdsFlex>  <GdsText level="2" color="neutral-01">Level 2 text</GdsText>

    </GdsDiv>

    <GdsFlex flex-direction="column" gap="m">```

      <GdsDivider />

      <GdsText font="body-s">Lines: 3</GdsText>---

      <GdsText font="display-m" lines={3}>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do### Inline usage inside paragraphs

        eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem

        ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodWhen embedding a `GdsText` element inside another `GdsText` (for example a `strong` element inside a paragraph), the nested element may render as a block depending on the default `tag` or styling. To ensure the nested text stays on the same line, set `display="inline"` on the nested `GdsText`.

        tempor incididunt ut labore et dolore magna aliqua.

      </GdsText>Example:

    </GdsFlex>```tsx

    <GdsText tag="p">This is a paragraph with an inline <GdsText tag="strong" display="inline">important phrase</GdsText> that remains on the same line.</GdsText>

    <GdsFlex flex-direction="column" gap="m">```

      <GdsDivider />

      <GdsText font="body-s">Lines: 4</GdsText>---

      <GdsText font="display-l" lines={4}>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do<!-- trimmed for brevity in file copy -->

        eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem

        ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod## Related Components

        tempor incididunt ut labore et dolore magna aliqua.

      </GdsText>- [GdsDiv](./GdsDiv.md) — Base container component (GdsText extends this)

    </GdsFlex>- [GdsLink](./GdsLink.md) — For inline links within text content

  </GdsFlex>- [GdsMask](./GdsMask.md) — For typography within gradient overlays

</GdsTheme>- [GdsFormattedAccount](./GdsFormattedAccount.md) — Formatted account numbers (extends GdsText)

```- [GdsFormattedDate](./GdsFormattedDate.md) — Formatted dates and times (extends GdsText)

- [GdsFormattedNumber](./GdsFormattedNumber.md) — Formatted numbers and currency (extends GdsText)

### Text Wrap- [GdsGroupedList](./GdsGroupedList.md) — For text in structured lists

- [GdsFlex](./GdsFlex.md) — For layout of text elements

The `text-wrap` property controls text wrapping behavior. Check [MDN documentation on text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap) for details.- [GdsCard](./GdsCard.md) — For text within cards

- [GdsDivider](./GdsDivider.md) — For separating text sections

Supported values: `wrap`, `nowrap`, `pretty`, `balance`, `stable`- [GdsButton](./GdsButton.md) — For button text styling

- [Icons](./Icons.md) — For icons within text content

```tsx

import { GdsText, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'*Last updated: October 23, 2025*

*Green Core version: 2.12.0*

<GdsTheme>

  <GdsFlex flex-direction="column" gap="m" width="250px">````

    <GdsFlex flex-direction="column">
      <GdsText tag="small" color="secondary">wrap</GdsText>
      <GdsText text-wrap="wrap">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </GdsText>
    </GdsFlex>
    
    <GdsFlex flex-direction="column">
      <GdsText tag="code" color="secondary">nowrap</GdsText>
      <GdsText text-wrap="nowrap">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </GdsText>
    </GdsFlex>
    
    <GdsFlex flex-direction="column">
      <GdsText tag="code" color="secondary">pretty</GdsText>
      <GdsText text-wrap="pretty">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </GdsText>
    </GdsFlex>
    
    <GdsFlex flex-direction="column">
      <GdsText tag="code" color="secondary">balance</GdsText>
      <GdsText text-wrap="balance">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </GdsText>
    </GdsFlex>
    
    <GdsFlex flex-direction="column">
      <GdsText tag="code" color="secondary">stable</GdsText>
      <GdsText text-wrap="stable">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </GdsText>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### Overflow Wrap

The `overflow-wrap` property controls text overflow behavior. Check [MDN documentation on overflow-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap) for details.

Supported values: `normal`, `anywhere`, `break-word`

```tsx
import { GdsText, GdsTheme, GdsFlex } from '@sebgreen/green-core/react'

<GdsTheme>
  <GdsFlex flex-direction="column" gap="m">
    <GdsFlex flex-direction="column">
      <GdsText tag="small" color="secondary">Normal</GdsText>
      <GdsText overflow-wrap="normal" font="heading-xl">
        Most words are short & don't need to break. But
        Antidisestablishmentarianism is long. The width is set to min-content,
        with a max-width of 11em.
      </GdsText>
    </GdsFlex>
    
    <GdsFlex flex-direction="column">
      <GdsText tag="small" color="secondary">Anywhere</GdsText>
      <GdsText overflow-wrap="anywhere" font="heading-xl">
        Most words are short & don't need to break. But
        Antidisestablishmentarianism is long. The width is set to min-content,
        with a max-width of 11em.
      </GdsText>
    </GdsFlex>
    
    <GdsFlex flex-direction="column">
      <GdsText tag="small" color="secondary">Break Word</GdsText>
      <GdsText overflow-wrap="break-word" font="heading-xl">
        Most words are short & don't need to break. But
        Antidisestablishmentarianism is long. The width is set to min-content,
        with a max-width of 11em.
      </GdsText>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### White Space

The `white-space` property supports all valid CSS white-space values. Check [MDN documentation on white-space](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space) for details.

Supported values: `normal`, `nowrap`, `pre`, `pre-wrap`, `pre-line`, `wrap`, `collapse`, `preserve`, and combinations

```tsx
import { GdsText, GdsTheme, GdsFlex, GdsDivider } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsFlex flex-direction="column" gap="m">
    <GdsFlex flex-direction="column">
      <GdsText tag="small" color="secondary">normal</GdsText>
      <GdsText white-space="normal" font="heading-xl">
        Most words are short & don't need to break. But
        Antidisestablishmentarianism is long.
      </GdsText>
    </GdsFlex>
    
    <GdsFlex flex-direction="column">
      <GdsText tag="small" color="secondary">pre</GdsText>
      <GdsText white-space="pre" font="heading-xl">
        Most words are short & don't need to break. But
        Antidisestablishmentarianism is long.
      </GdsText>
    </GdsFlex>
    
    <GdsFlex flex-direction="column">
      <GdsText tag="small" color="secondary">pre-wrap</GdsText>
      <GdsText white-space="pre-wrap" font="heading-xl">
        Most words are short & don't need to break. But
        Antidisestablishmentarianism is long.
      </GdsText>
    </GdsFlex>
    
    <GdsDivider />
    <GdsText>Shorthand</GdsText>
    
    <GdsFlex flex-direction="column">
      <GdsText tag="small" color="secondary">wrap</GdsText>
      <GdsText white-space="wrap" font="heading-xl">
        Most words are short & don't need to break. But
        Antidisestablishmentarianism is long.
      </GdsText>
    </GdsFlex>
    
    <GdsFlex flex-direction="column">
      <GdsText tag="small" color="secondary">collapse</GdsText>
      <GdsText white-space="collapse" font="heading-xl">
        Most words are short & don't need to break. But
        Antidisestablishmentarianism is long.
      </GdsText>
    </GdsFlex>
    
    <GdsFlex flex-direction="column">
      <GdsText tag="small" color="secondary">preserve nowrap</GdsText>
      <GdsText white-space="preserve nowrap" font="heading-xl">
        Most words are short & don't need to break. But
        Antidisestablishmentarianism is long.
      </GdsText>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### Inline Text within Paragraphs

When embedding a GdsText element inside another GdsText (e.g., a `strong` element inside a paragraph), the nested element may render as a block. To ensure nested text stays on the same line, set `display="inline"`:

```tsx
import { GdsText } from '@sebgroup/green-core/react'

<GdsText tag="p">
  This is a paragraph with an inline{' '}
  <GdsText tag="strong" display="inline">important phrase</GdsText>
  {' '}that remains on the same line.
</GdsText>
```

## TypeScript

```typescript
import type { GdsTextProps } from '@sebgroup/green-core/react'

interface GdsTextProps {
  // Attributes
  tag?: string
  level?: GdsColorLevel
  'gds-element'?: string

  // Typography Properties
  font?: string
  'text-transform'?: string
  'text-decoration'?: string
  lines?: number
  'overflow-wrap'?: string
  'white-space'?: string
  'font-weight'?: string

  // Style Expression Properties - Sizing
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

  // Style Expression Properties - Spacing
  margin?: string
  'margin-inline'?: string
  'margin-block'?: string
  padding?: string
  'padding-inline'?: string
  'padding-block'?: string

  // Style Expression Properties - Positioning
  'align-self'?: string
  'justify-self'?: string
  'place-self'?: string
  position?: string
  transform?: string
  inset?: string

  // Style Expression Properties - Grid
  'grid-column'?: string
  'grid-row'?: string
  'grid-area'?: string

  // Style Expression Properties - Flexbox
  flex?: string
  order?: string

  // Style Expression Properties - Appearance
  display?: string
  color?: string
  background?: string
  border?: string
  'border-color'?: string
  'border-width'?: string
  'border-style'?: string
  'border-radius'?: string
  'box-shadow'?: string
  opacity?: string
  overflow?: string
  'box-sizing'?: string
  'z-index'?: string
  'aspect-ratio'?: string
  cursor?: string
  'pointer-events'?: string

  // Style Expression Properties - Text
  'text-align'?: string
  'text-wrap'?: string

  // Style Expression Properties - Layout
  gap?: string
  'align-items'?: string
  'align-content'?: string
  'justify-content'?: string
  'justify-items'?: string
  'flex-direction'?: string
  'flex-wrap'?: string
  'place-items'?: string
  'place-content'?: string

  // Events
  onGdsElementDisconnected?: (event: CustomEvent) => void

  // Children
  children?: React.ReactNode
}

// Usage example
const textProps: GdsTextProps = {
  tag: 'h1',
  font: 'heading-xl',
  color: 'neutral-01',
  'margin-block': 'm'
}
```

## Best Practices

### Semantic HTML

1. **Use Appropriate Tags**: Always use semantic HTML tags that match the content purpose:
   ```tsx
   // ✅ Good - semantic heading
   <GdsText tag="h1" font="heading-xl">Page Title</GdsText>
   
   // ❌ Bad - non-semantic
   <GdsText font="heading-xl">Page Title</GdsText>
   ```

2. **Heading Hierarchy**: Maintain proper heading hierarchy (h1 → h2 → h3, etc.):
   ```tsx
   <GdsText tag="h1">Main Title</GdsText>
   <GdsText tag="h2">Section Title</GdsText>
   <GdsText tag="h3">Subsection Title</GdsText>
   ```

3. **Paragraph vs Span**: Use `p` for paragraphs, `span` for inline text:
   ```tsx
   // ✅ Good - paragraph
   <GdsText tag="p">This is a paragraph of text.</GdsText>
   
   // ✅ Good - inline emphasis
   <GdsText tag="p">
     This is a paragraph with <GdsText tag="strong" display="inline">emphasis</GdsText>.
   </GdsText>
   ```

### Typography

1. **Font Tokens**: Use design system font tokens instead of custom sizes:
   ```tsx
   // ✅ Good - design token
   <GdsText font="body-regular-m">Body text</GdsText>
   
   // ❌ Bad - custom CSS
   <GdsText style={{ fontSize: '16px' }}>Body text</GdsText>
   ```

2. **Heading Auto-Sizing**: Let heading tags use their default sizes unless override is necessary:
   ```tsx
   // ✅ Good - uses default heading-xl for h1
   <GdsText tag="h1">Title</GdsText>
   
   // ⚠️ Override only when needed
   <GdsText tag="h1" font="heading-m">Smaller Title</GdsText>
   ```

3. **Font Weight**: Use font-weight tokens from the design system:
   ```tsx
   <GdsText font-weight="medium">Medium weight text</GdsText>
   ```

### Color System

1. **Use Level System**: Use the `level` property with color tokens:
   ```tsx
   <GdsDiv level="1">
     <GdsText level="1" color="neutral-01">Level 1 text</GdsText>
   </GdsDiv>
   ```

2. **Transparency**: Use the token/transparency format for colors:
   ```tsx
   <GdsText color="neutral-01/0.8">Semi-transparent text</GdsText>
   ```

### Text Control

1. **Line Clamping**: Use `lines` property for controlled text truncation:
   ```tsx
   // ✅ Good - controlled truncation
   <GdsText lines={3}>Long text that truncates...</GdsText>
   
   // ❌ Bad - manual CSS overflow
   <GdsText style={{ overflow: 'hidden' }}>Text...</GdsText>
   ```

2. **Text Wrapping**: Use `text-wrap` for better typography:
   ```tsx
   // ✅ Good - balanced wrapping for headings
   <GdsText tag="h2" text-wrap="balance">
     This Heading Will Have Balanced Line Breaks
   </GdsText>
   
   // ✅ Good - pretty wrapping for body text
   <GdsText tag="p" text-wrap="pretty">
     This paragraph will have optimized line breaks for readability.
   </GdsText>
   ```

3. **Overflow Wrap**: Use `overflow-wrap` for long words:
   ```tsx
   <GdsText overflow-wrap="break-word">
     Text with verylongwordslikethiswillbreakcorrectly
   </GdsText>
   ```

### Layout & Spacing

1. **Space Tokens**: Always use space tokens for margins and padding:
   ```tsx
   // ✅ Good - space token
   <GdsText margin-block="m" padding="s">Text</GdsText>
   
   // ❌ Bad - arbitrary value
   <GdsText style={{ margin: '15px' }}>Text</GdsText>
   ```

2. **Logical Properties**: Prefer logical properties (margin-block, margin-inline) for internationalization:
   ```tsx
   // ✅ Good - logical properties
   <GdsText margin-block="m" padding-inline="s">Text</GdsText>
   
   // ⚠️ Less flexible - physical properties
   <GdsText margin-top="m" margin-bottom="m">Text</GdsText>
   ```

### Inline Content

1. **Display Inline**: Set `display="inline"` for nested inline text:
   ```tsx
   <GdsText tag="p">
     Normal text with <GdsText tag="strong" display="inline">bold</GdsText> inline.
   </GdsText>
   ```

2. **Text Decoration**: Use `text-decoration` for underlines, not CSS:
   ```tsx
   // ✅ Good
   <GdsText text-decoration="underline">Underlined</GdsText>
   
   // ❌ Bad
   <GdsText style={{ textDecoration: 'underline' }}>Underlined</GdsText>
   ```

## Common Use Cases

### Page Title with Spacing

```tsx
import { GdsText } from '@sebgroup/green-core/react'

<GdsText 
  tag="h1" 
  font="heading-xl" 
  margin-block="xl" 
  text-wrap="balance"
>
  SEB Banking Forms
</GdsText>
```

### Body Paragraph with Line Clamp

```tsx
import { GdsText } from '@sebgroup/green-core/react'

<GdsText 
  tag="p" 
  font="body-regular-m" 
  lines={3}
  text-wrap="pretty"
  max-width="600px"
>
  This is a long paragraph that will be clamped to 3 lines with an ellipsis.
  The text will wrap nicely using the pretty algorithm for better readability.
</GdsText>
```

### Card Description with Color

```tsx
import { GdsText, GdsCard } from '@sebgroup/green-core/react'

<GdsCard level="1" padding="l">
  <GdsText 
    tag="h3" 
    font="heading-s" 
    margin-block="0 s"
  >
    Card Title
  </GdsText>
  <GdsText 
    tag="p" 
    font="body-regular-s" 
    level="1" 
    color="neutral-02"
    margin-block="0"
  >
    Secondary description text with level-based coloring
  </GdsText>
</GdsCard>
```

### Emphasized Inline Text

```tsx
import { GdsText } from '@sebgroup/green-core/react'

<GdsText tag="p" font="body-regular-m">
  This paragraph contains{' '}
  <GdsText tag="strong" display="inline" font-weight="bold">
    important information
  </GdsText>
  {' '}that should stand out.
</GdsText>
```

### Truncated List Item

```tsx
import { GdsText } from '@sebgroup/green-core/react'

<GdsText 
  tag="p" 
  font="body-regular-s"
  lines={2}
  overflow-wrap="break-word"
  max-width="300px"
>
  Very long text that needs to be truncated after two lines with proper
  word breaking for long words like supercalifragilisticexpialidocious.
</GdsText>
```

### Heading with Underline

```tsx
import { GdsText } from '@sebgroup/green-core/react'

<GdsText 
  tag="h2" 
  font="heading-m"
  text-decoration="underline"
  margin-block="l m"
>
  Section Title
</GdsText>
```

### Code or Technical Text

```tsx
import { GdsText } from '@sebgroup/green-core/react'

<GdsText 
  tag="code" 
  font="detail-regular-s"
  background="neutral-01/0.1"
  padding-inline="xs"
  border-radius="2xs"
  white-space="nowrap"
>
  const value = "example"
</GdsText>
```

## Related Components

- [Typography](./Typography.md) — Complete typography system and text hierarchy guidelines
- [GdsDiv](./GdsDiv.md) — Base container component (GdsText extends this)
- [GdsTheme](./GdsTheme.md) — Theme utility for controlling text color schemes
- [GdsLink](./GdsLink.md) — For inline links within text content
- [GdsMask](./GdsMask.md) — For typography within gradient overlays
- [GdsSpinner](./GdsSpinner.md) — Loading indicators with label text
- [GdsFormattedAccount](./GdsFormattedAccount.md) — Formatted account numbers (extends GdsText)
- [GdsFormattedDate](./GdsFormattedDate.md) — Formatted dates and times (extends GdsText)
- [GdsFormattedNumber](./GdsFormattedNumber.md) — Formatted numbers and currency (extends GdsText)
- [GdsGroupedList](./GdsGroupedList.md) — For text in structured lists
- [GdsRichText](./GdsRichText.md) — For wrapping HTML content blocks with typography (GdsText for individual elements)
- [GdsFlex](./GdsFlex.md) — For layout of text elements
- [GdsCard](./GdsCard.md) — For text within cards
- [GdsDivider](./GdsDivider.md) — For separating text sections
- [GdsButton](./GdsButton.md) — For button text styling
- [Icons](./Icons.md) — For icons within text content

## Notes

- **Extends GdsDiv**: GdsText extends GdsDiv and inherits all its style expression properties
- **Default Tag**: Default is `span` with `body-m` size
- **Heading Auto-Sizing**: Heading tags (h1-h6) automatically apply appropriate font sizes from design tokens
- **Style Expression Properties**: Apply to the outer element unless otherwise specified
- **Naming Convention**: DOM attributes use kebab-case (`margin-block`), JS properties use camelCase
- **Space Tokens**: Use design system space tokens for consistent spacing (4xs, 3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl)
- **Color Tokens**: Use design system color tokens with optional transparency (`neutral-01/0.8`)
- **Font Tokens**: All available font tokens can be found in the Studio on seb.io
- **Line Clamping**: Use `lines` property for controlled text truncation with ellipsis
- **Text Wrapping**: Use `text-wrap` for optimized line breaks (`pretty` for body text, `balance` for headings)
- **Overflow Wrap**: Use `overflow-wrap="break-word"` for long words or URLs
- **White Space**: Supports all CSS white-space values including shorthand forms
- **Inline Display**: Set `display="inline"` for nested inline elements to prevent block rendering
- **Semantic HTML**: Always use appropriate semantic tags for accessibility and SEO

---

*Last updated: November 12, 2025*  
*Source: [GdsText Storybook Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-text--docs)*
