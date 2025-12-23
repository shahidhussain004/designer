# Localization

Green Core has built-in localization for English (default) and Swedish. This affects the built-in copy of the components. For the rest of the copy in your application, you need to handle the localization separately. The localization in Green Core is based on the `@lit/localize` library.

## Initialization

To use the localization features, import and call `gdsInitLocalization` from Green Core:

```ts
import { gdsInitLocalization } from '@sebgroup/green-core/localization'
const { setLocale } = gdsInitLocalization()
```

The current language can be set by calling the returned `setLocale` function:

```ts
setLocale('sv')
```

This can be called at any time, and it will cause all Green Core components on the page to re-render with the correct locale.

> **Important**: `gdsInitLocalization()` can only be called once per page load. Create a singleton (e.g., an Angular service or a React `useEffect`) to ensure you only initialize once. Calling it a second time will throw an error.

## Listing available locales

You can get a list of all available target locales by importing `targetLocales` from `@sebgroup/green-core/localization`:

```ts
import { targetLocales } from '@sebgroup/green-core/localization'
console.log(targetLocales) // ['sv'] (does not include the source locale 'en')
```

Note: The list does not include the source locale (English). Since Green Core currently supports English and Swedish, `targetLocales` will contain `['sv']`.

## Adding additional locales

If you need additional locales, Green supports extra locales and templates when calling `gdsInitLocalization`:

```ts
const { setLocale, getLocale } = gdsInitLocalization({
  extraLocales,
  extraTemplates,
})
```

- `extraLocales` is an array of locale ids (e.g., `['es', 'fr']`).
- `extraTemplates` is a `Map` keyed by locale id with `@lit/localize` templates as values. Templates can be generated using the `lit-localize` CLI. See the Lit docs for more details.

## Why `@lit/localize`?

`@lit/localize` integrates naturally with Green Core's use of `lit-html` for the web components' internal templates. Localization is often tightly coupled to the template engine, and providing a framework-agnostic solution for every possible consumer-side requirement is impractical.

The recommended mental model:

- Set up localization as you normally would in your application (CMS, backend, or a framework-specific solution).
- When your application updates its locale, also call `setLocale` from Green Core to keep components in sync.

## Example usage (React)

```tsx
// singleton pattern
import { useEffect } from 'react'
import { gdsInitLocalization } from '@sebgroup/green-core/localization'

export function useGdsLocalization() {
  useEffect(() => {
    const { setLocale } = gdsInitLocalization()
    return () => {
      // no-op: gdsInitLocalization should only be called once per page
    }
  }, [])
}

// In your app root
useGdsLocalization()
```

## Edge cases & customization

- If you need a custom translation for a specific locale, supply `extraLocales` and `extraTemplates` when initializing.
- Reach out to the Green Core maintainers if you require new built-in locales — the team can add translations to the main library.

## Related docs

- [Green Design System Architecture](./GreenDesignSystemArchitecture.md)
- [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md)
- [GdsTheme](./GdsTheme.md)
