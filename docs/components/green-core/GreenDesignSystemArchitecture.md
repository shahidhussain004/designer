# Green Design System Architecture Reference

## Overview

Green Core is the foundation of the Green Design System, providing a robust architecture built on Web Components that supports both React and Angular implementations for application development.

## System Architecture

### High-Level Structure

The Green architecture follows a hierarchical composition pattern with clear boundaries between public and internal APIs:

```
Design Tokens
    ↓
┌─────────────── Green Core ───────────────┐
│                                           │
│  Markup ──────┐                          │
│               ↓                           │
│       Atomic Primitives ←── Styles       │
│               ↓                           │
│          Composition                      │
│               ↓                           │
│      Compound Primitives                 │
│                                           │
└───────────────────────────────────────────┘
              ↓
    ───── Public API Boundary ─────
              ↓
        Web Components
              ↓
    ┌─────────┬─────────┬─────────┐
    ↓         ↓         ↓         ↓
 Angular  Direct   React
         Consumption
```

## Core Components

### 1. Design Tokens

- **Purpose**: Global design variables (colors, spacing, typography, etc.)
- **Scope**: Applied across all levels of the system
- **Usage**: Foundation for consistent styling throughout the design system

### 2. Green Core

The internal architecture consisting of:

#### Markup

- Semantic HTML structure
- Accessibility-first approach
- Feeds into atomic primitives

#### Styles

- CSS styling definitions
- Applied to atomic primitives
- Token-based styling system

#### Atomic Primitives

- Smallest building blocks of the system
- Combine markup and styles
- Internal components not exposed to consumers
- Examples: buttons, inputs, labels, icons

#### Composition

- Process of combining atomic primitives
- Creates more complex structures
- Internal orchestration layer

#### Compound Primitives

- Higher-level components built from atomic primitives
- Still internal to the framework
- Complex, reusable UI patterns

## Public API Boundary

### What It Means

The Public API Boundary represents a critical separation point in the architecture:

**Above the boundary (Internal):**

- Atomic Primitives
- Compound Primitives
- Composition logic
- Internal implementation details

**Below the boundary (Public):**

- Web Components
- Framework-specific implementations (Angular, React)
- Public-facing APIs

### Key Principles

**✓ Consumers Should Use:**

- Complete Web Components
- Framework-specific wrappers (Angular/React components)
- Documented public APIs

**✗ Consumers Should Not Use:**

- Atomic primitives directly
- Compound primitives
- Internal composition utilities
- Any undocumented components or APIs

## Versioning & Stability

### Semantic Versioning Guarantee

**Public API**: Full semantic versioning support

- **Major version**: Breaking changes
- **Minor version**: New features, backward compatible
- **Patch version**: Bug fixes

**Internal Components**: No versioning guarantee

- May change without notice
- No backward compatibility promised
- Breaking changes can occur in any release

### Best Practices

1. Always consume through the public API (Web Components level)
2. Never import or use components marked as "internal" or "primitives"
3. Stay updated with release notes for public API changes
4. Test thoroughly when upgrading versions
5. Use pure component imports from `/pure` sub-path for tree-shaking and reduced bundle sizes

## Consumption Patterns

### 1. Angular Integration

- Angular-wrapped Web Components
- Full Angular lifecycle support
- Consistent with Angular patterns and conventions

### 2. React Integration

- React-wrapped Web Components
- Hooks and React patterns supported
- Type-safe implementations

### 3. Direct Consumption

- Use Web Components directly in vanilla JavaScript
- Framework-agnostic approach
- Maximum flexibility for custom implementations

## Design & Development Notes

### Cross-Level Application

While design tokens, markup, and styles can technically be used at all composition levels, the architecture diagram simplifies this by showing them only at the top level.

**In practice:**

- Tokens cascade through all levels
- Styles can be applied at any component level
- Markup patterns are reused throughout

### Composition Hierarchy

Each level builds upon the previous:

1. Tokens define design constants
2. Markup + Styles create atomic elements
3. Atomic Primitives combine into meaningful units
4. Compound Primitives create complex components
5. Web Components expose finished, public-facing components

## Quick Reference

| Layer | Public/Internal | Can Consumers Use? | Versioning |
|-------|----------------|-------------------|------------|
| Design Tokens | Public | ✓ Yes | Semantic |
| Markup | Internal | ✗ No | None |
| Styles | Internal | ✗ No | None |
| Atomic Primitives | Internal | ✗ No | None |
| Compound Primitives | Internal | ✗ No | None |
| **Web Components** | **Public** | **✓ Yes** | **Semantic** |
| Angular/React/Direct | Public | ✓ Yes | Semantic |

## Summary

The Green Design System architecture provides a clear separation between internal implementation details and public-facing APIs. By respecting the Public API Boundary and only consuming Web Components and their framework wrappers, developers ensure stable, maintainable applications that won't break with internal framework changes.

**Remember**: If it's below the Public API Boundary, it's safe to use. If it's above, it's internal—hands off!

## Related Documentation

- **[Green Core README](./README.md)** — Component index and overview
- **[Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md)** — Comprehensive guide to style expression properties, responsive patterns, and why we avoid utility classes
- **[Localization](./Localization.md)** — Localization initialization, usage, and extension points for Green Core components
- **[GdsTheme](./GdsTheme.md)** — Theme provider for design tokens
- **[Custom Element Scoping](./CustomElementScoping.md)** — Scoping mechanism to avoid collisions in micro-frontends
- **[Tokens](./Tokens.md)** — Token collections, usage, and examples (colors, spacing, typography)
- **[Colors](./Colors.md)** — Complete color palette, usage guidelines, and token reference
- **[Spacing](./Spacing.md)** — Spacing system, 4px grid, and layout guidelines
- **[Radius](./Radius.md)** — Corner radius tokens and roundness scale
- **[Typography](./Typography.md)** — Typography system, type scale, and text hierarchy
- **[Shadows](./Shadows.md)** — Elevation and shadow token reference
- **[Viewport](./Viewport.md)** — Responsive breakpoint tokens and guidance
- **[Motion](./Motion.md)** — Motion tokens and transition guidelines
- **[Accessibility](./Accessibility.md)** — Accessibility principles and checklist
- **[GdsDiv](./GdsDiv.md)** — Base layout component with all style expression properties
- **[Transitional Styles](./TransitionalStyles.md)** — Mechanism to enable 2016 styles during migration to 2023
- **[Code Splitting](./CodeSplitting.md)** — Tree-shakable components and bundle optimization
- **[Code Conventions](./CodeConventions.md)** — Coding standards, naming conventions, and development best practices
- **[GdsGrid](./GdsGrid.md)** — Grid layout component
- **[GdsFlex](./GdsFlex.md)** — Flexbox layout component
- **All Component Docs** — See individual component pages for public API details
