````markdown
# @sebgroup/green-core - Comprehensive Guide

## Overview
Green Core is SEB's design system library providing framework-agnostic Web Components with React 19 integration, following the 2023 design standards with transitional support for 2016 styles.

**Key Architecture:** Each Green Core component includes its own styles internally via Lit CSS. Components like `GdsButton`, `GdsFlex`, `GdsText` etc. have their styling automatically bundled - no separate CSS imports needed.

**Documentation:** https://storybook.seb.io/latest/core | https://seb.io/components

---

## Component Architecture

### Self-Contained Styling
Green Core components use Lit CSS for styling, which means:
- **No global CSS imports needed** - each component (GdsButton, GdsFlex, etc.) includes its styles automatically
- **Component styles are scoped** - styles are embedded within each Web Component via shadow DOM
- **Only fonts need importing** - `@sebgroup/fonts` provides the SEB typography system
- **Design tokens work automatically** - CSS custom properties for spacing, colors, etc. are included with components

### What This Means for Developers
```tsx
// ✅ Correct - only import the component and fonts
import { GdsButton } from '@sebgroup/green-core/react'
import '@sebgroup/fonts'

// ❌ No longer needed - component styles are self-contained
// import '@sebgroup/green-core/core.css'
// import '@sebgroup/green-core/themes/default.css'
```

Each component file like `button.js` automatically includes `button.styles.js` with all the necessary CSS via Lit's styling system.

---

## Installation & Setup

### Installation
```bash
npm install @sebgroup/green-core @sebgroup/fonts
```

### Global Configuration
```tsx
// src/main.tsx
import '@sebgroup/fonts' // SEB SansSerif font

// Note: Component styles are self-contained in Green Core components
// No need to import core.css or themes - styles are included automatically

// Optional: Disable scoping for POCs (not recommended for production)
// (window as any).GDS_DISABLE_VERSIONED_ELEMENTS = true;
```

### Font Integration
```tsx
// Import SEB SansSerif font
import '@sebgroup/fonts'

// The font-family is inherited through shadow DOM boundaries
// All component styling is automatically included with each component import
```

---

## React 19 Integration

### Component Imports (Tree-shakable)
```tsx
// Import components from @sebgroup/green-core/react
import { 
	// Layout & Structure
	GdsGrid, GdsDiv, GdsDivider, GdsCard, GdsHeader,
  
	// Typography & Content  
	GdsText, GdsFormattedAccount, GdsFormattedDate, GdsFormattedNumber, GdsImg, GdsLink,
  
	// Form Controls
	GdsInput, GdsTextarea, GdsSelect, GdsOption,
	GdsCheckbox, GdsCheckboxGroup, GdsRadio, GdsRadioGroup,
	GdsDatepicker, GdsSensitiveDate, GdsDropdown,
  
	// Interactive Elements
	GdsButton, GdsSegmentedControl, GdsSegment, GdsDropdown, GdsFab,
  
	// Navigation & Menus
	GdsBreadcrumbs, GdsContextMenu, GdsMenuItem,
  
	// Feedback & Status
	GdsAlert, GdsBadge, GdsSpinner, GdsSignal, GdsCoachmark,
  
	// Overlays & Modals
	GdsDialog, GdsPopover, GdsDetails,
  
	// Specialized Components
	GdsCalendar, GdsFilterChips, GdsFilterChip, GdsFormSummary,
	GdsTheme,
  
	// Utilities
	GdsBlur,
  
	// Icons & Utilities
	IconBank, applyTriggerAriaAttributes
} from '@sebgroup/green-core/react'

// Icons (separate import)
import { 
	GdsIconHome, GdsIconUser, GdsIconEdit, GdsIconDelete,
	GdsIconCalendar, GdsIconSearch, GdsIconClose, GdsIconCheck
} from '@sebgroup/green-core/icons'
```

// Icons (separate import)
import { 
	GdsIconHome, GdsIconUser, GdsIconEdit, GdsIconDelete,
	GdsIconCalendar, GdsIconSearch, GdsIconClose, GdsIconCheck
} from '@sebgroup/green-core/icons'

### Event Handling (React-specific)
```tsx
// Green Core events use camelCase in React
// gds-ui-state → onGdsUiState
// gds-change → onGdsChange
// input → onInput (NOT onChange)

const [email, setEmail] = useState('')

<GdsInput
	label="Email Address"
	type="email" 
	value={email}
	onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
	onGdsChange={(e) => console.log('Custom event:', e.detail)}
/
```

---

## Core Components by Category

### Theme & Design

#### GdsTheme - Color Schemes & Design Versions

**📖 Complete GdsTheme documentation: [`GdsTheme.md`](./GdsTheme.md)** *(Beta)*

```tsx
import { GdsTheme } from '@sebgroup/green-core/react'

// Application root theme (typical use)
function App() {
  return (
    <GdsTheme color-scheme="auto" design-version="2023">
      <AppRouter />
      <AppContent />
    </GdsTheme>
  )
}

// Theme toggle with state
function ThemedApp() {
  const [isDark, setIsDark] = useState(false)
  
  return (
    <GdsTheme color-scheme={isDark ? 'dark' : 'light'}>
      <GdsButton onClick={() => setIsDark(!isDark)}>
        {isDark ? <IconMoon /> : <IconSun />}
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </GdsButton>
      <AppContent />
    </GdsTheme>
  )
}

// Auto mode (respects system preference)
<GdsTheme color-scheme="auto">
  {/* Automatically switches between light/dark based on prefers-color-scheme */}
  <GdsCard>
    <GdsText>Content adapts to system preference</GdsText>
  </GdsCard>
</GdsTheme>

// Nested themes (override for specific sections)
<GdsTheme color-scheme="light">
  <MainContent />
  
  <GdsTheme color-scheme="dark">
    <GdsCard variant="tertiary">
      <GdsText>Dark sidebar in light app</GdsText>
    </GdsCard>
  </GdsTheme>
</GdsTheme>

// Comparing 2023 vs 2016 design versions
<GdsGrid columns="2" gap="m">
  <GdsTheme design-version="2023" color-scheme="light">
    <GdsCard>
      <GdsText font="heading-s">2023 Design</GdsText>
      <GdsButton variant="primary">Modern Button</GdsButton>
    </GdsCard>
  </GdsTheme>
  
  <GdsTheme design-version="2016" color-scheme="light">
    <GdsCard>
      <GdsText font="heading-s">2016 Design</GdsText>
      <GdsButton variant="primary">Legacy Button</GdsButton>
    </GdsCard>
  </GdsTheme>
</GdsGrid>
```

**Key Features:**
- **Three Color Schemes**: `light` (default), `dark`, `auto` (system preference)
- **Two Design Versions**: `2023` (modern, default), `2016` (legacy, requires Transitional Styles)
- **Nested Themes**: Override theme for specific sections
- **Event Tracking**: Emits `gds-color-scheme-changed` and `gds-design-version-changed` events
- **Lightweight**: Minimal performance impact

**Important Notes:**
- **Beta Status**: Component API may change in future releases
- **Application Root**: Typically used at application root for global theming
- **Auto Mode**: Respects `prefers-color-scheme` system setting when set to `auto`
- **2016 Support**: For `design-version="2016"`, Transitional Styles must be imported and registered
- **All Components Adapt**: All Green Core components respect theme settings
- **React Context**: Consider wrapping in custom Context Provider for global theme state
- **Persistence**: Persist user preference in localStorage for better UX
- **Migration Path**: Provides smooth migration from 2016 to 2023 design system

### Layout & Structure

```tsx
import { 
  GdsGrid, 
  GdsDiv, 
  GdsFlex, 
  GdsContainer, 
  GdsCard, 
  GdsGroupedList, 
  GdsListItem, 
  GdsDivider 
} from '@sebgroup/green-core/react'
```

#### GdsGrid - Responsive Grid System

**📖 Complete GdsGrid documentation: [`GdsGrid.md`](./GdsGrid.md)**

```tsx
// Responsive grid with breakpoints (correct syntax)
<GdsGrid 
  columns="s{1} m{2} l{4}"  // Mobile: 1, Tablet: 2, Desktop: 4 columns
  gap="s{s} m{m} l{xl}"     // Responsive gap sizes
  padding="s{m} m{l} l{2xl}" // Responsive padding
>
  <GdsCard>Item 1</GdsCard>
  <GdsCard>Item 2</GdsCard>
  <GdsCard>Item 3</GdsCard>
  <GdsCard>Item 4</GdsCard>
</GdsGrid>

// Simple grid with auto-columns (fluid responsive)
<GdsGrid gap="m" auto-columns="s{200} m{220} l{240}">
  <GdsCard>Item 1</GdsCard>
  <GdsCard>Item 2</GdsCard>
  <GdsCard>Item 3</GdsCard>
</GdsGrid>

// Fixed columns with uniform sizing
<GdsGrid columns="4" gap="xl" padding="2xl">
  <GdsCard>Item 1</GdsCard>
  <GdsCard>Item 2</GdsCard>
</GdsGrid>
```

**Key Points:**
- Extends GdsDiv with all its capabilities
- Uses breakpoint syntax: `s{value} m{value} l{value}` (small, medium, large)
- `auto-columns` enables fluid responsive behavior without explicit column counts
- Supports all style expression properties from GdsDiv

#### GdsDiv - Base Container Element

**📖 Complete GdsDiv documentation: [`GdsDiv.md`](./GdsDiv.md)**

```tsx
// Basic container with styling
import { GdsDiv } from '@sebgroup/green-core/react'

<GdsDiv 
  background="neutral-01" 
  padding="l" 
  border-radius="m"
>
  Content with styled container
</GdsDiv>

// Flex layout (alternative to GdsFlex)
<GdsDiv 
  display="flex" 
  gap="xl" 
  justify-content="center" 
  align-items="center"
>
  <GdsDiv width="4xl" height="4xl" background="neutral-01" />
  <GdsDiv width="4xl" height="4xl" background="neutral-02" />
</GdsDiv>

// Responsive sizing with viewport expressions
<GdsDiv
  width="4xl; l{ 6xl }"
  height="4xl; l{ 6xl }"
  background="neutral-02"
  border="4xs"
>
  Larger on large viewports
</GdsDiv>

// Border styling variations
<GdsDiv border="4xs" padding="m">
  Simple 1px border
</GdsDiv>

<GdsDiv border-width="0 0 4xs 0" padding="m">
  Bottom border only
</GdsDiv>

<GdsDiv 
  border="2xs" 
  border-color="strong" 
  border-radius="m" 
  padding="m"
>
  Colored border with radius
</GdsDiv>

// Color tokens with transparency
<GdsDiv
  background="neutral-01/0.5"
  border-color="subtle-01/0.2"
  border="4xs"
  padding="l"
>
  Semi-transparent styling
</GdsDiv>

// Shadow variations
<GdsDiv box-shadow="xs" padding="l" background="03">
  Extra Small Shadow
</GdsDiv>
<GdsDiv box-shadow="m" padding="l" background="03">
  Medium Shadow
</GdsDiv>
<GdsDiv box-shadow="xl" padding="l" background="03">
  Extra Large Shadow
</GdsDiv>

// Positioned container
<GdsDiv position="relative" height="300px">
  <GdsDiv
    position="absolute"
    inset="m"
    background="neutral-02"
    padding="m"
  >
    Absolutely positioned
  </GdsDiv>
</GdsDiv>
```

**Key Properties:**
- **level**: `GdsColorLevel` - Color token resolution level (default: `'2'`)
- **background**: Color tokens with optional transparency (`neutral-01/0.5`)
- **border**: Shorthand (width/style/color) or individual properties
- **border-radius**: Space tokens for corners (`s`, `m`, `l`, etc.)
- **box-shadow**: Shadow tokens (`xs`, `s`, `m`, `l`, `xl`)
- **display**: All CSS display values
- **width**, **height**: Space tokens or CSS values
- **padding**, **margin**: Space tokens only
- **gap**: Space tokens for flex/grid children
- **All flex/grid properties**: Complete flexbox and grid support
- **Multi-viewport expressions**: Responsive values (`value; breakpoint{ value }`)

**Notes:**
- GdsDiv is the base class for GdsFlex, GdsGrid, GdsCard, and GdsText
- Use specialized components when appropriate (GdsFlex for flex layouts, GdsCard for cards)
- All spacing uses tokens for consistency
- Color tokens support transparency with `/opacity` syntax
- Border defaults: `subtle-01` color, `solid` style

#### GdsCard - Content Grouping

**📖 Complete GdsCard documentation: [`GdsCard.md`](./GdsCard.md)**

```tsx
// Basic card
import { GdsCard } from '@sebgroup/green-core/react'

<gds-card style={{ maxWidth: '300px' }}>
  Card content
</gds-card>

// Card with variant
<gds-card variant="secondary" border-radius="xs" padding="l">
  <GdsFlex flexDirection="column" gap="m">
    <GdsText font="heading-s">Card Title</GdsText>
    <GdsText>Card content with proper typography</GdsText>
    <GdsButton>Action</GdsButton>
  </GdsFlex>
</gds-card>

// Card with shadow
<gds-card 
  variant="secondary"
  box-shadow="m" 
  border-radius="xs"
  padding="l"
>
  Elevated card
</gds-card>

// Cards in grid layout
<GdsGrid columns="1; s{2}; m{3}" gap="l">
  <gds-card border-radius="xs" padding="l" variant="primary">
    Primary Card
  </gds-card>
  <gds-card border-radius="xs" padding="l" variant="secondary">
    Secondary Card
  </gds-card>
  <gds-card border-radius="xs" padding="l" variant="tertiary">
    Tertiary Card
  </gds-card>
</GdsGrid>

// Grid spanning with cards
<GdsGrid columns="4" gap="l">
  {/* Sidebar - 1 column */}
  <gds-div>
    <gds-card border-radius="xs">
      Sidebar
    </gds-card>
  </gds-div>
  
  {/* Main - Spans columns 2 to end */}
  <gds-div grid-column="2 / -1" grid-row="1 / -1">
    <gds-card border-radius="xs">
      Main Content
    </gds-card>
  </gds-div>
  
  {/* Footer - Spans all columns */}
  <gds-div grid-column="1 / -1">
    <gds-card border-radius="xs">
      Footer
    </gds-card>
  </gds-div>
</GdsGrid>

// Dashboard card with metrics
<gds-card border-radius="xs" padding="l" variant="secondary">
  <GdsFlex flexDirection="column" gap="m">
    <GdsFlex justifyContent="space-between" alignItems="center">
      <GdsText font="detail-m">Total Revenue</GdsText>
      <GdsBadge variant="positive" size="small">+12%</GdsBadge>
    </GdsFlex>
    <GdsText font="heading-xl">$45,231</GdsText>
    <GdsText font="detail-s" color="secondary">
      +20.1% from last month
    </GdsText>
  </GdsFlex>
</gds-card>
```

**Key Properties:**
- **variant**: Color variants - `'primary'`, `'secondary'`, `'tertiary'`, `'brand-01'`, `'brand-02'`, `'positive'`, `'negative'`, `'notice'`, `'warning'`, `'information'`
- **box-shadow**: Shadow tokens - `'xs'`, `'s'`, `'m'`, `'l'`, `'xl'`, `'2xl'`
- **border-radius**: Space tokens for rounded corners
- **level**: Color token resolution level (1-4), default is 2
- **padding/margin**: Space tokens for spacing
- **grid-column/grid-row**: Grid spanning support

**Note:** GdsCard extends GdsDiv, so all GdsDiv properties are available. Use lowercase `<gds-card>` in JSX for proper React integration.

---

#### GdsGroupedList & GdsListItem - Structured Data Lists

**Documentation:** [GdsGroupedList.md](./GdsGroupedList.md)

```tsx
import { GdsGroupedList, GdsListItem } from '@sebgroup/green-core/react'
```

GdsGroupedList and GdsListItem display structured data with labels in a list format. Items can be grouped under headings and support actions like links or buttons.

```tsx
// Basic list
<GdsGroupedList>
  <GdsListItem>Item 1</GdsListItem>
  <GdsListItem>Item 2</GdsListItem>
  <GdsListItem>Item 3</GdsListItem>
</GdsGroupedList>

// With label/heading
<GdsGroupedList label="Account Details">
  <GdsListItem>Item 1</GdsListItem>
  <GdsListItem>Item 2</GdsListItem>
</GdsGroupedList>

// Key-value pairs (default space-between layout)
<GdsGroupedList label="Example with values">
  <GdsListItem>
    <div>Key 1</div>
    <strong>Value 1</strong>
  </GdsListItem>
  <GdsListItem>
    <div>Key 2</div>
    <strong>Value 2</strong>
  </GdsListItem>
  <GdsListItem>
    <div>Key 3</div>
    <strong>Value 3</strong>
  </GdsListItem>
</GdsGroupedList>

// With links or buttons
<GdsGroupedList label="Transaction History">
  <GdsListItem>
    <div>Coffee Shop</div>
    <strong>-$4.50</strong>
    <a href="#">Details</a>
  </GdsListItem>
  <GdsListItem>
    <div>Grocery Store</div>
    <strong>-$56.78</strong>
    <GdsButton rank="tertiary" size="small">Details</GdsButton>
  </GdsListItem>
</GdsGroupedList>

// Account information with formatted components
<GdsCard padding="m">
  <GdsGroupedList label="Account Information">
    <GdsListItem>
      <GdsText>Account Number</GdsText>
      <GdsFormattedAccount>54400023423</GdsFormattedAccount>
    </GdsListItem>
    <GdsListItem>
      <GdsText>Available Balance</GdsText>
      <GdsFormattedNumber format="currency" currency="SEK">
        15250.75
      </GdsFormattedNumber>
    </GdsListItem>
    <GdsListItem>
      <GdsText>Last Updated</GdsText>
      <GdsFormattedDate format="dateShort">
        2025-02-25T13:17:30.000Z
      </GdsFormattedDate>
    </GdsListItem>
  </GdsGroupedList>
</GdsCard>

// Custom layout - left aligned
<GdsGroupedList label="Left aligned list">
  <GdsListItem style={{ justifyContent: 'left' }}>
    <div>Key 1</div>
    <strong>Value 1</strong>
    <div><a href="#">Link</a></div>
  </GdsListItem>
</GdsGroupedList>

// Vertical layout
<GdsGroupedList label="Vertical list">
  <GdsListItem style={{ flexDirection: 'column', borderWidth: 0 }}>
    <div>Key 1</div>
    <strong>Value 1</strong>
  </GdsListItem>
  <GdsListItem style={{ flexDirection: 'column', borderWidth: 0 }}>
    <div>Key 2</div>
    <strong>Value 2</strong>
  </GdsListItem>
</GdsGroupedList>

// Multiple grouped lists
<GdsFlex flex-direction="column" gap="m">
  <GdsGroupedList label="Personal Information">
    <GdsListItem>
      <GdsText>Full Name</GdsText>
      <GdsText font="body-m">John Doe</GdsText>
    </GdsListItem>
    <GdsListItem>
      <GdsText>Email</GdsText>
      <GdsText font="body-m">john.doe@example.com</GdsText>
    </GdsListItem>
  </GdsGroupedList>
  
  <GdsGroupedList label="Address">
    <GdsListItem>
      <GdsText>City</GdsText>
      <GdsText font="body-m">Stockholm</GdsText>
    </GdsListItem>
    <GdsListItem>
      <GdsText>Postal Code</GdsText>
      <GdsText font="body-m">123 45</GdsText>
    </GdsListItem>
  </GdsGroupedList>
</GdsFlex>

// Transaction details with grouped sections
<GdsCard padding="m">
  <GdsFlex flex-direction="column" gap="m">
    <GdsText tag="h3" font="heading-m">Transaction Details</GdsText>
    
    <GdsGroupedList label="Basic Information">
      <GdsListItem>
        <GdsText>Transaction ID</GdsText>
        <GdsText font="detail-m">TXN-2025-0001234</GdsText>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Date</GdsText>
        <GdsFormattedDate format="dateLongWithWeekday">
          2025-02-25T13:17:30.000Z
        </GdsFormattedDate>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Status</GdsText>
        <GdsBadge variant="positive">Completed</GdsBadge>
      </GdsListItem>
    </GdsGroupedList>
    
    <GdsGroupedList label="Amount Details">
      <GdsListItem>
        <GdsText>Amount</GdsText>
        <GdsFormattedNumber format="currency" currency="SEK">
          1234.50
        </GdsFormattedNumber>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Total</GdsText>
        <GdsFormattedNumber format="currency" currency="SEK" font="heading-s">
          1239.50
        </GdsFormattedNumber>
      </GdsListItem>
    </GdsGroupedList>
  </GdsFlex>
</GdsCard>
```

**Key Features:**
- **label**: Optional heading for the list
- **Default Layout**: List items are flex containers with `justify-content: space-between`
- **Custom Styling**: Use inline styles or CSS classes for layout customization
- **Actions**: Support for links, buttons, and other interactive elements
- **Nested Components**: Works with all Green Core components (GdsText, GdsFormattedNumber, etc.)

**Layout Patterns:**
- Default: Space-between horizontal layout (key-value pairs)
- Left-aligned: Set `justifyContent: 'left'` on list items
- Vertical: Set `flexDirection: 'column'` on list items
- Custom: Any valid CSS flex properties

**Common Use Cases:**
- Account/profile information displays
- Transaction details and history
- Product specifications
- Order summaries
- Settings lists with actions
- Contact information

**Important Notes:**
- GdsListItem must be direct children of GdsGroupedList
- List items default to flex containers
- Label renders as heading with class `gds-list-heading`
- Supports any HTML content within list items
- Use inline styles for layout customization

---

#### GdsDivider - Content Separation

**📖 Complete GdsDivider documentation: [`GdsDivider.md`](./GdsDivider.md)**

```tsx
// Visual and semantic content separation
import { GdsDivider } from '@sebgroup/green-core/react'

// Basic divider
<GdsText>Section 1</GdsText>
<GdsDivider />
<GdsText>Section 2</GdsText>

// With spacing control (size affects spacing, not line thickness)
<GdsDivider size="2xl" />

// With color
<GdsDivider color="subtle-01" size="2xl" />

// With opacity
<GdsDivider opacity="0.3" size="2xl" />

// Visual-only separator (not announced by screen readers)
<GdsDivider role="presentation" />

// Card content sections
<GdsCard padding="xl">
  <GdsFlex flex-direction="column">
    <GdsText tag="h3">Account Information</GdsText>
    <GdsText>Account Number: 123456789</GdsText>
    
    <GdsDivider size="2xl" color="subtle-01" />
    
    <GdsText tag="h3">Balance</GdsText>
    <GdsText>Current Balance: $1,234.56</GdsText>
  </GdsFlex>
</GdsCard>

// List item separation
<GdsFlex flex-direction="column">
  <GdsFlex padding="m" justify-content="space-between">
    <GdsText>Item 1</GdsText>
    <GdsText>$10.00</GdsText>
  </GdsFlex>
  
  <GdsDivider role="presentation" />
  
  <GdsFlex padding="m" justify-content="space-between">
    <GdsText>Item 2</GdsText>
    <GdsText>$25.00</GdsText>
  </GdsFlex>
</GdsFlex>

// Form section separation
<GdsFlex flex-direction="column" gap="m">
  <GdsText tag="h3">Personal Information</GdsText>
  <GdsInput label="Name" />
  
  <GdsDivider size="3xl" color="subtle-01" />
  
  <GdsText tag="h3">Address</GdsText>
  <GdsInput label="Street" />
</GdsFlex>

// Semantic color dividers
<GdsDivider color="positive-01" size="2xl" />
<GdsDivider color="information-01" size="2xl" />
<GdsDivider color="warning-01" size="2xl" />
```

**Key Properties:**
- **color**: Border color tokens (`subtle-01`, `subtle-02`, `strong`, `interactive`, `inverse`, semantic colors)
- **size**: Space token for spacing around divider (`xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`)
- **opacity**: Opacity value as string (`'0.2'`, `'0.5'`, `'0.8'`)
- **role**: Set to `'presentation'` for visual-only separation (not announced by screen readers)
- **width**: Custom width (supports space tokens and CSS values)

**Available Color Tokens:**
- Structure: `subtle-01`, `subtle-02`, `strong`, `interactive`, `inverse`
- Semantic: `information-01/02`, `positive-01/02`, `negative-01/02`, `warning-01/02`, `notice-01/02`

**Notes:**
- Default role is semantic separator (announced by screen readers as thematic break)
- Use `role="presentation"` for purely decorative visual separations
- The `size` property controls spacing *around* the divider, not line thickness
- Do NOT use GdsDivider as container borders - use container's `border` property instead
- Dividers are for separating content sections, not outlining elements
- Lower opacity values (`0.2`, `0.3`) create subtle separations
- Match color to context (card variant, alert type, etc.)

---

### Icons, Images & Typography

```tsx
import { 
  // Icons (use Icon prefix, NOT Gds)
  IconBank, 
  IconHomeOpen, 
  IconZap,
  // Typography & Media
  GdsText,
  GdsImg,
  GdsFormattedAccount,
  GdsFormattedDate,
  GdsFormattedNumber
} from '@sebgroup/green-core/react'
```

#### Icons - Visual Communication

**📖 Complete Icon documentation: [`Icons.md`](./Icons.md)**

```tsx
// Import icon components
import { IconBank, IconHomeOpen, IconZap } from '@sebgroup/green-core/react'
```

Icons use the Central Icon System by Iconist, designed on a 24×24 px grid with optimal clarity. All icons support two styles (regular and solid), flexible sizing, and full color customization.

```tsx
// Basic icon
<IconBank />

// With size (xs, s, m, l, xl, 2xl, 3xl, 4xl or custom)
<IconBank size="l" />

// Solid style (for selected states)
<IconBank solid />

// With color token
<IconBank color="positive" />
<IconBank color="primary/0.5" />  {/* With transparency */}

// With accessible label
<IconBank label="Bank account" />

// In components
<GdsButton rank="primary">
  <IconHomeOpen slot="lead" />
  Home
</GdsButton>

<GdsAlert variant="positive">
  <IconCircleCheck slot="lead" />
  Success message
</GdsAlert>
```

**Key Features:**
- **Naming**: Use `Icon` prefix (NOT `Gds`) — `IconBank`, `IconZap`, not `GdsIconBank`
- **Styles**: Regular (default) and Solid (for selected states)
- **Sizing**: Token-based (`xs` to `4xl`) or custom (`48px`, `2lh`)
- **Colors**: Inherits text color, supports all tokens with transparency
- **Accessibility**: Optional `label` attribute for screen readers
- **Layout**: Full style expression property support (margin, grid, flex, etc.)

**Common Patterns:**
```tsx
// Icon button
<GdsButton rank="tertiary">
  <IconSettings slot="lead" label="Settings" />
</GdsButton>

// Icon with text
<GdsFlex gap="xs" align-items="center">
  <IconCircleCheck size="m" color="positive" />
  <GdsText>Completed</GdsText>
</GdsFlex>

// Status indicators
<IconCircleCheck color="positive" label="Success" />
<IconCircleX color="negative" label="Error" />
<IconCircleInfo color="information" label="Info" />
```

**Available Icons:** 200+ icons across categories:
- Arrows & Navigation
- Brands (App Store, BankID, GitHub, etc.)
- Buildings & Places
- Communication & Social
- Date & Time
- Devices & Hardware
- Finance & Commerce
- General UI & Controls
- Media Controls
- People & Groups
- Things & Objects
- Utilities & Files
- Weather & Environment

See [`Icons.md`](./Icons.md) for complete list and naming conventions.

---

#### GdsText - Typography System  
```tsx
// Comprehensive text component with official API
<GdsText 
	tag="h1"                    // h1, h2, h3, h4, h5, h6, p, span, em, mark, strong, small
	font="heading-xl"           // Font token: display-*, heading-*, body-regular-*, body-semibold-*, detail-*
	level="2"                   // Color level for design system integration
	margin-bottom="m"           // Style expression property (use kebab-case)
	text-transform="uppercase"  // uppercase, lowercase, capitalize, none
	text-decoration="underline" // underline, overline, line-through, etc.
>
	SEB Banking Forms
</GdsText>

// Font Tokens Reference:
// Display: display-l, display-m, display-s
// Heading: heading-xl, heading-l, heading-m, heading-s, heading-xs
// Body Regular: body-regular-l (18px), body-regular-m (16px), body-regular-s (14px)
// Body Semibold: body-semibold-l, body-semibold-m, body-semibold-s
// Detail Regular: detail-regular-l, detail-regular-m, detail-regular-s
// Detail Semibold: detail-semibold-l, detail-semibold-m, detail-semibold-s

// Heading tags auto-apply font sizes (can be overridden with font property):
// h1 → heading-xl, h2 → heading-l, h3 → heading-m, etc.

// Style Expression Properties (use kebab-case):
// Margin: margin, margin-top, margin-bottom, margin-left, margin-right
// Padding: padding, padding-top, padding-bottom, padding-left, padding-right
// Layout: width, height, max-width, display, white-space, overflow-wrap
// Text: text-transform, text-decoration, font-weight
// Other: cursor, pointer-events, aspect-ratio

// Truncation example:
<GdsText lines={2} font="body-regular-m">
	Long text that will be truncated after 2 lines...
</GdsText>
```

---

#### GdsImg - Image Component

**📖 Complete GdsImg documentation: [`GdsImg.md`](./GdsImg.md)**

```tsx
// Basic image with responsive loading
import { GdsImg } from '@sebgroup/green-core/react'

<GdsImg 
  src="https://example.com/image.jpg"
  alt="Descriptive text"
/>

// With aspect ratio and object fit
<GdsImg 
  src="https://example.com/product.jpg"
  alt="Product photo"
  aspect-ratio="16/9"
  object-fit="cover"
  border-radius="m"
/>

// Responsive images with srcset
<GdsImg
  src="https://example.com/image-800.jpg"
  srcset="
    https://example.com/image-320.jpg 320w,
    https://example.com/image-800.jpg 800w,
    https://example.com/image-1200.jpg 1200w
  "
  sizes="(max-width: 320px) 280px, (max-width: 800px) 760px, 100vw"
  alt="Responsive image"
  aspect-ratio="16/9"
  object-fit="cover"
/>

// High-DPI displays
<GdsImg
  src="https://example.com/image.jpg"
  srcset="https://example.com/image.jpg 1x, https://example.com/image-2x.jpg 2x"
  alt="Retina-ready image"
/>

// Responsive aspect ratios
<GdsImg 
  src="https://example.com/image.jpg"
  alt="Adaptive image"
  aspect-ratio="l{16/9} m{4/3} s{1/1}"
  object-fit="cover"
/>

// In card layout
<GdsCard>
  <GdsImg 
    src="https://example.com/card-image.jpg"
    alt="Card image"
    aspect-ratio="16/9"
    object-fit="cover"
    border-radius="m m none none"
  />
  <GdsFlex flex-direction="column" gap="s" padding="m">
    <GdsText tag="h3" font="heading-m">Title</GdsText>
    <GdsText>Description</GdsText>
  </GdsFlex>
</GdsCard>

// Avatar/profile
<GdsImg 
  src="https://example.com/avatar.jpg"
  alt="User avatar"
  aspect-ratio="1/1"
  object-fit="cover"
  border-radius="max"
  width="64px"
/>
```

**Key Properties:**
- **src**: Image URL (required)
- **alt**: Alternative text (required for accessibility)
- **srcset**: Responsive image sources
- **sizes**: Viewport-based image sizes
- **aspect-ratio**: Token-based ratios with responsive breakpoints
- **object-fit**: `cover`, `contain`, `fill`, `none`, `scale-down`
- **object-position**: Position within container
- **border-radius**: Size tokens, per-corner, responsive
- **loading**: `lazy` (default) or `eager`
- **opacity**: Control transparency

**Common Aspect Ratios:**
- `1/1`: Square (avatars, thumbnails)
- `4/3`: Classic (photos, presentations)
- `16/9`: Widescreen (videos, hero images)
- `21/9`: Ultra-wide (cinematic banners)

**Responsive Syntax:**
```tsx
// Different ratios per breakpoint
aspect-ratio="l{16/9} m{4/3} s{1/1}"

// Different radius per breakpoint
border-radius="s{xs} m{s} l{m}"
```

**Accessibility:**
- Always provide descriptive `alt` text
- Use `alt=""` for decorative images
- Ensure sufficient contrast for text overlays

---

#### GdsVideo - Video Component

**📖 Complete GdsVideo documentation: [`GdsVideo.md`](./GdsVideo.md)**

Video component for embedding and displaying video content with responsive aspect ratios and object-fit control.

```tsx
// Basic video
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsVideo 
    src="https://api.seb.io/components/video/video.mp4"
  />
</GdsTheme>

// Autoplay background video
<GdsVideo 
  src="https://api.seb.io/components/video/hero.mp4"
  autoplay
  muted
  loop
  playsinline
  aspect-ratio="16/9"
  object-fit="cover"
/>

// Responsive aspect ratio
<GdsVideo 
  src="video.mp4"
  aspect-ratio="l{16/9} m{4/3} s{1/1}"
  poster="poster.jpg"
/>

// Video with border radius
<GdsVideo 
  src="video.mp4"
  aspect-ratio="16/9"
  border-radius="s"
  autoplay
  muted
  loop
/>

// Hero video background with overlay
<div style={{ position: 'relative', height: '80vh' }}>
  <GdsVideo 
    src="hero.mp4"
    autoplay
    muted
    loop
    playsinline
    object-fit="cover"
    width="100%"
    height="100%"
    opacity="0.4"
  />
  <div style={{ 
    position: 'absolute', 
    inset: 0, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: 'white'
  }}>
    <h1>Welcome</h1>
  </div>
</div>
```

**Key Attributes:**
- **src**: Video URL (required)
- **poster**: Poster image URL (recommended)
- **autoplay**: Auto-start playback (requires muted)
- **muted**: Mute audio
- **loop**: Continuous playback
- **playsinline**: Play inline on mobile (no fullscreen)

**Key Properties:**
- **aspect-ratio**: Token-based ratios with responsive breakpoints (16/9, 4/3, 1/1, 21/9)
- **object-fit**: `cover`, `contain`, `fill`, `none`, `scale-down`
- **object-position**: Position within container
- **border-radius**: Size tokens from design system
- **opacity**: Control transparency (useful for overlays)
- **pointer-events**: Control interaction

**Responsive Syntax:**
```tsx
// Different ratios per breakpoint
aspect-ratio="l{16/9} m{4/3} s{1/1}"
```

**Important Notes:**
- **Autoplay with Mute**: Always use `muted` with `autoplay` (browser requirement)
- **Mobile Playback**: Use `playsinline` to prevent fullscreen on iOS
- **Performance**: Always provide `poster` image for faster load
- **Accessibility**: Provide captions/subtitles for important content
- **File Optimization**: Compress videos to reduce bandwidth usage
- **Style Expression Properties**: Supports all size, spacing, and layout properties

---

#### GdsMask - Gradient Overlay Component

**📖 Complete GdsMask documentation: [`GdsMask.md`](./GdsMask.md)**

```tsx
import { GdsMask } from '@sebgroup/green-core/react'

// Basic image overlay
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/image.jpg" />
  
  <GdsMask
    background="neutral-01/0.8"
    mask-image="top"
    position="absolute"
    inset="50% 0 0 0"
  >
    <GdsTheme color-scheme="dark">
      <GdsFlex flex-direction="column" gap="m" padding="xl">
        <GdsText font="display-m">Overlay Title</GdsText>
        <GdsText>Content description</GdsText>
      </GdsFlex>
    </GdsTheme>
  </GdsMask>
</GdsCard>

// Full cover mask
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/background.jpg" />
  
  <GdsMask
    background="neutral-01/0.9"
    position="absolute"
    inset="0"
    flex-direction="column"
    justify-content="center"
    align-items="center"
    padding="2xl"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-xl">Centered Content</GdsText>
      <GdsButton rank="primary">Take Action</GdsButton>
    </GdsTheme>
  </GdsMask>
</GdsCard>

// Gradient from top
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/hero.jpg" />
  
  <GdsMask
    background="neutral-01/0.9"
    mask-image="top"
    position="absolute"
    inset="0"
    flex-direction="column"
    justify-content="flex-end"
    padding="xl"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-l">Title at Bottom</GdsText>
      <GdsText>Gradient fades from top</GdsText>
    </GdsTheme>
  </GdsMask>
</GdsCard>

// Responsive gradient with backdrop blur
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/woods-cabin.jpeg" />
  
  <GdsMask
    background="neutral-01/0.9"
    mask-image="top"
    position="absolute"
    inset="0; m{50% 0 0 0}"  // Full on small, bottom half on medium+
    level="3"
    flex-direction="column"
    justify-content="flex-end"
    padding="xl; s{2xl} m{6xl}"
    backdrop-filter="s{10px} m{20px}"
  >
    <GdsTheme color-scheme="dark">
      <GdsFlex flex-direction="column" gap="s">
        <GdsText font="display-s; m{display-xl}" font-weight="light">
          Sustainability
        </GdsText>
        <GdsText font="body-xs; body-s">
          Actively supporting the net zero transition.
        </GdsText>
      </GdsFlex>
      <GdsButton>Our Impact</GdsButton>
    </GdsTheme>
  </GdsMask>
</GdsCard>

// Hero section with mask
<GdsCard position="relative" padding="0" overflow="hidden" height="600px">
  <GdsImg 
    src="https://example.com/hero.jpg"
    object-fit="cover"
    width="100%"
    height="100%"
  />
  
  <GdsMask
    background="neutral-01/0.85"
    mask-image="top"
    position="absolute"
    inset="0"
    flex-direction="column"
    justify-content="flex-end"
    gap="xl"
    padding="6xl"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-2xl">Hero Title</GdsText>
      <GdsText font="body-l">Supporting message</GdsText>
      <GdsButton rank="primary">Call to Action</GdsButton>
    </GdsTheme>
  </GdsMask>
</GdsCard>

// Card grid with overlays
<GdsGrid columns="1; m{2} l{3}" gap="m">
  <GdsCard position="relative" padding="0" overflow="hidden">
    <GdsImg src="https://example.com/card1.jpg" aspect-ratio="16/9" />
    <GdsMask
      background="neutral-01/0.8"
      mask-image="top"
      position="absolute"
      inset="50% 0 0 0"
      padding="m"
    >
      <GdsTheme color-scheme="dark">
        <GdsText font="headline-m">Card Title</GdsText>
      </GdsTheme>
    </GdsMask>
  </GdsCard>
  
  <GdsCard position="relative" padding="0" overflow="hidden">
    <GdsImg src="https://example.com/card2.jpg" aspect-ratio="16/9" />
    <GdsMask
      background="neutral-01/0.8"
      mask-image="top"
      position="absolute"
      inset="50% 0 0 0"
      padding="m"
    >
      <GdsTheme color-scheme="dark">
        <GdsText font="headline-m">Another Card</GdsText>
      </GdsTheme>
    </GdsMask>
  </GdsCard>
</GdsGrid>
```

**Key Features:**
- **Gradient Overlays**: Create smooth gradient masks over content
- **Background Control**: Color tokens with transparency (`"neutral-01/0.9"`)
- **Mask Positioning**: Presets (`top`, `bottom`, `left`, `right`) or custom
- **Backdrop Filters**: Blur effects with responsive breakpoints
- **Full Positioning**: Absolute/relative with inset control
- **Flexbox Layout**: Built-in flex display for content arrangement
- **Level System**: Color token resolution based on level hierarchy
- **Responsive**: Breakpoint syntax for all properties

**Mask Image Presets:**
- `'top'`: Gradient fades from top to transparent (content at bottom)
- `'bottom'`: Gradient fades from bottom to transparent (content at top)
- `'left'`: Gradient fades from left to transparent
- `'right'`: Gradient fades from right to transparent

**Background Format:**
```tsx
// Color token with transparency
background="neutral-01/0.8"  // 80% opacity
background="neutral-01/0.5"  // 50% opacity for subtle overlay
background="01/0.9"          // Light background, 90% opacity
```

**Responsive Syntax:**
```tsx
// Responsive inset
inset="0; m{50% 0 0 0}"  // Full on mobile, bottom half on medium+

// Responsive padding
padding="xl; s{2xl} m{6xl}"  // Progressive padding

// Responsive blur
backdrop-filter="s{10px} m{20px} l{30px}"  // Progressive blur
```

**Accessibility Best Practices:**
- Always use `<GdsTheme color-scheme="dark">` for content over light images
- Use `<GdsTheme color-scheme="light">` for content over dark images
- Ensure sufficient contrast for text readability
- Test across different image brightness levels

**Common Use Cases:**
1. **Image Overlays**: Readable text over images
2. **Content Fading**: Fade effects at content edges
3. **Visual Hierarchy**: Draw attention with gradient masks
4. **Hero Sections**: Large banner overlays with CTAs
5. **Card Grids**: Consistent overlays across multiple cards

---

#### GdsFormattedAccount - Formatted Account Numbers

**📖 Complete GdsFormattedAccount documentation: [`GdsFormattedAccount.md`](./GdsFormattedAccount.md)**

**@beta** - This component is in beta and may have API changes.

```tsx
// Basic formatted account (extends GdsText)
import { GdsFormattedAccount } from '@sebgroup/green-core/react'

<GdsFormattedAccount>54400023423</GdsFormattedAccount>

// Using account attribute
<GdsFormattedAccount account="54400023423" />

// Empty/placeholder
<GdsFormattedAccount />

// With custom font
<GdsFormattedAccount font="heading-m">54400023423</GdsFormattedAccount>

// In card with label
<GdsCard padding="m">
  <GdsFlex flex-direction="column" gap="xs">
    <GdsText font="detail-s" text-transform="uppercase" opacity="0.6">
      Account Number
    </GdsText>
    <GdsFormattedAccount font="heading-s">54400023423</GdsFormattedAccount>
  </GdsFlex>
</GdsCard>

// Account list
<GdsFlex flex-direction="column" gap="m">
  <GdsFlex justify-content="space-between" align-items="center">
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s">Checking Account</GdsText>
      <GdsFormattedAccount>54400023423</GdsFormattedAccount>
    </GdsFlex>
    <GdsText font="heading-m">$12,345.67</GdsText>
  </GdsFlex>
  
  <GdsDivider />
  
  <GdsFlex justify-content="space-between" align-items="center">
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s">Savings Account</GdsText>
      <GdsFormattedAccount>54400056789</GdsFormattedAccount>
    </GdsFlex>
    <GdsText font="heading-m">$5,678.90</GdsText>
  </GdsFlex>
</GdsFlex>

// Clickable account
<GdsFormattedAccount 
  cursor="pointer"
  onClick={() => console.log('Account clicked')}
>
  54400023423
</GdsFormattedAccount>

// With copy functionality
function CopyableAccount() {
  const [copied, setCopied] = useState(false)
  const accountNumber = '54400023423'
  
  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <GdsFlex gap="s" align-items="center">
      <GdsFormattedAccount>{accountNumber}</GdsFormattedAccount>
      <GdsButton rank="tertiary" size="small" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </GdsButton>
    </GdsFlex>
  )
}

// Transaction details
<GdsCard padding="m">
  <GdsFlex flex-direction="column" gap="m">
    <GdsText tag="h3" font="heading-m">Transaction Details</GdsText>
    
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s" opacity="0.6">From Account</GdsText>
      <GdsFormattedAccount font="body-m">54400023423</GdsFormattedAccount>
    </GdsFlex>
    
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s" opacity="0.6">To Account</GdsText>
      <GdsFormattedAccount font="body-m">54400056789</GdsFormattedAccount>
    </GdsFlex>
    
    <GdsDivider />
    
    <GdsFlex justify-content="space-between">
      <GdsText>Amount</GdsText>
      <GdsText font="heading-m">$500.00</GdsText>
    </GdsFlex>
  </GdsFlex>
</GdsCard>

// With status badge
<GdsCard padding="m">
  <GdsFlex justify-content="space-between" align-items="center">
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s">Checking Account</GdsText>
      <GdsFormattedAccount>54400023423</GdsFormattedAccount>
    </GdsFlex>
    <GdsBadge variant="positive">Active</GdsBadge>
  </GdsFlex>
</GdsCard>
```

**Key Properties:**
- **account**: `number | string` - Account number to format (11 chars for 'seb-account')
- **format**: `'seb-account'` - Account format type (default)
- **tag**: `string` - HTML tag (span, p, div, h1-h6, default: `'span'`)
- **level**: `GdsColorLevel` - Color level (1-4, default: `'2'`)
- **formattedValue**: `string` - Read-only formatted value

**Style Expression Properties** (inherited from GdsText):
- **font**: Font tokens (heading-m, body-s, detail-l, etc.)
- **text-transform**: `'none' | 'uppercase' | 'lowercase' | 'capitalize'`

---

#### GdsSensitiveAccount - Formatted Account with Privacy Protection

**📖 Complete GdsSensitiveAccount documentation: [`GdsSensitiveAccount.md`](./GdsSensitiveAccount.md)**

**@beta** - This component is in beta and may have API changes.

```tsx
import { GdsSensitiveAccount } from '@sebgroup/green-core/react'
import { IconEye, IconEyeSlash } from '@sebgroup/green-core/react'

// Basic account with privacy
<GdsSensitiveAccount account="54400023423" hide />

// With visibility toggle
function AccountWithToggle() {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <GdsFlex gap="m" align-items="center">
      <GdsSensitiveAccount 
        account="54400023423" 
        hide={isHidden}
      />
      <GdsButton 
        variant="tertiary"
        size="small"
        onClick={() => setIsHidden(!isHidden)}
      >
        {isHidden ? <IconEye /> : <IconEyeSlash />}
        {isHidden ? 'Show' : 'Hide'}
      </GdsButton>
    </GdsFlex>
  )
}

// Account card with privacy control
<GdsCard padding="m">
  <GdsFlex justify-content="space-between" align-items="center">
    <GdsFlex flex-direction="column" gap="s">
      <GdsText font="detail-regular-s" color="secondary">
        Account Number
      </GdsText>
      <GdsSensitiveAccount 
        account="54400023423"
        hide={isPrivacyMode}
        font="body-m"
      />
    </GdsFlex>
    
    <GdsFlex gap="xs">
      <GdsButton 
        variant="tertiary"
        size="small"
        onClick={toggleVisibility}
      >
        {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
      </GdsButton>
      
      <GdsButton 
        variant="tertiary"
        size="small"
        onClick={copyToClipboard}
      >
        <IconCopy />
      </GdsButton>
    </GdsFlex>
  </GdsFlex>
</GdsCard>

// Global privacy mode
function AccountList() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="heading-m">My Accounts</GdsText>
        <GdsButton 
          variant="secondary"
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
        >
          {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
          {isPrivacyMode ? 'Show All' : 'Hide All'}
        </GdsButton>
      </GdsFlex>

      <GdsCard padding="m">
        <GdsFlex flex-direction="column" gap="s">
          <GdsText font="detail-regular-s" color="secondary">
            Checking Account
          </GdsText>
          <GdsSensitiveAccount 
            account="54400023423"
            hide={isPrivacyMode}
          />
          <GdsText font="heading-s">$10,245.50</GdsText>
        </GdsFlex>
      </GdsCard>
    </GdsFlex>
  )
}
```

**Key Features:**
- **Blur Protection**: Optional blur effect for visual privacy when `hide={true}`
- **Formatted Display**: Automatically formats account numbers (11 chars for 'seb-account' format)
- **Visibility Control**: Toggle between visible and hidden states
- **Screen Reader Safe**: Account numbers announced regardless of blur state
- **Extends GdsText**: Inherits all typography styling capabilities

**Common Use Cases:**
- Banking dashboards with privacy toggle
- Transaction history with account masking
- Account selectors with privacy protection
- Screen share protection
- Copy-to-clipboard with privacy

**Privacy vs Security:**
- Blur provides visual privacy (shoulder surfing, screen sharing)
- Does NOT encrypt or mask underlying value
- Screen readers still announce full account number
- Use for UI privacy, not data security
- **text-decoration**: CSS text-decoration values
- **lines**: Number - truncate to N lines
- **cursor**: CSS cursor values
- Plus all layout properties (margin, padding, display, etc.)

**Important Notes:**
- **@beta component** - API may change in future releases
- Extends GdsText, inherits all text styling capabilities
- Default format is `'seb-account'` (requires 11-character account)
- Automatically formats account numbers for readability
- Empty accounts render as placeholder
- Use `formattedValue` property to access formatted string
- Always provide context/label for accessibility
- Consider adding copy functionality for better UX

---

#### GdsFormattedDate - Formatted Date and Time

**Documentation:** [GdsFormattedDate.md](./GdsFormattedDate.md)

```tsx
import { GdsFormattedDate } from '@sebgroup/green-core/react'
```

GdsFormattedDate extends GdsText and formats dates and times to the desired format. **@beta component**.

```tsx
// Basic date formatting (default: dateOnlyNumbers)
<GdsFormattedDate>2025-02-25T13:17:30.000Z</GdsFormattedDate>

// Using value property
<GdsFormattedDate value={new Date()} />

// Long date with weekday
<GdsFormattedDate format="dateLongWithWeekday">
  2025-02-25T13:17:30.000Z
</GdsFormattedDate>

// With Swedish locale
<GdsFormattedDate locale="sv-SE" format="dateLong">
  2025-02-25T13:17:30.000Z
</GdsFormattedDate>

// Time only
<GdsFormattedDate format="timeShort">
  2025-02-25T13:17:30.000Z
</GdsFormattedDate>

// Custom font
<GdsFormattedDate font="heading-m" format="dateLong">
  2025-02-25T13:17:30.000Z
</GdsFormattedDate>

// In card with label
<GdsCard padding="m">
  <GdsFlex flex-direction="column" gap="xs">
    <GdsText font="detail-s" text-transform="uppercase" opacity="0.6">
      Transaction Date
    </GdsText>
    <GdsFormattedDate font="heading-s" format="dateLong">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
  </GdsFlex>
</GdsCard>

// All formats comparison
<GdsFlex flex-direction="column" gap="m">
  <GdsFlex gap="l" justify-content="space-between">
    <GdsText>Date Only Numbers:</GdsText>
    <GdsFormattedDate format="dateOnlyNumbers">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
  </GdsFlex>
  
  <GdsDivider />
  
  <GdsFlex gap="l" justify-content="space-between">
    <GdsText>Date Long:</GdsText>
    <GdsFormattedDate format="dateLong">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
  </GdsFlex>
  
  <GdsDivider />
  
  <GdsFlex gap="l" justify-content="space-between">
    <GdsText>Date Long With Weekday:</GdsText>
    <GdsFormattedDate format="dateLongWithWeekday">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
  </GdsFlex>
  
  <GdsDivider />
  
  <GdsFlex gap="l" justify-content="space-between">
    <GdsText>Time Short:</GdsText>
    <GdsFormattedDate format="timeShort">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
  </GdsFlex>
</GdsFlex>

// Transaction history with dates
<GdsCard padding="m">
  <GdsFlex flex-direction="column" gap="m">
    <GdsText tag="h3" font="heading-m">Recent Transactions</GdsText>
    
    <GdsFlex justify-content="space-between" align-items="center">
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="body-m">Coffee Shop</GdsText>
        <GdsFormattedDate font="detail-s" format="dateLongWithWeekday">
          2025-02-25T13:17:30.000Z
        </GdsFormattedDate>
      </GdsFlex>
      <GdsText font="heading-m">-$4.50</GdsText>
    </GdsFlex>
    
    <GdsDivider />
    
    <GdsFlex justify-content="space-between" align-items="center">
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="body-m">Grocery Store</GdsText>
        <GdsFormattedDate font="detail-s" format="dateLongWithWeekday">
          2025-02-24T10:30:00.000Z
        </GdsFormattedDate>
      </GdsFlex>
      <GdsText font="heading-m">-$56.78</GdsText>
    </GdsFlex>
  </GdsFlex>
</GdsCard>

// Appointment card with date and time
<GdsCard padding="m" border-color="interactive">
  <GdsFlex flex-direction="column" gap="m">
    <GdsFlex justify-content="space-between" align-items="center">
      <GdsText tag="h3" font="heading-m">Doctor Appointment</GdsText>
      <GdsBadge variant="positive">Confirmed</GdsBadge>
    </GdsFlex>
    
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s" opacity="0.6">Date</GdsText>
      <GdsFormattedDate font="body-m" format="dateLongWithWeekday">
        2025-03-15T10:00:00.000Z
      </GdsFormattedDate>
    </GdsFlex>
    
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s" opacity="0.6">Time</GdsText>
      <GdsFormattedDate font="body-m" format="timeShort">
        2025-03-15T10:00:00.000Z
      </GdsFormattedDate>
    </GdsFlex>
  </GdsFlex>
</GdsCard>

// Multi-locale display
<GdsFlex flex-direction="column" gap="s">
  <GdsFlex justify-content="space-between">
    <GdsText>English (US):</GdsText>
    <GdsFormattedDate locale="en-US" format="dateLong">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
  </GdsFlex>
  
  <GdsFlex justify-content="space-between">
    <GdsText>Swedish:</GdsText>
    <GdsFormattedDate locale="sv-SE" format="dateLong">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
  </GdsFlex>
  
  <GdsFlex justify-content="space-between">
    <GdsText>German:</GdsText>
    <GdsFormattedDate locale="de-DE" format="dateLong">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
  </GdsFlex>
</GdsFlex>
```

**Date/Time Formats:**
- **dateOnlyNumbers**: Date with numbers only (e.g., `2025-02-25`) - default
- **dateLong**: Long date format (e.g., `25 February 2025`)
- **dateLongWithWeekday**: Long date with weekday (e.g., `Tuesday, 25 February 2025`)
- **dateShort**: Short date format (e.g., `25 Feb 2025`)
- **dateShortWithWeekday**: Short date with weekday (e.g., `Tue, 25 Feb 2025`)
- **timeShort**: Short time format (e.g., `14:17`)
- **timeLong**: Long time format (e.g., `14:17:30`)

**Key Properties:**
- **value**: `Date | string` - Date value (Date object or ISO string)
- **locale**: `string` - Locale for formatting (e.g., `'sv-SE'`, `'en-US'`)
- **format**: `DateTimeFormat` - Date/time format (default: `'dateOnlyNumbers'`)
- **tag**: `string` - HTML tag (span, time, p, h1-h6, default: `'span'`)
- **level**: `GdsColorLevel` - Color level (1-4, default: `'2'`)
- **formattedValue**: `string` - Read-only formatted date string

**Style Expression Properties:**
- All properties from GdsText: `font`, `font-weight`, `text-transform`, `text-decoration`, `lines`, `cursor`, etc.
- Plus all layout properties: `margin`, `padding`, `display`, `flex`, `grid`, `color`, `background`, etc.

**Important Notes:**
- **@beta component** - API may change in future releases
- Extends GdsText, inherits all text styling capabilities
- Default format is `'dateOnlyNumbers'`
- Formatting is locale-aware (respects `locale` attribute)
- Can accept Date objects or ISO date strings
- `formattedValue` property provides formatted string (read-only)
- Use `tag="time"` for semantic HTML
- Empty dates render as empty (placeholder state)
- Locale defaults to browser/system locale if not specified
- Test with various locales and formats

---

#### GdsSensitiveDate - Formatted Date with Privacy

**Documentation:** [GdsSensitiveDate.md](./GdsSensitiveDate.md)

```tsx
import { GdsSensitiveDate } from '@sebgroup/green-core/react'
```

GdsSensitiveDate extends GdsText and displays formatted dates with optional blur effect for sensitive information protection. **@beta component**.

```tsx
// Basic date display
<GdsSensitiveDate value="2025-02-25T13:17:30.000Z" />

// Hidden date (blurred)
<GdsSensitiveDate value="2025-02-25T13:17:30.000Z" hide />

// With Swedish locale
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z" 
  locale="sv-SE"
/>

// Date visibility toggle
function DateWithToggle() {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <GdsFlex gap="m" align-items="center">
      <GdsSensitiveDate 
        value="2025-02-25T13:17:30.000Z"
        hide={isHidden}
        locale="sv-SE"
      />
      <GdsButton 
        variant="tertiary"
        size="small"
        onClick={() => setIsHidden(!isHidden)}
      >
        {isHidden ? <IconEye /> : <IconEyeSlash />}
        {isHidden ? 'Show' : 'Hide'}
      </GdsButton>
    </GdsFlex>
  )
}

// Transaction list with privacy mode
function TransactionList() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  const transactions = [
    { id: '1', date: '2025-02-25T13:17:30.000Z', desc: 'Payment', amount: '-150.00' },
    { id: '2', date: '2025-02-20T10:30:00.000Z', desc: 'Deposit', amount: '+500.00' },
  ]

  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="heading-m">Transactions</GdsText>
        <GdsButton 
          variant="secondary"
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
        >
          {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
          Privacy Mode
        </GdsButton>
      </GdsFlex>

      {transactions.map(tx => (
        <GdsCard key={tx.id} padding="m">
          <GdsFlex justify-content="space-between" align-items="center">
            <GdsFlex flex-direction="column" gap="2xs">
              <GdsText font="body-m">{tx.desc}</GdsText>
              <GdsSensitiveDate 
                value={tx.date}
                hide={isPrivacyMode}
                font="detail-regular-s"
                color="secondary"
                locale="sv-SE"
              />
            </GdsFlex>
            <GdsText font="body-m">{tx.amount} SEK</GdsText>
          </GdsFlex>
        </GdsCard>
      ))}
    </GdsFlex>
  )
}

// Timeline with selective date hiding
function Timeline() {
  const [hideOldDates, setHideOldDates] = useState(false)
  const cutoffDate = new Date('2025-02-01')

  const events = [
    { id: '1', date: '2025-02-25T13:17:30.000Z', title: 'Recent Event' },
    { id: '2', date: '2025-01-15T10:30:00.000Z', title: 'Old Event' },
  ]

  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsButton 
        variant="secondary"
        onClick={() => setHideOldDates(!hideOldDates)}
      >
        {hideOldDates ? 'Show' : 'Hide'} Old Dates
      </GdsButton>

      {events.map(event => {
        const eventDate = new Date(event.date)
        const shouldHide = hideOldDates && eventDate < cutoffDate

        return (
          <GdsCard key={event.id} padding="m">
            <GdsFlex flex-direction="column" gap="2xs">
              <GdsText font="body-m">{event.title}</GdsText>
              <GdsSensitiveDate 
                value={event.date}
                hide={shouldHide}
                font="detail-regular-s"
                color="secondary"
                locale="sv-SE"
              />
            </GdsFlex>
          </GdsCard>
        )
      })}
    </GdsFlex>
  )
}

// Global privacy mode with context
const PrivacyContext = createContext<{
  isPrivacyMode: boolean
  togglePrivacyMode: () => void
}>({
  isPrivacyMode: false,
  togglePrivacyMode: () => {},
})

function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [isPrivacyMode, setIsPrivacyMode] = useState(false)

  return (
    <PrivacyContext.Provider 
      value={{ 
        isPrivacyMode, 
        togglePrivacyMode: () => setIsPrivacyMode(!isPrivacyMode) 
      }}
    >
      {children}
    </PrivacyContext.Provider>
  )
}

function DateDisplay({ date }: { date: string | Date }) {
  const { isPrivacyMode } = useContext(PrivacyContext)

  return (
    <GdsSensitiveDate 
      value={date}
      hide={isPrivacyMode}
      locale="sv-SE"
    />
  )
}

// Medical appointment history
<GdsCard padding="m">
  <GdsFlex flex-direction="column" gap="m">
    <GdsFlex justify-content="space-between" align-items="center">
      <GdsText font="heading-s">Appointment History</GdsText>
      <GdsButton variant="tertiary" onClick={toggleDates}>
        {showDates ? <IconEyeSlash /> : <IconEye />}
      </GdsButton>
    </GdsFlex>

    <GdsFlex justify-content="space-between">
      <GdsText font="detail-regular-s" color="secondary">Last Visit</GdsText>
      <GdsSensitiveDate 
        value="2025-02-25T13:17:30.000Z"
        hide={!showDates}
        locale="en-US"
      />
    </GdsFlex>

    <GdsFlex justify-content="space-between">
      <GdsText font="detail-regular-s" color="secondary">Next Appointment</GdsText>
      <GdsSensitiveDate 
        value="2025-03-15T09:00:00.000Z"
        hide={!showDates}
        locale="en-US"
      />
    </GdsFlex>
  </GdsFlex>
</GdsCard>

// Responsive date with custom styling
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z"
  font="body-s; m{ body-m }; l{ body-l }"
  locale="sv-SE"
  hide={false}
/>
```

**Key Properties:**
- **value**: `Date | string` - Date value (Date object or ISO string)
- **hide**: `boolean` - When `true`, hides date with blur effect (default: `false`)
- **locale**: `string` - Locale for formatting (e.g., `'sv-SE'`, `'en-US'`)
- **format**: `DateTimeFormat` - Date format (default: `'dateOnlyNumbers'`)
- **tag**: `string` - HTML tag (span, p, h1-h6, default: `'span'`)
- **level**: `GdsColorLevel` - Color level (1-4, default: `'2'`)
- **formattedValue**: `string` - Read-only formatted date string

**Key Features:**
- Formatted date display with locale support
- Optional blur effect for visual privacy protection
- Extends GdsText with full typography capabilities
- Screen reader safe (announces date regardless of blur)
- **@beta component** - API may change

**Important Notes:**
- Blur effect is visual-only protection, not data security
- Screen readers announce date regardless of blur state
- Use for shoulder surfing protection or screen sharing
- Toggle visibility for privacy-sensitive dates
- Accepts Date objects or ISO 8601 strings
- Locale defaults to browser locale if not specified
- Consider global privacy mode for multiple dates
- Test with various locales and formats

---

#### GdsFormattedNumber - Formatted Number and Currency

**Documentation:** [GdsFormattedNumber.md](./GdsFormattedNumber.md)

```tsx
import { GdsFormattedNumber } from '@sebgroup/green-core/react'
```

GdsFormattedNumber extends GdsText and formats numbers to the desired format. **@beta component**.

```tsx
// Basic number formatting (default: decimalsAndThousands)
<GdsFormattedNumber>1234.5</GdsFormattedNumber>

// Using value property
<GdsFormattedNumber value={1234.5} />

// Currency formatting
<GdsFormattedNumber format="currency" currency="SEK">
  1234.5
</GdsFormattedNumber>

// With Swedish locale
<GdsFormattedNumber locale="sv-SE" format="currency" currency="SEK">
  1234.5
</GdsFormattedNumber>

// Percentage format
<GdsFormattedNumber format="percent">0.125</GdsFormattedNumber>

// Custom font and styling
<GdsFormattedNumber font="heading-m" format="currency" currency="SEK">
  1234.5
</GdsFormattedNumber>

// Account balance card
<GdsCard padding="m">
  <GdsFlex flex-direction="column" gap="xs">
    <GdsText font="detail-s" text-transform="uppercase" opacity="0.6">
      Available Balance
    </GdsText>
    <GdsFormattedNumber 
      font="heading-xl" 
      format="currency" 
      currency="SEK"
      locale="sv-SE"
    >
      15250.75
    </GdsFormattedNumber>
  </GdsFlex>
</GdsCard>

// Multiple currency display
<GdsFlex flex-direction="column" gap="m">
  <GdsFlex gap="l" justify-content="space-between">
    <GdsText>SEK:</GdsText>
    <GdsFormattedNumber currency="SEK" format="currency">
      1234.5
    </GdsFormattedNumber>
  </GdsFlex>
  
  <GdsDivider />
  
  <GdsFlex gap="l" justify-content="space-between">
    <GdsText>EUR:</GdsText>
    <GdsFormattedNumber currency="EUR" format="currency">
      1234.5
    </GdsFormattedNumber>
  </GdsFlex>
  
  <GdsDivider />
  
  <GdsFlex gap="l" justify-content="space-between">
    <GdsText>USD:</GdsText>
    <GdsFormattedNumber currency="USD" format="currency">
      1234.5
    </GdsFormattedNumber>
  </GdsFlex>
</GdsFlex>

// Transaction list with amounts
<GdsCard padding="m">
  <GdsFlex flex-direction="column" gap="m">
    <GdsText tag="h3" font="heading-m">Recent Transactions</GdsText>
    
    <GdsFlex justify-content="space-between" align-items="center">
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="body-m">Coffee Shop</GdsText>
        <GdsFormattedDate font="detail-s" format="dateShort">
          2025-02-25T13:17:30.000Z
        </GdsFormattedDate>
      </GdsFlex>
      <GdsFormattedNumber 
        font="heading-m" 
        format="currency" 
        currency="SEK"
        color="negative"
      >
        -45.50
      </GdsFormattedNumber>
    </GdsFlex>
    
    <GdsDivider />
    
    <GdsFlex justify-content="space-between" align-items="center">
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="body-m">Salary Deposit</GdsText>
        <GdsFormattedDate font="detail-s" format="dateShort">
          2025-02-20T09:00:00.000Z
        </GdsFormattedDate>
      </GdsFlex>
      <GdsFormattedNumber 
        font="heading-m" 
        format="currency" 
        currency="SEK"
        color="positive"
      >
        25000.00
      </GdsFormattedNumber>
    </GdsFlex>
  </GdsFlex>
</GdsCard>

// Different number formats
<GdsFlex flex-direction="column" gap="m">
  <GdsFlex gap="l" justify-content="space-between">
    <GdsText>Decimals & Thousands:</GdsText>
    <GdsFormattedNumber format="decimalsAndThousands">
      1234567.89
    </GdsFormattedNumber>
  </GdsFlex>
  
  <GdsFlex gap="l" justify-content="space-between">
    <GdsText>Integer Only:</GdsText>
    <GdsFormattedNumber format="integer">
      1234567.89
    </GdsFormattedNumber>
  </GdsFlex>
  
  <GdsFlex gap="l" justify-content="space-between">
    <GdsText>Percentage:</GdsText>
    <GdsFormattedNumber format="percent">
      0.125
    </GdsFormattedNumber>
  </GdsFlex>
</GdsFlex>

// Statistics dashboard
<GdsFlex gap="m">
  <GdsCard padding="m" flex="1">
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s" opacity="0.6">Total Sales</GdsText>
      <GdsFormattedNumber 
        font="heading-l" 
        format="currency" 
        currency="SEK"
      >
        2450000
      </GdsFormattedNumber>
      <GdsFlex gap="xs" align-items="center">
        <GdsFormattedNumber format="percent" color="positive" font="detail-s">
          0.15
        </GdsFormattedNumber>
        <GdsText font="detail-s" opacity="0.6">vs last month</GdsText>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
  
  <GdsCard padding="m" flex="1">
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s" opacity="0.6">Active Users</GdsText>
      <GdsFormattedNumber 
        font="heading-l" 
        format="decimalsAndThousands"
      >
        45678
      </GdsFormattedNumber>
      <GdsFlex gap="xs" align-items="center">
        <GdsFormattedNumber format="percent" color="positive" font="detail-s">
          0.08
        </GdsFormattedNumber>
        <GdsText font="detail-s" opacity="0.6">vs last month</GdsText>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsFlex>
```

**Number Formats:**
- **decimalsAndThousands**: Decimals with thousands separator (e.g., `1,234.50`) - default
- **decimals**: Decimals only, no thousands separator (e.g., `1234.50`)
- **thousands**: Thousands separator, no decimals (e.g., `1,235`)
- **currency**: Currency format with symbol (e.g., `$1,234.50`, `1 234,50 kr`)
- **percent**: Percentage format (e.g., `12.5%`)
- **integer**: Integer only, no decimals (e.g., `1235`)

**Key Properties:**
- **value**: `number | string` - Numerical value to display
- **locale**: `string` - Locale for formatting (e.g., `'sv-SE'`, `'en-US'`)
- **currency**: `string` - Currency code (e.g., `'SEK'`, `'EUR'`, `'USD'`)
- **format**: `NumberFormats` - Number format (default: `'decimalsAndThousands'`)
- **tag**: `string` - HTML tag (span, p, strong, h1-h6, default: `'span'`)
- **level**: `GdsColorLevel` - Color level (1-4, default: `'2'`)
- **formattedValue**: `string` - Read-only formatted number string

**Style Expression Properties:**
- All properties from GdsText: `font`, `font-weight`, `text-transform`, `text-decoration`, `lines`, `cursor`, etc.
- Plus all layout properties: `margin`, `padding`, `display`, `flex`, `grid`, `color`, `background`, etc.

**Important Notes:**
- **@beta component** - API may change in future releases
- Extends GdsText, inherits all text styling capabilities
- Default format is `'decimalsAndThousands'`
- Formatting is locale-aware (respects `locale` attribute)
- Currency format requires `currency` attribute
- Can accept number or string values
- `formattedValue` property provides formatted string (read-only)
- Use appropriate color tokens for positive/negative amounts
- Empty values render as empty (placeholder state)
- Locale defaults to browser/system locale if not specified
- Test with various locales and currencies

---

#### GdsSensitiveNumber - Formatted Number with Privacy

**Documentation:** [GdsSensitiveNumber.md](./GdsSensitiveNumber.md)

```tsx
import { GdsSensitiveNumber } from '@sebgroup/green-core/react'
```

GdsSensitiveNumber extends GdsText and displays formatted numbers with optional blur effect for sensitive information protection. **@beta component**.

```tsx
// Basic number display
<GdsSensitiveNumber value={1234.5} />

// Hidden number (blurred)
<GdsSensitiveNumber value={1234.5} hide />

// With currency
<GdsSensitiveNumber 
  value={45678.90}
  currency="SEK"
  locale="sv-SE"
/>

// Number visibility toggle
function NumberWithToggle() {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <GdsFlex gap="m" align-items="center">
      <GdsSensitiveNumber 
        value={45678.90}
        hide={isHidden}
        currency="SEK"
        locale="sv-SE"
      />
      <GdsButton 
        variant="tertiary"
        size="small"
        onClick={() => setIsHidden(!isHidden)}
      >
        {isHidden ? <IconEye /> : <IconEyeSlash />}
        {isHidden ? 'Show' : 'Hide'}
      </GdsButton>
    </GdsFlex>
  )
}

// Account balance with privacy
function AccountBalance() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  return (
    <GdsCard padding="m">
      <GdsFlex flex-direction="column" gap="s">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="detail-regular-s" color="secondary">
            Available Balance
          </GdsText>
          <GdsButton 
            variant="tertiary"
            size="small"
            onClick={() => setIsPrivacyMode(!isPrivacyMode)}
          >
            {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
          </GdsButton>
        </GdsFlex>
        
        <GdsSensitiveNumber 
          value={45678.90}
          hide={isPrivacyMode}
          currency="SEK"
          locale="sv-SE"
          font="heading-l"
        />
      </GdsFlex>
    </GdsCard>
  )
}

// Transaction list with amounts
function TransactionList() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  const transactions = [
    { id: '1', description: 'Salary', amount: 35000.00 },
    { id: '2', description: 'Rent', amount: -12000.00 },
    { id: '3', description: 'Groceries', amount: -850.50 },
  ]

  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="heading-m">Transactions</GdsText>
        <GdsButton 
          variant="secondary"
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
        >
          {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
          Privacy Mode
        </GdsButton>
      </GdsFlex>

      {transactions.map(tx => (
        <GdsCard key={tx.id} padding="m">
          <GdsFlex justify-content="space-between" align-items="center">
            <GdsText font="body-m">{tx.description}</GdsText>
            <GdsSensitiveNumber 
              value={tx.amount}
              hide={isPrivacyMode}
              currency="SEK"
              locale="sv-SE"
              font="body-m"
            />
          </GdsFlex>
        </GdsCard>
      ))}
    </GdsFlex>
  )
}

// Investment portfolio
<GdsCard padding="m">
  <GdsFlex flex-direction="column" gap="m">
    <GdsFlex justify-content="space-between" align-items="center">
      <GdsText font="heading-m">Portfolio Value</GdsText>
      <GdsButton variant="tertiary" onClick={toggleVisibility}>
        {isHidden ? <IconEye /> : <IconEyeSlash />}
      </GdsButton>
    </GdsFlex>

    <GdsFlex flex-direction="column" gap="s">
      <GdsFlex justify-content="space-between">
        <GdsText font="detail-regular-s" color="secondary">Stocks</GdsText>
        <GdsSensitiveNumber 
          value={125000.00}
          hide={isHidden}
          currency="SEK"
          locale="sv-SE"
        />
      </GdsFlex>

      <GdsFlex justify-content="space-between">
        <GdsText font="detail-regular-s" color="secondary">Bonds</GdsText>
        <GdsSensitiveNumber 
          value={75000.00}
          hide={isHidden}
          currency="SEK"
          locale="sv-SE"
        />
      </GdsFlex>

      <GdsDivider />

      <GdsFlex justify-content="space-between">
        <GdsText font="heading-s">Total</GdsText>
        <GdsSensitiveNumber 
          value={200000.00}
          hide={isHidden}
          currency="SEK"
          locale="sv-SE"
          font="heading-m"
        />
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsCard>

// Global privacy mode with context
const PrivacyContext = createContext<{
  isPrivacyMode: boolean
  togglePrivacyMode: () => void
}>({
  isPrivacyMode: false,
  togglePrivacyMode: () => {},
})

function AmountDisplay({ value, currency }: { value: number; currency?: string }) {
  const { isPrivacyMode } = useContext(PrivacyContext)

  return (
    <GdsSensitiveNumber 
      value={value}
      hide={isPrivacyMode}
      currency={currency}
      locale="sv-SE"
    />
  )
}

// Responsive number with custom styling
<GdsSensitiveNumber 
  value={1234567.89}
  currency="SEK"
  locale="sv-SE"
  font="body-s; m{ body-m }; l{ body-l }"
  hide={false}
/>
```

**Key Properties:**
- **value**: `number | string` - Numerical value to display
- **hide**: `boolean` - When `true`, hides number with blur effect (default: `false`)
- **locale**: `string` - Locale for formatting (e.g., `'sv-SE'`, `'en-US'`)
- **currency**: `string` - Currency code (e.g., `'SEK'`, `'EUR'`, `'USD'`)
- **format**: `NumberFormats` - Number format (default: `'decimalsAndThousands'`)
- **tag**: `string` - HTML tag (span, p, h1-h6, default: `'span'`)
- **level**: `GdsColorLevel` - Color level (1-4, default: `'2'`)
- **formattedValue**: `string` - Read-only formatted number string

**Key Features:**
- Formatted number display with locale support
- Optional blur effect for visual privacy protection
- Currency formatting support
- Extends GdsText with full typography capabilities
- Screen reader safe (announces number regardless of blur)
- **@beta component** - API may change

**Important Notes:**
- Blur effect is visual-only protection, not data security
- Screen readers announce number regardless of blur state
- Use for shoulder surfing protection or screen sharing
- Toggle visibility for privacy-sensitive amounts
- Accepts number or string values
- Locale defaults to browser locale if not specified
- Currency format requires `currency` attribute
- Consider global privacy mode for multiple numbers
- Test with various locales and currencies

---

### Form Controls

#### GdsInput - Text Input

**📖 Complete GdsInput documentation: [`GdsInput.md`](./GdsInput.md)**

```tsx
import { GdsInput } from '@sebgroup/green-core/react'
import { IconEmail, IconCreditCard, IconMagnifyingGlass } from '@sebgroup/green-core/react'

// Basic text input
<GdsInput
  label="Full Name"
  placeholder="Enter your full name"
  required
/>

// Email input with icon
<GdsInput
  label="Email Address"
  type="email"
  placeholder="your.email@example.com"
  autocomplete="email"
  required
>
  <IconEmail slot="lead" />
</GdsInput>

// Password input
<GdsInput
  label="Password"
  type="password"
  autocomplete="current-password"
  supporting-text="At least 8 characters"
  required
>
  <IconLock slot="lead" />
</GdsInput>

// Number input with constraints
<GdsInput
  label="Age"
  type="number"
  min="18"
  max="120"
  step="1"
/>

// Search input with clearable
<GdsInput
  label="Search"
  type="search"
  placeholder="Search transactions..."
  clearable
  inputmode="search"
  enterkeyhint="search"
>
  <IconMagnifyingGlass slot="lead" />
</GdsInput>

// Input with character limit
<GdsInput
  label="Short Description"
  maxlength={100}
  supporting-text="Maximum 100 characters"
/>

// Input with currency badge
<GdsInput
  label="Amount"
  type="number"
  value="10000.00"
  clearable
>
  <GdsBadge variant="information" slot="trail">USD</GdsBadge>
</GdsInput>

// Small size variant
<GdsInput
  label="Compact Field"
  size="small"
>
  <IconCreditCard slot="lead" />
</GdsInput>

// With extended supporting text
<GdsInput
  label="Password"
  type="password"
  supporting-text="Create a strong password"
>
  <IconLock slot="lead" />
  <span slot="extended-supporting-text">
    Your password must be at least 8 characters long and include uppercase, 
    lowercase, numbers, and special characters.
  </span>
</GdsInput>

// Form validation with validator
<GdsInput
  label="Email"
  type="email"
  required
  validator={{
    validate: (el) => {
      if (!el.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return [
          { ...el.validity, valid: false, customError: true },
          'Please enter a valid email address',
        ]
      }
    },
  }}
/>

// Manual error state
<GdsInput
  label="Username"
  value="ab"
  invalid
  error-message="Username must be at least 3 characters"
/>
```

**Key Features:**
- **Input Types**: text, email, password, number, date, datetime-local, tel, url, search, time, week, month
- **Validation**: Built-in validation with Constraint Validation API, custom validators
- **Icons and Badges**: Lead slot for icons, trail slot for badges (currency, units)
- **Clearable**: Optional clear button when field has value
- **Character Counter**: Automatic counter badge when maxlength is set
- **Supporting Text**: Regular and extended supporting text with info icon
- **Size Variants**: Large (default) and small sizes
- **Form Integration**: Full form association with ElementInternals
- **Accessibility**: ARIA support, keyboard navigation, screen reader support

**Common Input Types:**
- `text` — General text input
- `email` — Email addresses (mobile keyboard with @)
- `password` — Password fields (obscured text)
- `number` — Numeric values (numeric keypad)
- `tel` — Phone numbers (phone number pad)
- `url` — Website URLs (URL keyboard)
- `search` — Search queries (search keyboard)
- `date` — Date selection (date picker)
- `datetime-local` — Date and time (date/time picker)

**Complete Form Example:**
```tsx
import { IconEmail, IconLock, IconPeopleProfile } from '@sebgroup/green-core/react'

<GdsFlex flex-direction="column" gap="m" width="400px">
  <GdsInput 
    label="Full Name"
    required
    autocomplete="name"
  >
    <IconPeopleProfile slot="lead" />
  </GdsInput>
  
  <GdsInput 
    label="Email Address"
    type="email"
    required
    autocomplete="email"
  >
    <IconEmail slot="lead" />
  </GdsInput>
  
  <GdsInput 
    label="Password"
    type="password"
    required
    autocomplete="new-password"
    supporting-text="At least 8 characters"
  >
    <IconLock slot="lead" />
  </GdsInput>
  
  <GdsButton rank="primary" type="submit">
    Create Account
  </GdsButton>
</GdsFlex>
```

#### GdsTextarea - Multi-line Text Input

**📖 Complete GdsTextarea documentation: [`GdsTextarea.md`](./GdsTextarea.md)**

```tsx
import { GdsTextarea } from '@sebgroup/green-core/react'

// Basic textarea
<GdsTextarea 
  label="Description" 
  supporting-text="Enter your description here."
/>

// With character limit and counter
<GdsTextarea 
  label="Feedback" 
  supporting-text="Share your thoughts"
  value="Example feedback"
  maxlength={500}
  clearable
/>

// Custom rows with resize control
<GdsTextarea 
  label="Comments" 
  rows={8}
  resizable="auto"
  clearable
>
  <IconComment slot="lead" />
</GdsTextarea>

// No resize allowed
<GdsTextarea 
  label="Short Note" 
  rows={3}
  resizable="false"
/>

// With validation
<GdsTextarea
  label="Required Field"
  required
  validator={{
    validate: (el) => {
      if (el.value.trim().length < 10) {
        return [
          { ...el.validity, valid: false, customError: true },
          'Must be at least 10 characters.',
        ]
      }
    },
  }}
/>

// Size variants
<GdsTextarea 
  label="Compact Textarea" 
  size="small"
  resizable="false"
>
  <span slot="extended-supporting-text">
    Detailed instructions can go here in the extended supporting text.
  </span>
</GdsTextarea>
```

**Key Features:**
- **Three Resize Modes**: `'auto'` (content-based vertical resize), `'manual'` (user-controlled), `'false'` (fixed size)
- **Character Counter**: Automatic badge display when `maxlength` is set
- **Custom Rows**: Set initial height with `rows` property (default: 4)
- **Clearable**: Optional clear button when field has value
- **Form Validation**: Built-in validator support with custom error messages
- **Size Variants**: `'large'` (default) and `'small'` for compact layouts
- **Slots**: Lead slot for icons, trail slot for badges
- **Extended Supporting Text**: Collapsible detailed instructions with info icon

**Resize Behavior:**
- **`auto`** (default): Automatically grows/shrinks vertically based on content, resize handle at bottom center on hover
- **`manual`**: User can drag handle to resize both vertically and horizontally
- **`false`**: No resizing allowed, maintains fixed dimensions

**Common Use Cases:**
- Comments and feedback forms
- Multi-line address input
- Message composers
- Code snippet input (with `spellcheck={false}`)
- Bio editors with character limits
- Any multi-line text entry

#### GdsDropdown & GdsOption - Selection Control

**📖 Complete GdsDropdown documentation: [`GdsDropdown.md`](./GdsDropdown.md)**

```tsx
// Basic dropdown with single selection
import { GdsDropdown, GdsOption } from '@sebgroup/green-core/react'

<GdsDropdown label="Select a starship">
  <GdsOption value="1701-D-1">Enterprise 1701-D</GdsOption>
  <GdsOption value="falcon-1">Millenium Falcon</GdsOption>
  <GdsOption value="defiant-1">Defiant</GdsOption>
  <GdsOption value="voyager-1">Voyager</GdsOption>
</GdsDropdown>

// Searchable dropdown (for long lists)
<GdsDropdown label="Select technology" searchable>
  <GdsOption value="" isPlaceholder>Select a technology</GdsOption>
  <GdsOption value="warp">Warp Drive</GdsOption>
  <GdsOption value="cybernetics">Cybernetics</GdsOption>
  <GdsOption value="nanotechnology">Nanotechnology</GdsOption>
  <GdsOption value="ai">Artificial Intelligence</GdsOption>
</GdsDropdown>

// Multiple selection with checkboxes
<GdsDropdown label="Select technologies" multiple searchable clearable>
  <GdsOption value="warp">Warp Drive</GdsOption>
  <GdsOption value="cybernetics">Cybernetics</GdsOption>
  <GdsOption value="nanotechnology">Nanotechnology</GdsOption>
  <GdsOption value="cloning">Cloning</GdsOption>
</GdsDropdown>

// With option groups using GdsMenuHeading
import { GdsMenuHeading } from '@sebgroup/green-core/react'

<GdsDropdown label="Select a vehicle">
  <GdsMenuHeading>Space vehicles</GdsMenuHeading>
  <GdsOption value="1701-D-1">Enterprise 1701-D</GdsOption>
  <GdsOption value="falcon-1">Millenium Falcon</GdsOption>
  
  <GdsMenuHeading>Ground vehicles</GdsMenuHeading>
  <GdsOption value="at-at">AT-AT</GdsOption>
  <GdsOption value="at-st">AT-ST</GdsOption>
</GdsDropdown>

// Small size for compact layouts (tables, toolbars)
<GdsDropdown size="small" label="Status" hide-label>
  <GdsOption value="active">Active</GdsOption>
  <GdsOption value="inactive">Inactive</GdsOption>
</GdsDropdown>

// Combobox mode (allows custom values)
<GdsDropdown label="Favorite sci-fi tech" combobox>
  <GdsOption value="warp">Warp Drive</GdsOption>
  <GdsOption value="cybernetics">Cybernetics</GdsOption>
  <GdsOption value="nanotechnology">Nanotechnology</GdsOption>
</GdsDropdown>

// Custom trigger content (e.g., account selector)
<GdsDropdown width="250px">
  <GdsFlex gap="xs" width="100%" justify-content="space-between" slot="trigger">
    <GdsFlex flex-direction="column" gap="2xs">
      <GdsText font="detail-regular-s">Account</GdsText>
      <GdsText>123 456</GdsText>
    </GdsFlex>
    <GdsFlex flex-direction="column" gap="2xs">
      <GdsText font="detail-regular-s" text-align="end">Balance</GdsText>
      <GdsText text-align="end">9 654,00</GdsText>
    </GdsFlex>
  </GdsFlex>
  
  <GdsOption value="v1">
    <GdsFlex gap="xs" width="100%" justify-content="space-between">
      <GdsFlex flex-direction="column" gap="2xs">
        <GdsText font="detail-regular-s">Account</GdsText>
        <GdsText>123 456</GdsText>
      </GdsFlex>
      <GdsFlex flex-direction="column" gap="2xs">
        <GdsText font="detail-regular-s" text-align="end">Balance</GdsText>
        <GdsText text-align="end">9 654,00</GdsText>
      </GdsFlex>
    </GdsFlex>
  </GdsOption>
</GdsDropdown>

// With validation
<GdsDropdown 
  label="Select tech (required)" 
  value={value}
  onChange={handleChange}
  invalid={showError}
  error-message="Please select a technology"
  required
>
  <GdsOption value="" isPlaceholder>Select a technology</GdsOption>
  <GdsOption value="warp">Warp Drive</GdsOption>
  <GdsOption value="cybernetics">Cybernetics</GdsOption>
</GdsDropdown>
```

**Key Properties:**
- **label**: Label text (required for accessibility)
- **searchable**: Enables search/filter functionality
- **multiple**: Allows multiple selections with checkboxes
- **clearable**: Shows clear button to reset selection
- **combobox**: Allows custom values with predefined options
- **size**: `'medium'` (default) or `'small'`
- **hide-label**: Hides label visually (keeps for screen readers)
- **sync-popover-width**: Locks popover width to trigger width
- **max-height**: Maximum height of dropdown list (default: 500px)
- **supporting-text**: Help text between label and field
- **disabled**: Disables the dropdown
- **required**: Marks as required for validation
- **invalid**: Sets validation error state
- **error-message**: Custom error message

**GdsOption Properties:**
- **value**: Value of the option (required)
- **isPlaceholder**: Marks as placeholder (won't show in list)
- **hidden**: Controls visibility
- **selected**: Selection state

**Important Notes:**
- Single selection returns string value, multiple returns array
- Always provide `label` attribute (use `hide-label` to hide visually)
- Use `searchable` for lists with 10+ options
- Use `combobox` when custom values allowed, `searchable` for predefined only
- **Never** combine `searchable` and `combobox` attributes
- Combobox doesn't work with `multiple`
- Placeholder options don't show in multiple selection lists
- Use `GdsMenuHeading` to group related options

---

#### GdsFilterChip - Selectable Filter Chips

**📖 Complete GdsFilterChip documentation: [`GdsFilterChip.md`](./GdsFilterChip.md)**

```tsx
// Basic filter chips (always use with GdsFilterChips container)
import { GdsFilterChips, GdsFilterChip } from '@sebgroup/green-core/react'

<GdsFilterChips>
  <GdsFilterChip value="all" selected>All</GdsFilterChip>
  <GdsFilterChip value="active">Active</GdsFilterChip>
  <GdsFilterChip value="pending">Pending</GdsFilterChip>
  <GdsFilterChip value="completed">Completed</GdsFilterChip>
</GdsFilterChips>

// Small size
<GdsFilterChips>
  <GdsFilterChip size="small" value="all" selected>All</GdsFilterChip>
  <GdsFilterChip size="small" value="open">Open</GdsFilterChip>
  <GdsFilterChip size="small" value="closed">Closed</GdsFilterChip>
</GdsFilterChips>

// Multi-select with state management
function FilterExample() {
  const [filters, setFilters] = useState(['all'])
  
  const toggleFilter = (value) => {
    setFilters(prev => 
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }
  
  return (
    <GdsFilterChips>
      <GdsFilterChip 
        value="all" 
        selected={filters.includes('all')}
        onClick={() => toggleFilter('all')}
      >
        All
      </GdsFilterChip>
      <GdsFilterChip 
        value="active" 
        selected={filters.includes('active')}
        onClick={() => toggleFilter('active')}
      >
        Active
      </GdsFilterChip>
      <GdsFilterChip 
        value="pending" 
        selected={filters.includes('pending')}
        onClick={() => toggleFilter('pending')}
      >
        Pending
      </GdsFilterChip>
    </GdsFilterChips>
  )
}

// Single-select behavior
function SingleSelectFilter() {
  const [selected, setSelected] = useState('all')
  
  return (
    <GdsFilterChips>
      <GdsFilterChip 
        value="all" 
        selected={selected === 'all'}
        onClick={() => setSelected('all')}
      >
        All
      </GdsFilterChip>
      <GdsFilterChip 
        value="active" 
        selected={selected === 'active'}
        onClick={() => setSelected('active')}
      >
        Active
      </GdsFilterChip>
      <GdsFilterChip 
        value="inactive" 
        selected={selected === 'inactive'}
        onClick={() => setSelected('inactive')}
      >
        Inactive
      </GdsFilterChip>
    </GdsFilterChips>
  )
}

// Category filters
<GdsFilterChips>
  <GdsFilterChip value="electronics">Electronics</GdsFilterChip>
  <GdsFilterChip value="clothing">Clothing</GdsFilterChip>
  <GdsFilterChip value="home">Home & Garden</GdsFilterChip>
  <GdsFilterChip value="sports">Sports</GdsFilterChip>
</GdsFilterChips>

// With content filtering
function FilteredList() {
  const [activeFilter, setActiveFilter] = useState('all')
  
  const items = [
    { id: 1, name: 'Item 1', status: 'active' },
    { id: 2, name: 'Item 2', status: 'pending' },
    { id: 3, name: 'Item 3', status: 'completed' },
  ]
  
  const filteredItems = activeFilter === 'all' 
    ? items 
    : items.filter(item => item.status === activeFilter)
  
  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsFilterChips>
        <GdsFilterChip 
          value="all" 
          selected={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        >
          All ({items.length})
        </GdsFilterChip>
        <GdsFilterChip 
          value="active" 
          selected={activeFilter === 'active'}
          onClick={() => setActiveFilter('active')}
        >
          Active ({items.filter(i => i.status === 'active').length})
        </GdsFilterChip>
        <GdsFilterChip 
          value="pending" 
          selected={activeFilter === 'pending'}
          onClick={() => setActiveFilter('pending')}
        >
          Pending ({items.filter(i => i.status === 'pending').length})
        </GdsFilterChip>
      </GdsFilterChips>
      
      <GdsFlex flex-direction="column" gap="s">
        {filteredItems.map(item => (
          <GdsCard key={item.id}>
            <GdsText>{item.name}</GdsText>
          </GdsCard>
        ))}
      </GdsFlex>
    </GdsFlex>
  )
}
```

**Key Properties:**
- **value**: Value associated with the chip (any type)
- **selected**: `boolean` - Whether chip is selected
- **size**: `'small' | 'large'` - Chip size (default: `'large'`)

**Events:**
- **click**: Fired when chip is clicked
- **gds-element-disconnected**: Fired when element disconnects

**Important Notes:**
- **Always use within GdsFilterChips container** - standalone use not recommended
- Container provides proper grouping, keyboard navigation, and accessibility
- Use `value` for filtering logic (should be unique and stable)
- Control selection state via `selected` attribute
- Supports both single-select and multi-select patterns
- Keep labels short and descriptive (1-3 words)
- Use `large` (default) for primary filtering, `small` for compact layouts
- Consider GdsDropdown for filters with 10+ options

---

#### GdsCalendar - Date Selection

**📖 Complete GdsCalendar documentation: [`GdsCalendar.md`](./GdsCalendar.md)**

```tsx
// Basic calendar
import { GdsCalendar } from '@sebgroup/green-core/react'

<GdsCalendar 
  label="Select a date"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
/>

// Minimal calendar
<GdsCalendar 
  label="Pick a day"
  hideDayNames={true}
  hideExtraneousDays={true}
/>

// Small with week numbers
<GdsCalendar 
  label="Pick a day"
  size="small"
  showWeekNumbers={true}
/>

// Date range restriction
<GdsCalendar 
  label="Select appointment date"
  min={new Date()}
  max={maxDate}
  disabledWeekends={true}
/>

// With custom dates (must use ref)
const calendarRef = useRef<any>(null)

useEffect(() => {
  if (calendarRef.current) {
    calendarRef.current.customizedDates = [
      {
        date: new Date(2025, 7, 25),
        color: 'var(--intent-danger-background)',
        indicator: 'dot'
      }
    ]
  }
}, [])

<GdsCalendar 
  ref={calendarRef}
  label="Calendar with events"
/>
```

**Key Properties:**
- **value**: `Date` - Currently selected date
- **min/max**: `Date` - Date range boundaries
- **size**: `'small' | 'large'` - Calendar size
- **disabledWeekends**: `boolean` - Disable weekend selection
- **customizedDates**: `CustomizedDate[]` - Dates with custom styling (property-only)

**Events:**
- **change**: Fired when date is selected
- **gds-date-focused**: Fired when focus changes

---

#### GdsSelect - Native Select Wrapper

**📖 Complete GdsSelect documentation: [`GdsSelect.md`](./GdsSelect.md)**

```tsx
import { GdsSelect, GdsTheme } from '@sebgroup/green-core/react'
import { IconBooks } from '@sebgroup/green-core/react'

// Basic select with icon and optgroups
<GdsTheme>
  <GdsSelect label="Choose a course" supporting-text="Select your area of study">
    <IconBooks slot="lead" />
    <select>
      <option value="">Select a value</option>
      <optgroup label="Physics">
        <option value="quantum-mechanics">Quantum Mechanics</option>
        <option value="relativity">Relativity</option>
      </optgroup>
      <optgroup label="Chemistry">
        <option value="organic-chemistry">Organic Chemistry</option>
        <option value="inorganic-chemistry">Inorganic Chemistry</option>
      </optgroup>
      <optgroup label="Biology">
        <option value="genetics">Genetics</option>
        <option value="microbiology">Microbiology</option>
        <option value="ecology">Ecology</option>
      </optgroup>
    </select>
  </GdsSelect>
</GdsTheme>

// Small size
<GdsTheme>
  <GdsSelect size="small" label="Space Agency">
    <IconBank slot="lead" />
    <select>
      <optgroup label="International">
        <option value="nasa">NASA</option>
        <option value="esa">ESA</option>
      </optgroup>
      <optgroup label="National">
        <option value="isro">ISRO</option>
        <option value="cnsa">CNSA</option>
      </optgroup>
    </select>
  </GdsSelect>
</GdsTheme>

// Disabled state
<GdsTheme>
  <GdsSelect disabled label="Design System">
    <IconBrandGreen slot="lead" />
    <select>
      <option value="green">Green Design System</option>
      <option value="carbon">Carbon Design System</option>
    </select>
  </GdsSelect>
</GdsTheme>

// Invalid state with error message
<GdsTheme>
  <GdsSelect 
    invalid 
    label="Propulsion System" 
    error-message="This field is required"
  >
    <IconRocket slot="lead" />
    <select>
      <option value="">Incorrect Value</option>
      <optgroup label="Propulsion">
        <option value="ion-thrusters">Ion Thrusters</option>
        <option value="chemical-rockets">Chemical Rockets</option>
      </optgroup>
    </select>
  </GdsSelect>
</GdsTheme>

// With extended supporting text
<GdsTheme>
  <GdsSelect 
    label="Course Selection" 
    supporting-text="Choose your course" 
    show-extended-supporting-text
  >
    <span slot="extended-supporting-text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </span>
    <IconRocket slot="lead" />
    <select>
      <option value="">First option</option>
      <optgroup label="Propulsion">
        <option value="ion-thrusters">Ion Thrusters</option>
        <option value="chemical-rockets">Chemical Rockets</option>
      </optgroup>
    </select>
  </GdsSelect>
</GdsTheme>

// Controlled component with validation
function FormWithSelect() {
  const [value, setValue] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  const handleChange = (e: CustomEvent<{ value: string }>) => {
    setValue(e.detail.value)
    setIsInvalid(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value) {
      setIsInvalid(true)
    } else {
      console.log('Submitted:', value)
    }
  }

  return (
    <GdsTheme>
      <form onSubmit={handleSubmit}>
        <GdsSelect 
          label="Course" 
          required
          invalid={isInvalid}
          error-message="Please select a course"
          value={value}
          onChange={handleChange}
        >
          <IconBooks slot="lead" />
          <select>
            <option value="">Select a value</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
          </select>
        </GdsSelect>
        <GdsButton type="submit">Submit</GdsButton>
      </form>
    </GdsTheme>
  )
}

// Plain mode (minimal UI)
<GdsTheme>
  <GdsSelect plain label="Course selection">
    <select>
      <option value="">Select a value</option>
      <option value="physics">Physics</option>
      <option value="chemistry">Chemistry</option>
    </select>
  </GdsSelect>
</GdsTheme>
```

**Key Features:**
- **Native Wrapper**: Wraps native `<select>` element for native accessibility and mobile UX
- **Label**: Form control label (always set, even with `plain`)
- **Value**: Controlled via host element (`value` prop)
- **Size**: `'large'` (default) or `'small'`
- **Plain Mode**: Hides header/footer while keeping accessibility
- **Validation**: Supports `required`, `invalid`, `error-message`
- **Supporting Text**: Regular and extended supporting text slots
- **Lead Icon**: Icon slot before the select field
- **Optgroups**: Supports `<optgroup>` for organizing options
- **Form Associated**: Automatically participates in form submission
- **Event Listeners**: Add on host `<GdsSelect>`, not wrapped `<select>`

**Style Expression Properties:**
- **width**, **min-width**, **max-width**: Size controls
- **inline-size**, **min-inline-size**, **max-inline-size**: Logical sizing
- **align-self**, **justify-self**, **place-self**: Alignment
- **grid-column**, **grid-row**, **grid-area**: Grid placement
- **flex**, **order**: Flexbox controls
- **margin**, **margin-inline**, **margin-block**: Spacing (space tokens only)

**Important Notes:**
- Must wrap complete native `<select>` with `<option>` elements
- Due to Shadow DOM, select must be wrapped completely (not slotted options)
- Add event listeners on `<GdsSelect>` host, not on wrapped `<select>`
- Handle state through host `value` prop, not select's value attribute
- Native select provides better mobile UX than custom dropdowns
- Use GdsDropdown for custom styling, search, or better multi-select UX
- Always provide `label` even when using `plain` mode
- Combine `required` with empty default option for validation

---

#### GdsSpinner - Loading Indicator

**📖 Complete GdsSpinner documentation: [`GdsSpinner.md`](./GdsSpinner.md)**

An indeterminate progress indicator that provides visual feedback for loading states, ongoing processes, or when the duration of an operation is unknown.

```tsx
import { GdsSpinner, GdsTheme, GdsCard } from '@sebgroup/green-core/react'

// Basic spinner
<GdsSpinner size="md" label="Loading..." />

// With visible label
<GdsSpinner size="md" label="Loading data..." showLabel />

// Container cover mode
<GdsCard position="relative" width="400px" height="300px">
  <div>Container content...</div>
  <GdsSpinner cover size="md" label="Loading..." showLabel />
</GdsCard>
```

**Size Variants:**

```tsx
// Small - for inline loading, tight spaces
<GdsSpinner size="sm" label="Saving..." />

// Medium (default) - for most use cases
<GdsSpinner size="md" label="Loading..." />

// Large - for fullscreen loading, emphasis
<GdsSpinner size="lg" label="Loading application..." />
```

**Label Positioning:**

```tsx
// Hidden label (default) - available to screen readers only
<GdsSpinner label="Loading data..." />

// Visible label with position variants
<GdsSpinner label="Loading..." showLabel label-position="bottom" />
<GdsSpinner label="Loading..." showLabel label-position="top" />
<GdsSpinner label="Loading..." showLabel label-position="left" />
<GdsSpinner label="Loading..." showLabel label-position="right" />
```

**Cover Mode:**

```tsx
// Covers parent container with semi-transparent backdrop
// Parent must have position="relative"
<GdsCard position="relative" padding="xl" min-height="400px">
  <GdsText tag="h3">Customer Data</GdsText>
  <table>{/* table content */}</table>
  
  <GdsSpinner 
    cover 
    size="md" 
    label="Loading customer data..." 
    showLabel 
  />
</GdsCard>
```

**Fullscreen Mode:**

```tsx
// Covers entire viewport with fixed position backdrop
<GdsSpinner 
  fullscreen 
  size="lg" 
  label="Loading application..." 
  showLabel 
/>
```

**Form Submission with Loading State:**

```tsx
function FormWithSpinner() {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitFormData()
      alert('Form submitted!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <GdsCard position="relative" padding="xl">
      <form onSubmit={handleSubmit}>
        <GdsFlex flex-direction="column" gap="m">
          <GdsInput label="Name" required />
          <GdsInput label="Email" type="email" required />
          <GdsButton type="submit" disabled={submitting}>
            Submit
          </GdsButton>
        </GdsFlex>
      </form>
      
      {submitting && (
        <GdsSpinner 
          cover 
          size="md" 
          label="Submitting form..." 
          showLabel 
        />
      )}
    </GdsCard>
  )
}
```

**Inline Button Loading:**

```tsx
function ButtonWithSpinner() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await performAction()
    } finally {
      setLoading(false)
    }
  }

  return (
    <GdsButton onClick={handleClick} disabled={loading}>
      <GdsFlex gap="s" align-items="center">
        {loading && <GdsSpinner size="sm" label="Processing..." />}
        <span>{loading ? 'Processing...' : 'Click Me'}</span>
      </GdsFlex>
    </GdsButton>
  )
}
```

**Data Loading with Conditional Spinner:**

```tsx
function DataLoader() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await api.getData()
      setData(result)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GdsCard position="relative" padding="xl">
      <GdsText tag="h3">Data Loading Example</GdsText>
      <GdsButton onClick={fetchData} disabled={loading}>
        Load Data
      </GdsButton>
      
      {data && <GdsText margin-top="m">{data}</GdsText>}
      
      {loading && (
        <GdsSpinner 
          cover 
          size="md" 
          label="Loading data..." 
          showLabel 
        />
      )}
    </GdsCard>
  )
}
```

**Key Features:**

- **Size Variants**: `sm`, `md` (default), `lg` for different contexts
- **Label Control**: Hidden by default (still accessible to screen readers), `showLabel` makes it visible
- **Label Positioning**: `top`, `bottom` (default), `left`, `right` placement options
- **Cover Mode**: `cover` attribute overlays parent container with semi-transparent backdrop
- **Fullscreen Mode**: `fullscreen` attribute covers entire viewport with fixed positioning
- **Theme Adaptation**: Automatically adapts colors to light/dark themes
- **CurrentColor**: Label text uses `currentColor` to inherit from parent context
- **Accessibility**: Label always present for screen readers, proper ARIA support
- **Events**: `gds-spinner-connected` when spinner becomes visible, `gds-element-disconnected` when removed

**Style Expression Properties:**

- **Spacing**: `margin`, `margin-inline`, `margin-block` (space tokens only)
- **Positioning**: `position`, `transform`, `inset` for custom placement
- **Alignment**: `align-self`, `justify-self`, `place-self` in flex/grid containers
- **Grid**: `grid-column`, `grid-row`, `grid-area` for grid placement
- **Flexbox**: `flex`, `order` for flex container controls
- **Sizing**: `width`, `min-width`, `max-width`, `inline-size`, `min-inline-size`, `max-inline-size`

**Important Notes:**

- **Beta Status**: Component is in beta and may receive updates
- **Indeterminate Only**: For unknown/indefinite duration. Use progress bars for determinate progress
- **Parent Position**: Parent must have `position: relative` for cover mode to work
- **Always Provide Label**: Even when hidden, label is required for accessibility
- **Descriptive Labels**: Use clear, specific labels that describe what's loading
- **Size Selection**: Small for inline, medium for most cases, large for fullscreen/emphasis
- **Conditional Rendering**: Only render when actively loading to improve performance
- **Fullscreen Sparingly**: Reserve for critical loading operations (initial load, large imports)
- **No Multiple Fullscreen**: Only use one fullscreen spinner at a time
- **Clean Up**: Remove from DOM when not loading
- **Event Tracking**: Use `gds-spinner-connected` to track when spinner becomes visible

---

#### GdsRadioGroup & GdsRadio - Single Selection

**📖 Complete GdsRadioGroup documentation: [`GdsRadioGroup.md`](./GdsRadioGroup.md)**

Radio buttons allow users to select a single option from a predefined set of mutually exclusive choices. Managed by GdsRadioGroup for selection state, keyboard navigation, and validation.

```tsx
// Basic radio group
import { GdsRadioGroup, GdsRadio, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRadioGroup label="Select an option">
    <GdsRadio label="Option 1" value="1" supporting-text="Supporting text" />
    <GdsRadio label="Option 2" value="2" supporting-text="Supporting text" />
    <GdsRadio label="Option 3" value="3" supporting-text="Supporting text" />
  </GdsRadioGroup>
</GdsTheme>

// Size variants
<GdsRadioGroup label="Group Label" size="small" direction="row">
  <GdsRadio label="Small 1" value="1" />
  <GdsRadio label="Small 2" value="2" />
</GdsRadioGroup>

// With validation
function ValidatedRadioGroup() {
  return (
    <form>
      <GdsRadioGroup 
        label="Priority level" 
        required
        error-message="Please select a priority"
      >
        <GdsRadio label="High" value="high" />
        <GdsRadio label="Medium" value="medium" />
        <GdsRadio label="Low" value="low" />
      </GdsRadioGroup>
    </form>
  )
}

// Controlled radio group
function ControlledExample() {
  const [value, setValue] = useState('1')
  
  return (
    <GdsRadioGroup 
      label="Contact method" 
      value={value}
      onChange={(e) => setValue((e.target as HTMLInputElement).value)}
    >
      <GdsRadio label="Email" value="email" />
      <GdsRadio label="Phone" value="phone" />
      <GdsRadio label="SMS" value="sms" />
    </GdsRadioGroup>
  )
}
```

**Key Features:**
- **Mutually Exclusive**: Only one radio button can be selected at a time within a group
- **Two Sizes**: Large (default) for standard forms, small for compact layouts
- **Two Directions**: Column (default) for clarity, row for horizontal compact layouts
- **Form Associated**: Integrates with native form validation
- **Keyboard Navigation**: Arrow keys navigate between options, Space to select
- **Extended Supporting Text**: Slot for detailed explanations with info button

**Attributes (GdsRadioGroup):**
- `label` — Label for the radio group
- `size` — 'large' (default) or 'small'
- `direction` — 'column' (default) or 'row'
- `value` — Selected radio button value
- `required` — Mark as required field
- `disabled` — Disable all radio buttons
- `supporting-text` — Additional context below label
- `show-extended-supporting-text` — Show info button for extended text
- `error-message` — Custom error message

**Attributes (GdsRadio):**
- `label` — Label displayed next to radio button
- `value` — Unique value for the radio button
- `checked` — Whether radio is checked
- `disabled` — Whether radio is disabled
- `supporting-text` — Additional context below label

**Important Notes:**
- **Always Provide Label and Value**: Every radio button must have both label and value
- **Group Label Recommended**: Always provide a group label for clarity and accessibility
- **2-5 Options Ideal**: For more options, consider using GdsDropdown
- **Avoid Disabled State**: Instead, explain why an option is unavailable
- **Mutually Exclusive Only**: Use GdsCheckbox for multiple selections
- **Style Expression Properties**: Extends GdsDiv with all layout properties (margin, width, flex, grid)
- **Form Validation**: Supports Green Core's form validation API with custom validators
- **Events**: `change` and `input` events fired on selection changes

#### GdsRichText - HTML Content Wrapper with Typography

**📖 Complete GdsRichText documentation: [`GdsRichText.md`](./GdsRichText.md)**

GdsRichText wraps generic HTML content and applies design system typography styles. It captures and transfers wrapped content to its inner shadowRoot, making it ideal for wrapping HTML output from CMS or other sources that need consistent design system typography.

```tsx
// Basic rich text content
import { GdsRichText, GdsCard, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsCard>
    <GdsRichText>
      <h1>Welcome to Our Platform</h1>
      <p>
        This is a <strong>paragraph</strong> with <em>various</em> formatting,
        including a <a href="#">link</a>.
      </p>
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>
    </GdsRichText>
  </GdsCard>
</GdsTheme>

// CMS content display
function CMSArticle({ content }: { content: string }) {
  return (
    <GdsTheme>
      <GdsCard>
        <GdsRichText>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </GdsRichText>
      </GdsCard>
    </GdsTheme>
  )
}

// With themed card variant
<GdsCard variant="tertiary">
  <GdsRichText>
    <h1>Featured Article</h1>
    <h2>Subsection Title</h2>
    <p>Content inherits the theme from the parent card.</p>
    <blockquote>
      <p>A meaningful quote.</p>
      <cite>— Author Name</cite>
    </blockquote>
  </GdsRichText>
</GdsCard>

// Documentation page with code
<GdsRichText>
  <h1>API Documentation</h1>
  <h2>Installation</h2>
  <ol>
    <li>Install the package: <code>npm install @sebgroup/green-core</code></li>
    <li>Import the component in your file</li>
  </ol>
  <details open>
    <summary>Configuration Options</summary>
    <p>The following options are available...</p>
  </details>
</GdsRichText>
```

**Key Features:**
- **Two Capture Modes**: 'clone' (default, most compatible with React) or 'move' (preserves event listeners but less compatible)
- **Automatic Typography**: Applies design system typography to all standard HTML elements
- **Shadow DOM**: Content transferred to inner shadowRoot for style encapsulation
- **Theme Adaptation**: Inherits theme from parent container (e.g., card variants)
- **Supported Elements**: Full support for h1-h6, paragraphs, lists, blockquotes, figures, tables, details, inline formatting, links, and iframes
- **Style Expression Properties**: Extends GdsDiv with all layout properties (margin, flex, grid)
- **CMS Integration**: Ideal for wrapping HTML output from content management systems

**Attributes:**
- `captureMode` — 'clone' (default) or 'move' - controls how content is captured
- `gds-element` — Read-only, automatically set by the element

**Capture Modes:**
- **'clone' (default)**: Clones content to shadowRoot, most compatible, leaves original DOM untouched, doesn't retain addEventListener events
- **'move'**: Moves full sub-tree to shadowRoot preserving everything including event listeners, less compatible with React

**Supported HTML Elements:**
- **Headings**: h1-h6 with design system typography
- **Paragraphs**: p with proper spacing
- **Lists**: ul (unordered) and ol (ordered) with consistent spacing
- **Blockquotes**: With cite support for attributions
- **Figures**: With figcaption for image descriptions
- **Tables**: table/thead/tbody/tr/th/td with proper structure
- **Details**: With summary for collapsible content (disclosure widgets)
- **Inline**: strong/em/mark/small/s/code formatting
- **Links**: a with proper styling
- **Other**: hr (horizontal rules), iframe (embedded content)

**Important Notes:**
- **Clone Mode Recommended**: Use default 'clone' mode for React applications (most compatible)
- **Move Mode**: Only use 'move' when event listeners need to be preserved, but be aware it's less compatible with React
- **Wrap in GdsCard**: Typically used within a card container for best results
- **Semantic HTML**: Use proper semantic elements (h1, p, ul, etc.) instead of custom divs
- **Heading Hierarchy**: Maintain proper heading order (h1 → h2 → h3), don't skip levels
- **Accessibility**: Always provide alt text for images and use descriptive link text
- **Table Structure**: Always use thead and th for table headers
- **CMS Integration**: Ideal use case for wrapping HTML from content management systems with dangerouslySetInnerHTML
- **Style Expression Properties**: Extends GdsDiv with all layout properties (margin, flex, grid, align-self, justify-self, etc.)
- **innerHTML Property**: Forwards innerHTML from inner shadowRoot for programmatic access

#### GdsSegmentedControl & GdsSegment - View Switching

**📖 Complete GdsSegmentedControl documentation: [`GdsSegmentedControl.md`](./GdsSegmentedControl.md)**

Segmented control allows users to select a single option, immediately changing the display to reflect their selection. Used for switching views or view options, NOT for navigation.

```tsx
// Basic segmented control
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsSegmentedControl>
    <GdsSegment value="1">Item 1</GdsSegment>
    <GdsSegment value="2">Item 2</GdsSegment>
    <GdsSegment value="3">Item 3</GdsSegment>
  </GdsSegmentedControl>
</GdsTheme>

// Controlled with value
function ControlledExample() {
  const [selected, setSelected] = useState('2')
  
  return (
    <GdsSegmentedControl 
      value={selected} 
      onChange={(e) => setSelected((e.target as any).value)}
    >
      <GdsSegment value="1">First</GdsSegment>
      <GdsSegment value="2">Second</GdsSegment>
      <GdsSegment value="3">Third</GdsSegment>
    </GdsSegmentedControl>
  )
}

// Small size variant
<GdsSegmentedControl size="small" value="2">
  <GdsSegment value="1">First</GdsSegment>
  <GdsSegment value="2">Second</GdsSegment>
  <GdsSegment value="3">Third</GdsSegment>
</GdsSegmentedControl>

// With width control
<GdsSegmentedControl value="1">
  <GdsSegment value="1" min-width="200px">Min-width</GdsSegment>
  <GdsSegment value="2" max-width="150px">Long text</GdsSegment>
  <GdsSegment value="3">Normal</GdsSegment>
</GdsSegmentedControl>

// View mode switcher with icons
import { IconBulletList, IconSquareGridCircle } from '@sebgroup/green-core/react'

function ViewSwitcher() {
  const [view, setView] = useState('list')
  
  return (
    <>
      <GdsSegmentedControl 
        value={view} 
        onChange={(e) => setView((e.target as any).value)}
      >
        <GdsSegment value="list">
          <IconBulletList slot="lead" />
          List
        </GdsSegment>
        <GdsSegment value="grid">
          <IconSquareGridCircle slot="lead" />
          Grid
        </GdsSegment>
      </GdsSegmentedControl>
      {view === 'list' ? <ListView /> : <GridView />}
    </>
  )
}
```

**Key Features:**
- **Single Selection**: Only one segment can be selected at a time
- **Two Sizes**: Small and medium (default)
- **Automatic Scrolling**: Scroll buttons appear if segments don't fit
- **Width Control**: Individual segment widths can be controlled with `min-width`, `max-width` properties
- **Icon Support**: Segments support icons using `slot="lead"`
- **Style Expression Properties**: Extends GdsDiv with all layout properties

**Attributes (GdsSegmentedControl):**
- `value` — The value of the currently selected segment (default: '1')
- `size` — 'small' or 'medium' (default: 'medium')
- `gds-element` — Read-only, automatically set

**Attributes (GdsSegment):**
- `value` — Required. Value to tie arbitrary data to the segment
- `selected` — Whether the segment is selected (default: false)
- `disabled` — Whether the segment is disabled (default: false)
- `width`, `min-width`, `max-width` — Style expression properties for width control
- `gds-element` — Read-only, automatically set

**Events:**
- `change` — Fires when the selected segment is changed
- `gds-element-disconnected` — Fires when element is disconnected from DOM

**Important Notes:**
- **For View Switching Only**: Use for switching views or view options, NOT for navigation
- **Unique Values Required**: Each segment must have a unique `value` attribute
- **Keep Labels Concise**: Short, clear labels work best
- **2-5 Segments Ideal**: For more options, consider using GdsDropdown
- **Icon Usage**: Use Icon prefix (IconHome, IconCog) NOT Gds prefix, see [Icons.md](./Icons.md)
- **Automatic Overflow**: If segments don't fit, scroll buttons appear automatically
- **Width Control**: Use `min-width`, `max-width` on individual segments for responsive layouts
- **Style Expression Properties**: Supports all GdsDiv layout properties (margin, width, flex, grid)

#### GdsCheckbox & GdsCheckboxGroup - Multiple Selection

**📖 Complete GdsCheckbox documentation: [`GdsCheckbox.md`](./GdsCheckbox.md)**

```tsx
// Single checkbox
import { GdsCheckbox } from '@sebgroup/green-core/react'

<GdsCheckbox 
  label="Accept terms and conditions"
  value="terms"
  checked={accepted}
  onChange={(e) => setAccepted((e as any)?.target?.checked ?? false)}
/>

// Checkbox with supporting text
<GdsCheckbox 
  label="Two-Factor Authentication"
  supporting-text="Extra security for transactions"
  value="2fa"
  checked={twoFactorEnabled}
  onChange={handleChange}
/>

// Checkbox group
import { GdsCheckboxGroup, GdsCheckbox } from '@sebgroup/green-core/react'

<GdsCheckboxGroup 
  label="Banking Services"
  supporting-text="Select all that apply"
>
  <GdsCheckbox 
    label="Online Banking" 
    value="online" 
    supporting-text="Access your accounts online"
  />
  <GdsCheckbox 
    label="Mobile App" 
    value="mobile" 
    checked={true}
    supporting-text="Banking on the go"
  />
  <GdsCheckbox 
    label="Phone Banking" 
    value="phone"
    supporting-text="24/7 phone support"
  />
</GdsCheckboxGroup>

// Small size with row direction
<GdsCheckboxGroup 
  label="Quick Options"
  size="small"
  direction="row"
>
  <GdsCheckbox label="Option 1" value="1" />
  <GdsCheckbox label="Option 2" value="2" />
  <GdsCheckbox label="Option 3" value="3" />
</GdsCheckboxGroup>

// With extended supporting text
<GdsCheckboxGroup 
  label="Privacy Settings"
  supporting-text="Control your data sharing preferences"
  show-extended-supporting-text={true}
>
  <span slot="extended-supporting-text">
    These settings control how your data is used. You can change them at any time.
  </span>
  <GdsCheckbox label="Marketing emails" value="marketing" />
  <GdsCheckbox label="Analytics" value="analytics" />
  <GdsCheckbox label="Third-party sharing" value="sharing" />
</GdsCheckboxGroup>

// Indeterminate state (partial selection)
<GdsCheckbox 
  label="Select all items"
  value="all"
  indeterminate={someSelected && !allSelected}
  checked={allSelected}
  onChange={handleSelectAll}
/>
```

**Key Properties:**
- **label**: `string` - Required label text
- **value**: `string` - Required value for the checkbox
- **checked**: `boolean` - Whether checkbox is checked
- **indeterminate**: `boolean` - Partial selection state
- **size**: `'large' | 'small'` - Checkbox size (on group)
- **direction**: `'row' | 'column'` - Layout direction (on group)
- **supporting-text**: `string` - Helper text below label

**Events:**
- **input**: Fired when checkbox state changes
- **change**: Fired when checkbox state changes

#### GdsDatepicker - Date Selection

**📖 Complete GdsDatepicker documentation: [`GdsDatepicker.md`](./GdsDatepicker.md)**

```tsx
// Basic datepicker
import { GdsDatepicker } from '@sebgroup/green-core/react'

<GdsDatepicker label="Pick a date" />

// With supporting text
<GdsDatepicker
  label="Birth Date"
  supportingText="Select your date of birth"
  onChange={(e) => console.log('Selected:', e.target.value)}
/>

// Date range restrictions
<GdsDatepicker
  label="Appointment Date"
  min={new Date(2024, 0, 1)}
  max={new Date(2024, 11, 31)}
  supportingText="Select a date in 2024"
/>

// Disable weekends and specific dates
<GdsDatepicker
  label="Meeting Date"
  disabledWeekends={true}
  disabledDates={[
    new Date(2024, 2, 8),
    new Date(2024, 3, 12)
  ]}
  supportingText="Business days only"
/>

// With week numbers and clearable
<GdsDatepicker
  label="Project Start"
  showWeekNumbers={true}
  clearable={true}
/>

// Small size with hidden label
<GdsDatepicker
  label="Date"
  size="small"
  hideLabel={true}
/>

// Custom date format (European)
<GdsDatepicker
  label="Date"
  dateformat="d/m/y"
  supportingText="DD/MM/YYYY format"
/>

// Date range selection
function DateRange() {
  const [start, setStart] = useState<Date>()
  const [end, setEnd] = useState<Date>()
  
  return (
    <>
      <GdsDatepicker
        label="Start Date"
        value={start}
        max={end}
        onChange={(e) => setStart(e.target.value)}
      />
      <GdsDatepicker
        label="End Date"
        value={end}
        min={start}
        onChange={(e) => setEnd(e.target.value)}
      />
    </>
  )
}
```

**Key Properties:**
- **label**: `string` - Required label text
- **value**: `Date | string` - Selected date
- **min**: `Date | string` - Minimum selectable date
- **max**: `Date | string` - Maximum selectable date
- **size**: `'large' | 'small'` - Input field size
- **dateformat**: `string` - Date format (e.g., `'y-m-d'`, `'d/m/y'`, `'m/d/y'`)
- **supportingText**: `string` - Helper text below label
- **showWeekNumbers**: `boolean` - Show week numbers in calendar
- **disabledWeekends**: `boolean` - Disable Saturdays and Sundays
- **disabledDates**: `Date[]` - Array of dates to disable
- **clearable**: `boolean` - Show clear button
- **hideLabel**: `boolean` - Hide label visually
- **hideTodayButton**: `boolean` - Hide today button in calendar
- **open**: `boolean` - Control calendar popover visibility
- **required**: `boolean` - Required field
- **invalid**: `boolean` - Invalid state
- **disabled**: `boolean` - Disabled state

**Events:**
- **change**: Fired when date is selected by user
- **gds-ui-state**: Fired when calendar opens/closes

---

#### GdsFormSummary - Form Validation Error Summary

**📖 Complete GdsFormSummary documentation: [`GdsFormSummary.md`](./GdsFormSummary.md)**

```tsx
// Reactive form summary (below controls)
import { GdsFormSummary, GdsInput, GdsDropdown, GdsOption, GdsButton } from '@sebgroup/green-core/react'

<form noValidate>
  <GdsInput label="Name" required />
  <GdsInput label="Email" type="email" required />
  <GdsDropdown label="Category" required>
    <GdsOption value="">Select...</GdsOption>
    <GdsOption value="a">Option A</GdsOption>
  </GdsDropdown>
  
  <GdsFormSummary reactive />
  
  <GdsButton type="submit">Submit</GdsButton>
</form>

// Manual update (above controls)
import { useRef } from 'react'

function ManualForm() {
  const summaryRef = useRef(null)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    summaryRef.current?.refresh()
    
    if (summaryRef.current?.errorCount === 0) {
      console.log('Form is valid!')
    }
  }
  
  return (
    <form onSubmit={handleSubmit} noValidate>
      <GdsFormSummary ref={summaryRef} />
      
      <GdsFlex flex-direction="column" gap="m">
        <GdsInput label="Name" required />
        <GdsInput label="Email" type="email" required />
        <GdsButton type="submit">Submit</GdsButton>
      </GdsFlex>
    </form>
  )
}

// With native HTML controls
<form>
  <GdsInput
    id="name"
    label="Name"
    invalid
    error-message="Name is required"
    required
  />
  
  <GdsFormSummary />
</form>

// Hide inline errors
<form>
  <GdsInput label="Email" type="email" required invalid error-message="Email required" />
  <GdsInput label="Password" type="password" required invalid error-message="Password required" />
  
  <GdsFormSummary reactive hide-errors />
  
  <GdsButton type="submit">Sign In</GdsButton>
</form>

// Complex form with card
<form style={{ width: '450px' }} noValidate>
  <GdsCard 
    display="flex" 
    flex-direction="column" 
    gap="m" 
    padding="l"
  >
    <GdsText tag="h2" font="heading-l">Registration</GdsText>
    
    <GdsCheckboxGroup label="Interests" required>
      <GdsCheckbox value="tech" label="Technology" />
      <GdsCheckbox value="sports" label="Sports" />
      <GdsCheckbox value="music" label="Music" />
    </GdsCheckboxGroup>
    
    <GdsRadioGroup label="Experience Level" required>
      <GdsRadio value="beginner" label="Beginner" />
      <GdsRadio value="intermediate" label="Intermediate" />
      <GdsRadio value="advanced" label="Advanced" />
    </GdsRadioGroup>
    
    <GdsDropdown label="Country" required>
      <GdsOption value="">Select country</GdsOption>
      <GdsOption value="us">United States</GdsOption>
      <GdsOption value="uk">United Kingdom</GdsOption>
    </GdsDropdown>
    
    <GdsDatepicker label="Birth Date" required />
    
    <GdsInput label="Full Name" required />
    
    <GdsFormSummary reactive />
    
    <GdsFlex gap="m" justify-content="center">
      <GdsButton type="reset" rank="tertiary">Reset</GdsButton>
      <GdsButton type="submit">Register</GdsButton>
    </GdsFlex>
  </GdsCard>
</form>
```

**Key Properties:**
- **reactive**: `boolean` - Auto-refresh on validation changes (default: `false`)
- **hide-errors**: `boolean` - Hide inline field errors (default: `false`)
- **errorCount**: `number` - Current error count (read-only property)

**Methods:**
- **refresh()**: Manually update the error summary

**Events:**
- **gds-element-disconnected**: Fired when element disconnects

**Important Notes:**
- Must be placed inside `<form>` element
- Works with all Green Core form components automatically
- Supports native HTML controls with `aria-invalid` and data attributes
- Use `reactive` for automatic updates (best below controls)
- Use manual `refresh()` for summaries above controls (prevents layout shifts)
- Error links navigate to and focus corresponding fields
- `errorCount` property useful for conditional logic
- `hide-errors` removes inline messages (shows only in summary)
- Best practice: one summary per form
- For long forms, place summary at top with manual update

---

### Navigation Components

#### GdsLink - Link Component

**📖 Complete GdsLink documentation: [`GdsLink.md`](./GdsLink.md)**

```tsx
import { GdsLink } from '@sebgroup/green-core/react'
import { 
  IconChainLink, 
  IconArrowRight, 
  IconExternalLink,
  IconHomeOpen,
  IconSettings
} from '@sebgroup/green-core/react'

// Basic link
<GdsLink href="/about">About Us</GdsLink>

// External link
<GdsLink href="https://example.com" target="_blank">
  Visit Example
</GdsLink>

// Internal navigation
<GdsLink href="#section-1">Jump to Section 1</GdsLink>
<GdsLink href="/products">View Products</GdsLink>

// Link with lead icon
<GdsLink href="/resources">
  <IconChainLink slot="lead" />
  Resources
</GdsLink>

// Link with trail icon
<GdsLink href="/next-page">
  Continue
  <IconArrowRight slot="trail" />
</GdsLink>

// External link with icon
<GdsLink href="https://docs.example.com" target="_blank">
  <IconExternalLink slot="lead" />
  Documentation
</GdsLink>

// Text decoration variants
<GdsLink href="/page" text-decoration="underline">
  Always Underlined
</GdsLink>

<GdsLink href="/page" text-decoration="none">
  No Underline Ever
</GdsLink>

<GdsLink href="/page" text-decoration="hover:underline">
  Underline on Hover
</GdsLink>

<GdsLink href="/page" text-decoration="underline; hover:none">
  Remove Underline on Hover
</GdsLink>

// Icon-only link (accessible)
<GdsLink href="/settings" label="Open settings">
  <IconSettings />
</GdsLink>

// Download link
<GdsLink href="/files/report.pdf" download>
  Download Report (PDF)
</GdsLink>

// Download with custom filename
<GdsLink href="/files/data.csv" download="monthly-report.csv">
  Download Monthly Report
</GdsLink>

// Navigation menu
<GdsFlex gap="l" align-items="center">
  <GdsLink href="/">
    <IconHomeOpen slot="lead" />
    Home
  </GdsLink>
  
  <GdsLink href="/profile" text-decoration="hover:underline">
    Profile
  </GdsLink>
  
  <GdsLink href="/settings">
    <IconSettings slot="lead" />
    Settings
  </GdsLink>
</GdsFlex>

// Breadcrumb navigation
<GdsFlex gap="s" align-items="center">
  <GdsLink href="/">Home</GdsLink>
  <IconChevronRight size="xs" />
  
  <GdsLink href="/products">Products</GdsLink>
  <IconChevronRight size="xs" />
  
  <GdsText>Current Page</GdsText>
</GdsFlex>

// Alternative screen reader text
<GdsLink 
  href="/article/climate-change" 
  label="Read full article about climate change impacts"
>
  Read more
</GdsLink>
```

**Key Features:**
- **Navigation Types**: Internal links, external links, fragment links (anchors), email, phone
- **Icon Slots**: Lead and trail slots for icons before/after link text
- **Text Decoration**: Full control including hover states with `hover:` prefix
- **Target Control**: `_self` (default), `_blank` (new tab), `_parent`, `_top`
- **Download Support**: Mark links for file downloads with optional custom filename
- **Accessibility**: ARIA label support for icon-only links and alternative descriptions
- **Security**: Automatic `rel="noopener noreferrer"` for external links with `target="_blank"`
- **Style Expressions**: Full margin, width, and layout property support

**Link Types:**
- `href="/page"` — Internal relative link
- `href="https://example.com"` — External absolute link
- `href="#section"` — Same-page anchor link
- `href="mailto:email@example.com"` — Email link
- `href="tel:+15551234567"` — Phone link
- `download` attribute — File download link

**Text Decoration Syntax:**
- `"underline"` — Always underlined
- `"none"` — Never underlined
- `"hover:underline"` — Underline only on hover
- `"underline; hover:none"` — Underline normally, remove on hover

**Accessibility Best Practices:**
- Always use descriptive link text
- Use `label` attribute for icon-only links
- Provide context for "Read more" or "Click here" links
- Indicate external links with icons or text

#### GdsButton - Action & Navigation Component

**📖 Complete GdsButton documentation: [`GdsButton.md`](./GdsButton.md)**

```tsx
// Basic button
import { GdsButton } from '@sebgroup/green-core/react'

<GdsButton>Click Me</GdsButton>

// Ranks and variants
<GdsButton variant="primary">Primary</GdsButton>
<GdsButton rank="secondary">Secondary</GdsButton>
<GdsButton rank="tertiary">Tertiary</GdsButton>

<GdsButton variant="positive">Confirm</GdsButton>
<GdsButton variant="negative">Delete</GdsButton>
<GdsButton variant="brand">Brand Action</GdsButton>

// With icons
import { IconCreditCard, IconArrowRight, IconArrowLeft } from '@sebgroup/green-core/react'

<GdsButton>
  <IconCreditCard slot="lead" />
  Leading Icon
</GdsButton>

<GdsButton>
  Trailing Icon
  <IconArrowRight slot="trail" />
</GdsButton>

// Navigation buttons
<GdsButton justifyContent="space-between">
  <IconArrowLeft slot="lead" />
  Previous
</GdsButton>

<GdsButton justifyContent="space-between">
  Next
  <IconArrowRight slot="trail" />
</GdsButton>

// Icon-only button (always provide label)
<GdsButton label="Close dialog">
  <IconClose />
</GdsButton>

// Sizes
<GdsButton size="large">Large</GdsButton>
<GdsButton>Medium</GdsButton>
<GdsButton size="small">Small</GdsButton>
<GdsButton size="xs">XS</GdsButton>

// Link button
<GdsButton href="https://example.com" target="_blank">
  Visit Site
</GdsButton>
```

**Key Properties:**
- **rank**: `'primary' | 'secondary' | 'tertiary'` - Visual importance
- **variant**: `'neutral' | 'brand' | 'positive' | 'negative' | 'notice' | 'warning'` - Intent
- **size**: `'xs' | 'small' | 'medium' | 'large'` - Button size
- **disabled**: `boolean` - Disabled state (use sparingly)
- **label**: `string` - Accessible label for icon-only buttons
- **href**: `string` - Renders as link when provided
- **justifyContent**: `string` - Spread content (useful for navigation)

**Slots:**
- **lead**: Icon before text
- **trail**: Icon after text

---

#### GdsFab - Floating Action Button

**📖 Complete GdsFab documentation: [`GdsFab.md`](./GdsFab.md)**

```tsx
// Floating action button for persistent primary actions
import { GdsFab, GdsSignal } from '@sebgroup/green-core/react'

// Basic FAB (bottom right corner by default)
<GdsFab>See what's new!</GdsFab>

// With signal badge (for notifications)
<GdsFab>
  See what's new!
  <GdsSignal slot="trail" />
</GdsFab>

// Icon-only FAB (always provide label)
import { IconBubbles, IconPlus, IconBell } from '@sebgroup/green-core/icons'

<GdsFab label="Chat with support">
  <IconBubbles />
  <GdsSignal slot="trail" />
</GdsFab>

// Positioning with inset (top, right, bottom, left)
<GdsFab inset="auto 48px 48px auto">
  Bottom Right
</GdsFab>

<GdsFab inset="auto auto 48px 48px">
  Bottom Left
</GdsFab>

<GdsFab inset="48px 48px auto auto">
  Top Right
</GdsFab>

// Ranks and variants
<GdsFab rank="secondary" variant="positive">
  Secondary
  <GdsSignal slot="trail" />
</GdsFab>

<GdsFab rank="tertiary" variant="negative">
  Tertiary
</GdsFab>

// Sizes
<GdsFab size="large" label="Large chat button">
  <IconBubbles />
</GdsFab>

<GdsFab size="small" label="Small notification">
  <IconBell />
  <GdsSignal slot="trail" />
</GdsFab>

// Custom signal color
<GdsFab rank="secondary" variant="positive">
  Notifications
  <GdsSignal slot="trail" level="3" color="positive-01" />
</GdsFab>

// As link
<GdsFab href="/help" target="_blank">
  Get Help
</GdsFab>

// With click handler
<GdsFab onClick={() => console.log('FAB clicked')}>
  Action
</GdsFab>

// Common patterns
// Chat/Support
<GdsFab variant="positive" label="Chat">
  <IconBubbles />
  <GdsSignal slot="trail" />
</GdsFab>

// Add/Create
<GdsFab variant="positive" label="Add new">
  <IconPlus />
</GdsFab>

// Notifications
<GdsFab label="Notifications">
  <IconBell />
  {hasNotifications && <GdsSignal slot="trail" />}
</GdsFab>
```

**Key Properties:**
- **rank**: `'primary' | 'secondary' | 'tertiary'` - Visual hierarchy
- **variant**: `'neutral' | 'positive' | 'negative' | 'brand' | 'notice' | 'warning'` - Intent
- **size**: `'xs' | 'small' | 'medium' | 'large'` - Button size
- **label**: `string` - Accessible label (required for icon-only FABs)
- **inset**: `string` - Position (format: `top right bottom left`, use `auto` for unset)
- **position**: `string` - CSS position value (default: `fixed`)
- **href**: `string` - Renders as link when provided
- **disabled**: `boolean` - Disabled state

**Style Expression Properties:**
- **position**: Default is `fixed` (stays in viewport)
- **inset**: Controls positioning (shorthand for top/right/bottom/left)
- **transform**: CSS transform values
- **width**, **margin**, **flex**, **grid**: Layout properties

**Slots:**
- **lead**: Icon before text
- **trail**: Icon or signal after text (use `GdsSignal` for notifications)

**Important Notes:**
- FAB extends GdsButton with fixed positioning
- Default z-index is 1050 (stays above content)
- Only use one FAB per screen
- Typical placement: `inset="auto 48px 48px auto"` (bottom right)
- Always provide `label` for icon-only FABs
- Signal badge automatically matches button rank and variant
- Use for primary actions that need constant access
- Don't obscure important content
- Consider mobile viewport constraints

---

#### GdsMenuButton - Menu Navigation Component

**📖 Complete GdsMenuButton documentation: [`GdsMenuButton.md`](./GdsMenuButton.md)**

```tsx
import { GdsMenuButton, GdsTheme, GdsFlex, GdsPopover } from '@sebgroup/green-core/react'
import { 
  IconMagnifyingGlass, 
  IconBell, 
  IconPeople, 
  IconSquareArrowTopRight 
} from '@sebgroup/green-core/react'

// Basic menu button with icon
<GdsTheme>
  <GdsMenuButton>
    <IconMagnifyingGlass slot="lead" />
    Search
  </GdsMenuButton>
</GdsTheme>

// Selected state (current page)
<GdsTheme>
  <GdsMenuButton selected>
    <IconPeople solid slot="trail" />
    Profile
  </GdsMenuButton>
</GdsTheme>

// As navigation link
<GdsTheme>
  <GdsMenuButton href="/search">
    <IconMagnifyingGlass slot="lead" />
    Search
  </GdsMenuButton>
</GdsTheme>

// External link
<GdsTheme>
  <GdsMenuButton href="https://github.com/seb-oss/green" target="_blank">
    <IconSquareArrowTopRight slot="trail" />
    External link
  </GdsMenuButton>
</GdsTheme>

// Complete menu bar
<GdsTheme>
  <GdsFlex 
    width="700px" 
    background="neutral-01" 
    border="0 0 3xs/subtle-01 0" 
    align-items="center"
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
      <GdsMenuButton href="https://github.com/seb-oss/green" target="_blank">
        <IconSquareArrowTopRight slot="trail" />
        External link
      </GdsMenuButton>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>

// Compact menu bar (mobile-optimized)
<GdsTheme>
  <GdsFlex 
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
      <GdsMenuButton compact selected>
        <IconPeople slot="trail" />
        Profile
      </GdsMenuButton>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>

// Dark theme menu
<GdsTheme color-scheme="dark">
  <GdsFlex 
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
      <GdsMenuButton selected>
        <IconPeople slot="trail" />
        Profile
      </GdsMenuButton>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>

// With click handler
<GdsMenuButton onClick={() => handleSearch()}>
  <IconMagnifyingGlass slot="lead" />
  Search
</GdsMenuButton>

// Disabled state
<GdsMenuButton disabled>
  <IconMagnifyingGlass slot="lead" />
  Search
</GdsMenuButton>
```

**Key Properties:**
- **selected**: `boolean` - Indicates the current page or active menu item
- **compact**: `boolean` - Compact styling for mobile viewports
- **disabled**: `boolean` - Disabled state
- **href**: `string` - Renders as anchor element for navigation
- **target**: `'_self' | '_blank' | '_parent' | '_top'` - Where to display linked URL
- **rel**: `string` - Link relationship (defaults to "noreferrer noopener" when target is set)
- **download**: `string` - Treats linked URL as download
- **label**: `string` - Accessible label when no text in default slot

**Style Expression Properties:**
- **width**, **min-width**, **max-width**: Size controls
- **inline-size**, **min-inline-size**, **max-inline-size**: Logical size controls
- **align-self**, **justify-self**, **place-self**: Alignment in flex/grid containers
- **grid-column**, **grid-row**, **grid-area**: Grid placement
- **flex**, **order**: Flexbox controls
- **margin**, **margin-inline**, **margin-block**: Spacing controls

**Slots:**
- **lead**: Icon slot before the label (for action icons)
- **trail**: Icon slot after the label (for status/navigation icons)

**Events:**
- **click**: Fired when the button is clicked

**Important Notes:**
- Combines button and link behaviors for navigation menus
- Use `selected` attribute to highlight the current page
- Use `compact` for mobile-friendly menu bars
- Automatically renders as anchor element when `href` is provided
- Security: `rel="noreferrer noopener"` is auto-applied when `target` is set
- Icon placement: `lead` for actions (search, add), `trail` for status (arrow, external)
- Works seamlessly with GdsPopover for dropdown menus
- Supports both light and dark color schemes via GdsTheme
- Fully keyboard accessible (Tab, Enter, Space, Arrow keys)
- Always provide `label` for icon-only buttons for accessibility

---

#### GdsBreadcrumbs - Hierarchical Navigation

**📖 Complete GdsBreadcrumbs documentation: [`GdsBreadcrumbs.md`](./GdsBreadcrumbs.md)**

```tsx
// Simple breadcrumbs
<GdsBreadcrumbs>
	<gds-breadcrumb href="/">Home</gds-breadcrumb>
	<gds-breadcrumb href="/products">Products</gds-breadcrumb>
	<gds-breadcrumb href="/products/banking">Banking</gds-breadcrumb>
	<gds-breadcrumb>Current Page</gds-breadcrumb>
</GdsBreadcrumbs>

// With icons
<GdsBreadcrumbs>
	<gds-breadcrumb href="/">
		<IconHomeOpen slot="lead" />
		Home
	</gds-breadcrumb>
	<gds-breadcrumb href="/documents">
		<IconFolder slot="lead" />
		Documents
	</gds-breadcrumb>
	<gds-breadcrumb>Current</gds-breadcrumb>
</GdsBreadcrumbs>

// Size variants
<GdsBreadcrumbs size="small">...</GdsBreadcrumbs>

// Custom accessible label
<GdsBreadcrumbs label="Site Navigation">...</GdsBreadcrumbs>

// With overflow menu
<GdsBreadcrumbs>
	<gds-breadcrumb href="/">Home</gds-breadcrumb>
	<gds-breadcrumb overflow>
		<gds-context-menu>
			<gds-menu-item>Subfolder 1</gds-menu-item>
			<gds-menu-item>Subfolder 2</gds-menu-item>
		</gds-context-menu>
	</gds-breadcrumb>
	<gds-breadcrumb>Current</gds-breadcrumb>
</GdsBreadcrumbs>
```

**Key Properties:**
- `size`: "large" (default) | "small"
- `label`: Accessible label for screen readers (default: "breadcrumbs")

**Breadcrumb Item (`<gds-breadcrumb>`):**
- `href`: Link URL (omit for current page)
- `overflow`: Boolean for overflow menu items
- Slots: `lead` (icons), `trail`, default (text)

**Features:**
- Automatic mobile optimization (shows previous page only)
- Built-in separators between items
- Current page indication (no href on last item)
- Supports custom overflow solutions

#### GdsContextMenu - Contextual Action Menus

**📖 Complete GdsContextMenu documentation: [`GdsContextMenu.md`](./GdsContextMenu.md)**

```tsx
// Basic context menu
import { GdsContextMenu, GdsMenuItem, GdsMenuHeading } from '@sebgroup/green-core/react'

<GdsContextMenu label="Select an action" button-label="Actions">
  <GdsMenuItem>Action 1</GdsMenuItem>
  <GdsMenuItem>Action 2</GdsMenuItem>
  <GdsMenuItem>Action 3</GdsMenuItem>
</GdsContextMenu>

// With custom trigger
import { GdsButton } from '@sebgroup/green-core/react'
import { IconDotGridOneHorizontal } from '@sebgroup/green-core/react'

<GdsContextMenu label="Actions menu">
  <GdsButton slot="trigger" rank="tertiary">
    Options
    <IconDotGridOneHorizontal slot="trail" />
  </GdsButton>
  
  <GdsMenuItem>Edit</GdsMenuItem>
  <GdsMenuItem>Delete</GdsMenuItem>
</GdsContextMenu>

// With show label
<GdsContextMenu 
  label="File operations" 
  button-label="File" 
  show-label={true}
>
  <GdsMenuItem>New</GdsMenuItem>
  <GdsMenuItem>Open</GdsMenuItem>
  <GdsMenuItem>Save</GdsMenuItem>
</GdsContextMenu>

// With menu headings and icons
import { IconEdit, IconDelete } from '@sebgroup/green-core/react'

<GdsContextMenu label="Item actions" button-label="Actions">
  <GdsMenuHeading>Edit</GdsMenuHeading>
  <GdsMenuItem>
    <IconEdit />
    Edit Details
  </GdsMenuItem>
  <GdsMenuItem>Duplicate</GdsMenuItem>
  
  <GdsMenuHeading>Manage</GdsMenuHeading>
  <GdsMenuItem style={{ color: 'var(--intent-danger-background)' }}>
    <IconDelete />
    Delete
  </GdsMenuItem>
</GdsContextMenu>

// Event handling
<GdsContextMenu 
  label="Actions" 
  button-label="More"
  onGdsMenuItemClick={(e) => {
    console.log('Menu item clicked:', e.detail)
  }}
>
  <GdsMenuItem>Action 1</GdsMenuItem>
  <GdsMenuItem>Action 2</GdsMenuItem>
</GdsContextMenu>

// In table row
<tr>
  <td>{item.name}</td>
  <td>
    <GdsContextMenu label={`Actions for ${item.name}`} button-label="Actions">
      <GdsMenuItem onClick={() => handleEdit(item.id)}>Edit</GdsMenuItem>
      <GdsMenuItem onClick={() => handleDelete(item.id)}>Delete</GdsMenuItem>
    </GdsContextMenu>
  </td>
</tr>
```

**Key Properties:**
- **label**: `string` - Accessible label describing menu context (required)
- **button-label**: `string` - Label for trigger button (required for accessibility)
- **show-label**: `boolean` - Whether to show label on trigger button
- **placement**: `Placement` - Menu position (`'bottom-start'`, `'bottom-end'`, `'top'`, etc.)
- **open**: `boolean` - Controlled open state

**Slots:**
- **trigger**: Custom trigger element (should be focusable)
- **icon**: Custom icon for default trigger
- **(default)**: Menu items and headings

**Events:**
- **gds-menu-item-click**: Fired when any menu item is clicked
- **gds-ui-state**: Fired when menu opens/closes

**Components:**
- **GdsMenuItem**: Individual menu item (accepts any content)
- **GdsMenuHeading**: Section heading for grouping menu items

### Feedback & Status Components

#### GdsAlert - Status Messages & Notifications

**📖 Complete GdsAlert documentation: [`GdsAlert.md`](./GdsAlert.md)**

```tsx
// Basic alert
<GdsAlert variant="information">
	<strong>Information</strong> Important message for the user.
</GdsAlert>

// Variants
<GdsAlert variant="positive" role="status">Success message</GdsAlert>
<GdsAlert variant="negative" role="alert">Error message</GdsAlert>
<GdsAlert variant="warning" role="alert">Warning message</GdsAlert>
<GdsAlert variant="notice" role="status">Notice message</GdsAlert>

// Dismissible alert
<GdsAlert dismissible onGds-close={(e) => console.log('Closed')}>
	User can dismiss this alert
</GdsAlert>

// Auto-dismiss alert (5 seconds)
<GdsAlert timeout={5000}>
	This will auto-dismiss after 5 seconds
</GdsAlert>

// With action button
<GdsAlert 
	button-label="View Details"
	onGds-action={(e) => handleAction()}
>
	<strong>Action Required</strong> Please review your submission.
</GdsAlert>

// Error handling example
<GdsAlert variant="negative" role="alert" dismissible>
	<strong>Form Submission Failed</strong>
	<ul>
		{errors.map(err => <li key={err}>{err}</li>)}
	</ul>
</GdsAlert>
```

**Key Properties:**
- `variant`: "information" | "notice" | "positive" | "warning" | "negative"
- `role`: "alert" (critical) | "status" (informational) - for ARIA accessibility
- `dismissible`: Boolean - shows close button
- `timeout`: Number - auto-dismiss in milliseconds
- `button-label`: String - adds action button

**Events:**
- `gds-close`: Fired when dismissed
- `gds-action`: Fired when action button clicked

#### GdsCoachmark - User Guidance & Feature Highlights

**📖 Complete GdsCoachmark documentation: [`GdsCoachmark.md`](./GdsCoachmark.md)**

```tsx
// Basic coachmark targeting an element
import { GdsCoachmark, GdsButton, GdsTheme } from '@sebgreen/green-core/react'

<GdsTheme>
  <div>
    <button id="save-button">Save</button>
    
    <GdsCoachmark target={['#save-button']} placement="bottom">
      Click here to save your changes
    </GdsCoachmark>
  </div>
</GdsTheme>

// Onboarding flow
const [step, setStep] = useState(1)
const [showCoachmark, setShowCoachmark] = useState(true)

<>
  <button id="create-button">Create</button>
  <button id="import-button">Import</button>
  
  {showCoachmark && step === 1 && (
    <GdsCoachmark 
      target={['#create-button']}
      placement="bottom"
      label="Step 1: Create Project"
      onGdsUiState={() => setShowCoachmark(false)}
    >
      <div style={{ padding: '12px' }}>
        <p><strong>Step 1:</strong> Create your first project</p>
        <GdsButton size="small" onClick={() => setStep(2)}>
          Next
        </GdsButton>
      </div>
    </GdsCoachmark>
  )}
  
  {showCoachmark && step === 2 && (
    <GdsCoachmark 
      target={['#import-button']}
      placement="bottom"
      label="Step 2: Import Data"
      onGdsUiState={() => setShowCoachmark(false)}
    >
      <div style={{ padding: '12px' }}>
        <p><strong>Step 2:</strong> Import existing data</p>
        <GdsButton size="small" onClick={() => setShowCoachmark(false)}>
          Finish
        </GdsButton>
      </div>
    </GdsCoachmark>
  )}
</>

// Feature highlight with dismissal tracking
const [showFeature, setShowFeature] = useState(
  !localStorage.getItem('feature-highlight-seen')
)

{showFeature && (
  <GdsCoachmark 
    target={['#new-feature']}
    placement="right"
    onGdsUiState={() => {
      setShowFeature(false)
      localStorage.setItem('feature-highlight-seen', 'true')
    }}
  >
    <p>🎉 Check out our new export feature!</p>
  </GdsCoachmark>
)}

// ShadowDOM targeting
<GdsCoachmark 
  target={['custom-component', 'shadowRoot', '#internal-button']}
  placement="top"
>
  Configure settings here
</GdsCoachmark>
```

**Key Properties:**
- **target**: `string[]` - Array of selectors to target element (supports ShadowDOM)
- **placement**: Floating UI placement - `'top'`, `'bottom'`, `'left'`, `'right'`, `'top-start'`, `'top-end'`, `'bottom-start'`, `'bottom-end'`, `'left-start'`, `'left-end'`, `'right-start'`, `'right-end'`
- **label**: `string` - Accessible label (default: 'Coachmark')
- **overlappedBy**: `string[]` - Elements that hide coachmark when overlapping
- **computeVisibility**: `Function` - Custom visibility logic

**Events:**
- **gds-ui-state**: Fired when coachmark is closed

**Notes:**
- Only one coachmark visible at a time
- Automatically hides if target is out of view or covered
- Closes on any click
- Beta status - API may change

---

#### GdsSignal - Notification Indicator

**📖 Complete GdsSignal documentation: [`GdsSignal.md`](./GdsSignal.md)**

A visual indicator used to draw attention to notifications and new content. Commonly used as a notification badge on buttons and FABs.

```tsx
import { GdsSignal, GdsTheme, GdsFlex, GdsButton, GdsFab } from '@sebgroup/green-core/react'

// Basic signal
<GdsSignal />

// Color variants
<GdsFlex gap="4xl">
  <GdsSignal />
  <GdsSignal color="positive-01" />
  <GdsSignal color="negative-01" />
  <GdsSignal color="notice-01" />
</GdsFlex>
```

**With FAB (Floating Action Button):**

```tsx
// Signal in trail slot
<GdsFlex height="200px">
  <GdsFab inset="auto 40px 40px auto">
    Primary <GdsSignal slot="trail" />
  </GdsFab>
</GdsFlex>
```

**With Buttons:**

```tsx
// Notification indicators
<GdsFlex gap="m">
  <GdsButton>
    Messages <GdsSignal slot="trail" />
  </GdsButton>
  
  <GdsButton>
    Alerts <GdsSignal slot="trail" color="negative-01" />
  </GdsButton>
  
  <GdsButton>
    Updates <GdsSignal slot="trail" color="notice-01" />
  </GdsButton>
</GdsFlex>
```

**Conditional Display:**

```tsx
function NotificationButton() {
  const [hasNotifications, setHasNotifications] = useState(true)

  return (
    <GdsButton aria-label={`Notifications${hasNotifications ? ' (unread)' : ''}`}>
      Notifications
      {hasNotifications && <GdsSignal slot="trail" color="notice-01" />}
    </GdsButton>
  )
}
```

**Key Features:**

- **Color Customization**: Accepts all content color tokens (`positive-01`, `negative-01`, `notice-01`, etc.)
- **Context Matching**: When no color specified, inherits from surrounding component (button rank/variant)
- **Slot Support**: Commonly used in trail slot of buttons, FABs, and menu buttons
- **Automatic Sizing**: Sizes appropriately for context
- **Built-in Spacing**: Proper spacing when used in component slots

**Style Expression Properties:**

- **Color**: Content color tokens with optional transparency

**Important Notes:**

- **Decorative Only**: Signal is purely decorative and doesn't carry semantic meaning for screen readers
- **Accessibility**: Always provide accessible text alternatives (aria-label, visually-hidden text)
- **Color Tokens**: Use design system color tokens from Color System documentation (seb.io/studio/colors)
- **Common Usage**: Most commonly used in trail slot of buttons and FABs
- **Semantic Colors**:
  - Default: Matches component context
  - `positive-01`: Success, completed, verified
  - `negative-01`: Errors, failures, critical alerts
  - `notice-01`: Information, updates, attention needed
- **Best Practices**: Use sparingly (one signal per component), supplement with accessible text
- **Event**: `gds-element-disconnected` when element removed from DOM

---

#### GdsBadge - Status Indicators & Counters

**📖 Complete GdsBadge documentation: [`GdsBadge.md`](./GdsBadge.md)**

```tsx
// Basic badge
<GdsBadge variant="positive">Success</GdsBadge>

// Variants
<GdsBadge variant="information">Information</GdsBadge>
<GdsBadge variant="notice">Notice</GdsBadge>
<GdsBadge variant="positive">Positive</GdsBadge>
<GdsBadge variant="warning">Warning</GdsBadge>
<GdsBadge variant="negative">Negative</GdsBadge>
<GdsBadge variant="disabled">Disabled</GdsBadge>

// With icons (lead slot)
<GdsBadge variant="positive">
	<IconCircleCheck slot="lead" />
	Completed
</GdsBadge>

// With trail slot (currency, units)
<GdsBadge variant="positive">
	<IconPlusSmall slot="lead" />
	1,250.00
	<span slot="trail">SEK</span>
</GdsBadge>

// Size variants
<GdsBadge size="small" variant="information">120</GdsBadge>

// Notification mode
<GdsBadge notification>9</GdsBadge>
<GdsBadge notification>999+</GdsBadge>

// Rounded badges
<GdsBadge rounded variant="information">01</GdsBadge>

// Counter example
<GdsButton rank="tertiary">
	Notifications
	<GdsBadge notification size="small" margin-inline="s">12</GdsBadge>
</GdsButton>
```

**Key Properties:**
- `variant`: "information" | "notice" | "positive" | "warning" | "negative" | "disabled"
- `size`: "default" | "small"
- `notification`: Boolean - notification mode with only positive/negative variants
- `rounded`: Boolean - fully rounded corners

**Slots:**
- `lead`: For icons or leading content
- `trail`: For trailing content (currency, units, etc.)
- Default: Main badge content

**Events:**
- `gds-close`: Fired when dismissed
- `gds-action`: Fired when action button clicked

### Utility Components

#### GdsBlur - Content Blur Effect

**📖 Complete GdsBlur documentation: [`GdsBlur.md`](./GdsBlur.md)**

**Status**: Beta

```tsx
// Basic blur
<GdsBlur>
	<GdsText>This text is blurred</GdsText>
</GdsBlur>

// Blur sensitive data
<GdsFlex justify-content="space-between">
	<GdsText>Account Number:</GdsText>
	<GdsBlur>
		<GdsText>1234-5678-9012-3456</GdsText>
	</GdsBlur>
</GdsFlex>

// Conditional blur
{isBlurred ? (
	<GdsBlur>
		<GdsText>Confidential information</GdsText>
	</GdsBlur>
) : (
	<GdsText>Confidential information</GdsText>
)}

// Blur complex content
<GdsBlur>
	<GdsCard padding="l">
		<GdsText tag="h3" font="heading-m">Sensitive Card</GdsText>
		<GdsText>All content in this card is blurred</GdsText>
	</GdsCard>
</GdsBlur>

// Toggle blur state
const [showData, setShowData] = useState(false)

<GdsFlex flex-direction="column" gap="m">
	<GdsButton onClick={() => setShowData(!showData)}>
		{showData ? 'Hide' : 'Show'} Data
	</GdsButton>
	{showData ? (
		<GdsText>Account: 1234567890</GdsText>
	) : (
		<GdsBlur>
			<GdsText>Account: 1234567890</GdsText>
		</GdsBlur>
	)}
</GdsFlex>
```

**Use Cases:**
- Obscure sensitive information (account numbers, SSN, emails)
- Privacy protection in demos and screenshots
- De-emphasize background content with modals
- Progressive disclosure requiring authentication
- GDPR/compliance requirements for PII protection

**Important Notes:**
- ⚠️ Blur is visual only - not a security feature
- Content is still in DOM and accessible via developer tools
- Always implement proper backend security
- Screen readers will still read blurred content
- Use `aria-hidden="true"` if content should be hidden from assistive tech

### Overlays & Modals

#### GdsPopover - Temporary Overlay Content

**📖 Complete GdsPopover documentation: [`GdsPopover.md`](./GdsPopover.md)**

A temporary view that appears above other content, triggered by user interaction. Provides flexible positioning, customizable behavior, and built-in accessibility features.

```tsx
// Basic popover with trigger
import { GdsPopover, GdsTheme, GdsButton, IconChevronBottom } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsPopover>
    <GdsButton rank="secondary" slot="trigger">
      Show popover <IconChevronBottom slot="trail" />
    </GdsButton>
    <div style={{ padding: '1rem', paddingTop: 0 }}>
      <h3>This is a custom popover!</h3>
      <p>It can contain any content you need, including other components.</p>
      <GdsButton rank="primary">Such as buttons!</GdsButton>
    </div>
  </GdsPopover>
</GdsTheme>

// Different placements
<GdsPopover placement="top">
  <GdsButton slot="trigger">Top</GdsButton>
  <div style={{ padding: '1rem' }}>Top placement</div>
</GdsPopover>

<GdsPopover placement="bottom-start">
  <GdsButton slot="trigger">Bottom Start</GdsButton>
  <div style={{ padding: '1rem' }}>Bottom start placement</div>
</GdsPopover>

// Custom closing behavior
function CustomClosingPopover() {
  const handleStateChange = (e: CustomEvent) => {
    if (e.detail.reason === 'close') {
      e.preventDefault() // Prevent closing on outside click
    }
  }

  return (
    <GdsPopover onGdsUiState={handleStateChange}>
      <GdsButton slot="trigger">Show popover</GdsButton>
      <div style={{ padding: '1rem' }}>
        <p>Can only be closed by clicking button or hitting escape</p>
        <GdsButton rank="primary">Close me!</GdsButton>
      </div>
    </GdsPopover>
  )
}

// Nonmodal with backdrop
<div>
  <GdsPopover nonmodal backdrop=".my-backdrop">
    <GdsMenuButton slot="trigger">
      <IconChevronBottom slot="trail" />
      With custom backdrop
    </GdsMenuButton>
    <div style={{ padding: '1rem' }}>
      <h3>Customized popover</h3>
      <p>Using custom backdrop and positioning middleware.</p>
    </div>
  </GdsPopover>
  <GdsBackdrop className="my-backdrop" />
</div>
```

**Key Features:**
- **Flexible Positioning**: Uses Floating UI with middleware for intelligent positioning (placement, offset, flip, shift)
- **Modal or Nonmodal**: Modal traps focus (default), nonmodal allows interaction with other elements
- **Custom Closing**: Prevent closing with `preventDefault()` on `gds-ui-state` event (reasons: 'show', 'close', 'cancel')
- **Backdrop Support**: Use :backdrop pseudo-element (modal) or custom GdsBackdrop element (nonmodal)
- **Autofocus**: Automatically focus first child element when opened
- **Keyboard Support**: Opens on ArrowDown when trigger focused, closes on Escape
- **Custom Sizing**: Provide callbacks for maxWidth, minWidth, maxHeight, minHeight

**Attributes:**
- `placement` — Position relative to trigger (e.g., 'bottom-start', 'top', 'right')
- `open` — Whether popover is open
- `popup-role` — ARIA role ('menu', 'listbox', 'tree', 'grid', 'dialog')
- `nonmodal` — Allow interaction with other elements
- `backdrop` — Enable backdrop (true for :backdrop, or selector for GdsBackdrop)
- `autofocus` — Focus first child on open
- `disableMobileStyles` — Disable modal dialog in mobile viewport

**Properties:**
- `floatingUIMiddleware` — Array of Floating UI middleware for custom positioning
- `calcMaxWidth`, `calcMinWidth`, `calcMaxHeight`, `calcMinHeight` — Sizing callbacks
- `triggerRef`, `anchorRef` — Programmatic trigger/anchor assignment (Promise<HTMLElement>)

**Important Notes:**
- Uses Floating UI for intelligent positioning that adapts to available space
- Default middleware: `[offset(8), shift({ crossAxis: true, padding: 8 })]`
- Modal popovers (default) trap focus; nonmodal allow interaction with other elements
- Trigger slot automatically handles click and keyboard events
- State change reasons: 'show' (clicked trigger), 'close' (clicked outside), 'cancel' (pressed Escape)
- Use `preventDefault()` on `gds-ui-state` event to prevent opening/closing
- Helper function `applyTriggerAriaAttributes` applies proper ARIA attributes
- Supports menu, listbox, tree, grid, and dialog roles for proper semantics
- Mobile behavior uses modal dialog unless `disableMobileStyles` is true

#### GdsDialog - Modal Dialogs & Slide-Outs

**📖 Complete GdsDialog documentation: [`GdsDialog.md`](./GdsDialog.md)**

```tsx
// Basic dialog with trigger
import { GdsDialog, GdsButton, GdsRichText } from '@sebgroup/green-core/react'

<GdsDialog heading="Confirm Action">
  <GdsButton slot="trigger">Open Dialog</GdsButton>
  <GdsRichText>
    <p>Are you sure you want to proceed?</p>
  </GdsRichText>
  <GdsButton slot="footer" rank="secondary">Cancel</GdsButton>
  <GdsButton slot="footer" variant="positive">Confirm</GdsButton>
</GdsDialog>

// Slide-out variant (drawer)
<GdsDialog heading="Settings" variant="slide-out">
  <GdsButton slot="trigger">Open Settings</GdsButton>
  <GdsRichText>
    <h3>User Preferences</h3>
    <p>Configure your settings here.</p>
  </GdsRichText>
  <GdsButton slot="footer">Save</GdsButton>
</GdsDialog>

// Scrollable dialog
<GdsDialog 
  heading="Terms and Conditions" 
  scrollable={true}
  height="80vh"
>
  <GdsButton slot="trigger">View Terms</GdsButton>
  <GdsRichText>
    <h3>1. Agreement</h3>
    <p>Long content...</p>
    <h3>2. Privacy</h3>
    <p>More content...</p>
  </GdsRichText>
  <GdsButton slot="footer">Accept</GdsButton>
</GdsDialog>

// Programmatic control
function MyComponent() {
  const dialogRef = useRef<any>(null)
  
  return (
    <>
      <GdsButton onClick={() => dialogRef.current?.show()}>
        Open Dialog
      </GdsButton>
      
      <GdsDialog ref={dialogRef} heading="Controlled Dialog">
        <GdsRichText>
          <p>Programmatically controlled.</p>
        </GdsRichText>
        <GdsButton 
          slot="footer" 
          onClick={() => dialogRef.current?.close()}
        >
          Close
        </GdsButton>
      </GdsDialog>
    </>
  )
}

// Event handling with close reason
<GdsDialog
  heading="Event Demo"
  onGdsClose={(e) => console.log('Closed:', e.detail.reason)}
  onGdsShow={(e) => console.log('Opened:', e.detail.reason)}
>
  <GdsButton slot="trigger">Open</GdsButton>
  <GdsRichText>
    <p>Dialog with event tracking.</p>
  </GdsRichText>
</GdsDialog>

// Prevent closing
<GdsDialog
  heading="Unsaved Changes"
  onGdsUiState={(e) => {
    if (!e.detail.open) {
      const confirmed = confirm('Discard changes?')
      if (!confirmed) e.preventDefault()
    }
  }}
>
  <GdsButton slot="trigger">Edit</GdsButton>
  <GdsRichText>
    <p>Form with unsaved changes.</p>
  </GdsRichText>
</GdsDialog>

// Custom dialog content
<GdsDialog heading="Custom Layout">
  <GdsButton slot="trigger">Open Custom</GdsButton>
  <div slot="dialog">
    <div style={{ padding: '24px' }}>
      <h2>Custom Header</h2>
      <p>Complete control over dialog layout.</p>
      <button>Custom Button</button>
    </div>
  </div>
</GdsDialog>
```

**Key Properties:**
- **heading**: `string` - Dialog heading (required for accessibility)
- **variant**: `'default' | 'slide-out'` - Dialog variant
- **placement**: `'initial' | 'top' | 'bottom' | 'left' | 'right'` - Dialog placement
- **open**: `boolean` - Control open state
- **scrollable**: `boolean` - Enable scrolling for overflowing content
- **width**, **height**, **padding**: Style expression properties for sizing

**Methods:**
- **show(reason?)**: Open dialog with optional reason
- **close(reason?)**: Close dialog with optional reason

**Events:**
- **gds-show**: Fired when dialog opens
- **gds-close**: Fired when dialog closes
- **gds-ui-state**: Fired on state change (can be cancelled with preventDefault())

**Event Reasons:**
- `btn-close` - Closed by close button
- `btn-cancel` - Closed by cancel button
- `btn-ok` - Closed by OK button
- `native-close` - Closed by Escape key
- `click-outside` - Closed by clicking outside
- `slotted-trigger` - Opened by slotted trigger
- Custom string - When calling show()/close() with parameter

**Slots:**
- **trigger**: Button to open dialog (gets `aria-haspopup="dialog"` automatically)
- **footer**: Footer content (usually action buttons)
- **dialog**: Complete override of dialog content
- (default): Main content (wrap in GdsRichText for typography)

... (full guide continues with the same content as the original top-level file)
````
