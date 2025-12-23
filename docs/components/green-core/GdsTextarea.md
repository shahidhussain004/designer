# GdsTextarea

A textarea component that enables multi-line text input from users with comprehensive form control features including validation, character counting, and customizable resize behavior.

## Import

```tsx
import { GdsTextarea } from '@sebgroup/green-core/react'
import { charCounterCallbackDefault } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTextarea 
  label="Description" 
  supporting-text="Enter your description here."
/>
```

## Anatomy

The textarea follows the standard form-control anatomy used across Green Core:

- Header: Label, label support, contextual help icon, extended supporting text slot.
- Body: Field container with optional `lead` and `trail` slots, textarea input, and clear button when `clearable`.
- Footer: Character counter and error message area.

Anatomy parts:
1. Label
2. Label support text
3. Info icon (opens extended support)
4. Extended support text (slot)
5. Field container
6. Leading icon (slot `lead`)
7. Input value (native textarea)
8. Clear button (when `clearable`)
9. Character counter (when `maxlength` is set or callback used)
10. Resize handle (when `resizable` allows manual resizing)

## Variants

- Default — standard textarea with header and footer.
- Floating label (coming soon) — places the label inside the field and moves it on focus; limited accessibility surface and suitable only in specific contexts.

## Autosize and Resize Behavior

- `resizable="auto"` (default): the textarea grows vertically with content; a resize handle may appear on hover.
- `resizable="manual"`: user can drag the handle to resize both vertically and horizontally.
- `resizable="false"`: fixed height; no resize allowed.
- Use `rows` to set the initial row count (default 4).

## Accessibility

- The inner control is a native textarea which preserves keyboard and screen-reader behavior. Provide a visible `label` for each textarea.
- When using `clearable`, ensure the clear action is reachable via keyboard and announced to AT (the component fires `gds-input-cleared`).
- For character limits, expose the remaining count via the character counter and link it with `aria-describedby` where possible (the component manages this when `maxlength` or `charCounterCallback` is used).

## Keyboard interaction

- Enter: inserts a newline.
- Tab / Shift+Tab: move focus in and out of the field as expected.
- For manual resize handles, keyboard accessibility should be ensured by the browser; avoid replacing native resize affordances with custom non-keyboard draggable controls.

## Do's and Don'ts

Do
- Use textareas for longer, multi-line content such as comments, descriptions, and messages.
- Provide clear supporting text and examples of expected input when helpful.
- Use `maxlength` with a character counter for inputs with strict limits.

Don't
- Don't use textareas for short inputs that fit a single line — prefer `GdsInput`.
- Don't replace native textarea semantics with purely decorative controls; preserve keyboard and AT behavior.


## Complete Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | `''` | The label of the form control |
| `clearable` | `boolean` | `false` | Whether the field should be clearable. Clearable fields display a clear button when the field has a value |
| `resizable` | `'auto' \| 'manual' \| 'false'` | `'auto'` | Controls resize behavior: `'auto'` resizes vertically based on content, `'manual'` allows manual resize in both directions, `'false'` disables resizing |
| `maxlength` | `number` | - | Maximum number of characters allowed in the field |
| `size` | `'large' \| 'small'` | `'large'` | Controls the font-size of header and footer texts |
| `plain` | `boolean` | `false` | Hides the header and footer while keeping the accessible label (always set label attribute) |
| `autocapitalize` | `'off' \| 'none' \| 'on' \| 'sentences' \| 'words' \| 'characters'` | `'off'` | Controls automatic capitalization of text input |
| `autocorrect` | `boolean` | `false` | Indicates whether browser's autocorrect feature is on or off |
| `autocomplete` | `string` | `undefined` | Specifies browser's permission to assist in filling out form field values ([MDN reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)) |
| `autofocus` | `boolean` | `false` | Indicates that the input should receive focus on page load |
| `spellcheck` | `boolean` | `true` | Enables spell checking on the input |
| `wrap` | `'hard' \| 'soft'` | - | Indicates how the control should wrap the value for form submission ([MDN reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap)) |
| `enterkeyhint` | `'' \| 'enter' \| 'done' \| 'go' \| 'next' \| 'previous' \| 'search' \| 'send'` | `''` | Customizes the label or icon of the Enter key on virtual keyboards |
| `inputmode` | `'' \| 'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | `''` | Tells the browser what type of data will be entered, allowing it to display appropriate virtual keyboard |
| `value` | `string` | - | Get or set the value of the form control |
| `required` | `boolean` | `false` | Communicates to assistive technology that the control is required (validation needs to be done separately) |
| `invalid` | `boolean` | - | Validation state of the form control. Setting to `true` triggers invalid state |
| `disabled` | `boolean` | `false` | If the textarea is disabled |
| `supporting-text` | `string` | `''` | Supporting text displayed between the label and the field |
| `show-extended-supporting-text` | `boolean` | `false` | Whether the extended supporting text should be displayed |
| `aria-invalid` | `string` | - | Validation state for assistive technology |
| `error-message` | `string` | `''` | Manually control the error message displayed when control is invalid |
| `gds-element` | `string` | `undefined` | The unscoped name of this element (read-only, set automatically) |

### Declarative Layout / Style Expression Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `align-self` | `string` | `undefined` | Controls the align-self property (all valid CSS values) |
| `justify-self` | `string` | `undefined` | Controls the justify-self property (all valid CSS values) |
| `place-self` | `string` | `undefined` | Controls the place-self property (all valid CSS values) |
| `grid-column` | `string` | `undefined` | Controls the grid-column property ([MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column)) |
| `grid-row` | `string` | `undefined` | Controls the grid-row property (all valid CSS values) |
| `grid-area` | `string` | `undefined` | Controls the grid-area property (all valid CSS values) |
| `flex` | `string` | `undefined` | Controls the flex property (all valid CSS values) |
| `order` | `string` | `undefined` | Controls the order property (all valid CSS values) |
| `width` | `string` | `undefined` | Controls the width property (supports space tokens and CSS values) |
| `min-width` | `string` | `undefined` | Controls the min-width property (supports space tokens and CSS values) |
| `max-width` | `string` | `undefined` | Controls the max-width property (supports space tokens and CSS values) |
| `inline-size` | `string` | `undefined` | Controls the inline-size property (supports space tokens and CSS values) |
| `min-inline-size` | `string` | `undefined` | Controls the min-inline-size property (supports space tokens and CSS values) |
| `max-inline-size` | `string` | `undefined` | Controls the max-inline-size property (supports space tokens and CSS values) |
| `margin` | `string` | `undefined` | Controls the margin property (only accepts space tokens) |
| `margin-inline` | `string` | `undefined` | Controls the margin-inline property (only accepts space tokens) |
| `margin-block` | `string` | `undefined` | Controls the margin-block property (only accepts space tokens) |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rows` | `number` | `4` | Number of rows to display in the textarea |
| `supportingText` | `string` | `''` | Supporting text displayed between label and field |
| `showExtendedSupportingText` | `boolean` | `false` | Whether the extended supporting text should be displayed |
| `charCounterCallback` | `function` | `charCounterCallbackDefault` | Callback for customizing character counter. Returns tuple: `[remainingChars, badgeVariant]`. If second value is `false`, no badge shown |
| `formAssociated` | `boolean` | `true` | Whether the element is form-associated |
| `validator` | `GdsValidator` | `undefined` | Validator for form control validation and error messages |
| `errorMessage` | `string` | `''` | Manually control error message when control is invalid |
| `form` | `HTMLFormElement` | - | The form element the control is associated with |
| `validity` | `ValidityState` | - | Validity state of the form control |
| `validationMessage` | `string` | - | Validation message |
| `willValidate` | `boolean` | - | Whether the control will be validated |
| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry (read-only) |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only) |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version for troubleshooting (read-only) |
| `gdsElementName` | `string` | `undefined` | Unscoped element name (read-only) |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-input-cleared` | `CustomEvent` | Fired when the clear button is clicked |
| `gds-validity-state` | `CustomEvent` | Dispatched when validity state is changed by validator |
| `gds-element-disconnected` | `CustomEvent` | When element is disconnected from DOM |

### Slots

| Slot | Description |
|------|-------------|
| `lead` | Place an icon at the start of the field (e.g., `<IconMagnifyingGlass />`) |
| `trail` | Place a badge at the end of the field (e.g., `<GdsBadge>SEK</GdsBadge>`) |
| `extended-supporting-text` | Longer supporting text displayed in a panel when user clicks info button |

## Examples

### 1. Basic Textarea

```tsx
<GdsTextarea 
  label="Description" 
  supporting-text="Enter your description here."
/>
```

### 2. With Lead Icon

```tsx
<GdsTextarea label="Search">
  <IconMagnifyingGlass slot="lead" />
</GdsTextarea>
```

### 3. With Trail Badge (Currency)

```tsx
<GdsTextarea 
  label="Amount" 
  supporting-text="Enter amount in local currency"
  value="Example value"
  clearable
>
  <GdsBadge variant="information" slot="trail">SEK</GdsBadge>
</GdsTextarea>
```

### 4. Character Length Limit

```tsx
<GdsTextarea 
  label="Short Description" 
  supporting-text="Keep it brief"
  value="Example value"
  maxlength={20}
  clearable
/>
```

**Notes:**
- Badge automatically displays character count as limit is approached
- Badge updates in real-time as user types
- Character counter can be customized via `charCounterCallback` property

### 5. Custom Row Height

```tsx
<GdsFlex gap="xl" width="680px">
  {/* 8 rows with auto resize */}
  <GdsFlex flex-direction="column" gap="s" flex="1">
    <GdsFlex flex-direction="column">
      <GdsText>Rows: 8</GdsText>
      <GdsText tag="small" color="secondary">
        Clearable and auto resize
      </GdsText>
    </GdsFlex>
    <GdsDivider opacity="0.2" />
    <GdsTextarea 
      label="Notes" 
      supporting-text="Auto resizes with content"
      value="Example value with 8 rows"
      clearable
      rows={8}
    />
  </GdsFlex>

  {/* 8 rows with no resize */}
  <GdsFlex flex-direction="column" gap="s" flex="1">
    <GdsFlex flex-direction="column">
      <GdsText>Rows: 8</GdsText>
      <GdsText tag="small" color="secondary">
        Clearable and no resize
      </GdsText>
    </GdsFlex>
    <GdsDivider opacity="0.2" />
    <GdsTextarea 
      label="Fixed Notes" 
      supporting-text="Fixed height, no resize"
      value="Example value with 8 rows"
      clearable
      resizable="false"
      rows={8}
    />
  </GdsFlex>
</GdsFlex>
```

**Notes:**
- Default minimum rows is `4`
- Use `rows` property to set custom height
- Combine with `resizable` to control user resize behavior

### 6. Resize Behavior Comparison

```tsx
<GdsFlex gap="xl" width="800px">
  {/* Auto resize based on content */}
  <GdsFlex flex-direction="column" flex="1" gap="l">
    <GdsFlex flex-direction="column" gap="2xs">
      <GdsText>Resize: Auto</GdsText>
      <GdsText tag="small" color="secondary">
        Based on the content
      </GdsText>
      <GdsDivider opacity="0.2" />
    </GdsFlex>
    <GdsTextarea 
      label="Auto Resize" 
      supporting-text="Grows with content"
      resizable="auto"
    />
  </GdsFlex>

  {/* Manual resize with drag handle */}
  <GdsFlex flex-direction="column" flex="1" gap="l">
    <GdsFlex flex-direction="column" gap="2xs">
      <GdsText>Resize: Manual</GdsText>
      <GdsText tag="small" color="secondary">
        Dragging the pull tab to resize
      </GdsText>
      <GdsDivider opacity="0.2" />
    </GdsFlex>
    <GdsTextarea 
      label="Manual Resize" 
      supporting-text="Drag handle to resize"
      resizable="manual"
    />
  </GdsFlex>

  {/* No resize */}
  <GdsFlex flex-direction="column" flex="1" gap="l">
    <GdsFlex flex-direction="column" gap="2xs">
      <GdsText>Resize: False</GdsText>
      <GdsText tag="small" color="secondary">
        Will not resize at all
      </GdsText>
      <GdsDivider opacity="0.2" />
    </GdsFlex>
    <GdsTextarea 
      label="Fixed Size" 
      supporting-text="No resizing allowed"
      resizable="false"
    />
  </GdsFlex>
</GdsFlex>
```

**Resize Options:**
- **`auto`** (default): Vertical auto-resize based on content with resize handle at bottom center on hover
- **`manual`**: User can drag handle to resize both vertically and horizontally
- **`false`**: No resizing allowed, fixed size

### 7. Size Variations

```tsx
<GdsFlex gap="xl" width="800px">
  {/* Small size */}
  <GdsFlex flex-direction="column" flex="1" gap="l">
    <GdsFlex flex-direction="column" gap="s">
      <GdsText>Size: Small</GdsText>
      <GdsDivider opacity="0.2" />
    </GdsFlex>
    <GdsTextarea 
      label="Compact Textarea" 
      supporting-text="Smaller font size"
      resizable="false"
      size="small"
    >
      <span slot="extended-supporting-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </span>
    </GdsTextarea>
  </GdsFlex>

  {/* Large size (default) */}
  <GdsFlex flex-direction="column" flex="1" gap="l">
    <GdsFlex flex-direction="column" gap="s">
      <GdsText>Size: Large (default)</GdsText>
      <GdsDivider opacity="0.2" />
    </GdsFlex>
    <GdsTextarea 
      label="Standard Textarea" 
      supporting-text="Default font size"
    >
      <span slot="extended-supporting-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </span>
    </GdsTextarea>
  </GdsFlex>
</GdsFlex>
```

**Notes:**
- `size` controls font-size of header (label) and footer (supporting text)
- Does not affect textarea input text size
- Use `small` for compact forms or dense layouts

### 8. Clearable Textarea

```tsx
<GdsTextarea 
  label="Clearable Text" 
  value="Clear this text"
  clearable
/>
```

**Notes:**
- Clear button appears when field has a value
- Fires `gds-input-cleared` event when clicked
- Useful for quick input reset

### 9. Supporting Text

```tsx
<GdsTextarea 
  label="Feedback" 
  supporting-text="Share your thoughts with us"
/>
```

### 10. Extended Supporting Text

```tsx
{/* With info icon - click to expand */}
<GdsTextarea 
  label="Detailed Input" 
  supporting-text="Brief hint here"
>
  <span slot="extended-supporting-text">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </span>
</GdsTextarea>

{/* Always visible */}
<GdsTextarea 
  label="Detailed Input" 
  supporting-text="Brief hint here"
  show-extended-supporting-text
>
  <span slot="extended-supporting-text">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </span>
</GdsTextarea>
```

**Notes:**
- Without `show-extended-supporting-text`: Info icon displayed, click to expand
- With `show-extended-supporting-text`: Extended text always visible
- Use for providing detailed instructions or formatting guidelines

### 11. Form Validation

```tsx
import { useState } from 'react'

function ValidatedForm() {
  const [feedback, setFeedback] = useState('')

  return (
    <GdsFlex flex-direction="column" width="800px">
      <GdsFlex gap="xl">
        {/* Valid state */}
        <GdsTextarea 
          label="Feedback" 
          supporting-text="Enter your feedback"
          value={feedback}
          onInput={(e) => setFeedback((e.target as HTMLTextAreaElement).value)}
        >
          <IconCreditCard slot="lead" />
          <span slot="extended-supporting-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </span>
        </GdsTextarea>

        {/* Invalid state with error message */}
        <GdsTextarea 
          label="Feedback" 
          supporting-text="Enter your feedback"
          value="Incorrect value"
          maxlength={12}
          clearable
          error-message="This is explicitly set error message."
        >
          <IconCreditCard slot="lead" />
        </GdsTextarea>
      </GdsFlex>
    </GdsFlex>
  )
}
```

**Validator Example:**

```tsx
<GdsTextarea
  label="Required Field"
  value=" "
  validator={{
    validate: (el: any) => {
      if (el.value.trim() === '')
        return [
          {
            ...el.validity,
            valid: false,
            customError: true,
          },
          'This field is required.',
        ]
    },
  }}
/>
```

**Notes:**
- Built-in form validation using ElementInternals and Constraint Validation API
- Validator implements `GdsValidator` interface
- Use `error-message` attribute to manually set error message
- `invalid` attribute triggers invalid visual state

### 12. Disabled State

```tsx
<GdsFlex gap="xl" width="800px">
  {/* Disabled empty */}
  <GdsTextarea 
    label="Disabled Field" 
    disabled
    supporting-text="Cannot be edited"
  >
    <IconCreditCard slot="lead" />
  </GdsTextarea>

  {/* Disabled with value */}
  <GdsTextarea 
    label="Disabled Field" 
    disabled
    supporting-text="Cannot be edited"
    value="Disabled with value"
    clearable
  >
    <IconCreditCard slot="lead" />
  </GdsTextarea>
</GdsFlex>
```

### 13. Standard HTML Attributes

```tsx
<GdsTextarea 
  label="Advanced Input" 
  supporting-text="Using standard HTML attributes"
  autocapitalize="on"
  autocomplete="on"
  autocorrect="on"
  spellcheck={true}
  inputmode="text"
  autofocus
  enterkeyhint="enter"
/>
```

**Supported Attributes:**
- `autocapitalize`: Control automatic capitalization
- `autocomplete`: Browser autofill assistance
- `autocorrect`: Browser autocorrect feature
- `spellcheck`: Enable/disable spell checking
- `inputmode`: Virtual keyboard type on mobile
- `autofocus`: Auto-focus on page load
- `enterkeyhint`: Customize Enter key label on virtual keyboard
- `wrap`: Control text wrapping for form submission

### 14. Custom Character Counter Badge

```tsx
import { charCounterCallbackDefault } from '@sebgroup/green-core/react'

function CustomCounterTextarea() {
  // Custom callback that changes badge variant based on remaining characters
  const customCounterCallback = (el: any) => {
    const remaining = (el.maxlength || 0) - (el.value?.length || 0)
    
    // Change badge variant based on remaining characters
    if (remaining <= 10) {
      return [remaining, 'negative'] // Red badge when 10 or fewer remaining
    } else if (remaining <= 25) {
      return [remaining, 'notice'] // Yellow badge when 25 or fewer remaining
    } else {
      return [remaining, 'information'] // Default blue badge
    }
  }

  return (
    <GdsTextarea 
      label="Custom Counter" 
      maxlength={100}
      charCounterCallback={customCounterCallback}
    >
      <IconCreditCard slot="lead" />
    </GdsTextarea>
  )
}
```

**Counter Callback:**
- Returns tuple: `[remainingChars: number, badgeVariant: string | false]`
- If second value is `false`, no badge is shown
- Default callback: `charCounterCallbackDefault`
- Customize to change badge color/variant based on remaining characters

## TypeScript

```tsx
import { GdsTextarea, charCounterCallbackDefault } from '@sebgroup/green-core/react'

interface GdsTextareaProps {
  // Attributes
  label?: string
  clearable?: boolean
  resizable?: 'auto' | 'manual' | 'false'
  maxlength?: number
  size?: 'large' | 'small'
  plain?: boolean
  autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
  autocorrect?: boolean
  autocomplete?: string
  autofocus?: boolean
  spellcheck?: boolean
  wrap?: 'hard' | 'soft'
  enterkeyhint?: '' | 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
  inputmode?: '' | 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  value?: string
  required?: boolean
  invalid?: boolean
  disabled?: boolean
  'supporting-text'?: string
  'show-extended-supporting-text'?: boolean
  'aria-invalid'?: string
  'error-message'?: string
  'gds-element'?: string
  
  // Style Expression Properties
  'align-self'?: string
  'justify-self'?: string
  'place-self'?: string
  'grid-column'?: string
  'grid-row'?: string
  'grid-area'?: string
  flex?: string
  order?: string
  width?: string
  'min-width'?: string
  'max-width'?: string
  'inline-size'?: string
  'min-inline-size'?: string
  'max-inline-size'?: string
  margin?: string
  'margin-inline'?: string
  'margin-block'?: string
  
  // Properties
  rows?: number
  supportingText?: string
  showExtendedSupportingText?: boolean
  charCounterCallback?: (el: any) => [number, string | false]
  validator?: GdsValidator
  errorMessage?: string
  
  // Events
  onGdsInputCleared?: (event: CustomEvent) => void
  onGdsValidityState?: (event: CustomEvent) => void
  onGdsElementDisconnected?: (event: CustomEvent) => void
  
  // Standard
  children?: React.ReactNode
}

// Usage example
const MyForm: React.FC = () => {
  const [description, setDescription] = useState('')
  
  const handleCleared = (e: CustomEvent) => {
    console.log('Textarea cleared')
    setDescription('')
  }
  
  const customValidator = {
    validate: (el: any) => {
      if (el.value.trim().length < 10) {
        return [
          { ...el.validity, valid: false, customError: true },
          'Description must be at least 10 characters.',
        ]
      }
    },
  }
  
  return (
    <GdsTextarea
      label="Description"
      supporting-text="Enter a detailed description"
      value={description}
      onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
      onGdsInputCleared={handleCleared}
      clearable
      maxlength={500}
      rows={6}
      validator={customValidator}
    >
      <span slot="extended-supporting-text">
        Please provide a comprehensive description including all relevant details.
        The description should be clear and concise.
      </span>
    </GdsTextarea>
  )
}
```

## Best Practices

### ✅ Good Practices

**1. Always Provide Label**
```tsx
// ✅ Good - accessible label
<GdsTextarea label="Feedback" />

// ✅ Good - hidden label but still accessible
<GdsTextarea label="Feedback" plain />

// ❌ Bad - no label
<GdsTextarea />
```

**2. Use Appropriate Resize Mode**
```tsx
// ✅ Good - auto resize for dynamic content
<GdsTextarea label="Comment" resizable="auto" />

// ✅ Good - fixed for consistent layout
<GdsTextarea label="Short Note" resizable="false" rows={3} />

// ❌ Bad - manual resize in forms (inconsistent UX)
<GdsTextarea label="Feedback" resizable="manual" />
```

**3. Character Limits with Clear Communication**
```tsx
// ✅ Good - limit with supporting text
<GdsTextarea 
  label="Tweet" 
  maxlength={280}
  supporting-text="Keep it concise"
/>

// ❌ Bad - limit without explanation
<GdsTextarea label="Tweet" maxlength={280} />
```

**4. Validation Feedback**
```tsx
// ✅ Good - clear error message
<GdsTextarea 
  label="Feedback"
  error-message="Feedback must be at least 10 characters"
  validator={feedbackValidator}
/>

// ❌ Bad - generic error
<GdsTextarea 
  label="Feedback"
  error-message="Invalid input"
  validator={feedbackValidator}
/>
```

**5. Extended Supporting Text for Complex Inputs**
```tsx
// ✅ Good - detailed guidance available
<GdsTextarea label="API Key">
  <span slot="extended-supporting-text">
    Your API key should be 32 characters long and include only 
    alphanumeric characters. Never share your API key publicly.
  </span>
</GdsTextarea>

// ❌ Bad - complex requirements without guidance
<GdsTextarea label="API Key" />
```

## Common Use Cases

### 1. Feedback Form

```tsx
import { useState } from 'react'

function FeedbackForm() {
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const validator = {
    validate: (el: any) => {
      if (el.value.trim().length < 20) {
        return [
          { ...el.validity, valid: false, customError: true },
          'Feedback must be at least 20 characters.',
        ]
      }
    },
  }

  return (
    <GdsFlex flex-direction="column" gap="m" width="500px">
      <GdsTextarea
        label="Your Feedback"
        supporting-text="Tell us what you think"
        value={feedback}
        onInput={(e) => setFeedback((e.target as HTMLTextAreaElement).value)}
        clearable
        maxlength={500}
        rows={6}
        validator={validator}
      >
        <span slot="extended-supporting-text">
          Your feedback helps us improve our service. Please be as specific 
          as possible about your experience.
        </span>
      </GdsTextarea>
      
      <GdsButton 
        variant="primary"
        onClick={() => setSubmitted(true)}
        disabled={feedback.trim().length < 20}
      >
        Submit Feedback
      </GdsButton>
    </GdsFlex>
  )
}
```

### 2. Multi-line Address Input

```tsx
function AddressInput() {
  const [address, setAddress] = useState('')

  return (
    <GdsTextarea
      label="Street Address"
      supporting-text="Enter your full address"
      value={address}
      onInput={(e) => setAddress((e.target as HTMLTextAreaElement).value)}
      rows={3}
      resizable="false"
      autocapitalize="words"
      clearable
    >
      <IconMapPin slot="lead" />
    </GdsTextarea>
  )
}
```

### 3. Code Snippet Input

```tsx
function CodeInput() {
  const [code, setCode] = useState('')

  return (
    <GdsTextarea
      label="Code Snippet"
      supporting-text="Paste your code here"
      value={code}
      onInput={(e) => setCode((e.target as HTMLTextAreaElement).value)}
      rows={10}
      resizable="manual"
      spellcheck={false}
      autocorrect={false}
      autocapitalize="off"
      wrap="off"
      clearable
    >
      <IconCode slot="lead" />
      <span slot="extended-supporting-text">
        Code formatting will be preserved. Use proper indentation for readability.
      </span>
    </GdsTextarea>
  )
}
```

### 4. Character-Limited Bio

```tsx
function BioEditor() {
  const [bio, setBio] = useState('')
  
  const bioCounter = (el: any) => {
    const remaining = 250 - (el.value?.length || 0)
    
    if (remaining <= 0) {
      return [0, 'negative']
    } else if (remaining <= 25) {
      return [remaining, 'notice']
    } else {
      return [remaining, 'information']
    }
  }

  return (
    <GdsTextarea
      label="Bio"
      supporting-text="Write a short bio about yourself"
      value={bio}
      onInput={(e) => setBio((e.target as HTMLTextAreaElement).value)}
      maxlength={250}
      rows={5}
      resizable="auto"
      charCounterCallback={bioCounter}
      clearable
    >
      <IconUser slot="lead" />
    </GdsTextarea>
  )
}
```

### 5. Message Composer with Auto-Save

```tsx
import { useState, useEffect } from 'react'

function MessageComposer() {
  const [message, setMessage] = useState(() => {
    return localStorage.getItem('draft-message') || ''
  })

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (message.trim()) {
        localStorage.setItem('draft-message', message)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [message])

  const handleCleared = () => {
    localStorage.removeItem('draft-message')
    setMessage('')
  }

  return (
    <GdsFlex flex-direction="column" gap="m" width="600px">
      <GdsTextarea
        label="Message"
        supporting-text="Your message is auto-saved"
        value={message}
        onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
        onGdsInputCleared={handleCleared}
        rows={8}
        resizable="auto"
        clearable
      >
        <IconEnvelope slot="lead" />
        <span slot="extended-supporting-text">
          Your message draft is automatically saved every second. 
          You can return to it later.
        </span>
      </GdsTextarea>
      
      <GdsFlex gap="s" justify-content="flex-end">
        <GdsButton variant="secondary" onClick={handleCleared}>
          Discard Draft
        </GdsButton>
        <GdsButton variant="primary" disabled={!message.trim()}>
          <IconPaperPlane />
          Send Message
        </GdsButton>
      </GdsFlex>
    </GdsFlex>
  )
}
```

## Related Components

- [GdsInput](./GdsInput.md) — Single-line text input for short text
- [GdsTheme](./GdsTheme.md) — Theme utility for controlling textarea color schemes
- [GdsBadge](./GdsBadge.md) — Badge for trail slot (currency, units)
- [GdsButton](./GdsButton.md) — Buttons for form submission
- [GdsFormSummary](./GdsFormSummary.md) — Form validation error summaries
- [Icons](./Icons.md) — Icons for lead/trail slots (IconMagnifyingGlass, IconCreditCard, IconMapPin, IconCode, IconUser, IconEnvelope, IconPaperPlane)
- [GdsFlex](./GdsFlex.md) — Layout for form arrangement
- [GdsCard](./GdsCard.md) — Container for form sections
- [GdsDivider](./GdsDivider.md) — Separating form sections

## Accessibility

- **Accessible Label**: Always provide a `label` attribute, even if using `plain` to hide it visually
- **Required Fields**: Use `required` attribute to communicate requirement to assistive technology (implement separate validation)
- **Error Messages**: Provide clear, specific error messages via `error-message` attribute
- **Validation State**: Use `invalid` and `aria-invalid` for proper state communication
- **Supporting Text**: Use supporting text to provide hints and instructions
- **Keyboard Navigation**: Full keyboard support for navigation and editing
- **Focus Indicators**: Clear focus indicators in all states
- **Spellcheck**: Enabled by default (`spellcheck={true}`) for better text entry
- **Virtual Keyboards**: Use `inputmode` and `enterkeyhint` to optimize mobile experience

## Notes

- **Form Association**: Component is form-associated (`formAssociated: true`) and works with native form submission
- **Validation**: Built-in support using ElementInternals and Constraint Validation API
- **Validator Interface**: Implement `GdsValidator` interface for custom validation logic
- **Character Counter**: Automatically displays badge when `maxlength` is set
- **Custom Counter**: Use `charCounterCallback` to customize badge behavior and styling
- **Clear Button**: Appears only when field has a value (when `clearable` is true)
- **Resize Behavior**: Default `auto` resizes vertically based on content, `manual` allows user resize, `false` disables
- **Resize Handle**: In `auto` and `manual` modes, handle appears at bottom center on hover
- **Minimum Rows**: Default is `4`, adjustable via `rows` property
- **Size Property**: Controls header and footer font-size, not textarea input text
- **Standard Attributes**: Most standard HTML textarea attributes are supported and forwarded
- **Extended Supporting Text**: Hidden by default with info icon, or always visible with `show-extended-supporting-text`
- **Slots**: Use slots for icons (`lead`) and badges (`trail`) to enhance field context
- **Style Expressions**: Full support for declarative layout properties for grid/flex positioning
- **Read-only Properties**: Properties like `isDefined`, `styleExpressionBaseSelector`, `semanticVersion`, and `gdsElementName` are read-only
- **Event Handling**: Listen to `gds-input-cleared` for clear button clicks, `gds-validity-state` for validation changes
- **Auto-capitalization**: Use `autocapitalize` for names, addresses, or sentence-based inputs
- **Mobile Optimization**: Use `inputmode` to display appropriate virtual keyboard (text, email, numeric, etc.)
- **Enter Key Hint**: Use `enterkeyhint` to customize Enter key label on mobile keyboards (send, next, done, etc.)
- **Plain Mode**: Use `plain` attribute to hide header/footer while maintaining accessibility
