# Green Core — Declarative Layout & Style Expression Properties (SEPs)

This document explains how Green Core components use style expression properties (SEPs), the declarative layout system, and how to use SEPs effectively to build responsive, modular layouts without utility classes.

> **Architecture**: See [Green Design System Architecture](./GreenDesignSystemArchitecture.md) for understanding how SEPs and design tokens work within the component hierarchy.

## Overview

Green Core provides a small declarative layout system optimized for micro-frontend applications. Instead of relying on global CSS utility classes, layouts are declared using component attributes and properties that map to design tokens. This approach leverages shadow DOM encapsulation and ensures consistent spacing, sizing and colouring across micro-frontends.

Key concepts:

- **Declarative layout**: declare layout directly in markup using component properties.
- **Style Expression Properties (SEPs)**: component-specific attributes that resolve to CSS (and design tokens) and are applied inside shadow DOM.
- **SEP modularity**: SEPs are available on many components (not just layout containers) so you can adjust spacing, sizing or colour directly where it matters.

---

## Why Declarative Layout?

### The Problem with Traditional Utility Classes

One of the main reasons we are building Green Core using web components is **style encapsulation**. The use of Shadow DOM greatly reduces the risk of styling conflicts in a micro-frontend architecture environment.

This is great for styling the components themselves, but what about the rest of the stuff in an application? Things like margins, paddings, and grid systems also need styling. These sorts of things are usually handled by **utility classes** in traditional CSS frameworks. Utility classes are good, because you don't need to think about class names for everything. It allows you to quickly build out a responsive layout without writing a lot of CSS, and it also makes it clear from looking at the markup what the layout is supposed to be.

The main problem with utility classes, in our case, is that they are, in fact, still CSS classes. And CSS classes can, and will, lead to conflicts.

### Version Lock-in Problem

But, you may ask, if everyone just agrees to use Tailwind or Bootstrap, or some other available library, won't that solve the problem? Well, it may, initially. But as is always the case with libraries, they evolve over time. They have to, because CSS evolves over time. And so it inevitably leads to a **version lock-in effect**. Because if the next version of Bootstrap have any breaking changes, it means that every micro-frontend needs to upgrade at the same time to avoid conflicts. This is not a good situation to be in, because coordinating upgrades across multiple teams and products is hard, bordering on impossible.

### CSS Payload Size

And even if we could solve the lock-in problem, there is still the issue of the size of the CSS payload. Any utility framework will have a lot of utility classes, and if you only use a few of them, you may be shipping a lot of unused CSS to the client. In a single application context, this is typically not that big of an issue, because there are ways to tree-shake the classes and keep only the used ones. This (amongst other things) is what the Tailwind compiler does for you. But in a micro-frontend environment, it is often not possible to determine ahead of time which classes are going to be used in a given document, since it may consist of multiple independently developed parts.

### The Solution

The declarative layout system in Green Core is an attempt to solve these problems in a way that let's us have the cake and eat it too.

---

## How Declarative Layout Works

Instead of utility classes, the declarative layout system **generates CSS on the fly and injects it into the shadow roots of components**. It does this using something we call **style expression properties**. These properties are used to inform the component what CSS it needs to generate and inject into its Shadow DOM.

### Layout Components

The system introduces a set of layout oriented components:

- **[`<gds-div>`](./GdsDiv.md)** — Base component providing all layout properties
- **[`<gds-grid>`](./GdsGrid.md)** — Grid layout with specific grid defaults
- **[`<gds-flex>`](./GdsFlex.md)** — Flex layout with specific flex defaults
- **[`<gds-card>`](./GdsCard.md)** — Card container with card-specific defaults
- **[`<gds-text>`](./GdsText.md)** — Text wrapper with typography properties

The hierarchy in the list here is intentional. `<gds-div>` is the base component, providing all the base properties, while the other ones extend this base with specific defaults, and in some cases, additional properties.

Additionally, **some style expression properties are available on other components**, where it makes sense. For example, [`<gds-button>`](./GdsButton.md) supports horizontal sizing properties, margin properties and flex/grid child items properties. Check the API table for each component to see which properties are available. They are listed under a separate section in the API table.

---

## Responsiveness

Style expression properties allow you to write responsive styles in a compact and declarative way. Here is an example:

```html
<!-- Here, we're setting the default padding to `xs`, but increasing it to `m` in `l` viewports -->
<gds-div padding="xs; l {m}">
  <!-- Similarly, here we default to 1 column, increase to 2 columns in `m` viewports, and 4 columns in `xl` viewports -->
  <gds-grid columns="1; m {2}; xl {4}">
    <!-- Any HTML element can go as children -->
  </gds-grid>
</gds-div>
```

This is a very simple example, but it should give you an idea of how the style expression properties work.

### Media Query Syntax

Media queries can also be expressed as CSS units and as ranges, for example:

```
>m, <xl { ... }           - Above m, below xl
>500px, <1000px { ... }   - Above 500px, below 1000px
```

### Token Resolution

The value that goes in the media query is usually resolved to a CSS variable. In the padding example, it would resolve to `var(--gds-sys-space-m)`. This is then transformed into a CSS property, typically of the same name as the property used on the component. So, here it would be `padding: var(--gds-sys-space-m)`.

That means you can also use regular CSS shorthand patterns, like `padding: 1em 2em 3em 4em` by adding more values. They will each resolve to a CSS variable. For example:

```html
padding="xs; l {m xl m xl}"
```

When no media query is specified, it is the same as setting the breakpoint to 0. So, `padding="0 {m}"` is equivalent to `padding="m"`.

### Pseudo Selectors

Pseudo selectors can be added to any media query as a separate value sequence. For example:

```html
<gds-div padding="xs; hover: s; l { s; hover: m }">
  <!-- Any HTML element can go as children -->
</gds-div>
```

In the above example, the padding will be `xs` by default, `s` on hover, `s` in `l` viewports, and `m` on hover in `l` viewports.

---

## Style Expression Properties on Other Components

Style expression properties are not limited to the declarative layout components. In fact, they are a central part of the Green Core architecture, and are available in many components, wherever it makes sense. For example, on `<gds-button>` you can set the width using style expression syntax.

In the API tables in this documentation (and Storybook), you can find more information about the available style expression properties for each component under a separate section titled "Declarative layout / Style expression properties" or similar.

---

## Benefits Summary

The declarative layout system in Green Core solves multiple problems:

1. **Conflict Resolution**: CSS is injected directly into the shadow DOM of each component, eliminating style conflicts between micro-frontends
2. **Optimal Payload Size**: CSS is generated on-the-fly on the client side, only creating the styles that are actually used
3. **No Version Lock-in**: Uses the same version scoping mechanism as the rest of the components in Green Core
4. **Developer Experience**: Declarative, compact syntax that allows developers to "code at the speed of thought"

Internally, the style expression properties are using a custom property decorator which can be configured for different needs on a per-property basis. This keeps the code size in the implementation to a minimum, while still allowing for a sufficient level of flexibility.

---

## Learn More

To learn more about Declarative layout, and the syntax for style expression properties, head over to:
- **Official Documentation**: [https://seb.io/primitives/declarative-layout](https://seb.io/primitives/declarative-layout)
- **Architecture Overview**: [Green Design System Architecture](./GreenDesignSystemArchitecture.md)

---

## Declarative Layout (Original Section)

A micro-frontend optimized layout system for responsive layouts without utility classes. The relationships between elements rely on a set of rules for spacing, grids, and sizing, ensuring consistency throughout.

Declarative layout lets developers "code at the speed of thought" — you describe how elements should behave with attributes instead of inventing class names.

Because Green Core components use Shadow DOM, style expressions compile into CSS which is injected into the component's shadow root, removing styling conflicts between MFEs.

This system is intentionally minimal — it's not a component styling framework, it's layout glue for assembling components consistently.

---

## How it works

Components support special properties for declaring styles called Style Expression Properties (SEPs). A SEP typically corresponds to a CSS property (for example, `padding` or `margin`) and accepts token names or raw CSS values. SEPs support responsive variants and pseudo-selectors.

Example:

```html
<gds-div margin="m"> … </gds-div>
```

You can also provide multiple values with viewport conditions and pseudo selectors:

```html
<gds-div margin="m; s { l }; hover: l"> … </gds-div>
```

At render time, the component compiles the style expressions into CSS and injects it into its shadow DOM.

SEPs may be assigned using either properties (JS) or attributes (HTML):

```tsx
// property form (JSX)
<GdsDiv margin="m" />

// attribute form (HTML)
<gds-div margin="m"></gds-div>
```

---

## Style expression syntax

A style expression expresses values for a single CSS property. Use design token names where possible; raw CSS units are accepted for special cases.

### Basic expressions

`margin="m"`

A single token. Resolves to the token `--gds-sys-space-m`.

`margin="0 m 0 0"`

Shorthand form like CSS, sets only the right margin in this example.

### Viewport conditions

Values are separated by semicolon `;`.

`margin="m; s { l }"`

Means "use `m`, but above the `s` breakpoint use `l`".

You can express ranges and custom units:

`margin="xs; >s,<xl { m }"`

or

`margin="xs; >800px,<1000px { m }"`

### Pseudo selectors

Use `selector: value`.

`margin="xs; hover: l"`

Combines with viewport conditions:

`margin="xs; hover:l; s { s; hover: xl }"`

---

## Colours and levels

Colour properties like `color`, `background` and `border-color` map to the token collections:

- `background` -> `gds.sys.color.l[x].*` (levels map to surface types)
- `color` -> `gds.sys.color.content.*`
- `border-color` -> `gds.sys.color.border.*`

Backgrounds have levels (1–3). By default the component decides the appropriate level, but you can override it with the `level` prop.

```html
<gds-card level="3" background="neutral-01">…</gds-card>
```

This resolves to `--gds-sys-color-l3-neutral-01`.

---

## Token mapping

Property group -> Token collection (rough mapping):

- Spacing (margin, padding, gap, border-width): `gds.sys.space.*`
- background: `gds.sys.color.l[x].*`
- color: `gds.sys.color.content.*`
- border-color: `gds.sys.color.border.*`

---

## Declarative layout components

- `<gds-div>`: the base container that supports all SEPs.
- `<gds-flex>`: extends `<gds-div>` with `display:flex` defaults and flex helper props.
- `<gds-grid>`: extends `<gds-div>` with `display:grid` defaults and grid helper props.
- `<gds-card>`: extends `<gds-div>` with background, padding, border-radius and variant helpers.

These components are the building blocks for the declarative layout system.

---

## JSX / React usage

Green Core also exposes React wrappers for each web component so you can use the same declarative SEPs in JSX/TSX. The mapping follows a simple PascalCase convention: the kebab-case tag name becomes a PascalCase component name with the `Gds` prefix removed from the beginning of the tag and then upper-cased — in practice the wrapper names you should use are:

- `<gds-div>` -> `<GdsDiv>`
- `<gds-flex>` -> `<GdsFlex>`
- `<gds-grid>` -> `<GdsGrid>`
- `<gds-card>` -> `<GdsCard>`
- `<gds-button>` -> `<GdsButton>`
- `<gds-text>` -> `<GdsText>`

For other components follow the same pattern: convert the kebab-case tag to PascalCase and use the React export with the same name (for example `<gds-foo-bar>` becomes `<GdsFooBar>`). The React wrappers accept the same SEP strings as props instead of attributes.

JSX examples

Using `GdsDiv` with SEPs in JSX/TSX:

```tsx
import { GdsDiv } from '@sebgroup/green-core/react';

function Example() {
	return (
		<GdsDiv margin="m" padding="s" width="1200px" maxWidth="100%">
			Content
		</GdsDiv>
	);
}
```

Using a responsive grid in JSX:

```tsx
import { GdsGrid, GdsCard } from '@sebgroup/green-core/react';

function GridExample() {
	return (
		<GdsGrid gap="m" columns={"1; s { 2 }"}>
			<GdsCard>Left</GdsCard>
			<GdsCard>Right</GdsCard>
		</GdsGrid>
	);
}
```

Notes

- Prop names in the React wrappers are camelCase equivalents of the HTML attributes when necessary (for example `max-width` attribute becomes `maxWidth` prop). However SEP string values are passed as strings exactly as you would write them in markup (for example `columns={"1; s { 2 }"}`).
- The React wrappers forward props to the underlying web component; they preserve SEP behavior and token resolution.
- When using JSX in TypeScript, prefer importing the named component (for example `GdsDiv`) from `@sebgroup/green-core/react` so you get proper types and IntelliSense.


## SEP modularity

SEPs are a modular feature available on many components (not just the layout primitives). This enables concise local styling, e.g. `width` on a `gds-button` or `gap` on a `gds-grid`.

In Storybook, check the "Declarative Layout / Style Expression Properties" section for each component's API table to see supported SEPs.

---

## Examples

Center content with a constrained width:

```html
<gds-flex justify-content="center">
	<gds-div width="1200px" max-width="100%">…</gds-div>
</gds-flex>
```

Responsive two-column layout:

```html
<gds-grid gap="m" columns="1; s { 2 }">
	<gds-card>Left</gds-card>
	<gds-card>Right</gds-card>
</gds-grid>
```

Button with inline padding and width:

```html
<gds-button padding="s" width="auto">Click</gds-button>
```

---

## Notes & best practices

- Prefer design tokens (e.g., `m`, `l`, `xs`) to arbitrary units to ensure visual consistency.
- Use SEPs for layout composition only—component styling (colours, typography) should be handled by the component API and tokens.
- Avoid overusing raw CSS values unless necessary for precise control.
- Test responsive expressions in Storybook where the component API documents supported SEPs and their behavior.

---

## Where to find more

- Storybook API tables: components list -> "Declarative Layout / Style Expression Properties".
 - `docs/components/green-core/gds-flex-reference.md` for GdsFlex-specific examples.

