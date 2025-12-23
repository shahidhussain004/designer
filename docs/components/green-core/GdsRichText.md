# GdsRichText

A component for wrapping generic HTML content and applying design system typography styles. It captures and transfers wrapped content to its inner shadowRoot, making it ideal for CMS output or any HTML content that needs consistent typography styling.

## Import

```typescript
import { GdsRichText } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
import { GdsRichText, GdsTheme, GdsCard } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsCard>
    <GdsRichText>
      <h1>Main Heading</h1>
      <p>
        This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.
      </p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
      </ul>
    </GdsRichText>
  </GdsCard>
</GdsTheme>
```

## Public API

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `captureMode` | `'clone' \| 'move'` | `'clone'` | Capture mode for the content. **clone** (default): Clones the content to the shadowRoot. This is the default and most compatible behaviour, since it leaves the original DOM untouched. The downside is that events added through addEventListener will not be retained in the cloned DOM. **move**: Moves the content to the inner shadowRoot. This mode moves the full original sub-tree into the shadowRoot, leaving everything, including event listeners, intact. This mode is less compatible with some libraries that rely on the original DOM structure, for example React. |
| `gds-element` | `string` | `undefined` | The unscoped element name (read-only, set automatically) |

### Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `innerHTML` | `string` | — | Forwards innerHTML from the inner shadowRoot |
| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry (read-only) |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only) |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of this element (read-only) |
| `gdsElementName` | `string` | `undefined` | Unscoped name of this element (read-only) |

### Style Expression Properties

GdsRichText extends GdsDiv and supports all style expression properties for layout:

| Property | Description |
|----------|-------------|
| `align-self` | Controls the align-self property. Supports all valid CSS align-self values |
| `justify-self` | Controls the justify-self property. Supports all valid CSS justify-self values |
| `place-self` | Controls the place-self property. Supports all valid CSS place-self values |
| `grid-column` | Controls the grid-column property. Supports all valid CSS grid-column values |
| `grid-row` | Controls the grid-row property. Supports all valid CSS grid-row values |
| `grid-area` | Controls the grid-area property. Supports all valid CSS grid-area values |
| `flex` | Controls the flex property. Supports all valid CSS flex values |
| `order` | Controls the order property. Supports all valid CSS order values |
| `margin` | Controls the margin property. Only accepts space tokens |
| `margin-inline` | Controls the margin-inline property. Only accepts space tokens |
| `margin-block` | Controls the margin-block property. Only accepts space tokens |

### Events

| Name | Type | Description |
|------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from DOM |

## Supported HTML Elements

GdsRichText supports out of the box:

- **Headings**: `<h1>` through `<h6>` with design system typography styles
- **Paragraphs**: `<p>` with proper spacing and typography
- **Lists**: `<ul>` (unordered) and `<ol>` (ordered) with consistent spacing
- **Blockquotes**: `<blockquote>` with `<cite>` support
- **Figures**: `<figure>` with `<figcaption>`
- **Tables**: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`
- **Details**: `<details>` with `<summary>` for disclosure widgets
- **Inline formatting**: `<strong>`, `<em>`, `<mark>`, `<small>`, `<s>`, `<code>`
- **Links**: `<a>` with proper styling
- **Horizontal rules**: `<hr>`
- **Iframes**: `<iframe>` for embedded content

## Examples

### Basic Rich Text Content

```tsx
import { GdsRichText, GdsTheme, GdsCard } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsCard>
    <GdsRichText>
      <h1>The Starship <small>SS Endeavor</small> <mark>Exploration Class</mark></h1>
      
      <p>
        The <strong>SS Endeavor</strong> is a state-of-the-art exploration
        class starship designed for deep space missions. With a focus on
        <em>interstellar travel</em>, it features a unique propulsion system.
        <a href="#">Learn more</a>
      </p>
      
      <blockquote>
        <p>
          "The SS Endeavor represents the pinnacle of human engineering and
          ambition. It is not just a vessel; it is our gateway to the stars."
          <cite>— Dr. Amelia Carter, Chief Engineer</cite>
        </p>
      </blockquote>
    </GdsRichText>
  </GdsCard>
</GdsTheme>
```

### Headings

All heading levels (h1-h6) are styled according to the design system typography.

```tsx
import { GdsRichText, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRichText>
    <h1>Heading 1</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    
    <h2>Heading 2</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    
    <h3>Heading 3</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    
    <h4>Heading 4</h4>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    
    <h5>Heading 5</h5>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    
    <h6>Heading 6</h6>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </GdsRichText>
</GdsTheme>
```

### Lists

Both ordered and unordered lists with consistent spacing and typography.

```tsx
import { GdsRichText, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRichText>
    <h2>Key Technologies in Space Exploration</h2>
    <ul>
      <li>Rocket propulsion systems</li>
      <li>Life support systems</li>
      <li>Communication satellites</li>
      <li>Space habitats and modules</li>
      <li>Robotic exploration rovers</li>
      <li>Advanced materials for spacecraft</li>
    </ul>

    <h2>Major Milestones in Space Exploration</h2>
    <ol>
      <li>Launch of Sputnik 1 (1957) - The first artificial satellite.</li>
      <li>First human in space (Yuri Gagarin, 1961) - Historic manned spaceflight.</li>
      <li>Apollo 11 Moon landing (1969) - First humans to walk on the Moon.</li>
      <li>Launch of the Space Shuttle (1981) - Introduction of reusable spacecraft.</li>
      <li>Mars Rover Curiosity landing (2012) - Advanced exploration of the Martian surface.</li>
    </ol>
  </GdsRichText>
</GdsTheme>
```

### Details/Disclosure Widget

The `<details>` element creates collapsible disclosure widgets.

```tsx
import { GdsRichText, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRichText>
    <h3>Research Areas</h3>
    
    <details name="named-details">
      <summary>Focus Areas</summary>
      <p>The SS Endeavor will focus on the following research areas:</p>
      <ul>
        <li>Astrobiology</li>
        <li>Exoplanetary geology</li>
        <li>Astrophysics and cosmology</li>
        <li>Space weather and its effects on technology</li>
      </ul>
    </details>
    
    <details name="named-details">
      <summary>Exploration Objectives</summary>
      <p>
        The SS Endeavor aims to achieve significant breakthroughs in the
        following exploration objectives:
      </p>
      <ul>
        <li>Mapping the surface of Mars for potential human colonization</li>
        <li>Studying the atmospheres of gas giants</li>
        <li>Investigating the potential for life on Europa</li>
        <li>Understanding the dynamics of asteroid belts</li>
      </ul>
    </details>
    
    <details name="named-details">
      <summary>Technological Innovations</summary>
      <p>
        The SS Endeavor will develop and implement cutting-edge technologies
        in these areas:
      </p>
      <ul>
        <li>Advanced propulsion systems for deep space travel</li>
        <li>Autonomous robotic systems for planetary exploration</li>
        <li>Next-generation communication systems for interstellar data transmission</li>
        <li>Innovative life support systems for long-duration missions</li>
      </ul>
    </details>
  </GdsRichText>
</GdsTheme>
```

### Blockquotes

Styled blockquotes with optional cite element.

```tsx
import { GdsRichText, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRichText>
    <h2>Inspirational Quotes from Space Exploration Pioneers</h2>

    <blockquote>
      <p>
        "That's one small step for [a] man, one giant leap for mankind."
        <cite>— Neil Armstrong, Apollo 11 Astronaut</cite>
      </p>
    </blockquote>

    <blockquote>
      <p>
        "The important achievement of Apollo was demonstrating that humanity
        is not forever chained to this planet and our visions go rather
        further than that and our opportunities are unlimited."
        <cite>— Neil Armstrong</cite>
      </p>
    </blockquote>

    <blockquote>
      <p>
        "To confine our attention to terrestrial matters would be to limit the
        human spirit."
        <cite>— Stephen Hawking, Theoretical Physicist</cite>
      </p>
    </blockquote>
  </GdsRichText>
</GdsTheme>
```

### Inline Formatting

Support for various inline formatting tags.

```tsx
import { GdsRichText, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRichText>
    <h3>Key Concepts in Space Exploration</h3>
    <p>
      The field of space exploration is constantly evolving. It is essential
      to understand the <strong>fundamental principles</strong> that guide our
      missions. For example, <mark>propulsion technology</mark> is crucial for
      <em>successful space travel</em>. Moreover, the study of
      <s>outdated theories</s> has revealed significant insights into the
      <small>nature of the universe</small>. We use <code>advanced algorithms</code>
      for navigation.
    </p>
    <p>
      As we continue to explore the cosmos, <strong>collaboration</strong> among
      international space agencies is vital. Together, we can achieve
      <mark>greater advancements</mark> in our understanding of the universe.
    </p>
  </GdsRichText>
</GdsTheme>
```

### Tables

Styled tables with proper spacing and typography.

```tsx
import { GdsRichText, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRichText>
    <h2>Significant Space Missions</h2>
    <table>
      <thead>
        <tr>
          <th>Mission Name</th>
          <th>Launch</th>
          <th>Objectives</th>
          <th>Outcomes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Apollo 11</td>
          <td>1969</td>
          <td>First manned Moon landing</td>
          <td>
            Successful lunar landing; Neil Armstrong and Buzz Aldrin walked on
            the Moon.
          </td>
        </tr>
        <tr>
          <td>Voyager 1</td>
          <td>1977</td>
          <td>Explore outer planets and interstellar space</td>
          <td>
            Provided detailed images of Jupiter and Saturn; currently in
            interstellar space.
          </td>
        </tr>
        <tr>
          <td>Hubble Space Telescope</td>
          <td>1990</td>
          <td>Observe distant galaxies and cosmic phenomena</td>
          <td>
            Revolutionized astronomy; provided stunning images and data.
          </td>
        </tr>
        <tr>
          <td>Curiosity Rover</td>
          <td>2011</td>
          <td>Explore Mars' surface and assess habitability</td>
          <td>
            Confirmed the presence of water; conducted extensive geological
            analysis.
          </td>
        </tr>
        <tr>
          <td>James Webb Space Telescope</td>
          <td>2021</td>
          <td>Observe the early universe and exoplanets</td>
          <td>Expected to provide unprecedented insights into the cosmos.</td>
        </tr>
      </tbody>
    </table>
  </GdsRichText>
</GdsTheme>
```

### With Themed Card

Rich text adapts to the theme of its container (e.g., card variants).

```tsx
import { GdsRichText, GdsTheme, GdsCard } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsCard variant="tertiary">
    <GdsRichText>
      <h1>The Starship <small>SS Endeavor</small> <mark>Exploration Class</mark></h1>
      
      <h2>Mission Overview</h2>
      <p>
        The <strong>SS Endeavor</strong> is designed for deep space missions.
        With a focus on <em>interstellar travel</em>, it features advanced
        propulsion systems.
      </p>
      
      <h2>Specifications</h2>
      <ul>
        <li>Length: 150 meters</li>
        <li>Width: 50 meters</li>
        <li>Height: 30 meters</li>
        <li>Crew Capacity: 100 personnel</li>
        <li>Propulsion: Quantum Slipstream Drive</li>
        <li>Maximum Speed: 10 light-years per hour</li>
      </ul>
      
      <hr />
      
      <h2>Mission Objectives</h2>
      <ol>
        <li>Conduct scientific research on exoplanets.</li>
        <li>Establish contact with potential extraterrestrial civilizations.</li>
        <li>Collect data on cosmic phenomena.</li>
        <li>Test new technologies in real-world scenarios.</li>
      </ol>
      
      <blockquote>
        <p>
          "The SS Endeavor represents the pinnacle of human engineering."
          <cite>— Dr. Amelia Carter, Chief Engineer</cite>
        </p>
      </blockquote>
      
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Details</th>
            <th>Function</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Life Support System</td>
            <td>Advanced recycling and oxygen generation</td>
            <td>Ensures crew survival during long missions</td>
          </tr>
          <tr>
            <td>Navigation System</td>
            <td>AI-assisted star mapping</td>
            <td>Guides the ship through uncharted space</td>
          </tr>
          <tr>
            <td>Propulsion System</td>
            <td>Quantum Slipstream Drive</td>
            <td>Enables faster-than-light travel</td>
          </tr>
        </tbody>
      </table>
    </GdsRichText>
  </GdsCard>
</GdsTheme>
```

### With Figure and Caption

```tsx
import { GdsRichText, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRichText>
    <h2>The SS Endeavor</h2>
    <figure>
      <img src="https://placehold.co/600x400" alt="SS Endeavor Starship" />
      <figcaption>
        Artist's rendition of the SS Endeavor in flight.
      </figcaption>
    </figure>
    <p>
      The SS Endeavor represents humanity's next great leap into deep space exploration.
    </p>
  </GdsRichText>
</GdsTheme>
```

## TypeScript

```typescript
import type { GdsRichTextProps } from '@sebgroup/green-core/react'

interface GdsRichTextProps {
  // Attributes
  captureMode?: 'clone' | 'move'
  'gds-element'?: string

  // Properties
  innerHTML?: string

  // Style Expression Properties (extends GdsDiv)
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
  onGdsElementDisconnected?: (event: CustomEvent) => void

  // Children
  children?: React.ReactNode
}

// Usage example
const richTextProps: GdsRichTextProps = {
  captureMode: 'clone',
  margin: 'm'
}
```

## Best Practices

### Content Source

1. **CMS Output**: Ideal for wrapping HTML content from CMS:
   ```tsx
   // ✅ Good - wrapping CMS content
   <GdsRichText>
     <div dangerouslySetInnerHTML={{ __html: cmsContent }} />
   </GdsRichText>
   ```

2. **Semantic HTML**: Use proper semantic HTML elements:
   ```tsx
   // ✅ Good - semantic HTML
   <GdsRichText>
     <h1>Main Title</h1>
     <p>Paragraph text</p>
     <ul><li>List item</li></ul>
   </GdsRichText>
   
   // ❌ Avoid - non-semantic markup
   <GdsRichText>
     <div className="title">Title</div>
     <div className="text">Text</div>
   </GdsRichText>
   ```

### Capture Mode

1. **Use Clone (Default) for Most Cases**: Clone mode is most compatible:
   ```tsx
   // ✅ Good - default clone mode for React
   <GdsRichText captureMode="clone">
     <h1>Content</h1>
   </GdsRichText>
   ```

2. **Use Move When Event Listeners Needed**: Only use move mode when you need to preserve event listeners:
   ```tsx
   // ✅ Use move mode only when necessary
   <GdsRichText captureMode="move">
     <button onClick={handleClick}>Click me</button>
   </GdsRichText>
   
   // ⚠️ Note: May be less compatible with React
   ```

### Container Usage

1. **Wrap in Card**: Typically used within a card component:
   ```tsx
   // ✅ Good - rich text in card
   <GdsCard>
     <GdsRichText>
       {/* content */}
     </GdsRichText>
   </GdsCard>
   ```

2. **Theme Variants**: Works well with different card variants:
   ```tsx
   // ✅ Good - adapts to card theme
   <GdsCard variant="tertiary">
     <GdsRichText>
       {/* content */}
     </GdsRichText>
   </GdsCard>
   ```

### Typography

1. **Use Standard HTML Elements**: Rely on standard elements for styling:
   ```tsx
   // ✅ Good - standard elements
   <GdsRichText>
     <h1>Heading</h1>
     <p><strong>Bold</strong> and <em>italic</em></p>
   </GdsRichText>
   
   // ❌ Avoid - custom classes
   <GdsRichText>
     <div className="custom-heading">Heading</div>
   </GdsRichText>
   ```

2. **Headings Hierarchy**: Maintain proper heading hierarchy:
   ```tsx
   // ✅ Good - proper hierarchy
   <GdsRichText>
     <h1>Main Title</h1>
     <h2>Section</h2>
     <h3>Subsection</h3>
   </GdsRichText>
   
   // ❌ Avoid - skipping levels
   <GdsRichText>
     <h1>Main Title</h1>
     <h4>Subsection</h4>
   </GdsRichText>
   ```

### Lists and Tables

1. **Proper List Structure**: Use semantic list elements:
   ```tsx
   // ✅ Good - semantic lists
   <GdsRichText>
     <ul>
       <li>Item 1</li>
       <li>Item 2</li>
     </ul>
   </GdsRichText>
   ```

2. **Table Headers**: Always use thead and th elements:
   ```tsx
   // ✅ Good - proper table structure
   <GdsRichText>
     <table>
       <thead>
         <tr><th>Header</th></tr>
       </thead>
       <tbody>
         <tr><td>Data</td></tr>
       </tbody>
     </table>
   </GdsRichText>
   ```

### Accessibility

1. **Alt Text for Images**: Always provide alt text:
   ```tsx
   // ✅ Good - descriptive alt text
   <GdsRichText>
     <img src="image.jpg" alt="Detailed description of image" />
   </GdsRichText>
   
   // ❌ Avoid - missing alt text
   <GdsRichText>
     <img src="image.jpg" />
   </GdsRichText>
   ```

2. **Link Text**: Use descriptive link text:
   ```tsx
   // ✅ Good - descriptive link
   <GdsRichText>
     <a href="/docs">Read the documentation</a>
   </GdsRichText>
   
   // ❌ Avoid - vague link text
   <GdsRichText>
     <a href="/docs">Click here</a>
   </GdsRichText>
   ```

## Common Use Cases

### CMS Content Display

```tsx
import { GdsRichText, GdsTheme, GdsCard } from '@sebgroup/green-core/react'

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
```

### Blog Post

```tsx
import { GdsRichText, GdsTheme, GdsCard } from '@sebgroup/green-core/react'

function BlogPost() {
  return (
    <GdsTheme>
      <GdsCard>
        <GdsRichText>
          <h1>Introduction to Space Exploration</h1>
          <p>
            Space exploration represents humanity's quest to understand the
            cosmos. Through <strong>advanced technology</strong> and
            <em>scientific research</em>, we continue to push the boundaries
            of what's possible.
          </p>
          
          <h2>Key Achievements</h2>
          <ul>
            <li>First human on the Moon (1969)</li>
            <li>International Space Station (1998-present)</li>
            <li>Mars Rover missions (2004-present)</li>
          </ul>
          
          <blockquote>
            <p>
              "Space exploration is a force of nature unto itself that no other
              force in society can rival."
              <cite>— Neil deGrasse Tyson</cite>
            </p>
          </blockquote>
          
          <h2>Future Missions</h2>
          <p>
            Looking ahead, we have ambitious plans for <mark>Mars colonization</mark>
            and deep space exploration.
          </p>
        </GdsRichText>
      </GdsCard>
    </GdsTheme>
  )
}
```

### Documentation Page

```tsx
import { GdsRichText, GdsTheme, GdsCard } from '@sebgroup/green-core/react'

function DocumentationPage() {
  return (
    <GdsTheme>
      <GdsCard>
        <GdsRichText>
          <h1>API Documentation</h1>
          
          <h2>Getting Started</h2>
          <p>
            Follow these steps to integrate our API into your application.
          </p>
          
          <h3>Installation</h3>
          <ol>
            <li>Install the package: <code>npm install @example/api</code></li>
            <li>Import the library: <code>import API from '@example/api'</code></li>
            <li>Initialize with your API key</li>
          </ol>
          
          <details>
            <summary>Configuration Options</summary>
            <p>Available configuration options:</p>
            <ul>
              <li><code>apiKey</code> - Your API authentication key</li>
              <li><code>timeout</code> - Request timeout in milliseconds</li>
              <li><code>retries</code> - Number of retry attempts</li>
            </ul>
          </details>
          
          <h3>Example Usage</h3>
          <p>Here's a basic example:</p>
          <pre><code>const api = new API({{ apiKey: 'your-key' }});</code></pre>
        </GdsRichText>
      </GdsCard>
    </GdsTheme>
  )
}
```

### FAQ Section

```tsx
import { GdsRichText, GdsTheme, GdsCard } from '@sebgroup/green-core/react'

function FAQSection() {
  return (
    <GdsTheme>
      <GdsCard>
        <GdsRichText>
          <h1>Frequently Asked Questions</h1>
          
          <details name="faq">
            <summary>How do I get started?</summary>
            <p>
              Getting started is easy! Simply <a href="/signup">create an account</a>
              and follow the onboarding wizard.
            </p>
          </details>
          
          <details name="faq">
            <summary>What payment methods do you accept?</summary>
            <p>We accept the following payment methods:</p>
            <ul>
              <li>Credit cards (Visa, Mastercard, Amex)</li>
              <li>PayPal</li>
              <li>Bank transfer</li>
            </ul>
          </details>
          
          <details name="faq">
            <summary>Can I cancel my subscription?</summary>
            <p>
              Yes, you can cancel your subscription at any time from your
              account settings. Your access will continue until the end of
              your current billing period.
            </p>
          </details>
        </GdsRichText>
      </GdsCard>
    </GdsTheme>
  )
}
```

### Product Specifications

```tsx
import { GdsRichText, GdsTheme, GdsCard } from '@sebgroup/green-core/react'

function ProductSpecs() {
  return (
    <GdsTheme>
      <GdsCard>
        <GdsRichText>
          <h1>Product Specifications</h1>
          
          <figure>
            <img src="/product-image.jpg" alt="Product overview" />
            <figcaption>Professional-grade equipment for all applications</figcaption>
          </figure>
          
          <h2>Technical Specifications</h2>
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Specification</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dimensions</td>
                <td>100 x 50 x 30 cm</td>
                <td>Width x Depth x Height</td>
              </tr>
              <tr>
                <td>Weight</td>
                <td>15 kg</td>
                <td>Including packaging</td>
              </tr>
              <tr>
                <td>Power</td>
                <td>220V / 50Hz</td>
                <td>Standard European plug</td>
              </tr>
              <tr>
                <td>Warranty</td>
                <td>2 years</td>
                <td>Extended warranty available</td>
              </tr>
            </tbody>
          </table>
          
          <hr />
          
          <h2>Package Contents</h2>
          <ul>
            <li>Main unit</li>
            <li>Power cable</li>
            <li>User manual</li>
            <li>Quick start guide</li>
            <li>Warranty card</li>
          </ul>
        </GdsRichText>
      </GdsCard>
    </GdsTheme>
  )
}
```

## Related Components

- [Typography](./Typography.md) — Typography system, type scale, and text hierarchy
- [GdsCard](./GdsCard.md) — Container for rich text content
- [GdsText](./GdsText.md) — Typography component for individual text elements
- [GdsDialog](./GdsDialog.md) — For rich text content in dialogs
- [GdsDiv](./GdsDiv.md) — Base container with style expression properties
- [GdsFlex](./GdsFlex.md) — Layout component for arranging rich text sections
- [GdsTheme](./GdsTheme.md) — Theme provider for color schemes

## Accessibility

- **Semantic HTML**: Use proper semantic HTML elements (headings, paragraphs, lists)
- **Heading Hierarchy**: Maintain proper heading hierarchy (h1 → h2 → h3)
- **Alt Text**: Always provide descriptive alt text for images
- **Link Text**: Use descriptive link text instead of "click here"
- **Table Headers**: Use `<th>` elements in `<thead>` for table headers
- **Blockquote Citations**: Use `<cite>` element for quote attributions
- **List Structure**: Use `<ul>` for unordered and `<ol>` for ordered lists
- **Figure Captions**: Use `<figcaption>` within `<figure>` for image descriptions

## Notes

- **Capture Mode**: Default 'clone' mode is most compatible; 'move' mode preserves event listeners but may be less compatible with React
- **Shadow DOM**: Content is transferred to inner shadowRoot for style encapsulation
- **CMS Integration**: Ideal for wrapping HTML output from content management systems
- **Typography Styles**: Automatically applies design system typography to all standard HTML elements
- **Theme Adaptation**: Inherits theme from parent container (e.g., card variants)
- **Supported Elements**: Full support for headings, paragraphs, lists, blockquotes, figures, tables, details, inline formatting, links, and iframes
- **Style Expression Properties**: Extends GdsDiv with all layout properties (margin, flex, grid)
- **innerHTML Property**: Forwards innerHTML from inner shadowRoot for programmatic access
- **Event Listeners**: Clone mode doesn't retain addEventListener events; use move mode if needed
- **React Compatibility**: Clone mode (default) is recommended for React applications

---

*Last updated: November 12, 2025*  
*Source: [GdsRichText Storybook Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-rich-text--docs)*
