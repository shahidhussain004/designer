# GdsLink

A link component that navigates users to other pages or sections of content with support for icons, custom styling, and accessibility features.

> **Related Components**: See also [GdsCardPattern01](./GdsCardPattern01.md) for using links in card footer actions.
> 
> **Architecture**: See [Green Design System Architecture](./GreenDesignSystemArchitecture.md) for understanding public API boundaries.

## Overview

GdsLink is a navigation component that extends native HTML anchor capabilities with Green Core's design system integration. It provides flexible text decoration control, icon slots, and built-in accessibility features for creating consistent, accessible navigation throughout your application.

**Key Features:**
- **Navigation**: Internal and external link support with href attribute
- **Icon Slots**: Lead and trail slots for icons
- **Text Decoration**: Full control over underline styles including hover states
- **Target Control**: Open links in same window, new tab, or specific frames
- **Download Support**: Mark links for file downloads
- **Accessibility**: ARIA label support, screen reader friendly
- **Security**: Automatic rel attribute handling for external links
- **Style Expressions**: Full style expression property support

## Accessibility & Security

- **External links**: When `target="_blank"` is used the component automatically adds `rel="noopener noreferrer"` to prevent window.opener attacks. You can supply additional `rel` values if needed (for example `nofollow`).
- **ARIA current**: For navigation items that represent the current page, add `aria-current="page"` to the active `GdsLink` so assistive technologies can announce it.
- **Open in new tab indicator**: If your design visually indicates external links or new-tab behavior with an icon, also include it as accessible text (for example using `label` or visually-hidden text) so screen reader users know the link opens in a new tab.
- **Keyboard focus**: Links must have a visible focus state. Ensure contrast and focus ring styles are present in your theme.


## Import

```tsx
// Use as JSX element in React
import { GdsLink } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsLink href="/about">About Us</GdsLink>
</GdsTheme>
```

## Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | `string` | `undefined` | URL that the link points to. Can be absolute, relative, or fragment identifier. |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top'` | `undefined` | Specifies where to open the linked document. |
| `rel` | `string` | `undefined` | Specifies the relationship between current and linked document. Automatically adds security-related values when `target="_blank"`. |
| `download` | `string \| boolean` | `undefined` | When present, indicates that the linked resource should be downloaded. |
| `label` | `string` | `''` | Provides an accessible name for the link read by screen readers. Use when link contains only an icon, needs different screen reader description, or requires additional context. |
| `gds-element` | `string` | `undefined` | The unscoped name of this element (read-only). |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text-decoration` | `string` | `undefined` | Controls text-decoration property. Supports all valid CSS values. Use `hover:` prefix for hover states (e.g., `"hover:underline"`, `"underline; hover:none"`). |
| `rel` | `string` | `undefined` | Internal property for rel attribute (private). |
| `shadowRootOptions` | `ShadowRootInit` | `{ mode: 'open', delegatesFocus: true }` | Shadow root configuration (read-only). |
| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry (read-only). |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only). |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of element (read-only). |
| `gdsElementName` | `string` | `undefined` | Unscoped element name (read-only). |

### Style Expression Properties

| Property | Description |
|----------|-------------|
| `margin` | Controls margin property. Only accepts space tokens. |
| `margin-inline` | Controls margin-inline property. Only accepts space tokens. |
| `margin-block` | Controls margin-block property. Only accepts space tokens. |
| `width` | Controls width property. Supports space tokens and all valid CSS width values. |
| `min-width` | Controls min-width property. Supports space tokens and all valid CSS values. |
| `max-width` | Controls max-width property. Supports space tokens and all valid CSS values. |
| `inline-size` | Controls inline-size property. Supports space tokens and all valid CSS values. |
| `min-inline-size` | Controls min-inline-size property. Supports space tokens and all valid CSS values. |
| `max-inline-size` | Controls max-inline-size property. Supports space tokens and all valid CSS values. |
| `align-self` | Controls align-self property. Supports all valid CSS values. |
| `justify-self` | Controls justify-self property. Supports all valid CSS values. |
| `place-self` | Controls place-self property. Supports all valid CSS values. |
| `grid-column` | Controls grid-column property. Supports all valid CSS values. |
| `grid-row` | Controls grid-row property. Supports all valid CSS values. |
| `grid-area` | Controls grid-area property. Supports all valid CSS values. |
| `flex` | Controls flex property. Supports all valid CSS values. |
| `order` | Controls order property. Supports all valid CSS values. |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `click` | `MouseEvent` | Fired when the link is clicked. |
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from the DOM. |

### Slots

| Slot | Description |
|------|-------------|
| `main` | Content to be displayed as the link text (default slot). |
| `lead` | Optional slot for an icon element to be placed before the link text. |
| `trail` | Optional slot for an icon element to be placed after the link text. |

## Examples

### Basic Link

```tsx
<GdsLink href="/home">Home</GdsLink>
```

### External Link

```tsx
// Opens in new tab with automatic security attributes
<GdsLink href="https://example.com" target="_blank">
  Visit Example
</GdsLink>
```

### Internal Navigation

```tsx
// Same page section
<GdsLink href="#section-1">Jump to Section 1</GdsLink>

// Relative path
<GdsLink href="/products">View Products</GdsLink>

// Absolute path
<GdsLink href="https://mysite.com/about">About Page</GdsLink>
```

### With Lead Icon

```tsx
import { IconChainLink, IconExternalLink, IconHomeOpen } from '@sebgroup/green-core/react'

// Link with chain icon
<GdsLink href="/resources">
  <IconChainLink slot="lead" />
  Resources
</GdsLink>

// External link with icon
<GdsLink href="https://docs.example.com" target="_blank">
  <IconExternalLink slot="lead" />
  Documentation
</GdsLink>

// Home link
<GdsLink href="/">
  <IconHomeOpen slot="lead" />
  Home
</GdsLink>
```

### With Trail Icon

```tsx
import { IconArrowRight, IconArrowBoxRight, IconChevronRight } from '@sebgroup/green-core/react'

// Link with arrow
<GdsLink href="/next-page">
  Continue
  <IconArrowRight slot="trail" />
</GdsLink>

// External link indicator
<GdsLink href="https://external.com" target="_blank">
  External Site
  <IconArrowBoxRight slot="trail" />
</GdsLink>

// Navigation with chevron
<GdsLink href="/details">
  View Details
  <IconChevronRight slot="trail" />
</GdsLink>
```

### Text Decoration Variants

```tsx
// No underline (default)
<GdsLink href="/page">No Underline</GdsLink>

// Always underlined
<GdsLink href="/page" text-decoration="underline">
  Always Underlined
</GdsLink>

// Remove underline
<GdsLink href="/page" text-decoration="none">
  No Underline Ever
</GdsLink>

// Underline on hover only
<GdsLink href="/page" text-decoration="hover:underline">
  Underline on Hover
</GdsLink>

// Underline normally, remove on hover
<GdsLink href="/page" text-decoration="underline; hover:none">
  Remove Underline on Hover
</GdsLink>

### Active Link Example

```tsx
<GdsLink href="/dashboard" aria-current="page">Dashboard</GdsLink>
```
```

### Icon-Only Link (Accessible)

```tsx
import { IconSettings, IconPeopleProfile, IconBell } from '@sebgroup/green-core/react'

// Settings icon with label for screen readers
<GdsLink href="/settings" label="Open settings">
  <IconSettings />
</GdsLink>

// Profile icon
<GdsLink href="/profile" label="View your profile">
  <IconPeopleProfile />
</GdsLink>

// Notifications icon
<GdsLink href="/notifications" label="View notifications">
  <IconBell />
</GdsLink>
```

### Download Links

```tsx
// Download with default filename
<GdsLink href="/files/report.pdf" download>
  Download Report (PDF)
</GdsLink>

// Download with custom filename
<GdsLink href="/files/data.csv" download="monthly-report.csv">
  Download Monthly Report
</GdsLink>

// Download with icon
<GdsLink href="/files/document.docx" download>
  <IconDownload slot="lead" />
  Download Document
</GdsLink>
```

### Target Variants

```tsx
// Open in same window (default)
<GdsLink href="/page" target="_self">Same Window</GdsLink>

// Open in new tab/window
<GdsLink href="/page" target="_blank">New Tab</GdsLink>

// Open in parent frame
<GdsLink href="/page" target="_parent">Parent Frame</GdsLink>

// Open in top-level frame
<GdsLink href="/page" target="_top">Top Frame</GdsLink>
```

### Navigation Menu

```tsx
import { IconHomeOpen, IconPeopleProfile, IconSettings, IconBell } from '@sebgroup/green-core/react'

<GdsFlex gap="l" align-items="center">
  <GdsLink href="/">
    <IconHomeOpen slot="lead" />
    Home
  </GdsLink>
  
  <GdsLink href="/profile">
    <IconPeopleProfile slot="lead" />
    Profile
  </GdsLink>
  
  <GdsLink href="/settings">
    <IconSettings slot="lead" />
    Settings
  </GdsLink>
  
  <GdsLink href="/notifications" label="Notifications">
    <IconBell />
  </GdsLink>
</GdsFlex>
```

### Breadcrumb Navigation

```tsx
import { IconChevronRight } from '@sebgroup/green-core/react'

<GdsFlex gap="s" align-items="center">
  <GdsLink href="/">Home</GdsLink>
  <IconChevronRight size="xs" />
  
  <GdsLink href="/products">Products</GdsLink>
  <IconChevronRight size="xs" />
  
  <GdsLink href="/products/electronics">Electronics</GdsLink>
  <IconChevronRight size="xs" />
  
  <GdsText>Laptop</GdsText>
</GdsFlex>
```

### Card with Links

```tsx
import { IconArrowRight, IconExternalLink } from '@sebgroup/green-core/react'

<GdsCard>
  <GdsText tag="h3">Article Title</GdsText>
  <GdsText>Article description goes here...</GdsText>
  
  <GdsFlex gap="m" margin-block="m">
    <GdsLink href="/article/123">
      Read More
      <IconArrowRight slot="trail" />
    </GdsLink>
    
    <GdsLink href="https://source.com" target="_blank">
      View Source
      <IconExternalLink slot="trail" />
    </GdsLink>
  </GdsFlex>
</GdsCard>
```

### Footer Links

```tsx
<GdsFlex gap="xl" flex-wrap="wrap">
  <GdsFlex flex-direction="column" gap="m">
    <GdsText tag="strong">Company</GdsText>
    <GdsLink href="/about">About Us</GdsLink>
    <GdsLink href="/careers">Careers</GdsLink>
    <GdsLink href="/press">Press</GdsLink>
  </GdsFlex>
  
  <GdsFlex flex-direction="column" gap="m">
    <GdsText tag="strong">Support</GdsText>
    <GdsLink href="/help">Help Center</GdsLink>
    <GdsLink href="/contact">Contact</GdsLink>
    <GdsLink href="/faq">FAQ</GdsLink>
  </GdsFlex>
  
  <GdsFlex flex-direction="column" gap="m">
    <GdsText tag="strong">Legal</GdsText>
    <GdsLink href="/privacy">Privacy Policy</GdsLink>
    <GdsLink href="/terms">Terms of Service</GdsLink>
    <GdsLink href="/cookies">Cookie Policy</GdsLink>
  </GdsFlex>
</GdsFlex>
```

## Do's and Don'ts (updated)

- Do: Use descriptive link text that makes sense out of context (e.g., "View account details").
- Do: Use icons to indicate external links and provide accessible text for them.
- Do: Use `aria-current="page"` for the active navigation item.
- Don't: Use links for actions that change state (use buttons for actions like opening modals or submitting forms).
- Don't: Open new tabs unless necessary; when you do, indicate that behavior visually and for screen readers.

### List with Links

```tsx
import { IconChevronRight } from '@sebgroup/green-core/react'

<GdsGroupedList>
  <GdsListItem>
    <GdsLink href="/dashboard">
      Dashboard
      <IconChevronRight slot="trail" />
    </GdsLink>
  </GdsListItem>
  
  <GdsListItem>
    <GdsLink href="/transactions">
      Transactions
      <IconChevronRight slot="trail" />
    </GdsLink>
  </GdsListItem>
  
  <GdsListItem>
    <GdsLink href="/accounts">
      Accounts
      <IconChevronRight slot="trail" />
    </GdsLink>
  </GdsListItem>
</GdsGroupedList>
```

### With Responsive Width

```tsx
// Full width on mobile, constrained on desktop
<GdsLink 
  href="/page"
  width="100%"
  max-width="300px"
  margin-inline="auto"
>
  Centered Link
</GdsLink>
```

### Alternative Screen Reader Text

```tsx
// Visual text is short, but screen reader gets more context
<GdsLink 
  href="/article/climate-change-2024" 
  label="Read full article about climate change impacts in 2024"
>
  Read more
</GdsLink>

// Icon with descriptive label
<GdsLink 
  href="/download/annual-report" 
  label="Download annual financial report PDF"
  download
>
  <IconDownload />
</GdsLink>
```

## TypeScript Types

```tsx
// GdsLink props interface
interface GdsLinkProps {
  // Required
  href?: string
  
  // Navigation
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
  download?: string | boolean
  
  // Styling
  'text-decoration'?: string
  
  // Accessibility
  label?: string
  
  // Children/Content
  children?: React.ReactNode
  
  // Style expressions
  margin?: string
  width?: string
  'max-width'?: string
  // ... other style expression properties
}

// Usage example
const NavigationLink = () => {
  return (
    <GdsLink 
      href="/products"
      text-decoration="hover:underline"
      onClick={(e) => {
        console.log('Link clicked')
      }}
    >
      <IconArrowRight slot="lead" />
      View Products
    </GdsLink>
  )
}
```

## Link Types and Use Cases

| Type | Use Case | Example |
|------|----------|---------|
| **Internal Link** | Same-site navigation | `href="/products"` |
| **External Link** | Different domain | `href="https://example.com"` with `target="_blank"` |
| **Fragment Link** | Same page anchor | `href="#section-1"` |
| **Email Link** | Open email client | `href="mailto:contact@example.com"` |
| **Phone Link** | Initiate phone call | `href="tel:+15551234567"` |
| **Download Link** | File download | `href="/file.pdf"` with `download` |

## Best Practices

### Accessibility
- **Always provide context**: Use descriptive link text that makes sense out of context
- **Icon-only links**: Always use `label` attribute for screen reader users
- **Alternative text**: Use `label` when visual text differs from intended meaning
- **External links**: Consider indicating external links with icon or text

```tsx
// Good - descriptive text
<GdsLink href="/products">View our product catalog</GdsLink>

// Bad - unclear context
<GdsLink href="/products">Click here</GdsLink>

// Good - icon-only with label
<GdsLink href="/settings" label="Open settings">
  <IconSettings />
</GdsLink>

// Bad - icon-only without label
<GdsLink href="/settings">
  <IconSettings />
</GdsLink>
```

### Security
- **External links**: Use `target="_blank"` for external sites
- **Rel attribute**: Component automatically adds `noopener noreferrer` for `target="_blank"`
- **User awareness**: Consider visual indicators for external links

```tsx
// Secure external link (rel automatically added)
<GdsLink href="https://external.com" target="_blank">
  External Site
  <IconExternalLink slot="trail" />
</GdsLink>
```

### Text Decoration
- **Underlines**: Help users identify clickable elements
- **Hover states**: Provide visual feedback on interaction
- **Consistency**: Use consistent decoration patterns across your app
- **Context**: Consider removing underlines in navigation menus where links are obvious

```tsx
// Navigation menu - no underline needed
<nav>
  <GdsLink href="/" text-decoration="none">Home</GdsLink>
  <GdsLink href="/about" text-decoration="none">About</GdsLink>
</nav>

// Body content - underline helps identification
<GdsText>
  Learn more in our <GdsLink href="/guide">complete guide</GdsLink>.
</GdsText>
```

### Icons
- **Directional cues**: Use arrow icons to indicate navigation direction
- **External indicators**: Use external link icon for off-site links
- **Action hints**: Use download icon for downloadable content
- **Consistency**: Use same icon patterns throughout application

### Performance
- **Prefetch**: Consider prefetching important pages
- **Download size**: Be mindful of link count on initial page load
- **External links**: Opening in new tab prevents navigation away from your app

## Related Components

- [GdsButton](./GdsButton.md) — For actions instead of navigation
- [GdsMenuButton](./GdsMenuButton.md) — Menu button combining button and link behaviors
- [GdsBreadcrumbs](./GdsBreadcrumbs.md) — For breadcrumb navigation
- [GdsMenuItem](./GdsMenuItem.md) — For menu items with links
- [GdsContextMenu](./GdsContextMenu.md) — For contextual link menus
- [GdsGroupedList](./GdsGroupedList.md) — For lists with linked items
- [GdsCard](./GdsCard.md) — Cards can contain links
- [GdsText](./GdsText.md) — For inline links within text
- [Icons](./Icons.md) — Available icons for lead/trail slots
- [GdsFlex](./GdsFlex.md) — For link layouts and navigation menus

## Navigation Patterns

### Single-Page Application (SPA) Routing

For SPA frameworks like React Router, you may need to integrate GdsLink with your router:

```tsx
import { useNavigate } from 'react-router-dom'

const SPALink = ({ to, children, ...props }) => {
  const navigate = useNavigate()
  
  const handleClick = (e) => {
    // Prevent default link behavior
    e.preventDefault()
    
    // Use router navigation
    navigate(to)
  }
  
  return (
    <GdsLink href={to} onClick={handleClick} {...props}>
      {children}
    </GdsLink>
  )
}

// Usage
<SPALink to="/dashboard">Go to Dashboard</SPALink>
```

### Active Link State

```tsx
const NavLink = ({ href, children, isActive }) => {
  return (
    <GdsLink 
      href={href}
      text-decoration={isActive ? 'underline' : 'hover:underline'}
      style={{ 
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? 'var(--gds-color-primary)' : undefined
      }}
    >
      {children}
    </GdsLink>
  )
}
```

## Accessibility Guidelines

### ARIA and Semantic HTML
- Component renders semantic `<a>` element
- `label` attribute maps to `aria-label`
- `href` attribute makes link keyboard accessible
- Focus styles provided automatically

### Keyboard Navigation
- **Tab**: Move to next link
- **Shift + Tab**: Move to previous link
- **Enter**: Activate link
- **Space**: Activate link (when focused)

### Screen Reader Support
- Link purpose announced by screen reader
- `label` attribute provides additional context
- Icon-only links require `label` for meaning
- External link indicators should be announced

## Notes

- **Delegated Focus**: Shadow root has `delegatesFocus: true` for keyboard accessibility
- **Security**: `rel="noopener noreferrer"` automatically added for `target="_blank"`
- **Text Decoration**: Supports hover states with `hover:` prefix syntax
- **Style Expressions**: Full support for margin, width, and layout properties
- **Default Slot**: Link text goes in main slot (default)
- **Icon Slots**: Lead and trail slots for icons before/after text
- **Event Handling**: Use `onClick` in React (standard DOM click event)
- **Fragment Links**: Use `href="#id"` for same-page navigation

---

*Last updated: November 12, 2025*  
*Green Core version: 2.12.0+*  
*Documentation source: [Storybook Link Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-link--docs)*
