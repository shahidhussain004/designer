# GdsMenuButton

A menu button component that combines button and link behaviors for navigation menus. It provides a unified interface for menu items that can act as both interactive buttons and navigation links, with support for icons, selected states, and both standard and compact sizes.

## Import

```typescript
import { GdsMenuButton } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
import { GdsMenuButton, GdsTheme } from '@sebgroup/green-core/react'
import { IconMagnifyingGlass } from '@sebgroup/green-core/react'

function NavigationMenu() {
  return (
    <GdsTheme>
      <GdsMenuButton>
        <IconMagnifyingGlass slot="lead" />
        Search
      </GdsMenuButton>
    </GdsTheme>
  )
}
```

## Public API

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Whether the menu button is disabled |
| `label` | `string` | `''` | Accessible label for the button when no text is in the default slot |
| `href` | `string` | `''` | When set, renders as an anchor element for navigation |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top'` | `'_self'` | Where to display the linked URL (only used with `href`) |
| `rel` | `string` | `undefined` | Link relationship types. Defaults to "noreferrer noopener" when `target` is set |
| `download` | `string` | `undefined` | Treats the linked URL as a download (only used with `href`) |
| `compact` | `boolean` | `false` | Uses compact styling, mainly for mobile viewports |
| `selected` | `boolean` | `false` | Whether the menu button is currently selected |
| `gds-element` | `string` | `undefined` | The unscoped element name (read-only, set automatically) |

### Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `shadowRootOptions` | `ShadowRootInit` | `{ mode: 'open', delegatesFocus: true }` | Shadow DOM configuration |
| `isDefined` | `boolean` | `false` | Whether the element is defined in the custom element registry (read-only) |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only) |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | The semantic version of this element (read-only) |
| `gdsElementName` | `string` | `undefined` | The unscoped name of this element (read-only) |

### Style Expression Properties

GdsMenuButton supports the following style expression properties for advanced layout control:

#### Sizing
- `width` — Controls width. Supports space tokens and all valid CSS width values
- `min-width` — Controls minimum width
- `max-width` — Controls maximum width
- `inline-size` — Controls inline size
- `min-inline-size` — Controls minimum inline size
- `max-inline-size` — Controls maximum inline size

#### Positioning & Layout
- `align-self` — Controls alignment within parent flex/grid container
- `justify-self` — Controls justification within parent grid container
- `place-self` — Shorthand for `align-self` and `justify-self`

#### Grid Layout
- `grid-column` — Controls grid column placement
- `grid-row` — Controls grid row placement
- `grid-area` — Controls grid area placement

#### Flexbox
- `flex` — Controls flex grow, shrink, and basis
- `order` — Controls order in flex container

#### Spacing
- `margin` — Controls all margins
- `margin-inline` — Controls inline margins (left/right in LTR)
- `margin-block` — Controls block margins (top/bottom)

### Events

| Name | Type | Description |
|------|------|-------------|
| `click` | `Event` | Fired when the button is clicked |
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from the DOM |

### Slots

| Name | Description |
|------|-------------|
| (default) | Main content of the menu button (text label) |
| `lead` | Optional icon slot before the label |
| `trail` | Optional icon slot after the label |

### CSS Shadow Parts

| Name | Description |
|------|-------------|
| `main-slot` | The main slot of the button, between the lead and trail slots |

## Anatomy

1. Link text — The visible label that communicates destination or action.
2. Trailing icon — Optional icon after the label (slot `trail`) used for affordance or external-link indicator.
3. Leading icon — Optional icon before the label (slot `lead`) used for identification (e.g., search, profile).
4. Container — The interactive surface (button or anchor) that receives focus and hit testing.
5. Selected decoration — Visual indicator (underline, highlight, or accent) used to mark the active or current item.

## Usage

Use `GdsMenuButton` for navigation items in toolbars, site headers, and side navigation.
- Prefer text or text+icon labels for clarity.
- Use icon-only variants only when the icon is universally understood and you provide an accessible label via the `label` attribute.
- When the menu item navigates to a different page, prefer `href` so the component renders an anchor element and preserves expected semantics (history, middle-click, open-in-new-tab).
- Use the `selected` attribute to visually indicate the current page or section. When the item is a navigation link, also expose `aria-current="page"` to communicate the active state to assistive technologies.

## Sizes

`GdsMenuButton` supports three visual sizes to fit different navigation contexts:
- Large — For primary navigation where space allows larger buttons and touch targets.
- Medium — Default balance between density and readability.
- Small — Compact presentation for constrained spaces or mobile toolbars.

The component will adapt its height to match the container where appropriate so a row of menu buttons remains visually aligned. Avoid mixing sizes within the same navigation row.

## Accessibility

- Semantic element: prefer `href` for navigation so the component renders an anchor and exposes native link semantics. If you must handle navigation via script, ensure keyboard activation (Enter/Space) behaves like a link and manage focus history appropriately.
- Active state: when used for navigation, pair `selected` with `aria-current="page"` on the rendered anchor to announce the current location to screen readers.
- Icon-only: provide an accessible label using the `label` attribute when the visible text is omitted; do not rely on title/tooltips for primary accessible names.
- Focus: the container is focusable and should present a clear visible focus indicator. Ensure any parent containers do not suppress or hide focus outlines.
- External links: the `rel` attribute defaults to safe values when `target` is set; include an icon and a visible indicator if the link opens in a new tab. Also communicate this to assistive technology where appropriate (visually or via SR-only text).
- Popover triggers: when `GdsMenuButton` is used as a trigger for popovers or menus, ensure the trigger exposes `aria-haspopup` (e.g., `aria-haspopup="true"`) and that `aria-expanded` is updated as the popover opens and closes.

## Keyboard interaction

- Enter / Space: activates the menu button (follow link or dispatch click).
- Tab / Shift+Tab: move focus in and out of the navigation bar normally.
- Arrow keys: if the menu is presented as a roving-menu (vertical or horizontal), implement arrow-key focus management in the container (e.g., the parent menu or toolbar should handle left/right/up/down and move focus between `GdsMenuButton` instances).

## Do's and Don'ts

Do
- Combine text and icons when it helps clarify the purpose of the button, especially for profile, help, or settings links.
- Keep button labels short and descriptive to avoid crowding the navigation bar.
- Use `href` for real navigation so assistive tech and user agents get the correct semantics.

Don't
- Don't mix different sizes of menu buttons within the same navigation bar.
- Don't rely on icon-only buttons unless the icon’s meaning is universally understood; provide an accessible `label` when text is omitted.
- Don't use menu buttons for actions unrelated to navigation. For actions that open dialogs, prefer an explicit button element with clear ARIA for dialogs/popovers.

## Examples

### Basic Menu Button

```tsx
import { GdsMenuButton, GdsTheme } from '@sebgroup/green-core/react'
import { IconMagnifyingGlass } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsMenuButton>
    <IconMagnifyingGlass slot="lead" />
    Search
  </GdsMenuButton>
</GdsTheme>
```

### Selected State

Use the `selected` attribute to indicate the current page or active menu item:

```tsx
import { GdsMenuButton, GdsTheme } from '@sebgroup/green-core/react'
import { IconPeople } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsMenuButton selected>
    <IconPeople solid slot="trail" />
    Profile
  </GdsMenuButton>
</GdsTheme>
```

### Text-Only Menu Button

```tsx
import { GdsMenuButton, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsMenuButton>Search</GdsMenuButton>
</GdsTheme>
```

### As Navigation Link

Use the `href` attribute to render the menu button as a link:

```tsx
import { GdsMenuButton, GdsTheme } from '@sebgroup/green-core/react'
import { IconSquareArrowTopRight } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsMenuButton href="https://github.com/seb-oss/green" target="_blank">
    <IconSquareArrowTopRight slot="trail" />
    External link
  </GdsMenuButton>
</GdsTheme>
```

### Complete Menu Bar

An example of a full menu bar with search, notifications, profile popover, and external link:

```tsx
import { 
  GdsMenuButton, 
  GdsTheme, 
  GdsDiv, 
  GdsFlex,
  GdsPopover 
} from '@sebgroup/green-core/react'
import { 
  IconMagnifyingGlass,
  IconBell,
  IconPeople,
  IconSquareArrowTopRight
} from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsDiv 
    display="flex" 
    height="70px" 
    width="700px" 
    border-color="strong" 
    border-width="0 0 4xs 0"
  >
    <div style={{ flexBasis: '50%' }}>
      <GdsMenuButton>
        <IconMagnifyingGlass slot="lead" />
        Search
      </GdsMenuButton>
    </div>
    <GdsFlex style={{ flexBasis: '50%' }} justify-content="flex-end">
      <GdsMenuButton>
        <IconBell slot="trail" />
        Notification
      </GdsMenuButton>
      <GdsPopover>
        <GdsMenuButton slot="trigger">
          <IconPeople slot="trail" />
          Profile
        </GdsMenuButton>
        <div style={{ padding: '1rem' }}>Profile stuff</div>
      </GdsPopover>
      <GdsMenuButton href="https://github.com/seb-oss/green" target="_blank">
        <IconSquareArrowTopRight slot="trail" />
        External link
      </GdsMenuButton>
    </GdsFlex>
  </GdsDiv>
</GdsTheme>
```

### Compact Menu Bar

Use the `compact` attribute for mobile-friendly menu bars:

```tsx
import { 
  GdsMenuButton, 
  GdsTheme, 
  GdsFlex,
  GdsPopover 
} from '@sebgroup/green-core/react'
import { 
  IconMagnifyingGlass,
  IconBell,
  IconPeople,
  IconSquareArrowTopRight
} from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsFlex 
    width="700px" 
    background="neutral-01" 
    border="0 0 3xs/subtle-01 0" 
    align-items="center"
  >
    <GdsFlex flex="1">
      <GdsMenuButton compact>
        <IconMagnifyingGlass slot="lead" />
        Search
      </GdsMenuButton>
    </GdsFlex>
    <GdsFlex justify-content="flex-end">
      <GdsMenuButton compact>
        <IconBell slot="trail" />
        Notification
      </GdsMenuButton>
      <GdsPopover>
        <GdsMenuButton slot="trigger" compact>
          <IconPeople slot="trail" />
          Profile
        </GdsMenuButton>
        <div style={{ padding: '1rem' }}>Profile stuff</div>
      </GdsPopover>
      <GdsMenuButton compact selected href="https://github.com/seb-oss/green" target="_blank">
        <IconSquareArrowTopRight slot="trail" />
        External link
      </GdsMenuButton>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### Dark Mode Menu Bar

Menu buttons adapt to both light and dark color schemes:

```tsx
import { 
  GdsMenuButton, 
  GdsTheme, 
  GdsFlex,
  GdsPopover 
} from '@sebgroup/green-core/react'
import { 
  IconMagnifyingGlass,
  IconBell,
  IconPeople,
  IconSquareArrowTopRight
} from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsFlex flex-direction="column" gap="l">
    {/* Dark theme menu */}
    <GdsTheme color-scheme="dark">
      <GdsFlex 
        width="700px" 
        background="neutral-01" 
        height="80px" 
        border="0 0 3xs/secondary 0"
      >
        <GdsFlex flex="1">
          <GdsMenuButton>
            <IconMagnifyingGlass slot="lead" />
            Search
          </GdsMenuButton>
        </GdsFlex>
        <GdsFlex>
          <GdsMenuButton>
            <IconBell slot="trail" />
            Notification
          </GdsMenuButton>
          <GdsPopover>
            <GdsMenuButton slot="trigger">
              <IconPeople slot="trail" />
              Profile
            </GdsMenuButton>
            <div style={{ padding: '1rem' }}>Profile stuff</div>
          </GdsPopover>
          <GdsMenuButton selected href="https://github.com/seb-oss/green" target="_blank">
            <IconSquareArrowTopRight slot="trail" />
            External link
          </GdsMenuButton>
        </GdsFlex>
      </GdsFlex>
    </GdsTheme>

    {/* Light theme menu */}
    <GdsTheme color-scheme="light">
      <GdsFlex 
        width="700px" 
        background="neutral-01" 
        height="80px" 
        border="0 0 3xs/secondary 0"
      >
        <GdsFlex flex="1">
          <GdsMenuButton>
            <IconMagnifyingGlass slot="lead" />
            Search
          </GdsMenuButton>
        </GdsFlex>
        <GdsFlex justify-content="flex-end">
          <GdsMenuButton>
            <IconBell slot="trail" />
            Notification
          </GdsMenuButton>
          <GdsPopover>
            <GdsMenuButton slot="trigger">
              <IconPeople slot="trail" />
              Profile
            </GdsMenuButton>
            <div style={{ padding: '1rem' }}>Profile stuff</div>
          </GdsPopover>
          <GdsMenuButton selected href="https://github.com/seb-oss/green" target="_blank">
            <IconSquareArrowTopRight slot="trail" />
            External link
          </GdsMenuButton>
        </GdsFlex>
      </GdsFlex>
    </GdsTheme>
  </GdsFlex>
</GdsTheme>
```

### With Click Handler

```tsx
import { GdsMenuButton, GdsTheme } from '@sebgroup/green-core/react'
import { IconMagnifyingGlass } from '@sebgroup/green-core/react'

function SearchMenu() {
  const handleSearch = () => {
    console.log('Search clicked')
    // Open search dialog, navigate, etc.
  }

  return (
    <GdsTheme>
      <GdsMenuButton onClick={handleSearch}>
        <IconMagnifyingGlass slot="lead" />
        Search
      </GdsMenuButton>
    </GdsTheme>
  )
}
```

### Disabled State

```tsx
import { GdsMenuButton, GdsTheme } from '@sebgroup/green-core/react'
import { IconMagnifyingGlass } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsMenuButton disabled>
    <IconMagnifyingGlass slot="lead" />
    Search
  </GdsMenuButton>
</GdsTheme>
```

## TypeScript

```typescript
import type { GdsMenuButtonProps } from '@sebgroup/green-core/react'

interface GdsMenuButtonProps {
  // Attributes
  disabled?: boolean
  label?: string
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
  download?: string
  compact?: boolean
  selected?: boolean
  'gds-element'?: string

  // Style Expression Properties
  width?: string
  'min-width'?: string
  'max-width'?: string
  'inline-size'?: string
  'min-inline-size'?: string
  'max-inline-size'?: string
  'align-self'?: string
  'justify-self'?: string
  'place-self'?: string
  'grid-column'?: string
  'grid-row'?: string
  'grid-area'?: string
  flex?: string
  order?: string
  margin?: string
  'margin-inline'?: string
  'margin-block'?: string

  // Events
  onClick?: (event: MouseEvent) => void

  // Children/Slots
  children?: React.ReactNode
}

// Usage example
const menuButton: GdsMenuButtonProps = {
  selected: true,
  compact: false,
  onClick: (e) => console.log('Clicked', e)
}
```

## Best Practices

### Navigation Patterns

1. **Selected State**: Always use the `selected` attribute to indicate the current page or active menu item:
   ```tsx
   <GdsMenuButton selected>Current Page</GdsMenuButton>
   ```

2. **Icon Placement**: 
   - Use `lead` slot for action icons (search, add, etc.)
   - Use `trail` slot for status/navigation icons (arrow, external link, etc.)

3. **External Links**: When linking to external URLs, always use `target="_blank"`:
   ```tsx
   <GdsMenuButton href="https://external.com" target="_blank">
     <IconSquareArrowTopRight slot="trail" />
     External Link
   </GdsMenuButton>
   ```

### Accessibility

1. **Descriptive Labels**: When using icon-only buttons, provide a `label` attribute:
   ```tsx
   <GdsMenuButton label="Search">
     <IconMagnifyingGlass />
   </GdsMenuButton>
   ```

2. **Keyboard Navigation**: Menu buttons are fully keyboard accessible:
   - `Tab` to focus
   - `Enter` or `Space` to activate
   - Arrow keys for navigation (when used in menu context)

3. **ARIA Support**: The component automatically handles ARIA attributes for the selected state

4. **Link Semantics**: When using `href`, the component renders as an anchor element with proper semantics

### Responsive Design

1. **Compact Mode**: Use the `compact` attribute for mobile viewports:
   ```tsx
   const isMobile = useMediaQuery('(max-width: 768px)')
   
   <GdsMenuButton compact={isMobile}>
     Mobile Menu
   </GdsMenuButton>
   ```

2. **Flexible Layouts**: Combine with GdsFlex for responsive menu bars:
   ```tsx
   <GdsFlex justify-content="flex-start; m{flex-end}">
     <GdsMenuButton>Menu Item</GdsMenuButton>
   </GdsFlex>
   ```

### Performance

1. **Icon Loading**: Import only the icons you need to reduce bundle size:
   ```tsx
   // Good: Named imports
   import { IconMagnifyingGlass, IconBell } from '@sebgroup/green-core/react'
   
   // Avoid: Default imports of entire icon library
   ```

2. **Event Handlers**: Use `onClick` for simple interactions, `href` for navigation:
   ```tsx
   // For SPA navigation
   <GdsMenuButton onClick={() => navigate('/search')}>Search</GdsMenuButton>
   
   // For page navigation
   <GdsMenuButton href="/search">Search</GdsMenuButton>
   ```

### Layout Integration

1. **Menu Bars**: Use consistent spacing and alignment:
   ```tsx
   <GdsFlex gap="m" align-items="center">
     <GdsMenuButton>Item 1</GdsMenuButton>
     <GdsMenuButton>Item 2</GdsMenuButton>
   </GdsFlex>
   ```

2. **With Popover**: Nest menu buttons inside GdsPopover trigger slots:
   ```tsx
   <GdsPopover>
     <GdsMenuButton slot="trigger">Menu</GdsMenuButton>
     <div>Popover content</div>
   </GdsPopover>
   ```

3. **Grid Layout**: Use style expression properties for grid placement:
   ```tsx
   <GdsMenuButton grid-column="1 / 2" align-self="center">
     Grid Item
   </GdsMenuButton>
   ```

## Common Use Cases

### Application Menu Bar

```tsx
import { GdsMenuButton, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'
import { IconHome, IconBarChart, IconCog, IconPeople } from '@sebgroup/green-core/react'

function AppMenu({ currentPage }: { currentPage: string }) {
  return (
    <GdsTheme>
      <GdsFlex gap="xs" padding="m">
        <GdsMenuButton selected={currentPage === 'home'} href="/home">
          <IconHome slot="lead" />
          Home
        </GdsMenuButton>
        <GdsMenuButton selected={currentPage === 'analytics'} href="/analytics">
          <IconBarChart slot="lead" />
          Analytics
        </GdsMenuButton>
        <GdsMenuButton selected={currentPage === 'team'} href="/team">
          <IconPeople slot="lead" />
          Team
        </GdsMenuButton>
        <GdsMenuButton selected={currentPage === 'settings'} href="/settings">
          <IconCog slot="lead" />
          Settings
        </GdsMenuButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### User Profile Menu

```tsx
import { GdsMenuButton, GdsTheme, GdsPopover, GdsFlex } from '@sebgroup/green-core/react'
import { IconPeople, IconCog, IconArrowRightFromBracket } from '@sebgroup/green-core/react'

function UserMenu() {
  return (
    <GdsTheme>
      <GdsPopover>
        <GdsMenuButton slot="trigger">
          <IconPeople slot="trail" />
          John Doe
        </GdsMenuButton>
        <GdsFlex flex-direction="column" padding="m">
          <GdsMenuButton href="/profile">
            <IconPeople slot="lead" />
            My Profile
          </GdsMenuButton>
          <GdsMenuButton href="/settings">
            <IconCog slot="lead" />
            Settings
          </GdsMenuButton>
          <GdsMenuButton onClick={() => logout()}>
            <IconArrowRightFromBracket slot="lead" />
            Sign Out
          </GdsMenuButton>
        </GdsFlex>
      </GdsPopover>
    </GdsTheme>
  )
}
```

### Responsive Navigation

```tsx
import { GdsMenuButton, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'
import { IconMagnifyingGlass, IconBell, IconPeople } from '@sebgroup/green-core/react'

function ResponsiveNav() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768)

  return (
    <GdsTheme>
      <GdsFlex 
        background="neutral-01" 
        padding={isMobile ? 's' : 'm'}
        justify-content="space-between"
      >
        <GdsMenuButton compact={isMobile}>
          <IconMagnifyingGlass slot="lead" />
          {!isMobile && 'Search'}
        </GdsMenuButton>
        <GdsMenuButton compact={isMobile}>
          <IconBell slot="trail" />
          {!isMobile && 'Notifications'}
        </GdsMenuButton>
        <GdsMenuButton compact={isMobile}>
          <IconPeople slot="trail" />
          {!isMobile && 'Profile'}
        </GdsMenuButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

## Related Components

- [GdsButton](./GdsButton.md) — General-purpose button component
- [GdsLink](./GdsLink.md) — Text links without button styling
- [GdsFab](./GdsFab.md) — Floating action button
- [GdsSignal](./GdsSignal.md) — Notification indicator for trail slot badges
- [GdsPopover](./GdsPopover.md) — For dropdown menus with menu buttons
- [GdsFlex](./GdsFlex.md) — For menu bar layouts
- [GdsDiv](./GdsDiv.md) — For menu container layouts
- [GdsTheme](./GdsTheme.md) — For color scheme control
- [Icons](./Icons.md) — Available icons for lead/trail slots

## Notes

- Menu buttons automatically handle both button and link semantics based on the `href` attribute
- The `selected` state provides visual feedback for the current page or active item
- The `compact` variant is optimized for mobile viewports and tight spaces
- When `target` is set, `rel="noreferrer noopener"` is automatically applied for security
- The component uses Shadow DOM with `delegatesFocus: true` for proper keyboard navigation
- Style expression properties provide advanced layout control without custom CSS
- Use `lead` slot for icons before the label, `trail` slot for icons after
- The component is fully accessible with proper ARIA attributes and keyboard support

---

*Last updated: November 12, 2025*  
*Source: [GdsMenuButton Storybook Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-menu-button--docs)*
