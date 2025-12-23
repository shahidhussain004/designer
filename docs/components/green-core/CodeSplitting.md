# Code Splitting

This document describes how to build and use components in a tree-shakable way to optimize bundle size.

## Dead Code Elimination

Dead code elimination works by statically analyzing the code in the application, and figuring out which code paths are actually being called, and then removing the stuff that is never reached.

This kind of elimination can only be done for code that is free of side-effects. If there are side-effects, such as setting a cookie or writing to localStorage, the code cannot be eliminated, because the analyzer doesn't know what else relies on the side-effect. The same thing is true when a web component is defined in the browser's CustomElementRegistry.

To get around this, Green Core exports both side-effect components that are defined automatically on import, and pure components that need to be manually defined.

## Importing Components

### Side-Effect Imports (Non-Tree-Shakable)

Currently, side-effect exports are exposed through the package root:

```javascript
import { GdsDropdown } from '@sebgroup/green-core'
```

This imports all components in a non-tree-shakable way, meaning that even unused components will be included in the final bundle.

### Pure Imports (Tree-Shakable)

The pure components are exposed through a sub-path:

```javascript
import { GdsDropdown } from '@sebgroup/green-core/pure'

GdsDropdown.define()
```

This will import only `GdsDropdown`, allowing for tree-shaking and reducing the final bundle size.

> **Note:** In a future major release, pure components are likely to become the default export.

## Library Coding Guidelines

### File Structure

The file structure of a component should look roughly something like this:

```
my-component/
  index.ts
  my-component.ts
  my-component.component.ts
  my-component.styles.ts
  my-component.test.ts
```

The important parts here are the `my-component.ts` and the `my-component.component.ts`.

### Implementation Pattern

The actual implementation of the component should be in `my-component.component.ts`, while `my-component.ts` should import the component, call `MyComponent.define()` and then re-export.

**Example from `dropdown.ts`:**

```typescript
import { GdsDropdown } from './dropdown.component'

GdsDropdown.define()

export { GdsDropdown }
```

This way, the side-effect of defining the component is contained within the `my-component.ts` file, keeping the `.component.ts` file pure.

## Sub-Dependencies

You should never rely on the consumer to import some vital dependency on their end. If component A relies on component B for its internal structure, then component A needs to import component B.

Also in cases where you know that a component needs to be used with a particular child-component, it makes sense for the parent component to import that child component.

### Example: Dropdown with Options

Here's some consumer code using a `gds-dropdown`:

**JavaScript:**

```javascript
import { GdsDropdown } from '@sebgroup/green-core/pure'
GdsDropdown.define()
```

**HTML:**

```html
<gds-dropdown label="Select something">
  <gds-option value="first">First choice</gds-option>
  <gds-option value="second">Second choice</gds-option>
</gds-dropdown>
```

Notice that the consumer needs two components here: `gds-dropdown` and `gds-option`. Therefore, `gds-dropdown` should also import `gds-option`, because from the consumer's perspective, it would be unexpected to need to import it separately.

### Type Forwarding

In case a consumer also needs the types for these components, it can be helpful to forward them in the `index.ts`:

**`index.ts` for `gds-dropdown`:**

```typescript
export * from './dropdown'
export * from '../../primitives/listbox/option'
```

### Dependency Registration

Internally, the dropdown also uses other components, such as `gds-popover` and `gds-listbox`. These are also imported by the component.

All dependencies should be registered in the `gdsCustomElement` decorator. This ensures that all of them are defined in the CustomElementRegistry when the dependent is defined.

**For `gds-dropdown`, it looks like this:**

```typescript
@gdsCustomElement('gds-dropdown', {
  dependsOn: [
    GdsFormControlHeader,
    GdsFormControlFooter,
    GdsFieldBase,
    GdsListbox,
    GdsPopover,
    IconCheckmark,
    IconChevronBottom,
  ],
})
```

## Benefits of Pure Components

1. **Reduced Bundle Size**: Only components actually used are included in the final bundle
2. **Better Performance**: Smaller bundles mean faster load times
3. **Explicit Control**: Developers have full control over which components are registered
4. **Lazy Loading**: Components can be loaded on-demand when needed

## Migration Strategy

When migrating from side-effect imports to pure imports:

1. Replace root imports with pure sub-path imports
2. Add explicit `.define()` calls for each component
3. Ensure all component dependencies are properly declared
4. Test that all components are properly registered before use

## Related Documentation

- [Custom Element Scoping](./CustomElementScoping.md) - Understanding component registration and scoping
- [Green Design System Architecture](./GreenDesignSystemArchitecture.md) - Overall system design and boundaries
- [Tokens](./Tokens.md) - Design token usage across components
- [Code Conventions](./CodeConventions.md) - Coding standards for developing tree-shakable components
