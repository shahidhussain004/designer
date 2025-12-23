# GdsSelect# GdsSelect Component



A select component that enables users to choose a single option from a list. GdsSelect is a wrapper component for the native select element, providing consistent styling and integration with the Green Core design system while maintaining native accessibility and mobile usability.## Overview



## When to Use`GdsSelect` is a wrapper component for the native select element in Green Core. It provides a consistent design system appearance while leveraging the inherent behavior and accessibility features of native select elements.



Use **GdsSelect** when you need:**Always use `GdsSelect` instead of native `<select>` elements in this application.**

- Native accessibility features that are not replicable in custom dropdowns
- Better usability on mobile devices with native select behavior## When to Use
- Single-select functionality with native browser support
- Form controls that integrate with native form validation✅ **Use GdsSelect when:**
- You need native accessibility features

**Don't use** GdsSelect when you need:- Better mobile device usability is required

- Customized dropdown behavior or appearance (use GdsDropdown instead)- Single-select dropdown functionality is needed
- Complex content in the dropdown (use GdsDropdown instead)- Native select behavior is preferred (keyboard navigation, native validation)
- Multi-select functionality (while supported, use GdsDropdown for better UX)
- Advanced filtering or search capabilities (use GdsDropdown instead)❌ **Don't use when:**

- You need to customize dropdown behavior or appearance extensively

## Import- Complex content needs to be displayed in the dropdown

- Multi-select functionality is required (while supported, not recommended)

```typescript

import { GdsSelect } from '@sebgroup/green-core/react'## Import

```

```typescript

## Basic Usageimport { GdsSelect } from '@sebgroup/green-core/react'

```

```tsx

import { GdsSelect, GdsTheme } from '@sebgroup/green-core/react'## Basic Usage

import { IconBooks } from '@sebgroup/green-core/react'

### React/JSX Syntax

function CourseSelector() {

  return (```tsx

    <GdsTheme><GdsSelect label="Select a subject" supporting-text="Choose your favorite">

      <GdsSelect label="Choose a course" supporting-text="Select your area of study">  <select>

        <IconBooks slot="lead" />    <option value="">Select a value</option>

        <select>    <optgroup label="Sciences">

          <option value="">Select a value</option>      <option value="physics">Physics</option>

          <optgroup label="Physics">      <option value="chemistry">Chemistry</option>

            <option value="quantum-mechanics">Quantum Mechanics</option>      <option value="biology">Biology</option>

            <option value="relativity">Relativity</option>    </optgroup>

          </optgroup>  </select>

          <optgroup label="Chemistry"></GdsSelect>

            <option value="organic-chemistry">Organic Chemistry</option>```

            <option value="inorganic-chemistry">Inorganic Chemistry</option>

          </optgroup>### Important: Native Select Element Required

          <optgroup label="Biology">

            <option value="genetics">Genetics</option>`GdsSelect` **must** wrap a native `<select>` element with `<option>` elements inside. This is because Web Components using Shadow DOM cannot associate elements across Shadow DOM boundaries.

            <option value="microbiology">Microbiology</option>

            <option value="ecology">Ecology</option>```tsx

          </optgroup>// ✅ Correct

        </select><GdsSelect>

      </GdsSelect>  <select>

    </GdsTheme>    <option value="option1">Option 1</option>

  )    <option value="option2">Option 2</option>

}  </select>

```</GdsSelect>



## Public API// ❌ Incorrect - options won't work

<GdsSelect>

### Attributes  <option value="option1">Option 1</option>

  <option value="option2">Option 2</option>

| Name | Type | Default | Description |</GdsSelect>

|------|------|---------|-------------|```

| `label` | `string` | `''` | The label of the form control |

| `value` | `string \| string[]` | `undefined` | The value of the select element. Can be single value or array (for multiple). Use this property, not the wrapped select's value |## Props / Attributes

| `size` | `'large' \| 'small'` | `'large'` | Controls the font-size and height of the field |

| `plain` | `boolean` | `false` | Hides the header and footer, while keeping the accessible label. Always set label attribute |### Essential Props

| `required` | `boolean` | `false` | Communicates to assistive technology that the control is required |

| `invalid` | `boolean` | `false` | Validation state of the form control. Triggers invalid state || Prop | Type | Default | Description |

| `disabled` | `boolean` | `false` | Whether the select is disabled ||------|------|---------|-------------|

| `supporting-text` | `string` | `''` | Supporting text displayed between the label and the field || `label` | `string` | `''` | The label text for the select field (required for accessibility) |

| `show-extended-supporting-text` | `boolean` | `false` | Whether the extended supporting text should be displayed || `value` | `string` | - | The selected value. Use this on the host element, not the wrapped select |

| `aria-invalid` | `boolean` | `false` | Validation state for assistive technology || `supporting-text` | `string` | `''` | Helper text displayed below the label |

| `error-message` | `string` | `''` | Manually controls the error message displayed when invalid || `size` | `'small' \| 'large'` | `'large'` | Controls the font-size and height |

| `gds-element` | `string` | `undefined` | The unscoped element name (read-only, set automatically) || `required` | `boolean` | `false` | Marks the field as required |

| `disabled` | `boolean` | `false` | Disables the select field |

### Properties| `invalid` | `boolean` | `false` | Sets the invalid/error state |

| `error-message` | `string` | `''` | Custom error message when invalid |

| Name | Type | Default | Description || `plain` | `boolean` | `false` | Hides header/footer while keeping accessible label |

|------|------|---------|-------------|

| `supportingText` | `string` | `''` | Supporting text displayed between label and field |### Advanced Props

| `showExtendedSupportingText` | `boolean` | `false` | Whether the extended supporting text should be displayed |

| `selectElement` | `HTMLSelectElement` | `undefined` | Reference to the native select element (read-only) || Prop | Type | Default | Description |

| `displayValue` | `string` | `undefined` | Returns the display value. For single-select: selected option text. For multi-select: comma-separated list (read-only) ||------|------|---------|-------------|

| `multiple` | `boolean` | `false` | Whether the select is in multiple selection mode (read-only) || `show-extended-supporting-text` | `boolean` | `false` | Shows extended supporting text by default |

| `formAssociated` | `boolean` | `true` | Whether the element participates in form submission (read-only) || `multiple` | `boolean` | `false` | Enables multi-select mode (not recommended) |

| `validator` | `GdsValidator` | `undefined` | Validator for form control validation and error messages |

| `errorMessage` | `string` | `''` | Manually controls error message when invalid |## React Hook Form Integration

| `form` | `HTMLFormElement` | `undefined` | The form element the control is associated with (read-only) |

| `validity` | `ValidityState` | `undefined` | Validity state of the form control (read-only) |### Using Controller

| `validationMessage` | `string` | `undefined` | Validation message from the browser (read-only) |

| `willValidate` | `boolean` | `undefined` | Whether the element will be validated (read-only) |```tsx

| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry (read-only) |import { Controller, useForm } from 'react-hook-form'

| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only) |import { GdsSelect } from '@sebgroup/green-core/react'

| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of this element (read-only) |

| `gdsElementName` | `string` | `undefined` | Unscoped name of this element (read-only) |function MyForm() {

  const { control } = useForm()

### Style Expression Properties

  return (

GdsSelect supports the following style expression properties for layout control:    <Controller

      name="country"

#### Sizing      control={control}

- `width` — Controls width. Supports space tokens and all valid CSS width values      rules={{ required: 'Country is required' }}

- `min-width` — Controls minimum width      render={({ field, fieldState }) => (

- `max-width` — Controls maximum width        <GdsSelect

- `inline-size` — Controls inline size          label="Country *"

- `min-inline-size` — Controls minimum inline size          supporting-text="Select your country"

- `max-inline-size` — Controls maximum inline size          invalid={!!fieldState.error}

          error-message={fieldState.error?.message}

#### Positioning & Layout        >

- `align-self` — Controls alignment within parent flex/grid container          <select

- `justify-self` — Controls justification within parent grid container            value={field.value}

- `place-self` — Shorthand for `align-self` and `justify-self`            onChange={field.onChange}

            onBlur={field.onBlur}

#### Grid Layout          >

- `grid-column` — Controls grid column placement            <option value="">Select a country</option>

- `grid-row` — Controls grid row placement            <option value="sweden">Sweden</option>

- `grid-area` — Controls grid area placement            <option value="norway">Norway</option>

            <option value="denmark">Denmark</option>

#### Flexbox          </select>

- `flex` — Controls flex grow, shrink, and basis        </GdsSelect>

- `order` — Controls order in flex container      )}

    />

#### Spacing  )

- `margin` — Controls all margins (space tokens only)}

- `margin-inline` — Controls inline margins (space tokens only)```

- `margin-block` — Controls block margins (space tokens only)

### Validation Pattern

### Events

```tsx

| Name | Type | Description |<Controller

|------|------|-------------|  name="status"

| `change` | `CustomEvent<{ value: string }>` | Fired when the selection changes |  control={control}

| `input` | `CustomEvent<{ value: string }>` | Fired on input |  rules={{

| `gds-validity-state` | `CustomEvent` | Dispatched when validity state changes via validator |    required: 'Status is required',

| `gds-element-disconnected` | `CustomEvent` | Fired when element is disconnected from DOM |    validate: (value) => value !== 'invalid' || 'Please select a valid status'

  }}

### Slots  render={({ field, fieldState }) => (

    <GdsSelect

| Name | Description |      label="Status *"

|------|-------------|      invalid={!!fieldState.error}

| (default) | Must contain a native `<select>` element with `<option>` and `<optgroup>` elements |      error-message={fieldState.error?.message}

| `lead` | Icon slot for leading content before the select field |    >

| `extended-supporting-text` | Extended information about the select field |      <select

        value={field.value}

## Examples        onChange={field.onChange}

        onBlur={field.onBlur}

### Basic Select with Icon      >

        <option value="">Choose status</option>

```tsx        <option value="active">Active</option>

import { GdsSelect, GdsTheme } from '@sebgroup/green-core/react'        <option value="inactive">Inactive</option>

import { IconBooks } from '@sebgroup/green-core/react'      </select>

    </GdsSelect>

<GdsTheme>  )}

  <GdsSelect label="Label text" supporting-text="Supporting text">/>

    <IconBooks slot="lead" />```

    <select>

      <option value="">Select a value</option>## Features

      <optgroup label="Physics">

        <option value="quantum-mechanics">Quantum Mechanics</option>### Lead Icon

        <option value="relativity">Relativity</option>

      </optgroup>Add an icon to the left of the select field for visual context:

      <optgroup label="Chemistry">

        <option value="organic-chemistry">Organic Chemistry</option>```tsx

        <option value="inorganic-chemistry">Inorganic Chemistry</option>import { GdsSelect, IconBooks } from '@sebgroup/green-core/react'

      </optgroup>

    </select><GdsSelect label="Subject">

  </GdsSelect>  <IconBooks slot="lead" />

</GdsTheme>  <select>

```    <option value="math">Mathematics</option>

    <option value="science">Science</option>

### With Optgroups  </select>

</GdsSelect>

```tsx```

import { GdsSelect, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'

import { IconSquareGridCircle } from '@sebgroup/green-core/react'### Option Groups



<GdsTheme>Use `<optgroup>` to organize related options:

  <GdsFlex>

    <GdsSelect label="Label text" supporting-text="Supporting text">```tsx

      <span slot="extended-supporting-text"><GdsSelect label="Course">

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do  <select>

        eiusmod tempor incididunt ut labore et dolore magna aliqua.    <option value="">Select a course</option>

      </span>    <optgroup label="Science">

      <IconSquareGridCircle slot="lead" />      <option value="physics">Physics</option>

      <select>      <option value="chemistry">Chemistry</option>

        <optgroup label="Astronomy">    </optgroup>

          <option value="cosmology">Cosmology</option>    <optgroup label="Arts">

          <option value="astrophysics">Astrophysics</option>      <option value="music">Music</option>

        </optgroup>      <option value="painting">Painting</option>

        <optgroup label="Geology">    </optgroup>

          <option value="volcanology">Volcanology</option>  </select>

          <option value="seismology">Seismology</option></GdsSelect>

        </optgroup>```

      </select>

    </GdsSelect>### Extended Supporting Text

  </GdsFlex>

</GdsTheme>Provide additional information that can be toggled:

```

```tsx

### Lead Icon<GdsSelect

  label="Select option"

The lead icon provides visual context for the select field:  supporting-text="Choose carefully"

  show-extended-supporting-text

```tsx>

import { GdsSelect, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'  <span slot="extended-supporting-text">

import { IconBrandGreen } from '@sebgroup/green-core/react'    This selection will affect your application. Please review the options

    carefully before making your choice.

<GdsTheme>  </span>

  <GdsFlex>  <select>

    <GdsSelect label="Label text" supporting-text="Supporting text">    <option value="option1">Option 1</option>

      <span slot="extended-supporting-text">    <option value="option2">Option 2</option>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do  </select>

        eiusmod tempor incididunt ut labore et dolore magna aliqua.</GdsSelect>

      </span>```

      <IconBrandGreen slot="lead" />

      <select>### Size Variants

        <option value="green">Green Design System</option>

        <option value="carbon">Carbon Design System</option>```tsx

      </select>// Small size

    </GdsSelect><GdsSelect size="small" label="Compact select">

  </GdsFlex>  <select>

</GdsTheme>    <option value="1">Option 1</option>

```  </select>

</GdsSelect>

### Disabled State

// Large size (default)

```tsx<GdsSelect size="large" label="Standard select">

import { GdsSelect, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'  <select>

import { IconLightning } from '@sebgroup/green-core/react'    <option value="1">Option 1</option>

  </select>

<GdsTheme></GdsSelect>

  <GdsFlex>```

    <GdsSelect disabled label="Label text" supporting-text="Supporting text">

      <span slot="extended-supporting-text">### Disabled State

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do

        eiusmod tempor incididunt ut labore et dolore magna aliqua.```tsx

      </span><GdsSelect disabled label="Disabled select">

      <IconLightning slot="lead" />  <select>

      <select>    <option value="1">Option 1</option>

        <option value="thunder">Thunder</option>  </select>

        <option value="lightning">Lightning</option></GdsSelect>

      </select>```

    </GdsSelect>

  </GdsFlex>### Invalid State with Error Message

</GdsTheme>

``````tsx

<GdsSelect

### Invalid State with Error Message  invalid

  label="Invalid select"

Set the invalid state directly with `invalid` and `error-message`:  error-message="This field is required"

>

```tsx  <select>

import { GdsSelect, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'    <option value="">Select a value</option>

import { IconRocket } from '@sebgroup/green-core/react'    <option value="1">Option 1</option>

  </select>

<GdsTheme></GdsSelect>

  <GdsFlex>```

    <GdsSelect 

      invalid ## Events

      label="Label text" 

      supporting-text="Supporting text" ### Event Handling

      error-message="This field is required"

    >Events should be added to the native `<select>` element, not the `GdsSelect` host:

      <span slot="extended-supporting-text">

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do```tsx

        eiusmod tempor incididunt ut labore et dolore magna aliqua.<GdsSelect label="Select option">

      </span>  <select

      <IconRocket slot="lead" />    onChange={(e) => handleChange(e.target.value)}

      <select>    onBlur={() => handleBlur()}

        <option value="">Incorrect Value</option>  >

        <optgroup label="Propulsion">    <option value="1">Option 1</option>

          <option value="ion-thrusters">Ion Thrusters</option>    <option value="2">Option 2</option>

          <option value="chemical-rockets">Chemical Rockets</option>  </select>

        </optgroup></GdsSelect>

        <optgroup label="Communication">```

          <option value="satellite-communication">Satellite Communication</option>

          <option value="deep-space-network">Deep Space Network</option>### Available Events

        </optgroup>

      </select>- `change` - Fired when selection changes (on native select)

    </GdsSelect>- `input` - Fired on input (on native select)

  </GdsFlex>- `blur` - Fired when focus is lost (on native select)

</GdsTheme>

```## Important Notes



### Extended Supporting Text### State Management



Provide additional information with the `extended-supporting-text` slot:⚠️ **Always handle state through the host element (`GdsSelect`), not the wrapped select element.**



```tsx```tsx

import { GdsSelect, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'// ✅ Correct - control value through parent state

import { IconRocket } from '@sebgroup/green-core/react'const [value, setValue] = useState('')



<GdsTheme><GdsSelect label="Select" value={value}>

  <GdsFlex gap="xl" align-items="center" justify-content="center" width="100%">  <select onChange={(e) => setValue(e.target.value)}>

    <GdsSelect     <option value="1">Option 1</option>

      label="Label text"   </select>

      supporting-text="Supporting text" </GdsSelect>

      show-extended-supporting-text

    >// ❌ Incorrect - don't set value directly on select in initial render

      <span slot="extended-supporting-text"><GdsSelect label="Select">

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do  <select value={value} onChange={handleChange}>

        eiusmod tempor incididunt ut labore et dolore magna aliqua.    <option value="1">Option 1</option>

      </span>  </select>

      <IconRocket slot="lead" /></GdsSelect>

      <select>```

        <option value="">First option</option>

        <optgroup label="Propulsion">### Event Listeners

          <option value="ion-thrusters">Ion Thrusters</option>

          <option value="chemical-rockets">Chemical Rockets</option>Event listeners should be added to the native `<select>` element within the `GdsSelect`, as the select is cloned into the Shadow DOM.

        </optgroup>

      </select>### Accessibility

    </GdsSelect>

  </GdsFlex>- Always provide a `label` prop for screen readers

</GdsTheme>- Use `required` prop to communicate required fields

```- Use `error-message` prop for validation feedback

- The component leverages native select accessibility features

### Small Size

## Examples from the Application

Use `size="small"` for compact layouts:

### Country Selection

```tsx

import { GdsSelect, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'```tsx

import { IconBank } from '@sebgroup/green-core/react'<Controller

  name="country"

<GdsTheme>  control={control}

  <GdsFlex>  rules={{ required: 'Country is required' }}

    <GdsSelect size="small" label="Label text" supporting-text="Supporting text">  render={({ field, fieldState }) => (

      <span slot="extended-supporting-text">    <GdsSelect

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do      label="Country *"

        eiusmod tempor incididunt ut labore et dolore magna aliqua.      supporting-text="Select your country of residence"

      </span>      invalid={!!fieldState.error}

      <IconBank slot="lead" />      error-message={fieldState.error?.message}

      <select>    >

        <optgroup label="International">      <select

          <option value="nasa">NASA</option>        value={field.value}

          <option value="esa">ESA</option>        onChange={field.onChange}

        </optgroup>        onBlur={field.onBlur}

        <optgroup label="National">      >

          <option value="isro">ISRO</option>        <option value="">Select a country</option>

          <option value="cnsa">CNSA</option>        <option value="Sweden">Sweden</option>

        </optgroup>        <option value="Norway">Norway</option>

      </select>        <option value="Denmark">Denmark</option>

    </GdsSelect>        <option value="Finland">Finland</option>

  </GdsFlex>        <option value="United States">United States</option>

</GdsTheme>        <option value="United Kingdom">United Kingdom</option>

```      </select>

    </GdsSelect>

### Controlled Component  )}

/>

```tsx```

import { GdsSelect, GdsTheme } from '@sebgroup/green-core/react'

import { IconBooks } from '@sebgroup/green-core/react'### Property Status

import { useState } from 'react'

```tsx

function ControlledSelect() {<Controller

  const [value, setValue] = useState('')  name="propertyStatus"

  control={control}

  const handleChange = (e: CustomEvent<{ value: string }>) => {  rules={{ required: 'Property status is required' }}

    setValue(e.detail.value)  render={({ field, fieldState }) => (

    console.log('Selected value:', e.detail.value)    <GdsSelect

  }      label="Property Status *"

      invalid={!!fieldState.error}

  return (      error-message={fieldState.error?.message}

    <GdsTheme>    >

      <GdsSelect       <select

        label="Choose a course"         value={field.value}

        value={value}        onChange={field.onChange}

        onChange={handleChange}        onBlur={field.onBlur}

      >      >

        <IconBooks slot="lead" />        <option value="Owned">Owned</option>

        <select>        <option value="Rented">Rented</option>

          <option value="">Select a value</option>        <option value="Living with family">Living with family</option>

          <option value="physics">Physics</option>        <option value="Other">Other</option>

          <option value="chemistry">Chemistry</option>      </select>

          <option value="biology">Biology</option>    </GdsSelect>

        </select>  )}

      </GdsSelect>/>

      <p>Selected: {value}</p>```

    </GdsTheme>

  )## Browser Support

}

```GdsSelect leverages native select elements, providing excellent cross-browser support and native mobile experience.



### With Form Validation## Related Components



```tsx- `GdsInput` - For text input fields

import { GdsSelect, GdsTheme, GdsButton, GdsFlex } from '@sebgroup/green-core/react'- `GdsTextarea` - For multi-line text input

import { IconBooks } from '@sebgroup/green-core/react'- `GdsCheckbox` - For boolean selections

import { useState } from 'react'- `GdsRadioGroup` - For single selection from visible options

- `GdsDropdown` - For custom dropdown behavior (not form controls)

function FormWithValidation() {

  const [isInvalid, setIsInvalid] = useState(false)## References

  const [value, setValue] = useState('')

- [Green Core Documentation](https://developer.sebgroup.com/green-core/)

  const handleSubmit = (e: React.FormEvent) => {- [Web Components Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)

    e.preventDefault()- [Native Select Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)

    if (!value) {
      setIsInvalid(true)
    } else {
      setIsInvalid(false)
      console.log('Form submitted with:', value)
    }
  }

  const handleChange = (e: CustomEvent<{ value: string }>) => {
    setValue(e.detail.value)
    setIsInvalid(false)
  }

  return (
    <GdsTheme>
      <form onSubmit={handleSubmit}>
        <GdsFlex flex-direction="column" gap="m">
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
        </GdsFlex>
      </form>
    </GdsTheme>
  )
}
```

### Plain Mode (Minimal UI)

Use `plain` to hide header and footer while keeping accessibility:

```tsx
import { GdsSelect, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsSelect plain label="Course selection">
    <select>
      <option value="">Select a value</option>
      <option value="physics">Physics</option>
      <option value="chemistry">Chemistry</option>
      <option value="biology">Biology</option>
    </select>
  </GdsSelect>
</GdsTheme>
```

## Overview

`GdsSelect` is a thin wrapper around the native HTML `<select>` element that provides consistent styling, integration with Green Core tokens, and improved form integration while preserving native browser accessibility and mobile behavior.

## Dropdown vs Select

- Dropdown: a highly customizable overlay control suitable for single or multiple selection, complex item layouts, combobox behavior, and advanced filtering. Use `GdsDropdown` when you need custom UI or multi-select.
- Select: a native `<select>` wrapper best suited for single-choice lists where native semantics, form association, and mobile behavior are desired. Use `GdsSelect` when you want the predictable native behavior and accessibility of the browser-provided select.

## Usage

- Use `GdsSelect` for single-value selections where native keyboard behavior, form submission, and mobile pickers improve the user experience.
- Do not use `GdsSelect` when you need complex option content (rich media, interactive controls), multi-select UX, or custom filtering — prefer `GdsDropdown` in those cases.

## Option list

- `GdsSelect` requires a native `<select>` element with `<option>` and optional `<optgroup>` children inside its default slot. This is necessary because form controls and browser pickers work with native select semantics and cannot be emulated across Shadow DOM boundaries.
- Browser rendering of the option list is platform dependent (especially on mobile). Rely on native behavior for scrolling, grouping, and pickers.

## Accessibility

- Always provide a visible `label` for the select. `GdsSelect` exposes a `label` attribute for this purpose and will render the accessible label for the field.
- Use `supporting-text` and `extended-supporting-text` to provide additional instructions or clarifications.
- Validation: set `required` and use validators; expose `invalid` / `error-message` so assistive technologies are informed of errors. Connect the error message via `aria-describedby` when needed (the component handles this by default when using `error-message`).
- Multi-select caution: while `multiple` may be supported, native multi-select UX is not always optimal on mobile. Prefer custom multi-select implementations when the UX warrants it.

## Keyboard interaction

- Native select keyboard behavior is preserved: Up/Down to change option, Home/End to jump, type-to-search where supported, and Enter/Space to open or activate depending on platform.

## Do's and Don'ts

Do
- Use `GdsSelect` to leverage native select behavior, especially for better mobile pickers and built-in browser accessibility.
- Use `label` and `supporting-text` to make purpose and constraints clear.

Don't
- Don't use `GdsSelect` when you need highly customized dropdown appearance or complex option content — use `GdsDropdown` instead.
- Don't rely on `GdsSelect` for multi-select experiences on mobile without testing the UX.

## Example (React, correct pattern)

This example shows the correct pattern: `GdsSelect` wrapping a native `<select>` element with `<option>` children.

```tsx
import { GdsSelect, GdsTheme } from '@sebgroup/green-core/react'

function CountrySelector() {
  return (
    <GdsTheme>
      <GdsSelect label="Country" supporting-text="Select your country">
        <select>
          <option value="">Choose a country</option>
          <optgroup label="Nordics">
            <option value="se">Sweden</option>
            <option value="no">Norway</option>
            <option value="dk">Denmark</option>
          </optgroup>
          <optgroup label="Europe">
            <option value="de">Germany</option>
            <option value="fr">France</option>
          </optgroup>
        </select>
      </GdsSelect>
    </GdsTheme>
  )
}
```

## TypeScript

```typescript
import type { GdsSelectProps } from '@sebgroup/green-core/react'

interface GdsSelectProps {
  // Attributes
  label?: string
  value?: string | string[]
  size?: 'large' | 'small'
  plain?: boolean
  required?: boolean
  invalid?: boolean
  disabled?: boolean
  'supporting-text'?: string
  'show-extended-supporting-text'?: boolean
  'aria-invalid'?: boolean
  'error-message'?: string
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
  onChange?: (event: CustomEvent<{ value: string }>) => void
  onInput?: (event: CustomEvent<{ value: string }>) => void

  // Children/Slots
  children?: React.ReactNode
}

// Usage example
const selectProps: GdsSelectProps = {
  label: 'Course Selection',
  required: true,
  size: 'large',
  onChange: (e) => console.log('Selected:', e.detail.value)
}
```

## Best Practices

### Native Select Requirements

1. **Wrap Native Select**: Always wrap a complete native `<select>` element with its options:
   ```tsx
   // ✅ Correct
   <GdsSelect>
     <select>
       <option value="a">Option A</option>
       <option value="b">Option B</option>
     </select>
   </GdsSelect>

   // ❌ Incorrect - options cannot be in default slot
   <GdsSelect>
     <option value="a">Option A</option>
     <option value="b">Option B</option>
   </GdsSelect>
   ```

2. **Shadow DOM Limitation**: Due to Shadow DOM encapsulation, the native select must be wrapped completely. Elements cannot be associated across Shadow DOM boundaries.

3. **Event Listeners**: Add event listeners only on the `<GdsSelect>` host element, not on the wrapped `<select>`:
   ```tsx
   // ✅ Correct
   <GdsSelect onChange={handleChange}>
     <select>...</select>
   </GdsSelect>

   // ❌ Incorrect - won't work as expected
   <GdsSelect>
     <select onChange={handleChange}>...</select>
   </GdsSelect>
   ```

4. **State Management**: Handle state through the `<GdsSelect>` host element using the `value` prop:
   ```tsx
   // ✅ Correct
   <GdsSelect value={selectedValue}>
     <select>...</select>
   </GdsSelect>

   // ❌ Incorrect - won't work as expected
   <GdsSelect>
     <select value={selectedValue}>...</select>
   </GdsSelect>
   ```

### Accessibility

1. **Always Provide Label**: Even when using `plain` mode, always set the `label` attribute:
   ```tsx
   <GdsSelect plain label="Course selection">
     <select>...</select>
   </GdsSelect>
   ```

2. **Required Fields**: Use the `required` attribute to communicate to assistive technology:
   ```tsx
   <GdsSelect required label="Required field">
     <select>...</select>
   </GdsSelect>
   ```

3. **Error Messages**: Provide clear error messages for validation:
   ```tsx
   <GdsSelect 
     invalid 
     error-message="Please select a valid option"
     label="Course"
   >
     <select>...</select>
   </GdsSelect>
   ```

4. **Supporting Text**: Use supporting text to provide context:
   ```tsx
   <GdsSelect 
     label="Course" 
     supporting-text="Select your area of study"
   >
     <select>...</select>
   </GdsSelect>
   ```

### Form Integration

1. **Form Association**: GdsSelect automatically participates in form submission via the `formAssociated` property

2. **Validation**: Use native HTML5 validation or the `validator` property for custom validation

3. **Required Validation**: Combine `required` with empty default option:
   ```tsx
   <GdsSelect required>
     <select>
       <option value="">Select a value</option>
       <option value="a">Option A</option>
     </select>
   </GdsSelect>
   ```

### When to Use vs GdsDropdown

**Use GdsSelect when:**
- Native accessibility is critical
- Mobile usability is a priority
- Simple single-select is needed
- Native browser behavior is acceptable
- Form submission with native validation

**Use GdsDropdown when:**
- Custom styling is required
- Multi-select with better UX is needed
- Search/filter functionality is required
- Complex content (icons, descriptions) in options
- Custom dropdown behavior

### Performance

1. **Icon Loading**: Import only the icons you need:
   ```tsx
   // Good: Named imports
   import { IconBooks, IconRocket } from '@sebgroup/green-core/react'
   ```

2. **Large Option Lists**: For very large lists (100+ options), consider using GdsDropdown with search functionality

3. **Controlled Components**: Use controlled state only when necessary for performance

### Layout Integration

1. **Flex Layouts**: Use style expression properties for flex positioning:
   ```tsx
   <GdsSelect flex="1" margin="s">
     <select>...</select>
   </GdsSelect>
   ```

2. **Grid Layouts**: Use grid placement properties:
   ```tsx
   <GdsSelect grid-column="1 / 3" align-self="start">
     <select>...</select>
   </GdsSelect>
   ```

3. **Responsive Width**: Control width with style expressions:
   ```tsx
   <GdsSelect width="100%" max-width="400px">
     <select>...</select>
   </GdsSelect>
   ```

## Common Use Cases

### Form with Multiple Selects

```tsx
import { GdsSelect, GdsTheme, GdsFlex, GdsButton } from '@sebgroup/green-core/react'
import { IconBooks, IconBank, IconRocket } from '@sebgroup/green-core/react'

function RegistrationForm() {
  return (
    <GdsTheme>
      <GdsFlex flex-direction="column" gap="m">
        <GdsSelect label="Department" required>
          <IconBank slot="lead" />
          <select>
            <option value="">Select department</option>
            <option value="science">Science</option>
            <option value="engineering">Engineering</option>
            <option value="arts">Arts</option>
          </select>
        </GdsSelect>

        <GdsSelect label="Course" required>
          <IconBooks slot="lead" />
          <select>
            <option value="">Select course</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </GdsSelect>

        <GdsSelect label="Level" required>
          <IconRocket slot="lead" />
          <select>
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </GdsSelect>

        <GdsButton type="submit">Register</GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Cascading Selects

```tsx
import { GdsSelect, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'
import { IconSquareGridCircle } from '@sebgroup/green-core/react'
import { useState } from 'react'

function CascadingSelects() {
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')

  const subcategories = {
    physics: ['Quantum Mechanics', 'Relativity'],
    chemistry: ['Organic Chemistry', 'Inorganic Chemistry'],
    biology: ['Genetics', 'Microbiology']
  }

  return (
    <GdsTheme>
      <GdsFlex flex-direction="column" gap="m">
        <GdsSelect 
          label="Category" 
          value={category}
          onChange={(e) => {
            setCategory(e.detail.value)
            setSubcategory('')
          }}
        >
          <IconSquareGridCircle slot="lead" />
          <select>
            <option value="">Select category</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
          </select>
        </GdsSelect>

        <GdsSelect 
          label="Subcategory" 
          disabled={!category}
          value={subcategory}
          onChange={(e) => setSubcategory(e.detail.value)}
        >
          <select>
            <option value="">Select subcategory</option>
            {category && subcategories[category as keyof typeof subcategories]?.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </GdsSelect>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Grouped Options with Icons

```tsx
import { GdsSelect, GdsTheme } from '@sebgroup/green-core/react'
import { IconSquareGridCircle } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsSelect 
    label="Space Agencies" 
    supporting-text="Select an agency"
  >
    <IconSquareGridCircle slot="lead" />
    <select>
      <option value="">Select an agency</option>
      <optgroup label="International">
        <option value="nasa">NASA - National Aeronautics and Space Administration</option>
        <option value="esa">ESA - European Space Agency</option>
      </optgroup>
      <optgroup label="National">
        <option value="isro">ISRO - Indian Space Research Organisation</option>
        <option value="cnsa">CNSA - China National Space Administration</option>
        <option value="jaxa">JAXA - Japan Aerospace Exploration Agency</option>
      </optgroup>
    </select>
  </GdsSelect>
</GdsTheme>
```

## Related Components

- [GdsDropdown](./GdsDropdown.md) — Custom dropdown with search and multi-select
- [GdsInput](./GdsInput.md) — Text input component
- [GdsButton](./GdsButton.md) — Button component for form actions
- [GdsFlex](./GdsFlex.md) — Layout for form controls
- [GdsGrid](./GdsGrid.md) — Grid layout for forms
- [GdsTheme](./GdsTheme.md) — Theme context for styling
- [Icons](./Icons.md) — Available icons for lead slot
- [Code Splitting](./CodeSplitting.md) — Using pure imports for tree-shaking and reduced bundle size

## Notes

- **Native Wrapper**: GdsSelect is a wrapper for native `<select>` element, not a custom dropdown
- **Shadow DOM**: The wrapped select element is cloned into Shadow DOM
- **Event Listeners**: Add listeners on the host `<GdsSelect>`, not the wrapped `<select>`
- **State Management**: Handle state through the host `value` prop, not the select's value
- **Mobile Optimized**: Native select provides better mobile UX than custom dropdowns
- **Accessibility**: Maintains all native accessibility features
- **Form Associated**: Automatically participates in form submission
- **Option Groups**: Supports `<optgroup>` for organizing options
- **Multi-Select**: While supported via native select's `multiple` attribute, consider GdsDropdown for better multi-select UX
- **Size Variants**: Supports `large` (default) and `small` sizes
- **Validation**: Supports both native HTML5 validation and custom validators
- **Extended Info**: Use `extended-supporting-text` slot for detailed help text
- **Plain Mode**: Hides UI chrome while maintaining accessibility with `plain` attribute

---

*Last updated: November 12, 2025*  
*Source: [GdsSelect Storybook Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-select--docs)*
