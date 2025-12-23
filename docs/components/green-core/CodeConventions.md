# Code Conventions for Green Core

This document outlines the coding standards and conventions used when developing Green Core components.

## Naming Conventions

### File Names

File names should always be written in **kebab-case**, and should reflect the name of the component or feature that the file contains.

**Example:**
```
gds-button.ts
gds-dropdown.ts
gds-form-control.ts
```

### Prefix Names

Names should be prefixed with `Gds` to indicate that they are part of the Green Component library. This is to avoid naming conflicts with other libraries or custom code.

### Class Names

Class names should be written in **PascalCase**, and should reflect the name of the component or feature that the class represents.

**Example:**
```typescript
class GdsButton extends GdsElement { ... }
class GdsDropdown extends GdsElement { ... }
class GdsFormControl extends GdsElement { ... }
```

### Custom Element Names

Custom element names should be written in **kebab-case**, and should reflect the name of the component that the class represents.

**Example:**
```typescript
@gdsCustomElement('gds-button')
class GdsButton extends GdsElement { ... }
```

## Component Architecture

### Always Extend GdsElement

All components in Green Core should extend the `GdsElement` base class. Among some other minor things, this class adds the standard `gds-element` attribute to all components.

**Example:**
```typescript
import { GdsElement } from '../../gds-element'

@gdsCustomElement('gds-my-component')
class GdsMyComponent extends GdsElement {
  // Component implementation
}
```

Check the `GdsElement` source code for more details on what it provides.

### Form Controls

Form control components should extend the `GdsFormControlElement` abstract class. This ensures that the component gets set up as a native form control, and has all the expected attributes and methods.

**Example:**
```typescript
import { GdsFormControlElement } from '../../utils/form-control'

@gdsCustomElement('gds-input')
class GdsInput extends GdsFormControlElement {
  // Form control implementation
}
```

## Events

### Standard Events

Aim to use standard events when applicable. For example, a form control should dispatch a standard `input` event when the value is updated.

### Custom Events

In cases where you need to use a custom event, name it `gds-[custom-event-name]`.

### Event Dispatch Helpers

The `GdsElement` base class has event dispatch helper methods that should be used for all event dispatching. The helpers will automatically emit a CamelCased version of the event, so that it can be used in React and other frameworks that use CamelCase for event names.

**Example:**
```typescript
// Dispatching 'gds-ui-state' will also emit 'GdsUiState'
this.dispatchEvent(new CustomEvent('gds-ui-state', { detail: { ... } }))

// In React:
<GdsMyComponent onGdsUiState={(e) => console.log(e.detail)} />
```

## Private Properties and Methods

### ES2022 Private Identifier Syntax

Private properties and functions should use the ES2022 **private identifier (`#`)** syntax. This ensures that the field is private at both compile-time and run-time.

**Example:**
```typescript
class GdsButton extends GdsElement {
  #internalState = false
  
  #calculateSomething() {
    return this.#internalState ? 'yes' : 'no'
  }
}
```

### Why Use `#` Syntax?

There are a few common arguments against using private identifiers, such as added overhead when targeting older JS versions, but in this case the added protection against incorrect use of internal API is worth it. Remember that this is a Web Component library and that it is perfectly valid to use it outside of TypeScript, where there's no compiler to yell at you for incorrectly using private properties.

### Fallback to TypeScript `private`

In the event that `#` cannot be used, for example together with decorators, we can fall back on the TypeScript `private` keyword. We should then also prefix the method or property with an **underscore**.

**Example:**
```typescript
class GdsButton extends GdsElement {
  @property()
  private _decoratedProperty: string
  
  private _helperMethod() {
    // Implementation
  }
}
```

The underscore helps communicate the intended visibility to non-TypeScript consumers and at runtime. This means that a component class may contain some private fields with the `#` syntax and some with the `private` keyword, which may seem confusing but is intentional.

## Code Order

The suggested order of code in a component is:

1. **Static properties**
2. **Static functions**
3. **Public properties**
4. **Private properties**
5. **Constructor**
6. **Public methods**
7. **Render function**
8. **Private methods**

**Example:**
```typescript
@gdsCustomElement('gds-example')
class GdsExample extends GdsElement {
  // 1. Static properties
  static styles = css`...`
  
  // 2. Static functions
  static createInstance() { ... }
  
  // 3. Public properties
  @property()
  label = ''
  
  @property({ type: Boolean })
  disabled = false
  
  // 4. Private properties
  #internalState = false
  
  // 5. Constructor
  constructor() {
    super()
  }
  
  // 6. Public methods
  focus() {
    this.#button?.focus()
  }
  
  // 7. Render function
  render() {
    return html`...`
  }
  
  // 8. Private methods
  #handleClick() {
    // Implementation
  }
}
```

### Terminology

- **Property**: A field that holds a value. Includes Lit reactive properties. Also commonly referred to as members.
- **Method**: Functions that can be called on an instance of the component. Arrow functions also fall under this category.
- **Render function**: The standard Lit `render()` function that all components use to render their view.

## ARIA and State Attributes

### Attribute Reflection

As a rule-of-thumb, all primitives should be responsible for setting their own `aria-` attributes. If the `aria-` attribute reflects state, then the `aria-` attribute can be a reactive prop that reflects that internal state, such as `"selected"`, `"hidden"`, etc.

State that can't be expressed as `aria-` attributes can have custom reflected attributes. Also, primitives should generally be responsible for setting their own `role` attribute.

### Future: Accessibility Object Model (AOM)

At some point in the future, when the Accessibility Object Model (AOM) has matured a bit more and gained better browser support, we might move the `aria-` attributes there instead, and set them through `ElementInternals` as the AOM spec suggests.

### Propagating ARIA

In many cases, the `aria-` attribute should apply to an inner element of the component, rather than the host.

**Example:**

Setting `aria-label` on `<gds-button>` would be incorrect, because it should really be set on the internal `<button>` element. Therefore, there should either be:

1. A part of the component API that handles it (e.g., `<gds-button>` has a `label` property that will in turn set the `aria-label` on the internal `<button>`), or
2. The component should forward (and rename) attributes prefixed with `gds-aria` to the appropriate underlying component.

## Component Responsibilities

### Consider Primitive Responsibilities

Many types of UI widgets have certain expected behaviors, such as keyboard navigation. When developing a component and breaking it down into primitives, carefully consider where the responsibility for controlling those behaviors should lie.

**Questions to ask:**
- Should the containing component manage this behavior?
- Should the primitive itself handle it?
- How is focus managed and flowing through the interface?

## Composition

Many aspects of components are shared between many components. When we come across shared features, we should work with **composition**, through:

- **Lit controllers**
- **Helper functions**
- **Class mixins**
- **Decorators**

That way we create reusable and composable building blocks.

**Example:**
```typescript
// Using a Lit controller for shared behavior
import { FocusController } from '../../controllers/focus-controller'

class GdsButton extends GdsElement {
  private focusController = new FocusController(this)
  
  // Component can now use focus management behavior
}
```

## Documentation

### JSDoc Comments

At a minimum, **all public methods and properties** should be documented using JSDoc.

**Example:**
```typescript
/**
 * A button component for triggering actions.
 * 
 * @element gds-button
 * @status stable
 */
@gdsCustomElement('gds-button')
class GdsButton extends GdsElement {
  /**
   * The variant style of the button.
   * 
   * @attr
   */
  @property()
  variant: 'primary' | 'secondary' = 'primary'
  
  /**
   * Programmatically focus the button.
   */
  focus() {
    this.#button?.focus()
  }
}
```

### Internal Documentation

In addition to the public interface, it can also be useful to have JSDoc comments for internal methods and properties. These are helpful when maintaining the library or when working on new features, as the JSDoc comments get picked up by code editors such as VS Code and displayed when hovering parts of the code.

## Component Status

### Beta or Stable

Status can be added in the main JSDoc entry for a component, by using the `@status` tag. The status can be either `stable` or `beta`.

**Example:**
```typescript
/**
 * A new experimental component.
 * 
 * @element gds-experimental
 * @status beta
 */
@gdsCustomElement('gds-experimental')
class GdsExperimental extends GdsElement { ... }
```

### Beta Component Guidelines

Newly added components should usually be marked as **Beta** until they have been fully reviewed, tested and processed in all relevant aspects.

**Important:** A component marked as Beta is **not included in the Semantic Versioning guarantees** of the rest of the system. Using a beta component means accepting the risk that breaking changes can, and will, occur even in patch releases of the framework.

## Testing

### Test Coverage

Every component that is part of the public API should have **full test coverage** of all of its features.

### Test-Driven Development

Preferably, any new components or features added to existing components should be developed using a **test-driven approach**.

### Test Infrastructure

Tests run in headless browsers using the **Modern Web test runner** together with **Playwright**.

**Example test structure:**
```typescript
import { expect, fixture, html } from '@open-wc/testing'
import { GdsButton } from './gds-button'

describe('GdsButton', () => {
  it('should render', async () => {
    const el = await fixture<GdsButton>(html`<gds-button>Click me</gds-button>`)
    expect(el).to.exist
  })
  
  it('should handle click events', async () => {
    const el = await fixture<GdsButton>(html`<gds-button>Click me</gds-button>`)
    let clicked = false
    el.addEventListener('click', () => { clicked = true })
    el.click()
    expect(clicked).to.be.true
  })
})
```

## Related Documentation

- [Code Splitting](./CodeSplitting.md) - Tree-shakable components and bundle optimization
- [Custom Element Scoping](./CustomElementScoping.md) - Component registration and scoping patterns
- [Green Design System Architecture](./GreenDesignSystemArchitecture.md) - Overall system architecture
- [Tokens](./Tokens.md) - Design token system
