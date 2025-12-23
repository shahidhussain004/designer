# Transitional Styles

Transitional Styles is a temporary mechanism to facilitate the migration from the 2016 design version to the 2023 design version.

## How it works

Core components use the 2023 design by default. Transitional Styles provide alternate 2016 styles that can be registered and applied at runtime. The main entry points are:

- `register()` — registers transitional styles for a specific component
- `registerTransitionalStyles()` — registers transitional styles for all components (global; prevents tree-shaking)

### Example

```js
// Import and apply 2016 design to buttons only
import * as ButtonStyles from '@sebgroup/green-core/components/button/button.trans.styles.js'
ButtonStyles.register()
```

### Granular control

Once transitional styles are registered for a component, they apply to all instances of that component in the document. To opt specific areas back into 2023 design, wrap them in `gds-theme` with `design-version="2023"`:

```html
<gds-theme design-version="2023">
  <gds-button>Button with 2023 style</gds-button>
</gds-theme>
```

If the document does not include Chlorophyll variables required by the 2016 styles, you may need to wrap the area in `gds-theme` and register transitional styles for `gds-theme` itself.

## Info for library developers

To support Transitional Styles in a component:

1. Create `component-name.trans.styles.ts` and `component-name.trans.styles.scss` in the component directory. The SCSS file can import Chlorophyll variables via relative paths.
2. The `.ts` module should import its SCSS and any `register()` functions of sub-components, and export a `register()` function that:
   - registers the component styles with the `TransitionalStyles` singleton
   - calls `register()` on required sub-components
3. Update `transitional-styles.ts` (the global module) to import the component's `.ts` module and ensure `registerTransitionalStyles()` calls the component `register()` function.
4. In the component's `connectedCallback()` call `TransitionalStyles.instance.apply(this, 'component-name')` to allow runtime replacement of the constructed stylesheet.

### Tree-shaking and granular imports

To keep transitional styles tree-shakable, consumers should import `register()` only for the components they need. Each component must propagate `register()` calls to its sub-components and primitives so consumers don't need to manually register dependencies.

Calling `registerTransitionalStyles()` will register everything and prevent tree-shaking, so avoid it unless you truly need all transitional styles.

### Implementation notes

- Use a `TransitionalStyles` singleton to track registered component styles.
- Each component's `register()` function can be idempotent; multiple calls are tolerated.
- Provide a helper `registerTransitionalStyles()` for quick global registration (use carefully).

## Related docs

- [GdsTheme](./GdsTheme.md)
- [Green Design System Architecture](./GreenDesignSystemArchitecture.md)
- [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md)
