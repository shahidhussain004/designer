# GdsVideo

Video component for embedding and displaying video content with responsive aspect ratios and object-fit control.

## Import

```tsx
import { GdsVideo } from '@sebgroup/green-core/react'
```

**Important:** In React, always use `<GdsVideo>` (PascalCase), NOT `<gds-video>` (lowercase web component tag). Similarly, use `<GdsTheme>` instead of `<gds-theme>`.

## Basic Usage

```tsx
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsVideo />
</GdsTheme>
```

## Complete Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | `string` | `undefined` | URL of the video file |
| `autoplay` | `boolean` | `undefined` | Whether the video should start playing automatically |
| `muted` | `boolean` | `undefined` | Whether the video should be muted |
| `playsinline` | `boolean` | `undefined` | Whether the video should play inline on mobile devices |
| `loop` | `boolean` | `undefined` | Whether the video should loop continuously |
| `poster` | `string` | `undefined` | URL of an image to show before the video plays |
| `gds-element` | `string` | `undefined` | Read-only. The unscoped name of this element. Set automatically. |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `aspect-ratio` | `string` | `undefined` | Controls the aspect ratio of the video. Supports all common aspect ratios like 16/9, 4/3, 1/1, etc. Supports responsive syntax. |
| `object-position` | `string` | `undefined` | Controls the object-position of the video. Supports all valid CSS values. |
| `object-fit` | `string` | `undefined` | Controls the object-fit property of the video. Values: 'cover', 'contain', 'fill', 'none', 'scale-down'. |
| `pointer-events` | `string` | `undefined` | Controls the pointer-events property of the video. Supports all valid CSS pointer-events values. |
| `videoElement` | `HTMLVideoElement` | - | Reference to the underlying video element |
| `isDefined` | `boolean` | `false` | Read-only. Whether the element is defined in the custom element registry |
| `styleExpressionBaseSelector` | `string` | `':host'` | Read-only. Base selector for style expression properties |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Read-only. The semantic version of this element for troubleshooting |
| `gdsElementName` | `string` | `undefined` | Read-only. The unscoped name of this element |

### Style Expression Properties

All properties support responsive syntax and space tokens where applicable.

| Property | Description |
|----------|-------------|
| `inset` | Controls the inset CSS property. Supports all valid CSS inset values. |
| `position` | Controls the position CSS property. Supports all valid CSS position values. |
| `opacity` | Controls the opacity property of the video. Example: `opacity="0.2"` for transparent effect. |
| `border-radius` | Controls the border-radius property. Supports all size tokens from the design system. |
| `width` | Controls the width CSS property. Supports space tokens and all valid CSS width values. |
| `min-width` | Controls the min-width CSS property. Supports space tokens and all valid CSS min-width values. |
| `max-width` | Controls the max-width CSS property. Supports space tokens and all valid CSS max-width values. |
| `inline-size` | Controls the inline-size CSS property. Supports space tokens and all valid CSS inline-size values. |
| `min-inline-size` | Controls the min-inline-size CSS property. Supports space tokens and all valid CSS min-inline-size values. |
| `max-inline-size` | Controls the max-inline-size CSS property. Supports space tokens and all valid CSS max-inline-size values. |
| `height` | Controls the height CSS property. Supports space tokens and all valid CSS height values. |
| `min-height` | Controls the min-height CSS property. Supports space tokens and all valid CSS min-height values. |
| `max-height` | Controls the max-height CSS property. Supports space tokens and all valid CSS max-height values. |
| `block-size` | Controls the block-size CSS property. Supports space tokens and all valid CSS block-size values. |
| `min-block-size` | Controls the min-block-size CSS property. Supports space tokens and all valid CSS min-block-size values. |
| `max-block-size` | Controls the max-block-size CSS property. Supports space tokens and all valid CSS max-block-size values. |
| `margin` | Controls the margin CSS property. Only accepts space tokens. |
| `margin-inline` | Controls the margin-inline CSS property. Only accepts space tokens. |
| `margin-block` | Controls the margin-block CSS property. Only accepts space tokens. |
| `align-self` | Controls the align-self CSS property. Supports all valid CSS align-self values. |
| `justify-self` | Controls the justify-self CSS property. Supports all valid CSS justify-self values. |
| `place-self` | Controls the place-self CSS property. Supports all valid CSS place-self values. |
| `grid-column` | Controls the grid-column CSS property. Supports all valid CSS grid-column values. |
| `grid-row` | Controls the grid-row CSS property. Supports all valid CSS grid-row values. |
| `grid-area` | Controls the grid-area CSS property. Supports all valid CSS grid-area values. |
| `flex` | Controls the flex CSS property. Supports all valid CSS flex values. |
| `order` | Controls the order CSS property. Supports all valid CSS order values. |
| `transform` | Controls the transform CSS property. Supports all valid CSS transform values. |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fires when the element is disconnected from the DOM |

## Examples

### 1. Basic Video

```tsx
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

function BasicVideo() {
  return (
    <GdsTheme>
      <GdsVideo 
        src="https://api.seb.io/components/video/video.mp4"
      />
    </GdsTheme>
  )
}
```

### 2. Autoplay Video with Mute

```tsx
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

function AutoplayVideo() {
  return (
    <GdsTheme>
      <GdsVideo 
        src="https://api.seb.io/components/video/video.mp4"
        autoplay
        muted
        loop
        playsinline
      />
    </GdsTheme>
  )
}
```

### 3. Video with Aspect Ratio

```tsx
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

function AspectRatioVideo() {
  return (
    <GdsTheme>
      <GdsVideo 
        src="https://api.seb.io/components/video/video.mp4"
        aspect-ratio="16/9"
        object-fit="cover"
      />
    </GdsTheme>
  )
}
```

### 4. Responsive Aspect Ratio

```tsx
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

function ResponsiveVideo() {
  return (
    <GdsTheme>
      <GdsVideo 
        src="https://api.seb.io/components/video/video.mp4"
        aspect-ratio="l{16/9} m{4/3} s{1/1}"
        object-fit="cover"
      />
    </GdsTheme>
  )
}
```

### 5. Video with Poster Image

```tsx
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

function VideoWithPoster() {
  return (
    <GdsTheme>
      <GdsVideo 
        src="https://api.seb.io/components/video/video.mp4"
        poster="https://example.com/poster.jpg"
        aspect-ratio="16/9"
      />
    </GdsTheme>
  )
}
```

### 6. Video with Border Radius

```tsx
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

function RoundedVideo() {
  return (
    <GdsTheme>
      <GdsVideo 
        src="https://api.seb.io/components/video/video.mp4"
        border-radius="s"
        aspect-ratio="16/9"
        autoplay
        muted
        loop
      />
    </GdsTheme>
  )
}
```

### 7. Video in Card

```tsx
import { GdsVideo, GdsCard, GdsTheme, GdsText } from '@sebgroup/green-core/react'

function VideoCard() {
  return (
    <GdsTheme>
      <GdsCard>
        <GdsVideo 
          src="https://api.seb.io/components/video/video.mp4"
          aspect-ratio="16/9"
          poster="https://example.com/poster.jpg"
          margin-block="0"
        />
        <GdsText tag="h3" margin-block="m">
          Video Title
        </GdsText>
        <GdsText>
          Video description goes here with additional details about the content.
        </GdsText>
      </GdsCard>
    </GdsTheme>
  )
}
```

### 8. Video with Opacity Overlay

```tsx
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

function VideoWithOverlay() {
  return (
    <GdsTheme>
      <div style={{ position: 'relative' }}>
        <GdsVideo 
          src="https://api.seb.io/components/video/video.mp4"
          aspect-ratio="16/9"
          opacity="0.3"
          autoplay
          muted
          loop
        />
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2>Content Over Video</h2>
        </div>
      </div>
    </GdsTheme>
  )
}
```

### 9. Video Grid Layout

```tsx
import { GdsVideo, GdsGrid, GdsTheme } from '@sebgroup/green-core/react'

function VideoGrid() {
  return (
    <GdsTheme>
      <GdsGrid columns="3" gap="m">
        <GdsVideo 
          src="https://api.seb.io/components/video/video1.mp4"
          aspect-ratio="16/9"
          object-fit="cover"
        />
        <GdsVideo 
          src="https://api.seb.io/components/video/video2.mp4"
          aspect-ratio="16/9"
          object-fit="cover"
        />
        <GdsVideo 
          src="https://api.seb.io/components/video/video3.mp4"
          aspect-ratio="16/9"
          object-fit="cover"
        />
      </GdsGrid>
    </GdsTheme>
  )
}
```

### 10. Hero Video Background

```tsx
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

function HeroVideo() {
  return (
    <GdsTheme>
      <div style={{ position: 'relative', height: '80vh', overflow: 'hidden' }}>
        <GdsVideo 
          src="https://api.seb.io/components/video/hero.mp4"
          autoplay
          muted
          loop
          playsinline
          object-fit="cover"
          width="100%"
          height="100%"
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center'
        }}>
          <div>
            <h1>Welcome to SEB</h1>
            <p>Banking for a sustainable future</p>
          </div>
        </div>
      </div>
    </GdsTheme>
  )
}
```

## TypeScript

```tsx
import { GdsVideo } from '@sebgroup/green-core/react'

interface GdsVideoProps {
  // Attributes
  src?: string
  autoplay?: boolean
  muted?: boolean
  playsinline?: boolean
  loop?: boolean
  poster?: string
  'gds-element'?: string
  
  // Properties
  'aspect-ratio'?: string
  'object-position'?: string
  'object-fit'?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  'pointer-events'?: string
  
  // Style Expression Properties - Position & Layout
  inset?: string
  position?: string
  opacity?: string
  'border-radius'?: string
  
  // Style Expression Properties - Width
  width?: string
  'min-width'?: string
  'max-width'?: string
  'inline-size'?: string
  'min-inline-size'?: string
  'max-inline-size'?: string
  
  // Style Expression Properties - Height
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
  
  // Style Expression Properties - Grid/Flex
  'align-self'?: string
  'justify-self'?: string
  'place-self'?: string
  'grid-column'?: string
  'grid-row'?: string
  'grid-area'?: string
  flex?: string
  order?: string
  transform?: string
  
  // Events
  onGdsElementDisconnected?: (event: CustomEvent) => void
  
  children?: React.ReactNode
}

// Usage
function TypedVideo() {
  const videoProps: Partial<GdsVideoProps> = {
    src: 'https://api.seb.io/components/video/video.mp4',
    'aspect-ratio': '16/9',
    'object-fit': 'cover',
    autoplay: true,
    muted: true,
    loop: true,
    'border-radius': 's'
  }
  
  return <GdsVideo {...videoProps} />
}
```

## Best Practices

### Aspect Ratios

✅ **Good - Standard aspect ratios:**
```tsx
// Common video aspect ratios
<GdsVideo aspect-ratio="16/9" />  // Widescreen
<GdsVideo aspect-ratio="4/3" />   // Standard
<GdsVideo aspect-ratio="1/1" />   // Square
<GdsVideo aspect-ratio="21/9" />  // Ultra-wide
```

❌ **Bad - Non-standard ratios:**
```tsx
// Unusual ratios that may look distorted
<GdsVideo aspect-ratio="7/5" />
<GdsVideo aspect-ratio="13/8" />
```

### Object Fit

✅ **Good - Appropriate object-fit:**
```tsx
// Cover for hero videos (fills space)
<GdsVideo object-fit="cover" aspect-ratio="16/9" />

// Contain for full video visibility
<GdsVideo object-fit="contain" aspect-ratio="16/9" />
```

❌ **Bad - Distorted videos:**
```tsx
// Fill can distort the video
<GdsVideo object-fit="fill" aspect-ratio="16/9" />
```

### Autoplay Best Practices

✅ **Good - Autoplay with mute:**
```tsx
// Always mute autoplaying videos
<GdsVideo 
  src="video.mp4"
  autoplay
  muted
  loop
  playsinline
/>
```

❌ **Bad - Autoplay with sound:**
```tsx
// Never autoplay with sound (annoying UX)
<GdsVideo 
  src="video.mp4"
  autoplay
  loop
/>
```

### Accessibility

✅ **Good - Provide alternatives:**
```tsx
// Provide poster image as fallback
<GdsVideo 
  src="video.mp4"
  poster="poster.jpg"
  aspect-ratio="16/9"
/>

// Consider providing captions/subtitles via track elements
```

❌ **Bad - No fallback:**
```tsx
// No poster or alternative content
<GdsVideo src="video.mp4" />
```

### Performance

✅ **Good - Optimize video loading:**
```tsx
// Use poster for faster initial load
<GdsVideo 
  src="video.mp4"
  poster="poster.jpg"
  aspect-ratio="16/9"
/>

// Don't autoplay on mobile to save bandwidth
<GdsVideo 
  src="video.mp4"
  autoplay={!isMobile}
  muted
/>
```

❌ **Bad - Large unoptimized videos:**
```tsx
// Huge video file that slows down page
<GdsVideo src="uncompressed-4k-video.mp4" autoplay />
```

## Common Use Cases

### 1. Hero Background Video

```tsx
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

function HeroSection() {
  return (
    <GdsTheme>
      <section style={{ position: 'relative', height: '100vh' }}>
        <GdsVideo 
          src="https://api.seb.io/components/video/hero-background.mp4"
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          zIndex: 1
        }}>
          <h1>Banking Made Simple</h1>
          <p>Discover innovative financial solutions</p>
        </div>
      </section>
    </GdsTheme>
  )
}
```

### 2. Video Gallery

```tsx
import { useState } from 'react'
import { GdsVideo, GdsCard, GdsGrid, GdsTheme, GdsText } from '@sebgroup/green-core/react'

function VideoGallery() {
  const videos = [
    { id: 1, src: 'video1.mp4', title: 'Introduction', poster: 'poster1.jpg' },
    { id: 2, src: 'video2.mp4', title: 'Tutorial', poster: 'poster2.jpg' },
    { id: 3, src: 'video3.mp4', title: 'Advanced Tips', poster: 'poster3.jpg' }
  ]
  
  return (
    <GdsTheme>
      <GdsGrid columns="3" gap="m">
        {videos.map(video => (
          <GdsCard key={video.id}>
            <GdsVideo 
              src={video.src}
              poster={video.poster}
              aspect-ratio="16/9"
              border-radius="s"
            />
            <GdsText tag="h3" margin-block="m">
              {video.title}
            </GdsText>
          </GdsCard>
        ))}
      </GdsGrid>
    </GdsTheme>
  )
}
```

### 3. Product Showcase Video

```tsx
import { GdsVideo, GdsCard, GdsTheme, GdsText, GdsButton } from '@sebgroup/green-core/react'

function ProductShowcase() {
  return (
    <GdsTheme>
      <GdsCard>
        <GdsVideo 
          src="https://api.seb.io/components/video/product-demo.mp4"
          poster="https://api.seb.io/components/video/product-poster.jpg"
          aspect-ratio="16/9"
          border-radius="s"
        />
        <div style={{ padding: '1rem' }}>
          <GdsText tag="h2" margin-block="m">
            Mobile Banking App
          </GdsText>
          <GdsText margin-block="m">
            Experience seamless banking on the go with our award-winning mobile app.
            Manage your accounts, make payments, and track your spending all in one place.
          </GdsText>
          <GdsButton rank="primary">
            Download Now
          </GdsButton>
        </div>
      </GdsCard>
    </GdsTheme>
  )
}
```

### 4. Testimonial Video

```tsx
import { GdsVideo, GdsCard, GdsTheme, GdsText, GdsFlex } from '@sebgroup/green-core/react'

function TestimonialVideo() {
  return (
    <GdsTheme>
      <GdsCard>
        <GdsFlex direction="column" gap="m">
          <GdsVideo 
            src="https://api.seb.io/components/video/testimonial.mp4"
            poster="https://api.seb.io/components/video/customer.jpg"
            aspect-ratio="16/9"
            border-radius="s"
          />
          <GdsText tag="blockquote" margin-block="m">
            "SEB has transformed how I manage my business finances. 
            The tools are intuitive and powerful."
          </GdsText>
          <GdsText tag="cite">
            — Anna Svensson, CEO of TechStart AB
          </GdsText>
        </GdsFlex>
      </GdsCard>
    </GdsTheme>
  )
}
```

### 5. Looping Ambient Video

```tsx
import { GdsVideo, GdsTheme } from '@sebgroup/green-core/react'

function AmbientVideo() {
  return (
    <GdsTheme>
      <div style={{ 
        position: 'relative', 
        height: '400px',
        overflow: 'hidden',
        borderRadius: '8px'
      }}>
        <GdsVideo 
          src="https://api.seb.io/components/video/ambient.mp4"
          autoplay
          muted
          loop
          playsinline
          object-fit="cover"
          width="100%"
          height="100%"
          pointer-events="none"
        />
      </div>
    </GdsTheme>
  )
}
```

## Related Components

- [GdsImg](./GdsImg.md) — For static images with responsive loading
- [GdsCard](./GdsCard.md) — For containing video content
- [GdsMask](./GdsMask.md) — For gradient overlays over video content
- [GdsGrid](./GdsGrid.md) — For video gallery layouts
- [GdsFlex](./GdsFlex.md) — For flexible video layouts
- [GdsButton](./GdsButton.md) — For video play/pause controls

## Accessibility

- **Poster Images**: Always provide a `poster` attribute with a representative image for the video
- **Captions**: Consider providing captions or subtitles for accessibility
- **Autoplay**: If using autoplay, always include `muted` to avoid disrupting users
- **Keyboard Controls**: Native video controls are keyboard accessible
- **Screen Readers**: Provide descriptive content around videos for context
- **Motion Sensitivity**: Consider users with motion sensitivity when using autoplay loops

## Notes

- **Autoplay Restrictions**: Browsers restrict autoplay with sound. Always use `muted` with `autoplay`
- **Mobile Playback**: Use `playsinline` to prevent fullscreen on iOS devices
- **Aspect Ratios**: Supports responsive aspect ratios with syntax like `l{16/9} m{4/3} s{1/1}`
- **Object Fit**: Use `cover` for hero backgrounds, `contain` when full video must be visible
- **Performance**: Always provide a `poster` image for faster perceived load times
- **File Formats**: Use modern formats (MP4 with H.264) for broad browser support
- **Video Optimization**: Compress and optimize videos before deploying to reduce bandwidth
- **Style Expression Properties**: Extends all size, spacing, and layout properties for flexible layouts
- **Border Radius**: Supports design system tokens (xs, s, m, l, xl) for consistent styling
- **Opacity**: Useful for creating transparent video overlays with text content above
- **Pointer Events**: Can disable pointer events for decorative background videos
- **Loop**: Use `loop` for ambient background videos and continuous playback scenarios
- **React Compatibility**: Use PascalCase component name (`<GdsVideo>`) in React applications

---

*For related image components, see [GdsImg documentation](./GdsImg.md).*
