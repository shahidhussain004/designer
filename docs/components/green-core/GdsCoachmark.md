# GdsCoachmark Component Documentation

## Overview

Coachmarks guide users through interface features by highlighting specific elements and providing contextual information. The coachmark follows the targeted element and automatically hides if the target is covered or out of view.

**Status**: Beta

**Key Features**:
- Targets specific elements using selectors
- Automatically positions relative to target
- Visibility management (hides when target is covered/out of view)
- Customizable placement (12 positions via Floating UI)
- Only one coachmark visible at a time
- Closes on click anywhere
- ShadowDOM support

## Important React Usage Note

⚠️ **In React, always use the JSX element imports from `@sebgroup/green-core/react`:**
- `GdsCoachmark` (React component)
- `GdsTheme` (React component)

**Never use the HTML custom elements directly:**
- ❌ `<gds-coachmark>`
- ❌ `<gds-theme>`

## Import

```tsx
import { GdsCoachmark, GdsTheme } from '@sebgroup/green-core/react'
```

## Basic Usage

### Simple Coachmark

```tsx
<GdsTheme>
  <div style={{ height: '200px' }}>
    <p>
      The coachmark will target the first element that matches the selector.
      Clicking anywhere closes the coachmark.
    </p>
    <p id="targetElement" style={{ width: '200px', background: '#ddd', padding: '1px' }}>
      Coachmark target element
    </p>
    <GdsCoachmark placement="bottom">
      This is the coachmark content.
    </GdsCoachmark>
  </div>
</GdsTheme>
```

### Targeting Specific Elements

```tsx
// Target element by ID
<button id="save-button">Save</button>

<GdsCoachmark target={['#save-button']} placement="top">
  Click here to save your changes
</GdsCoachmark>

// Target element by class
<div className="feature-button">New Feature</div>

<GdsCoachmark target={['.feature-button']} placement="right">
  Try our new feature!
</GdsCoachmark>
```

### ShadowDOM Target

```tsx
// Target element inside ShadowDOM
<GdsCoachmark 
  target={['some-component', 'shadowRoot', 'target-element']}
  placement="bottom"
>
  This targets an element within a Shadow DOM
</GdsCoachmark>
```

## Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `placement` | `Placement` | `'bottom'` | Position relative to target. Accepts Floating UI placements: `'top'`, `'bottom'`, `'left'`, `'right'`, `'top-start'`, `'top-end'`, `'bottom-start'`, `'bottom-end'`, `'left-start'`, `'left-end'`, `'right-start'`, `'right-end'` |
| `label` | `string` | `'Coachmark'` | Accessible label for the coachmark |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `target` | `string[]` | `[]` | Array of selectors to target element. For ShadowDOM: `['component', 'shadowRoot', 'element']` |
| `overlappedBy` | `string[]` | `[]` | Selectors of elements that hide coachmark when overlapping target |
| `computeVisibility` | `Function` | - | Custom visibility logic: `(self, target, computedVisibility) => boolean` |
| `targetElement` | `HTMLElement` | `undefined` | **Read-only** - The resolved targeted element |

### Events

| Event | Description |
|-------|-------------|
| `gds-ui-state` | Dispatched when the coachmark is closed |
| `gds-element-disconnected` | When element is disconnected from DOM |

### Slots

| Slot | Description |
|------|-------------|
| (default) | Content to display inside the coachmark |

## Features

### Placement Options

The coachmark supports 12 placement positions via Floating UI:

```tsx
// Primary placements
<GdsCoachmark placement="top">Top</GdsCoachmark>
<GdsCoachmark placement="bottom">Bottom</GdsCoachmark>
<GdsCoachmark placement="left">Left</GdsCoachmark>
<GdsCoachmark placement="right">Right</GdsCoachmark>

// Start-aligned placements
<GdsCoachmark placement="top-start">Top Start</GdsCoachmark>
<GdsCoachmark placement="bottom-start">Bottom Start</GdsCoachmark>
<GdsCoachmark placement="left-start">Left Start</GdsCoachmark>
<GdsCoachmark placement="right-start">Right Start</GdsCoachmark>

// End-aligned placements
<GdsCoachmark placement="top-end">Top End</GdsCoachmark>
<GdsCoachmark placement="bottom-end">Bottom End</GdsCoachmark>
<GdsCoachmark placement="left-end">Left End</GdsCoachmark>
<GdsCoachmark placement="right-end">Right End</GdsCoachmark>
```

### Automatic Visibility Management

The coachmark automatically hides when:
- Target element is out of view (scrolled away)
- Target element is covered by another element
- Target element is not rendered

```tsx
// Coachmark will hide if covered by modal or overlay
<GdsCoachmark 
  target={['#feature-button']}
  overlappedBy={['.modal', '.overlay']}
>
  Click to activate feature
</GdsCoachmark>
```

### Custom Visibility Logic

```tsx
const [isCoachmarkVisible, setIsCoachmarkVisible] = useState(true)
const coachmarkRef = useRef<any>(null)

useEffect(() => {
  if (coachmarkRef.current) {
    coachmarkRef.current.computeVisibility = (
      self: any,
      target: HTMLElement,
      computedVisibility: boolean
    ) => {
      // Custom logic: only show if user hasn't completed onboarding
      return computedVisibility && !hasCompletedOnboarding
    }
  }
}, [hasCompletedOnboarding])

<GdsCoachmark 
  ref={coachmarkRef}
  target={['#next-step']}
>
  Continue to next step
</GdsCoachmark>
```

### Event Handling

```tsx
const handleCoachmarkClose = (event: CustomEvent) => {
  console.log('Coachmark closed')
  // Track that user has seen this coachmark
  localStorage.setItem('coachmark-step-1-seen', 'true')
}

<GdsCoachmark 
  target={['#feature-button']}
  onGdsUiState={handleCoachmarkClose}
>
  Welcome! Click here to start.
</GdsCoachmark>
```

## Usage Examples

### Onboarding Flow

```tsx
import { useState, useEffect } from 'react'
import { GdsCoachmark, GdsButton, GdsTheme } from '@sebgroup/green-core/react'
import { IconArrowRight } from '@sebgroup/green-core/react'

const OnboardingFlow = () => {
  const [step, setStep] = useState(1)
  const [showCoachmark, setShowCoachmark] = useState(true)

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem('onboarding-completed')
    if (completed) setShowCoachmark(false)
  }, [])

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      setShowCoachmark(false)
      localStorage.setItem('onboarding-completed', 'true')
    }
  }

  const handleCoachmarkClose = () => {
    setShowCoachmark(false)
  }

  return (
    <GdsTheme>
      <div>
        <button id="create-button">Create New</button>
        <button id="import-button">Import Data</button>
        <button id="settings-button">Settings</button>

        {showCoachmark && step === 1 && (
          <GdsCoachmark 
            target={['#create-button']}
            placement="bottom"
            onGdsUiState={handleCoachmarkClose}
          >
            <div style={{ padding: '12px' }}>
              <p><strong>Step 1:</strong> Create your first project</p>
              <GdsButton size="small" onClick={handleNext}>
                Next
                <IconArrowRight slot="trail" />
              </GdsButton>
            </div>
          </GdsCoachmark>
        )}

        {showCoachmark && step === 2 && (
          <GdsCoachmark 
            target={['#import-button']}
            placement="bottom"
            onGdsUiState={handleCoachmarkClose}
          >
            <div style={{ padding: '12px' }}>
              <p><strong>Step 2:</strong> Import existing data</p>
              <GdsButton size="small" onClick={handleNext}>
                Next
                <IconArrowRight slot="trail" />
              </GdsButton>
            </div>
          </GdsCoachmark>
        )}

        {showCoachmark && step === 3 && (
          <GdsCoachmark 
            target={['#settings-button']}
            placement="bottom"
            onGdsUiState={handleCoachmarkClose}
          >
            <div style={{ padding: '12px' }}>
              <p><strong>Step 3:</strong> Configure your preferences</p>
              <GdsButton size="small" onClick={handleNext}>
                Finish
              </GdsButton>
            </div>
          </GdsCoachmark>
        )}
      </div>
    </GdsTheme>
  )
}
```

### Feature Highlight

```tsx
import { GdsCoachmark, GdsButton, GdsFlex } from '@sebgroup/green-core/react'
import { IconClose } from '@sebgroup/green-core/react'

const FeatureHighlight = () => {
  const [showCoachmark, setShowCoachmark] = useState(true)

  useEffect(() => {
    const seen = localStorage.getItem('feature-highlight-seen')
    if (seen) setShowCoachmark(false)
  }, [])

  const handleDismiss = () => {
    setShowCoachmark(false)
    localStorage.setItem('feature-highlight-seen', 'true')
  }

  return (
    <>
      <button id="new-feature">🎉 New Feature</button>

      {showCoachmark && (
        <GdsCoachmark 
          target={['#new-feature']}
          placement="right"
          label="New Feature Announcement"
          onGdsUiState={handleDismiss}
        >
          <GdsFlex flex-direction="column" gap="s" padding="m">
            <GdsFlex justify-content="space-between" align-items="center">
              <strong>Check out our new feature!</strong>
              <GdsButton 
                size="xs" 
                rank="tertiary" 
                label="Close"
                onClick={handleDismiss}
              >
                <IconClose />
              </GdsButton>
            </GdsFlex>
            <p>Export your data in multiple formats.</p>
            <GdsButton size="small" onClick={handleDismiss}>
              Try it now
            </GdsButton>
          </GdsFlex>
        </GdsCoachmark>
      )}
    </>
  )
}
```

### Contextual Help

```tsx
import { GdsCoachmark, GdsText } from '@sebgreen/green-core/react'

const ContextualHelp = () => {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div>
      <label htmlFor="account-number">Account Number</label>
      <GdsInput
        id="account-number"
        label="Account Number"
        type="text"
        onFocus={() => setShowHelp(true)}
        onBlur={() => setTimeout(() => setShowHelp(false), 200)}
      />

      {showHelp && (
        <GdsCoachmark 
          target={['#account-number']}
          placement="top"
          label="Account Number Help"
        >
          <GdsText tag="small" padding="s">
            Enter your 10-digit account number without dashes
          </GdsText>
        </GdsCoachmark>
      )}
    </div>
  )
}
```

### Multi-Step Tutorial

```tsx
import { GdsCoachmark, GdsButton, GdsFlex, GdsText } from '@sebgroup/green-core/react'
import { IconArrowLeft, IconArrowRight, IconClose } from '@sebgroup/green-core/react'

interface TutorialStep {
  target: string[]
  placement: 'top' | 'bottom' | 'left' | 'right'
  title: string
  content: string
}

const tutorialSteps: TutorialStep[] = [
  {
    target: ['#dashboard'],
    placement: 'bottom',
    title: 'Dashboard Overview',
    content: 'View your account summary and recent activity here.'
  },
  {
    target: ['#transactions'],
    placement: 'right',
    title: 'Transaction History',
    content: 'Access all your past transactions and download statements.'
  },
  {
    target: ['#transfer'],
    placement: 'left',
    title: 'Quick Transfer',
    content: 'Transfer money between accounts with just a few clicks.'
  }
]

const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsActive(false)
      localStorage.setItem('tutorial-completed', 'true')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setIsActive(false)
  }

  const step = tutorialSteps[currentStep]

  return (
    <>
      {!isActive && (
        <GdsButton onClick={() => setIsActive(true)}>
          Start Tutorial
        </GdsButton>
      )}

      {isActive && (
        <GdsCoachmark 
          target={step.target}
          placement={step.placement}
          label={`Tutorial Step ${currentStep + 1}`}
        >
          <GdsFlex flex-direction="column" gap="m" padding="m" max-width="300px">
            <GdsFlex justify-content="space-between" align-items="center">
              <GdsText tag="strong">{step.title}</GdsText>
              <GdsButton 
                size="xs" 
                rank="tertiary" 
                label="Close tutorial"
                onClick={handleClose}
              >
                <IconClose />
              </GdsButton>
            </GdsFlex>
            
            <GdsText>{step.content}</GdsText>
            
            <GdsFlex justify-content="space-between" align-items="center">
              <GdsText tag="small" color="secondary">
                {currentStep + 1} of {tutorialSteps.length}
              </GdsText>
              
              <GdsFlex gap="s">
                {currentStep > 0 && (
                  <GdsButton size="small" rank="secondary" onClick={handlePrevious}>
                    <IconArrowLeft slot="lead" />
                    Previous
                  </GdsButton>
                )}
                
                <GdsButton size="small" onClick={handleNext}>
                  {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
                  {currentStep < tutorialSteps.length - 1 && (
                    <IconArrowRight slot="trail" />
                  )}
                </GdsButton>
              </GdsFlex>
            </GdsFlex>
          </GdsFlex>
        </GdsCoachmark>
      )}
    </>
  )
}
```

### Complex Target Selection

```tsx
// Target nested elements
<GdsCoachmark 
  target={['#sidebar', '.menu-item:first-child']}
  placement="right"
>
  Start here to navigate
</GdsCoachmark>

// Target within specific container
<GdsCoachmark 
  target={['#main-content', '.action-button']}
  placement="top"
>
  Primary action button
</GdsCoachmark>

// Target within ShadowDOM component
<GdsCoachmark 
  target={['custom-component', 'shadowRoot', '#internal-button']}
  placement="bottom"
>
  Click to configure
</GdsCoachmark>
```

## Best Practices

### ✅ DO

- **Track completion**: Store coachmark completion state to avoid showing repeatedly
- **Provide dismiss option**: Always allow users to close or skip coachmarks
- **Use clear, concise content**: Keep coachmark text brief and actionable
- **Consider placement**: Choose placement that doesn't cover important UI
- **Test visibility**: Ensure target elements are visible when coachmark appears
- **Provide accessible labels**: Use descriptive `label` attributes

```tsx
// ✅ Good: Tracked and dismissible
const [seen, setSeen] = useState(
  localStorage.getItem('coachmark-feature-x') === 'true'
)

{!seen && (
  <GdsCoachmark 
    target={['#feature-x']}
    label="Feature X Guide"
    onGdsUiState={() => {
      setSeen(true)
      localStorage.setItem('coachmark-feature-x', 'true')
    }}
  >
    <p>Try our new feature!</p>
    <GdsButton size="small">Got it</GdsButton>
  </GdsCoachmark>
)}
```

### ❌ DON'T

- **Don't show multiple coachmarks**: Only one at a time (enforced by component)
- **Don't block critical actions**: Avoid covering important buttons or inputs
- **Don't use for errors**: Use GdsAlert for error messages
- **Don't show without context**: Ensure target element exists and is visible
- **Don't make too long**: Keep content focused and scannable

```tsx
// ❌ Bad: No way to dismiss or track
<GdsCoachmark target={['#button']}>
  This is a very long explanation that goes on and on about the feature
  and contains way too much information that users won't read...
</GdsCoachmark>

// ✅ Good: Concise with action
<GdsCoachmark target={['#button']} onGdsUiState={handleDismiss}>
  <p>Quick tip: Click here to export</p>
  <GdsButton size="small">Got it</GdsButton>
</GdsCoachmark>
```

## Common Patterns

### Persistent Help Button

```tsx
const [showHelp, setShowHelp] = useState(false)

<>
  <GdsButton 
    id="help-trigger"
    size="small" 
    rank="tertiary"
    onClick={() => setShowHelp(!showHelp)}
  >
    ?
  </GdsButton>

  {showHelp && (
    <GdsCoachmark 
      target={['#complex-form-section']}
      placement="right"
      onGdsUiState={() => setShowHelp(false)}
    >
      <p>Fill in all required fields marked with *</p>
    </GdsCoachmark>
  )}
</>
```

### First-Time User Experience

```tsx
useEffect(() => {
  const isFirstVisit = !localStorage.getItem('has-visited')
  if (isFirstVisit) {
    setShowWelcome(true)
    localStorage.setItem('has-visited', 'true')
  }
}, [])

{showWelcome && (
  <GdsCoachmark 
    target={['#main-nav']}
    placement="bottom"
    onGdsUiState={() => setShowWelcome(false)}
  >
    <h4>Welcome to Banking Portal!</h4>
    <p>Let's take a quick tour of the main features.</p>
    <GdsButton size="small" onClick={startTour}>
      Start Tour
    </GdsButton>
  </GdsCoachmark>
)}
```

### Conditional Display Based on User Role

```tsx
const { user } = useAuth()

{user?.role === 'admin' && !user.hasSeenAdminTour && (
  <GdsCoachmark 
    target={['#admin-panel']}
    placement="left"
    label="Admin Features Guide"
    onGdsUiState={() => markTourComplete('admin')}
  >
    <p>Access advanced admin features here</p>
  </GdsCoachmark>
)}
```

## TypeScript Types

```typescript
import type { Placement } from '@floating-ui/dom'

interface GdsCoachmarkProps {
  // Attributes
  placement?: Placement
  label?: string
  
  // Properties
  target?: string[]
  overlappedBy?: string[]
  computeVisibility?: (
    self: GdsCoachmark,
    target: HTMLElement,
    computedVisibility: boolean
  ) => boolean
  
  // Events
  onGdsUiState?: (event: CustomEvent) => void
  onGdsElementDisconnected?: (event: CustomEvent) => void
  
  // Standard props
  children?: React.ReactNode
  ref?: React.Ref<any>
}

// Placement types from Floating UI
type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
```

## Limitations & Notes

- **Single coachmark**: Only one coachmark can be visible at a time
- **Beta status**: API may change in future versions
- **Target visibility**: Coachmark won't render if target is not found
- **Click to close**: Clicking anywhere (including coachmark) closes it
- **Storybook limitation**: May not render correctly in multiple Storybook panels

## Related Components

- [GdsPopover](./GdsPopover.md) — For interactive popovers with triggers
- [GdsAlert](./GdsAlert.md) — For important messages and notifications
- [GdsButton](./GdsButton.md) — For coachmark action buttons
- [GdsFlex](./GdsFlex.md) — For coachmark content layout
- [Icons](./Icons.md) — For coachmark icons

## Accessibility

- **ARIA Label**: Always provide descriptive `label` attribute
- **Keyboard Access**: Ensure coachmark content is keyboard accessible
- **Focus Management**: Don't trap focus within coachmark
- **Close Mechanism**: Provide clear way to dismiss
- **Screen Readers**: Coachmark content is announced to screen readers
- **Color Contrast**: Ensure text meets WCAG contrast requirements

## References

- [Green Core Coachmark Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-coachmark--docs)
- [Floating UI Placement](https://floating-ui.com/docs/computePosition#placement)
- [Icons Documentation](./Icons.md)
