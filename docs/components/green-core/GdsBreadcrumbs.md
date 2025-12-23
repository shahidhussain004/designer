# GdsBreadcrumbs Component

The `GdsBreadcrumbs` component is a secondary navigation pattern that shows the website hierarchy, helping users understand their current location and navigate back through parent pages. Breadcrumbs improve findability of parent pages and provide quick upward navigation in deep hierarchies.

## Features

- Supports both text-only and icon+text navigation links
- Responsive design with mobile optimization (shows previous page only on mobile)
- Configurable sizes (`large` / `small`)
- Custom overflow solutions for long breadcrumb trails
- Accessible with customizable ARIA labels and landmark support
- Automatic separator rendering between breadcrumb items
- Current page indication (last breadcrumb rendered as non-interactive text)

## Import

```tsx
import { GdsBreadcrumbs } from '@sebgroup/green-core/react'
```

## Basic Usage

Use React/JSX component wrappers in examples for clarity. In markup the underlying web component names map to `gds-*` tags.

```tsx
<GdsBreadcrumbs>
  <GdsBreadcrumb href="/">Home</GdsBreadcrumb>
  <GdsBreadcrumb href="/products">Products</GdsBreadcrumb>
  <GdsBreadcrumb href="/products/category">Category</GdsBreadcrumb>
  <GdsBreadcrumb>Current page</GdsBreadcrumb>
</GdsBreadcrumbs>
```

## Public API

### Attributes & Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"large" \| "small"` | `"large"` | Controls the font-size and spacing of separators and breadcrumb items |
| `label` | `string` | `"breadcrumbs"` | Accessible label for the breadcrumbs navigation. Customize for multiple navigation sections |
| `breadcrumbItems` | `GdsBreadcrumb[]` | - | Array of breadcrumb items (read-only property) |

### Style Expression Properties

The component supports various style expression properties for layout customization:

| Property | Description |
|----------|-------------|
| `width` | Controls the width property. Supports space tokens and all valid CSS width values |
| `min-width` | Controls the min-width property |
| `max-width` | Controls the max-width property |
| `inline-size` | Controls the inline-size property |
| `min-inline-size` | Controls the min-inline-size property |
| `max-inline-size` | Controls the max-inline-size property |
| `margin` | Controls the margin property. Only accepts space tokens |
| `margin-inline` | Controls the margin-inline property. Only accepts space tokens |
| `margin-block` | Controls the margin-block property. Only accepts space tokens |
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
| `gds-element-disconnected` | `CustomEvent` | When the element is disconnected from the DOM |

### Breadcrumb Item API

Individual `GdsBreadcrumb` / `gds-breadcrumb` items support:

| Attribute | Description |
|-----------|-------------|
| `href` | URL for the breadcrumb link. Omit for current page |
| `overflow` | Boolean attribute to mark as overflow menu item (used by custom overflow implementations) |

**Slots:**
- `lead`: For icons before the text
- `trail`: For icons after the text
- Default: Breadcrumb text content

Note: Examples in this doc use the React wrappers (`GdsBreadcrumb`) for readability. The underlying custom element tag remains `gds-breadcrumb` in plain HTML.

## Examples

### Simple Breadcrumbs

Basic text-only breadcrumb navigation:

```tsx
<GdsBreadcrumbs>
  <GdsBreadcrumb href="/">Home</GdsBreadcrumb>
  <GdsBreadcrumb href="/products">Products</GdsBreadcrumb>
  <GdsBreadcrumb href="/products/category">Category</GdsBreadcrumb>
  <GdsBreadcrumb>Current page</GdsBreadcrumb>
</GdsBreadcrumbs>
```

### With Icons

Add icons to breadcrumb items using the `lead` slot. See [Icons documentation](./Icons.md) for available icons.

```tsx
import { IconHomeOpen, IconFolder, IconSettingsGear } from '@sebgroup/green-core/react'

<GdsBreadcrumbs>
  <GdsBreadcrumb href="/">
    <IconHomeOpen slot="lead" />
    Home
  </GdsBreadcrumb>

  <GdsBreadcrumb href="/documents">
    <IconFolder slot="lead" />
    Documents
  </GdsBreadcrumb>

  <GdsBreadcrumb href="/documents/settings">
    <IconSettingsGear slot="lead" />
    Settings
  </GdsBreadcrumb>

  <GdsBreadcrumb>Current page</GdsBreadcrumb>
</GdsBreadcrumbs>
```

### Size Variants

Breadcrumbs support two sizes: `large` (default) and `small`:

```tsx
<GdsFlex flex-direction="column" gap="xl">
  {/* Large (default) */}
  <GdsBreadcrumbs>
    <GdsBreadcrumb href="/">Home</GdsBreadcrumb>
    <GdsBreadcrumb href="/products">Products</GdsBreadcrumb>
    <GdsBreadcrumb>Current page</GdsBreadcrumb>
  </GdsBreadcrumbs>

  {/* Small */}
  <GdsBreadcrumbs size="small">
    <GdsBreadcrumb href="/">Home</GdsBreadcrumb>
    <GdsBreadcrumb href="/products">Products</GdsBreadcrumb>
    <GdsBreadcrumb>Current page</GdsBreadcrumb>
  </GdsBreadcrumbs>
</GdsFlex>
```

Use small size for:
- Compact layouts
- Dense information displays
- Secondary navigation areas

### Mobile Responsive

The breadcrumbs component automatically optimizes for mobile devices by showing only the previous page instead of the full path. This is built-in and requires no configuration.

```tsx
<GdsBreadcrumbs>
  <GdsBreadcrumb href="/">
    <IconHomeOpen slot="lead" />
    Home
  </GdsBreadcrumb>

  <GdsBreadcrumb href="/documents">
    <IconFolder slot="lead" />
    Documents
  </GdsBreadcrumb>

  <GdsBreadcrumb href="/settings">
    <IconSettingsGear slot="lead" />
    Settings
  </GdsBreadcrumb>

  <GdsBreadcrumb>Current page</GdsBreadcrumb>
</GdsBreadcrumbs>
```

On mobile: Shows "← Settings" (previous page only)  
On desktop: Shows full path "Home > Documents > Settings > Current page"

### Overflow Menu

For long breadcrumb trails, implement custom overflow solutions using context menus. The component exposes an `overflow` marker attribute on items which you can use to render a menu or button that exposes hidden path segments.

```tsx
import { IconHomeOpen, IconSettingsGear, IconDotGridOneHorizontal } from '@sebgroup/green-core/react'

<GdsBreadcrumbs>
  <GdsBreadcrumb href="/">
    <IconHomeOpen slot="lead" />
    Home
  </GdsBreadcrumb>

  <GdsBreadcrumb href="/documents">
    <IconFolder slot="lead" />
    Documents
  </GdsBreadcrumb>

  {/* Overflow menu for hidden items */}
  <GdsBreadcrumb overflow>
    <GdsContextMenu>
      <GdsMenuItem>Subfolder 1</GdsMenuItem>
      <GdsMenuItem>Subfolder 2</GdsMenuItem>
      <GdsMenuItem>Subfolder 3</GdsMenuItem>
    </GdsContextMenu>
  </GdsBreadcrumb>

  <GdsBreadcrumb href="/settings">
    <IconSettingsGear slot="lead" />
    Settings
  </GdsBreadcrumb>

  <GdsBreadcrumb>Current page</GdsBreadcrumb>
</GdsBreadcrumbs>
```

Alternative overflow with button (keeps markup accessible and keyboard-focusable):

```tsx
<GdsBreadcrumbs>
  <GdsBreadcrumb href="/">Home</GdsBreadcrumb>

  <GdsButton rank="tertiary" size="small">
    <IconDotGridOneHorizontal />
  </GdsButton>

  <GdsBreadcrumb>Current</GdsBreadcrumb>
</GdsBreadcrumbs>
```

### Accessible Labeling and Landmark Usage

Customize the ARIA label for better accessibility when you have multiple navigation sections. Breadcrumbs should also be placed inside a landmark where appropriate (for example `nav`), and use `aria-label` to describe the kind of path.

```tsx
<nav aria-label="Site breadcrumb">
  <GdsBreadcrumbs label="Site Navigation">
    <GdsBreadcrumb href="/">Home</GdsBreadcrumb>
    <GdsBreadcrumb href="/products">Products</GdsBreadcrumb>
    <GdsBreadcrumb>Current page</GdsBreadcrumb>
  </GdsBreadcrumbs>
</nav>

<nav aria-label="Document breadcrumb">
  <GdsBreadcrumbs label="Document Path">
    <GdsBreadcrumb href="/docs">Documentation</GdsBreadcrumb>
    <GdsBreadcrumb href="/docs/guides">Guides</GdsBreadcrumb>
    <GdsBreadcrumb>Current Guide</GdsBreadcrumb>
  </GdsBreadcrumbs>
</nav>
```

### Complete Example with All Features

```tsx
import { IconHomeOpen, IconFolder, IconSettingsGear } from '@sebgroup/green-core/react'

<GdsBreadcrumbs size="large" label="Page Navigation">
  <gds-breadcrumb href="/">
    <IconHomeOpen slot="lead" />
    Home
  </gds-breadcrumb>
  
  <gds-breadcrumb href="/banking">
    <IconFolder slot="lead" />
    Banking
  </gds-breadcrumb>
  
  <gds-breadcrumb href="/banking/accounts">
    Accounts
  </gds-breadcrumb>
  
  <gds-breadcrumb href="/banking/accounts/settings">
    <IconSettingsGear slot="lead" />
    Settings
  </gds-breadcrumb>
  
  <gds-breadcrumb>Account Details</gds-breadcrumb>
</GdsBreadcrumbs>
```

## Use Cases

### Website Navigation

Primary use case for showing site hierarchy:

```tsx
<GdsBreadcrumbs>
  <GdsBreadcrumb href="/">
    <IconHomeOpen slot="lead" />
    Home
  </GdsBreadcrumb>
  <GdsBreadcrumb href="/products">Products</GdsBreadcrumb>
  <GdsBreadcrumb href="/products/banking">Banking</GdsBreadcrumb>
  <GdsBreadcrumb>Personal Accounts</GdsBreadcrumb>
</GdsBreadcrumbs>
```

### Document Browser

Navigate through folder hierarchies:

```tsx
<GdsBreadcrumbs label="Document Path">
  <GdsBreadcrumb href="/documents">
    <IconFolder slot="lead" />
    My Documents
  </GdsBreadcrumb>
  <GdsBreadcrumb href="/documents/work">Work</GdsBreadcrumb>
  <GdsBreadcrumb href="/documents/work/projects">Projects</GdsBreadcrumb>
  <GdsBreadcrumb href="/documents/work/projects/2024">2024</GdsBreadcrumb>
  <GdsBreadcrumb>Annual Report</GdsBreadcrumb>
</GdsBreadcrumbs>
```

### Multi-Step Forms

Show progress through form sections:

```tsx
<GdsBreadcrumbs size="small">
  <GdsBreadcrumb href="/application/start">
    <IconCircleCheck slot="lead" />
    Personal Info
  </GdsBreadcrumb>
  <GdsBreadcrumb href="/application/financial">
    <IconCircleCheck slot="lead" />
    Financial Details
  </GdsBreadcrumb>
  <GdsBreadcrumb>Review & Submit</GdsBreadcrumb>
</GdsBreadcrumbs>
```

### Settings Navigation

Navigate through settings sections:

```tsx
<GdsBreadcrumbs>
  <GdsBreadcrumb href="/settings">
    <IconSettingsGear slot="lead" />
    Settings
  </GdsBreadcrumb>
  <GdsBreadcrumb href="/settings/account">Account</GdsBreadcrumb>
  <GdsBreadcrumb href="/settings/account/security">Security</GdsBreadcrumb>
  <GdsBreadcrumb>Two-Factor Authentication</GdsBreadcrumb>
</GdsBreadcrumbs>
```

### E-commerce Category Navigation

Navigate through product categories:

```tsx
<GdsBreadcrumbs>
  <GdsBreadcrumb href="/">
    <IconHomeOpen slot="lead" />
    Home
  </GdsBreadcrumb>
  <GdsBreadcrumb href="/shop">Shop</GdsBreadcrumb>
  <GdsBreadcrumb href="/shop/electronics">Electronics</GdsBreadcrumb>
  <GdsBreadcrumb href="/shop/electronics/computers">Computers</GdsBreadcrumb>
  <GdsBreadcrumb>Laptops</GdsBreadcrumb>
</GdsBreadcrumbs>
```

## Best Practices

- **Current page indication**: Omit `href` on the last breadcrumb (current page). Render the last item as non-interactive text so screen readers and keyboard users understand it's the current location.
- **Home link**: First breadcrumb should usually link to home. Use the home icon to visually indicate root.
- **Keep it concise**: Use short labels and avoid long page titles. Truncate text if necessary and ensure the most important segments remain visible.
- **Icon usage**: Use icons consistently (all or none) and prefer a single `lead` icon per item for visual scanning. See [Icons.md](./Icons.md).
- **Overflow handling**: For deep hierarchies (4–5+ levels), prefer an overflow/menu pattern showing first, last and current items. Mark overflowed items with `overflow` and expose them via a context menu or button.
- **Mobile optimization**: Use built-in mobile behavior (show previous page only) and verify touch targets meet accessibility sizes.

## Accessibility

- Place breadcrumbs inside a `nav` element with `aria-label` describing the path (for example `aria-label="Site breadcrumb"`).
- Ensure the breadcrumb container has an accessible label via the `label` property or `aria-label` when multiple breadcrumb regions exist.
- Use semantic links for interactive items and render the current page as plain text (no `href`).
- Provide visible focus indicators and ensure separators are announced correctly by screen readers by not making them focusable.
- Test with keyboard only navigation and screen readers to confirm reading order and contextual meaning.

## Related tokens & styles

- **Spacing:** use spacing tokens for padding and gap (`Tokens: Spacing`) to align breadcrumb items consistently.
- **Typography:** breadcrumbs typically use smaller caption/body tokens (`Tokens: Typography`) — prefer `small` size when `size="small"` is used.
- **Icons:** See `Icons.md` for recommended icons and sizes.

If you'd like, I can convert remaining docs to PascalCase JSX examples or add concrete CSS token examples for spacing and typography.

7. **Accessibility**:
   - Use custom `label` for multiple breadcrumb sections
   - Ensure sufficient color contrast
   - Current page should be indicated via aria-current
   - Screen reader users benefit from descriptive labels

8. **Navigation context**:
   - Place breadcrumbs near top of page
   - Position above page title
   - Ensure it reflects actual site structure

## Common Patterns

### Dynamic Breadcrumbs from Route

```tsx
const DynamicBreadcrumbs = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const pathSegments = location.pathname
    .split('/')
    .filter(Boolean)
  
  const breadcrumbs = [
    { label: 'Home', path: '/', icon: IconHomeOpen }
  ]
  
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: currentPath,
      icon: index === pathSegments.length - 1 ? null : IconFolder
    })
  })
  
  return (
    <GdsBreadcrumbs>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        const Icon = crumb.icon
        
        return (
          <gds-breadcrumb 
            key={crumb.path} 
            href={!isLast ? crumb.path : undefined}
          >
            {Icon && <Icon slot="lead" />}
            {crumb.label}
          </gds-breadcrumb>
        )
      })}
    </GdsBreadcrumbs>
  )
}
```

### Breadcrumbs with Route Metadata

```tsx
const routes = {
  '/': { label: 'Home', icon: IconHomeOpen },
  '/banking': { label: 'Banking Services', icon: IconBank },
  '/banking/accounts': { label: 'Accounts', icon: IconFolder },
  '/banking/accounts/details': { label: 'Account Details', icon: null }
}

const BreadcrumbsFromMeta = ({ currentPath }: { currentPath: string }) => {
  const paths = currentPath.split('/').filter(Boolean)
  const breadcrumbPaths = ['/', ...paths.map((_, i) => 
    '/' + paths.slice(0, i + 1).join('/')
  )]
  
  return (
    <GdsBreadcrumbs>
      {breadcrumbPaths.map((path, index) => {
        const route = routes[path]
        const isLast = index === breadcrumbPaths.length - 1
        const Icon = route?.icon
        
        return (
          <gds-breadcrumb 
            key={path}
            href={!isLast ? path : undefined}
          >
            {Icon && <Icon slot="lead" />}
            {route?.label || path}
          </gds-breadcrumb>
        )
      })}
    </GdsBreadcrumbs>
  )
}
```

### Breadcrumbs with Click Handling

```tsx
const handleBreadcrumbClick = (path: string) => (e: Event) => {
  e.preventDefault()
  // Custom navigation logic
  navigate(path)
  // Analytics tracking
  trackBreadcrumbClick(path)
}

<GdsBreadcrumbs>
  <gds-breadcrumb 
    href="/"
    onClick={handleBreadcrumbClick('/')}
  >
    Home
  </gds-breadcrumb>
  <gds-breadcrumb 
    href="/products"
    onClick={handleBreadcrumbClick('/products')}
  >
    Products
  </gds-breadcrumb>
  <gds-breadcrumb>Current</gds-breadcrumb>
</GdsBreadcrumbs>
```

### Breadcrumbs with Overflow Logic

```tsx
const CollapsibleBreadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  const maxVisible = 4
  const shouldCollapse = items.length > maxVisible
  
  if (!shouldCollapse) {
    return (
      <GdsBreadcrumbs>
        {items.map((item, i) => (
          <gds-breadcrumb 
            key={i}
            href={i < items.length - 1 ? item.path : undefined}
          >
            {item.label}
          </gds-breadcrumb>
        ))}
      </GdsBreadcrumbs>
    )
  }
  
  const first = items[0]
  const hidden = items.slice(1, -2)
  const visible = items.slice(-2)
  
  return (
    <GdsBreadcrumbs>
      <gds-breadcrumb href={first.path}>{first.label}</gds-breadcrumb>
      
      <gds-breadcrumb overflow>
        <gds-context-menu>
          {hidden.map(item => (
            <gds-menu-item key={item.path}>{item.label}</gds-menu-item>
          ))}
        </gds-context-menu>
      </gds-breadcrumb>
      
      {visible.map((item, i) => (
        <gds-breadcrumb 
          key={item.path}
          href={i < visible.length - 1 ? item.path : undefined}
        >
          {item.label}
        </gds-breadcrumb>
      ))}
    </GdsBreadcrumbs>
  )
}
```

## Related Components

- **GdsLink**: Breadcrumb items use link component internally (see [GdsLink.md](./GdsLink.md))
- **GdsMenuButton**: Menu button for navigation menus (see [GdsMenuButton.md](./GdsMenuButton.md))
- **GdsButton**: Used for overflow menu triggers and navigation actions (see [GdsButton.md](./GdsButton.md))
- **GdsContextMenu**: For overflow menus with hidden items
- **Icons**: For breadcrumb item icons (see [Icons.md](./Icons.md))
- **GdsFlex**: For layout of breadcrumbs within page header (see [GdsFlex.md](./GdsFlex.md))

## Accessibility

- Uses semantic `<nav>` element with breadcrumb role
- Provides default ARIA label "breadcrumbs" (customizable via `label` prop)
- Current page indicated with `aria-current="page"`
- Separators are decorative and hidden from screen readers
- Keyboard navigable (tab through links)
- Each breadcrumb item is properly labeled for screen readers

### ARIA Best Practices

```tsx
// Multiple breadcrumb sections on same page
<GdsBreadcrumbs label="Main Navigation">
  {/* Primary site navigation */}
</GdsBreadcrumbs>

<GdsBreadcrumbs label="Document Navigation">
  {/* Document-specific navigation */}
</GdsBreadcrumbs>
```

## Notes

- Breadcrumb items (`<gds-breadcrumb>`) are lowercase web component elements
- Container (`<GdsBreadcrumbs>`) is the React wrapper component
- Separators are automatically rendered between items
- Mobile breakpoint automatically shows only previous page
- Current page (last item) should not have `href` attribute
- Icons enhance usability but are optional
- For React Router, use `to` prop with custom click handlers
- Breadcrumbs should reflect actual site structure, not user journey

## Responsive Behavior

The component automatically handles responsive display:

- **Desktop**: Shows full breadcrumb trail
- **Tablet**: Shows full breadcrumb trail
- **Mobile**: Shows only previous page with back arrow
- **Breakpoint**: Typically around 768px (handled internally)

No additional configuration needed - responsive behavior is built-in.

---

**Reference**: [SEB Green Core Storybook - Breadcrumbs](https://storybook.seb.io/latest/core/?path=/docs/components-breadcrumbs--docs)

Generated: 2025-11-12
