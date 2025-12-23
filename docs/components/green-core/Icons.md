````markdown
# SEB Green Core Icon Library

An icon helps communicate meaning quickly, enhances visual hierarchy, and supports navigation or interaction. Icons serve as visual shorthand that helps users quickly recognize actions, states, or categories.

## Overview

In Green, we use the Central Icon System by Iconist. These icons are designed on a 24×24 px grid with a 2 px safe area, resulting in a 20×20 px live area for optimal clarity and balance. Icons can be scaled to fit text and component sizes.

**Key Features:**
- **Two Styles**: Regular (default) and Solid (for selected states)
- **Consistent Stroke**: 1.5 px stroke width with 0% radius and round join
- **Flexible Sizing**: Token-based sizes (xs to 4xl) and custom values
- **Color System**: Inherits text color, supports all content color tokens with transparency
- **Accessible**: Optional label attribute for screen reader support
- **Design Tokens**: Integrated spacing, alignment, and grid properties

## Importing icons

All icon components are provided as named exports from `@sebgroup/green-core/react`.

```tsx
import { IconBank, IconHomeOpen, IconZap } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
// Basic icon in React
<GdsTheme>
  <IconBank />
</GdsTheme>

// Icon with size
<IconBank size="l" />

// Solid style
<IconBank solid />

// With color
<IconBank color="positive" />

// With label for accessibility
<IconBank label="Bank account" />

// Inside a button
<GdsButton>
  <IconHomeOpen slot="lead" />
  Home
</GdsButton>
```

## Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `solid` | `boolean` | `false` | When true, displays the solid version of the icon. When false or not provided, displays the regular version. |
| `stroke` | `number` | `undefined` | When set, applies custom stroke width to the icon. |
| `level` | `GdsColorLevel` | `'2'` | The level used to resolve color tokens from the corresponding level. Check Color System documentation for more information. |
| `label` | `string` | `''` | Sets the accessible label of the icon. If not provided, the icon will be presentational. |
| `gds-element` | `string` | `undefined` | The unscoped name of this element (read-only). |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | `string` | `undefined` | Sets the icon size using tokens or custom values. Shorthand for setting both width and height. Accepts: `'xs'`, `'s'`, `'m'`, `'l'`, `'xl'`, `'2xl'`, `'3xl'`, `'4xl'`, or custom values like `'48px'`, `'2lh'`. |
| `margin` | `string` | `undefined` | Style Expression Property for margin. Only accepts space tokens. |
| `margin-inline` | `string` | `undefined` | Style Expression Property for margin-inline. Only accepts space tokens. |
| `margin-block` | `string` | `undefined` | Style Expression Property for margin-block. Only accepts space tokens. |
| `align-self` | `string` | `undefined` | Style Expression Property for align-self. Supports all valid CSS values. |
| `justify-self` | `string` | `undefined` | Style Expression Property for justify-self. Supports all valid CSS values. |
| `place-self` | `string` | `undefined` | Style Expression Property for place-self. Supports all valid CSS values. |
| `grid-column` | `string` | `undefined` | Style Expression Property for grid-column. Supports all valid CSS values. |
| `grid-row` | `string` | `undefined` | Style Expression Property for grid-row. Supports all valid CSS values. |
| `grid-area` | `string` | `undefined` | Style Expression Property for grid-area. Supports all valid CSS values. |
| `flex` | `string` | `undefined` | Style Expression Property for flex. Supports all valid CSS values. |
| `order` | `string` | `undefined` | Style Expression Property for order. Supports all valid CSS values. |
| `color` | `string` | `undefined` | Style Expression Property for color. Accepts color tokens with optional transparency: `tokenName/transparency`. Example: `"neutral-01/0.2"` |
| `isDefined` | `boolean` | `false` | Whether the element is defined in the custom element registry (read-only). |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only). |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of this element (read-only). |
| `gdsElementName` | `string` | `undefined` | Unscoped element name (read-only). |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from the DOM. |

### CSS Shadow Parts

| Part | Description |
|------|-------------|
| `icon` | The icon SVG element. Can be targeted for custom styling. |

## Size Tokens

The `size` property accepts the following tokens:

| Token | Size | Description |
|-------|------|-------------|
| `xs` | 8px | Extra small |
| `s` | 12px | Small |
| `m` | 16px | Medium |
| `l` | 24px | Large (default grid size) |
| `xl` | 32px | Extra large |
| `2xl` | 40px | 2× extra large |
| `3xl` | 48px | 3× extra large |
| `4xl` | 64px | 4× extra large |

**Custom Values:** You can also use custom values like `'48px'`, `'2lh'` (2 line heights), or any valid CSS size value.

## Examples

### Basic Icon

```tsx
<GdsTheme>
  <IconBank />
</GdsTheme>
```

### Solid Style

Toggle between outline and solid icon styles using the `solid` attribute. Solid style is primarily used for selected states (e.g., active menu items).

```tsx
// Regular (default)
<IconBank />

// Solid
<IconBank solid />
```

### Size Variations

The default icon size is equal to 1lh (1 line height). Change the size using the `size` attribute.

```tsx
// Token sizes
<IconBank size="xs" />  {/* 8px */}
<IconBank size="s" />   {/* 12px */}
<IconBank size="m" />   {/* 16px */}
<IconBank size="l" />   {/* 24px */}
<IconBank size="xl" />  {/* 32px */}
<IconBank size="2xl" /> {/* 40px */}
<IconBank size="3xl" /> {/* 48px */}
<IconBank size="4xl" /> {/* 64px */}

// Custom values
<IconBank size="48px" />
<IconBank size="2lh" />
```

### Custom Stroke Width

Apply custom stroke width using the `stroke` attribute.

```tsx
<IconBank stroke={2} />
<IconBank stroke={3} />
```

### Color Tokens

Icons inherit text color by default. Override using the `color` attribute with design system tokens.

```tsx
// Basic color tokens
<IconAi color="primary" />
<IconAi color="negative-01" />
<IconAi color="positive" />
<IconAi color="notice" />

// With transparency (format: token/transparency)
<IconAi color="primary/0.2" />
<IconAi color="negative/0.5" />
<IconAi color="neutral-01/0.3" />
```

**Available Color Tokens:**
- Content colors: `primary`, `secondary`, `tertiary`
- Semantic colors: `positive`, `negative`, `notice`, `warning`, `information`
- Neutral: `neutral-01`, `neutral-02`, etc.
- Brand: `brand-01`, `brand-02`

### Accessibility with Label

Icons have `role="presentation"` when no label is provided, meaning screen readers ignore them. Add a `label` for standalone icons that convey meaning.

```tsx
// Presentational (ignored by screen readers)
<IconBank />

// With accessible label
<IconBank label="Bank account" />
<IconSearch label="Search" />
<IconSettings label="Settings" />
```

### Layout Properties

Icons support style expression properties for flexible layouts:

```tsx
// Margin spacing
<IconBank margin="m" />
<IconBank margin-inline="s" margin-block="xs" />

// Grid positioning
<IconBank grid-column="1 / 3" grid-row="1" />
<IconBank grid-area="header" />

// Flex properties
<IconBank align-self="center" />
<IconBank flex="0 0 auto" order="1" />
```

### In Components

Icons work seamlessly with Green Core components using slots:

```tsx
// Button with lead icon
<GdsButton rank="primary">
  <IconHomeOpen slot="lead" />
  Home
</GdsButton>

// Button with trail icon
<GdsButton rank="secondary">
  Next
  <IconArrowRight slot="trail" />
</GdsButton>

// Alert with icon
<GdsAlert variant="positive">
  <IconCircleCheck slot="lead" />
  Operation completed successfully
</GdsAlert>

// Card with icon header
<GdsCard>
  <GdsFlex align-items="center" gap="s">
    <IconBank size="xl" color="primary" />
    <GdsText tag="h3" font="heading-m">Account Details</GdsText>
  </GdsFlex>
  <GdsText>Account information content...</GdsText>
</GdsCard>
```

### Multiple Icons

```tsx
<GdsFlex gap="m" align-items="center">
  <IconBank size="l" color="primary" />
  <IconCreditCard size="l" color="secondary" />
  <IconWallet size="l" color="tertiary" />
</GdsFlex>
```

## Naming rules

## Naming rules

- Each icon is exported as `Icon` + PascalCased name.
- Single-word icons become `Icon<Word>` (for example: `Zap` → `IconZap`).
- Multi-word icons are converted to PascalCase and prefixed with `Icon`.
- Remove all spaces, dashes, and underscores when forming the component name.

**Important:** Icon components do NOT use a `Gds` prefix. Use the `Icon` prefix only.

**Examples:**
- ✅ `<IconTree />` (NOT `<GdsIconTree />`)
- ✅ `<IconTicket />` (NOT `<GdsIconTicket />`)
- ✅ `<IconArrowRotateCounterClockwise />` (spaces removed)
- ✅ `<IconArrowInbox />` (from "Arrow Inbox")

### Conversion Examples

| Icon Name | Component Name | Import |
|-----------|----------------|--------|
| Arrows | `IconArrows` | `import { IconArrows } from '@sebgroup/green-core/react'` |
| Arrow Inbox | `IconArrowInbox` | `import { IconArrowInbox } from '@sebgroup/green-core/react'` |
| Arrow Rotate Counter Clockwise | `IconArrowRotateCounterClockwise` | `import { IconArrowRotateCounterClockwise } from '@sebgroup/green-core/react'` |
| Bank | `IconBank` | `import { IconBank } from '@sebgroup/green-core/react'` |
| Home Open | `IconHomeOpen` | `import { IconHomeOpen } from '@sebgroup/green-core/react'` |
| Cloudy Sun | `IconCloudySun` | `import { IconCloudySun } from '@sebgroup/green-core/react'` |

## Usage Best Practices

### Visual Communication
- Use icons consistently across your interface to enhance user understanding
- Ensure icons clearly communicate their purpose
- Maintain visual hierarchy with appropriate sizing

### Style Selection
- **Regular (default)**: Use for most UI elements
- **Solid**: Use for selected states (active menu items, toggled buttons)

### Sizing Guidelines
- Match icon size to surrounding text for inline usage
- Use larger sizes (`xl`, `2xl`, `3xl`) for prominent actions or headers
- Use smaller sizes (`xs`, `s`, `m`) for compact UI elements

### Color Usage
- Icons inherit text color by default—no need to set color explicitly in most cases
- Use semantic colors (`positive`, `negative`, `notice`) to reinforce meaning
- Apply transparency for subtle or decorative icons

### Accessibility
- Add `label` attribute for standalone icons that convey meaning
- Use presentational icons (no label) when adjacent text provides context
- Ensure sufficient color contrast for visibility

### Performance
- Use named imports for tree-shaking: `import { IconBank } from '@sebgroup/green-core/react'`
- Avoid importing entire icon set unless necessary

## TypeScript Types

```tsx
// Icon props interface
interface IconProps {
  solid?: boolean
  stroke?: number
  level?: GdsColorLevel  // '1' | '2' | '3' | '4'
  label?: string
  size?: string  // Token or custom value
  margin?: string
  'margin-inline'?: string
  'margin-block'?: string
  'align-self'?: string
  'justify-self'?: string
  'place-self'?: string
  'grid-column'?: string
  'grid-row'?: string
  'grid-area'?: string
  flex?: string
  order?: string
  color?: string  // Token with optional transparency
}

// Usage example
const MyComponent = () => {
  return (
    <IconBank 
      size="xl" 
      color="primary" 
      label="Bank account"
      solid
    />
  )
}
```

## Quick usage examples

```tsx
// Single word
<IconZap />

// Two words
<IconCloudySun />

// Three words
<IconSunsetArrowDown />

// With multiple props
<IconBank 
  size="l" 
  color="positive" 
  solid 
  label="Primary account" 
/>
```

## Available icons

Below is the complete list of icons available from the Green Core icon set. Use the `Icon` prefix and PascalCase the name to form the component name.

### Arrows

- Arrows → `IconArrows`
- Arrow → `IconArrow`
- Arrow Bottom Top -> `IconArrowBottomTop`
- Arrow Box Left -> `IconArrowBoxLeft`
- Arrow Box Right -> `IconArrowBoxRight`
- Arrow Down -> `IconArrowDown`
- Arrow Inbox -> `IconArrowInbox`
- Arrow Left -> `IconArrowLeft`
- Arrow Left Right -> `IconArrowLeftRight`
- Arrow Out Of Box -> `IconArrowOutOfBox`
- Arrow Right -> `IconArrowRight`
- Arrow Right Circle -> `IconArrowRightCircle`
- Arrow Right Down Circle -> `IconArrowRightDownCircle`
- Arrow Right Up Circle -> `IconArrowRightUpCircle`
- Arrow Rotate Clockwise -> `IconArrowRotateClockwise`
- Arrow Rotate Counter Clockwise -> `IconArrowRotateCounterClockwise`
- Arrow Rotate Left Right -> `IconArrowRotateLeftRight`
- Arrow Rotate Right Left -> `IconArrowRotateRightLeft`
- Arrow Share Left -> `IconArrowShareLeft`
- Arrow Share Right -> `IconArrowShareRight`
- Arrow Split -> `IconArrowSplit`
- Arrow Up -> `IconArrowUp`
- Arrow Wall Down -> `IconArrowWallDown`
- Arrow Wall Left -> `IconArrowWallLeft`
- Arrow Wall Right -> `IconArrowWallRight`
- Arrow Wall Up -> `IconArrowWallUp`
- Chevron Bottom -> `IconChevronBottom`
- Chevron Double Down -> `IconChevronDoubleDown`
- Chevron Double Left -> `IconChevronDoubleLeft`
- Chevron Double Right -> `IconChevronDoubleRight`
- Chevron Double Up -> `IconChevronDoubleUp`
- Chevron Down Small -> `IconChevronDownSmall`
- Chevron Grabber Vertical -> `IconChevronGrabberVertical`
- Chevron Left -> `IconChevronLeft`
- Chevron Left Small -> `IconChevronLeftSmall`
- Chevron Right -> `IconChevronRight`
- Chevron Right Small -> `IconChevronRightSmall`
- Chevron Top -> `IconChevronTop`
- Chevron Top Small -> `IconChevronTopSmall`
- Cursor -> `IconCursor`
- Expand -> `IconExpand`
- History -> `IconHistory`
- Minimize -> `IconMinimize`
- Refund -> `IconRefund`
- Sort Ascending -> `IconSortAscending`
- Sort Descending -> `IconSortDescending`
- Sort Down -> `IconSortDown`
- Sort Up -> `IconSortUp`
- Square Arrow Top Right -> `IconSquareArrowTopRight`

### Brands
- Brand App Store -> `IconBrandAppStore`
- Brand Apple Music -> `IconBrandAppleMusic`
- Brand Bankid -> `IconBrandBankid`
- Brand Chrome -> `IconBrandChrome`
- Brand Facebook -> `IconBrandFacebook`
- Brand Figma -> `IconBrandFigma`
- Brand Firefox -> `IconBrandFirefox`
- Brand Github -> `IconBrandGithub`
- Brand Green -> `IconBrandGreen`
- Brand Instagram -> `IconBrandInstagram`
- Brand Linkedin -> `IconBrandLinkedin`
- Brand Play Store -> `IconBrandPlayStore`
- Brand Rss Feed -> `IconBrandRssFeed`
- Brand Seb -> `IconBrandSeb`
- Brand Spotify -> `IconBrandSpotify`
- Brand Storybook -> `IconBrandStorybook`
- Brand X -> `IconBrandX`
- Safari -> `IconSafari`
- Youtube -> `IconYoutube`

### Buildings & places
- Buildings -> `IconBuildings`
- Bank -> `IconBank`
- Block -> `IconBlock`
- Home Energy One -> `IconHomeEnergyOne`
- Home Energy Two -> `IconHomeEnergyTwo`
- Home Open -> `IconHomeOpen`
- Home Roof -> `IconHomeRoof`
- Industry -> `IconIndustry`
- Office -> `IconOffice`
- Store -> `IconStore`

### Code & developer
- Code -> `IconCode`
- Code Brackets -> `IconCodeBrackets`
- Run Shortcut -> `IconRunShortcut`

### Communication & social
- At -> `IconAt`
- Book -> `IconBook`
- Bookmark Delete -> `IconBookmarkDelete`
- Bookmark Plus -> `IconBookmarkPlus`
- Books -> `IconBooks`
- Bubble Annotation -> `IconBubbleAnnotation`
- Bubbles -> `IconBubbles`
- Chain Link -> `IconChainLink`
- Chain Link Broken -> `IconChainLinkBroken`
- Email -> `IconEmail`
- Inbox Empty -> `IconInboxEmpty`
- Paper Plane Top Right -> `IconPaperPlaneTopRight`
- Share -> `IconShare`
- Thumbs Down -> `IconThumbsDown`
- Thumbs Up -> `IconThumbsUp`

### Date & time
- Date -> `IconDate`
- Calendar -> `IconCalendar`
- Calendar Check -> `IconCalendarCheck`
- Calender Add -> `IconCalenderAdd`
- Clock -> `IconClock`
- Compass Round -> `IconCompassRound`
- Hourglass -> `IconHourglass`
- Map Pin -> `IconMapPin`

### Devices & hardware
- Ai -> `IconAi`
- Barcode -> `IconBarcode`
- Call -> `IconCall`
- Focus -> `IconFocus`
- Lab -> `IconLab`
- Macbook Air -> `IconMacbookAir`
- Phone -> `IconPhone`
- Printer -> `IconPrinter`
- Qr Code -> `IconQrCode`
- Robot -> `IconRobot`
- Smartwatch -> `IconSmartwatch`
- Television -> `IconTelevision`
- Wifi Full -> `IconWifiFull`

### Finance & commerce
- Bag -> `IconBag`
- Banknote -> `IconBanknote`
- Banknote 2 -> `IconBanknote2`
- Calculator -> `IconCalculator`
- Chart Two -> `IconChartTwo`
- Circles Three -> `IconCirclesThree`
- Credit Card -> `IconCreditCard`
- Dollar -> `IconDollar`
- Euro -> `IconEuro`
- Law -> `IconLaw`
- Line Chart Four -> `IconLineChartFour`
- Line Chart One -> `IconLineChartOne`
- Line Chart Three -> `IconLineChartThree`
- Line Chart Two -> `IconLineChartTwo`
- Money Hand -> `IconMoneyHand`
- Moneybag -> `IconMoneybag`
- Pension -> `IconPension`
- Pie Chart -> `IconPieChart`
- Piggy Bank -> `IconPiggyBank`
- Pound -> `IconPound`
- Shopping Bag -> `IconShoppingBag`
- Trading View Candles -> `IconTradingViewCandles`
- Trending Four -> `IconTrendingFour`
- Trending One -> `IconTrendingOne`
- Trending Three -> `IconTrendingThree`
- Trending Two -> `IconTrendingTwo`
- Wallet -> `IconWallet`

### General UI & controls
- Bars Three -> `IconBarsThree`
- Bars Two -> `IconBarsTwo`
- Bell -> `IconBell`
- Bullet List -> `IconBulletList`
- Carussel -> `IconCarussel`
- Checkmark -> `IconCheckmark`
- Circle Ban -> `IconCircleBan`
- Circle Check -> `IconCircleCheck`
- Circle Dots -> `IconCircleDots`
- Circle Info -> `IconCircleInfo`
- Circle Minus -> `IconCircleMinus`
- Circle Placeholder On -> `IconCirclePlaceholderOn`
- Circle Plus -> `IconCirclePlus`
- Circle Questionmark -> `IconCircleQuestionmark`
- Circle X -> `IconCircleX`
- Copy -> `IconCopy`
- Cross Large -> `IconCrossLarge`
- Cross Small -> `IconCrossSmall`
- Dot Grid One Horizontal -> `IconDotGridOneHorizontal`
- Dot Grid One Vertical -> `IconDotGridOneVertical`
- Dot Grid Three -> `IconDotGridThree`
- Dot Grid Two -> `IconDotGridTwo`
- Eye Open -> `IconEyeOpen`
- Eye Slash -> `IconEyeSlash`
- Flag -> `IconFlag`
- Globus -> `IconGlobus`
- Heart -> `IconHeart`
- Lock -> `IconLock`
- Magnifying Glass -> `IconMagnifyingGlass`
- Menu Sidebar -> `IconMenuSidebar`
- Minus Large -> `IconMinusLarge`
- Minus Small -> `IconMinusSmall`
- Percent -> `IconPercent`
- Plus Large -> `IconPlusLarge`
- Plus Small -> `IconPlusSmall`
- Search Menu -> `IconSearchMenu`
- Settings Gear -> `IconSettingsGear`
- Settings Slider Hor -> `IconSettingsSliderHor`
- Shield -> `IconShield`
- Shield Checked -> `IconShieldChecked`
- Shield Crossed -> `IconShieldCrossed`
- Sort -> `IconSort`
- Square Grid Circle -> `IconSquareGridCircle`
- Star -> `IconStar`
- Tag -> `IconTag`
- Trash Can -> `IconTrashCan`
- Triangle Exclamation -> `IconTriangleExclamation`
- Unlocked -> `IconUnlocked`
- Zoom In -> `IconZoomIn`
- Zoom Out -> `IconZoomOut`

### Media controls
- Back -> `IconBack`
- Fast Forward -> `IconFastForward`
- Fullscreen -> `IconFullscreen`
- Headphones -> `IconHeadphones`
- Megaphone -> `IconMegaphone`
- Mic Off -> `IconMicOff`
- Mic On -> `IconMicOn`
- Mute -> `IconMute`
- Pause -> `IconPause`
- Play -> `IconPlay`
- Play Circle -> `IconPlayCircle`
- Record -> `IconRecord`
- Volume Full -> `IconVolumeFull`
- Volume Half -> `IconVolumeHalf`
- Volume Off -> `IconVolumeOff`

### People & groups
- Emoji Angry -> `IconEmojiAngry`
- Emoji Neutral -> `IconEmojiNeutral`
- Emoji Sad -> `IconEmojiSad`
- Emoji Smile -> `IconEmojiSmile`
- Emoji Smiley -> `IconEmojiSmiley`
- Group -> `IconGroup`
- Leisure -> `IconLeisure`
- People -> `IconPeople`
- People A11y -> `IconPeopleA11y`
- People Add -> `IconPeopleAdd`
- People Added -> `IconPeopleAdded`
- People Circle -> `IconPeopleCircle`
- People Copy -> `IconPeopleCopy`
- People Profile -> `IconPeopleProfile`
- People Remove -> `IconPeopleRemove`

### Things & objects
- Airplane Up -> `IconAirplaneUp`
- Basket -> `IconBasket`
- Battery Loading -> `IconBatteryLoading`
- Brush -> `IconBrush`
- Car -> `IconCar`
- Checklist -> `IconChecklist`
- Cookies -> `IconCookies`
- Cup Hot -> `IconCupHot`
- Direction -> `IconDirection`
- Fashion -> `IconFashion`
- File Bend -> `IconFileBend`
- File Chart -> `IconFileChart`
- File Text -> `IconFileText`
- Files -> `IconFiles`
- Gift -> `IconGift`
- Graduate Cap -> `IconGraduateCap`
- Green Power -> `IconGreenPower`
- Growth -> `IconGrowth`
- Heart Beat -> `IconHeartBeat`
- Images -> `IconImages`
- Jpg -> `IconJpg`
- Key -> `IconKey`
- Knife Spoon -> `IconKnifeSpoon`
- Light Bulb Simple -> `IconLightBulbSimple`
- Page Add -> `IconPageAdd`
- Paperclip -> `IconPaperclip`
- Pdf -> `IconPdf`
- Pinch -> `IconPinch`
- Png -> `IconPng`
- Poop -> `IconPoop`
- Postcard -> `IconPostcard`
- Raising Hand -> `IconRaisingHand`
- Reading List -> `IconReadingList`
- Receipt Bill -> `IconReceiptBill`
- Receiption Bell -> `IconReceiptionBell`
- Rocket -> `IconRocket`
- Shapes -> `IconShapes`
- Solar -> `IconSolar`
- Square Placeholder -> `IconSquarePlaceholder`
- Target Arrow -> `IconTargetArrow`
- Tennis -> `IconTennis`
- Ticket -> `IconTicket`
- Tree -> `IconTree`
- Truck -> `IconTruck`
- Warning Sign -> `IconWarningSign`

### Utilities & files
- Archive -> `IconArchive`
- Backward -> `IconBackward`
- Bookmark -> `IconBookmark`
- Bookmark Check -> `IconBookmarkCheck`
- Bookmark Remove -> `IconBookmarkRemove`
- Cloud Download -> `IconCloudDownload`
- Cloud Upload -> `IconCloudUpload`
- Floppy Disk -> `IconFloppyDisk`
- Folder -> `IconFolder`
- Folder Add Right -> `IconFolderAddRight`
- Pencil Sign -> `IconPencilSign`
- Pencil Sparkle -> `IconPencilSparkle`
- Pin -> `IconPin`
- Scissors -> `IconScissors`
- Signature -> `IconSignature`
- Text Edit -> `IconTextEdit`

### Weather & environment
- Cloudy Sun -> `IconCloudySun`
- Lightning -> `IconLightning`
- Moon -> `IconMoon`
- Rainy -> `IconRainy`
- Sun -> `IconSun`
- Sunset Arrow Down -> `IconSunsetArrowDown`
- Thermostat -> `IconThermostat`
- Umbrella Security -> `IconUmbrellaSecurity`
- Zap -> `IconZap`

## Related Components

- [GdsButton](./GdsButton.md) — Buttons with icon slots
- [GdsMenuButton](./GdsMenuButton.md) — Menu buttons with lead/trail icon slots
- [GdsInput](./GdsInput.md) — Text inputs with lead icon slots
- [GdsSelect](./GdsSelect.md) — Select dropdown with lead icon slot
- [GdsLink](./GdsLink.md) — Links with lead/trail icon slots
- [GdsAlert](./GdsAlert.md) — Alerts with icon indicators
- [GdsBadge](./GdsBadge.md) — Badges with icon support
- [GdsFlex](./GdsFlex.md) — Layout for icon arrangements
- [GdsText](./GdsText.md) — Typography with inline icons
- [GdsCard](./GdsCard.md) — Cards with icon headers
- [GdsMenuItem](./GdsMenuItem.md) — Menu items with icons
- [GdsSegment](./GdsSegment.md) — Segments with icons
- [GdsGroupedList](./GdsGroupedList.md) — Lists with icons

## Accessibility Guidelines

### When to Add Labels
- **Add `label`**: For standalone icons that convey meaning or trigger actions
- **Omit `label`**: When adjacent text provides context

**Examples:**

```tsx
// Standalone icon button - needs label
<GdsButton rank="tertiary">
  <IconSearch label="Search" />
</GdsButton>

// Icon with text - no label needed (presentational)
<GdsButton rank="primary">
  <IconHomeOpen slot="lead" />
  Home
</GdsButton>

// Decorative icon - no label
<GdsFlex gap="s">
  <IconBank />
  <GdsText>Account Details</GdsText>
</GdsFlex>
```

### Color Contrast
- Ensure icons meet WCAG AA contrast requirements (4.5:1 for small icons, 3:1 for large)
- Test icon visibility against background colors
- Use `color` attribute to adjust contrast when needed

### Interactive Icons
- Icons in buttons/links should have clear focus states (handled by parent component)
- Ensure touch/click targets are at least 44×44 px for mobile
- Provide text alternatives for icon-only actions

## Design System Integration

### Central Icon System
Green uses the Central Icon System by Iconist, providing:
- **24×24 px grid** with 2 px safe area
- **20×20 px live area** for optimal clarity
- **1.5 px stroke width** for consistency
- **0% radius** with round join for modern appearance

### Token Integration
Icons integrate with Green's design token system:
- **Size tokens**: `xs` to `4xl`
- **Color tokens**: All content and semantic colors
- **Space tokens**: Margin properties
- **Grid tokens**: Layout positioning

## Common Patterns

### Icon Button

```tsx
<GdsButton rank="tertiary">
  <IconSettings slot="lead" label="Settings" />
</GdsButton>
```

### Icon with Text

```tsx
<GdsFlex gap="xs" align-items="center">
  <IconCircleCheck size="m" color="positive" />
  <GdsText>Operation successful</GdsText>
</GdsFlex>
```

### Icon in Card Header

```tsx
<GdsCard>
  <GdsFlex gap="s" align-items="center">
    <IconBank size="xl" color="primary" />
    <GdsText tag="h3" font="heading-m">Bank Account</GdsText>
  </GdsFlex>
  <GdsText>Account content...</GdsText>
</GdsCard>
```

### Icon List

```tsx
<GdsFlex flex-direction="column" gap="s">
  <GdsFlex gap="xs" align-items="center">
    <IconCircleCheck size="s" color="positive" />
    <GdsText>Feature enabled</GdsText>
  </GdsFlex>
  <GdsFlex gap="xs" align-items="center">
    <IconCircleX size="s" color="negative" />
    <GdsText>Feature disabled</GdsText>
  </GdsFlex>
</GdsFlex>
```

### Status Indicators

```tsx
<GdsFlex gap="m">
  <IconCircleCheck color="positive" label="Completed" />
  <IconCircleX color="negative" label="Failed" />
  <IconCircleInfo color="information" label="Pending" />
</GdsFlex>
```

## Notes and best practices

- Prefer named imports from `@sebgroup/green-core/react` so bundlers can tree-shake unused icons.
- Use the `Icon` components as plain React components; avoid accessing internal SVG markup unless necessary.
- When using icons inside Green Core components (buttons, badges, etc.), pass the icon in the appropriate slot (for example `<IconHomeOpen slot="lead"/>`).
- If you need an alias for a repeated icon in a specific context, prefer creating a tiny wrapper component in `src/components/icons/` that re-exports the icon with a semantic name.
- **IMPORTANT**: Icon components use the `Icon` prefix (for example `IconTree`, `IconTicket`). Do NOT prefix icon component names with `Gds` (e.g., `GdsIconTree` is incorrect).
- Default size equals 1 line height (1lh) for seamless text integration
- Icons support Shadow DOM styling via the `icon` CSS part
- For custom styling needs, target `::part(icon)` in your styles


## Examples

Button with icon:

import { IconMenuSidebar } from '@sebgroup/green-core/react'

<GdsButton rank="tertiary">
  <IconMenuSidebar slot="lead" />
  Menu
</GdsButton>

Inline icon with text:

import { IconZap } from '@sebgroup/green-core/react'

<span>
  <IconZap /> Fast action
</span>


---

*Last updated: November 12, 2025*
*Green Core version: 2.12.0+*
*Documentation source: [Storybook Icon Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-icon--docs)*

````
