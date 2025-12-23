# GdsAlert

An alert displays important messages, feedback, or time-sensitive information.

An alert is a message used to inform the user about the state of a system, page, or function. Icons and colour indicate the type and urgency of the information within the message.

> **Related tokens & styles**: See [Colors](./Colors.md), [Spacing](./Spacing.md), [Accessibility](./Accessibility.md)

## Overview

An alert is a message used to inform the user about the state of a system, page, or function. Icons and colour indicate the type and urgency of the information within the message.

## Anatomy

Alert consists of a card with an icon, a message text, optional action button, and optional close button. The layout is responsive and adapts based on the size of the alert.

## Features

- Multiple variants for different message types (information, notice, positive, warning, negative)
- Accessible with proper ARIA roles (`alert` or `status`)
- Dismissible alerts with close button
- Auto-dismiss with configurable timeout
- Optional action button for user interactions
- Keyboard navigation support (Escape key to dismiss)
- Supports rich content including links, emphasis, and code

## Import

```tsx
import { GdsAlert } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsAlert>
  <strong>Information</strong> Body text starts on the same row as heading. 
  A link (optional) always ends the message.
</GdsAlert>
```

## Public API

### Attributes & Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"information" \| "notice" \| "positive" \| "warning" \| "negative"` | `"information"` | The variant of the alert, which determines its appearance and icon |
| `role` | `"alert" \| "status"` | `"alert"` | The ARIA role of the alert. Use `"alert"` for critical messages requiring immediate attention, `"status"` for informational messages |
| `label` | `string` | `""` | The label for the alert, used for accessibility purposes. Should be set to something relevant to the alert content |
| `dismissible` | `boolean` | `false` | Determines whether the alert can be closed by the user |
| `timeout` | `number` | `0` | Time in milliseconds after which the alert will automatically dismiss. Set to `0` to disable auto-dismiss |
| `button-label` / `buttonLabel` | `string` | `""` | The text for the action button. If not set, no action button will be rendered |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-close` | `CustomEvent` | Fired when the alert is dismissed |
| `gds-action` | `CustomEvent` | Fired when the action button is clicked |
| `gds-element-disconnected` | `CustomEvent` | When the element is disconnected from the DOM |

## Examples

### Default

Basic information alert:

```tsx
<GdsAlert>
  <strong>Information</strong> Body text starts on the same row as heading. 
  A link (optional) always ends the message.
</GdsAlert>
```

## Variants

A set of predefined styles that convey different meanings and states through consistent visual treatment each with specific icons.

### Information

Used for passive, non-critical updates like tips or background information. It's quiet and unobtrusive.

```tsx
<GdsDiv width="80%" display="block">
  <GdsAlert variant="information" role="alert">
    <strong>Information</strong> Body text starts on the same row as heading.
  </GdsAlert>
</GdsDiv>
```

### Notice

Used for actionable, attention-worthy updates that are still non-critical, like a change in a process or a reminder to do something soon.

```tsx
<GdsDiv width="80%" display="block">
  <GdsAlert variant="notice" role="alert">
    <strong>Notice</strong> Body text with link or additional context.
  </GdsAlert>
</GdsDiv>
```

### Positive

Confirms successful actions, such as form submissions, with a success message, optional next steps, and possible brand reinforcement.

```tsx
<GdsDiv width="80%" display="block">
  <GdsAlert variant="positive" role="alert">
    <strong>Positive</strong> Feedback message with optional CTA.
  </GdsAlert>
</GdsDiv>
```

### Warning

Highlights non-critical issues, such as upcoming deadlines, with a concise issue summary, optional duration estimate, and suggested actions.

```tsx
<GdsDiv width="80%" display="block">
  <GdsAlert variant="warning" role="alert">
    <strong>Warning</strong> Important information to consider.
  </GdsAlert>
</GdsDiv>
```

### Negative

Communicates critical issues or errors, such as system outages, with a clear problem description, optional apology for system issues, and resolution guidance.

```tsx
<GdsDiv width="80%" display="block">
  <GdsAlert variant="negative" role="alert">
    <strong>Negative</strong> Error message requiring user attention.
  </GdsAlert>
</GdsDiv>
```

## Action Button

Alert supports an optional action button with customisable text to trigger relevant actions.

```tsx
<GdsDiv width="90%" display="block">
  <GdsAlert variant="information" role="alert" button-label="Action">
    <strong>Actionable</strong> Alert with a button for quick user interaction.
  </GdsAlert>
</GdsDiv>
```

### Handling Action Button Click

```tsx
const handleAction = (e: CustomEvent) => {
  console.log('Action button clicked')
  // Perform your action here
}

<GdsAlert 
  button-label="Retry"
  onGds-action={handleAction}
>
  <strong>Action Required</strong> Click the button to retry the operation.
</GdsAlert>
```

## Dismissible

Alerts can be configured as dismissible in order to show a close button in the upper right corner. This also enabled closing the alert by pressing the escape key.

```tsx
<GdsDiv width="90%" display="block">
  <GdsAlert variant="information" role="alert" dismissible>
    <strong>Dismissible</strong> User can dismiss this alert.
  </GdsAlert>
</GdsDiv>
```

### Handling Dismiss Event

```tsx
<GdsAlert dismissible>
  <strong>Dismissible</strong> User can dismiss this alert.
</GdsAlert>
```

### Handling Dismiss Event

```tsx
const handleClose = (e: CustomEvent) => {
  console.log('Alert dismissed')
}

<GdsAlert 
  dismissible
  onGds-close={handleClose}
>
  <strong>Dismissible</strong> User can close this alert.
</GdsAlert>
```

## Placement

The most important rule is to place the alert near the issue that triggered it.

### Global Alert

Used for system-wide messages.

- Placed above the header and takes full width of the screen.
- The icon, text content, and action button should be center-aligned horizontally.
- The dismiss button is placed at the far right.

### Page Alert

Used for messages affecting the entire page (e.g., Bankgiro is down).

- Placed at the top of the page, below the header.

### Group Alert

Used for messages related to a specific module (e.g., Transaction listing is unavailable).

- Placed within the module, at the top.

### Specific Alert

Used for messages related to specific content (e.g., Negative balance).

- Placed directly in the content area, close to the element it concerns (such as a table or field).

## Guidelines

Select the appropriate variant to match the message's intent, such as using positive for success messages or negative for errors. Also ensure a meaningful label property is set to describe the alert's purpose for accessibility. A label should always be set when using alert.

Choose the role property carefully, using alert for critical messages and status for informational updates, to align with ARIA best practices.

For toast-like messages, like save confirmations and other non-critical messages, auto-dismiss can be used to avoid interrupting user workflows.

### Do

- Use concise, clear message text to ensure quick comprehension.
- Enable dismissible for alerts, unless you need them to stay on screen permanently.
- Set proper ARIA roles: Use `alert` for critical messages, `status` for informational
- Provide clear, actionable messages: Be specific about what happened and what to do next
- Always set the `label` attribute for better screen reader support

### Don't

- Don't use overly long message text.
- Avoid using alert role for non-critical messages; use status instead to reduce urgency.
- Don't set a timeout for critical alerts that require user acknowledgment.
- Never omit the label property, as it's essential for screen reader users.
- Don't overuse alerts, especially critical ones (avoid alert fatigue)

### Auto Dismiss

Alerts can automatically dismiss themselves after a specified timeout (in milliseconds):

```tsx
<GdsAlert timeout={5000}>
  <strong>Auto Dismiss</strong> This alert disappears automatically after 5 seconds.
</GdsAlert>
```

Combine auto-dismiss with manual dismissal:

```tsx
<GdsAlert dismissible timeout={10000}>
  <strong>Auto Dismiss</strong> This alert will auto-dismiss in 10 seconds, 
  or you can close it manually.
</GdsAlert>
```

### Rich Content

Alerts can contain rich content including links, emphasis, code, and other HTML elements:

```tsx
<GdsAlert>
  <strong>Rich Content</strong> Includes <a href="#">a link</a>, <em>emphasis</em>, 
  and <code>inline code</code>.
</GdsAlert>
```

More complex rich content example:

```tsx
<GdsAlert variant="warning">
  <div>
    <strong>Multiple Issues Found</strong>
    <ul>
      <li>Invalid email format</li>
      <li>Password too short</li>
      <li>Phone number missing</li>
    </ul>
    <p>Please correct the above issues and try again.</p>
  </div>
</GdsAlert>
```

### Combined Features

Example combining multiple features:

```tsx
<GdsAlert 
  variant="warning" 
  dismissible 
  timeout={8000}
  button-label="View Details"
  onGds-action={(e) => console.log('View details clicked')}
  onGds-close={(e) => console.log('Alert closed')}
>
  <strong>System Maintenance</strong> Scheduled maintenance in 30 minutes. 
  Save your work to avoid data loss.
</GdsAlert>
```

## Accessibility

- Uses proper ARIA roles (`alert` or `status`) for screen readers
- **alert role**: For critical messages requiring immediate attention (announced immediately and interrupts screen reader)
- **status role**: For informational messages (announced politely without interrupting)
- Keyboard navigation: Press `Escape` to dismiss when the alert has focus
- Dismissible alerts include an accessible close button
- The `label` attribute provides additional context for assistive technologies
- Always set the `label` property, as it's essential for screen reader users

### ARIA Role Guidelines

Use `role="alert"` for:
- Error messages
- Critical warnings
- Time-sensitive information
- Messages requiring immediate user action

Use `role="status"` for:
- Success confirmations
- General information updates
- Non-critical notices
- Progress indicators

### Accessibility Checklist

See [Accessibility](./Accessibility.md) for comprehensive accessibility guidance including:
- Contrast requirements for alert colors
- Keyboard navigation patterns
- Screen reader compatibility
- Focus behavior for dismissible alerts
- Touch target sizes for action and close buttons

## Use Cases

- **Form validation**: Display errors and success messages after form submission
- **System notifications**: Inform users about system status, updates, or maintenance
- **Confirmation messages**: Confirm successful actions (e.g., "Settings saved")
- **Warnings**: Alert users to potential issues or important information
- **Error handling**: Display error messages with actionable solutions
- **Temporary notifications**: Show auto-dismissing messages for transient information

## Best Practices

### What to Do

1. **Use appropriate variants**: Match the variant to the message severity and type
2. **Set proper ARIA roles**: Use `alert` for critical messages, `status` for informational
3. **Provide clear, actionable messages**: Be specific about what happened and what to do next
4. **Use action buttons wisely**: Provide action buttons for common responses to the alert
5. **Consider auto-dismiss**: Use timeouts for non-critical information that doesn't require acknowledgment
6. **Make dismissible when appropriate**: Allow users to dismiss alerts they've acknowledged
7. **Set accessibility labels**: Always set the `label` attribute for better screen reader support
8. **Use concise text**: Short, clear messages are more effective
9. **Place alerts strategically**: Near the issue that triggered them
10. **Enable dismissible**: Unless alerts need to stay on screen permanently

### What to Avoid

1. **Don't overuse alerts**: Especially critical ones (avoid alert fatigue)
2. **Don't use overly long text**: Keep messages concise and scannable
3. **Don't use alert role for non-critical messages**: Use status instead to reduce urgency
4. **Don't set timeouts on critical alerts**: That require user acknowledgment
5. **Never omit the label property**: Essential for screen reader users

## Common Patterns

### Form Error Display

```tsx
{formErrors.length > 0 && (
  <GdsAlert variant="negative" role="alert" label="Form validation errors">
    <strong>Please correct the following errors:</strong>
    <ul>
      {formErrors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  </GdsAlert>
)}
```

### Success Confirmation

```tsx
{saveSuccess && (
  <GdsAlert 
    variant="positive" 
    role="status" 
    dismissible 
    timeout={5000}
    label="Save successful"
  >
    <strong>Success!</strong> Your changes have been saved.
  </GdsAlert>
)}
```

### Warning with Action

```tsx
<GdsAlert 
  variant="warning" 
  role="alert"
  button-label="Backup Now"
  onGds-action={handleBackup}
  label="Data backup reminder"
>
  <strong>Backup Reminder</strong> You haven't backed up your data in 30 days.
</GdsAlert>
```

### Information with Link

```tsx
<GdsAlert variant="information" role="status" label="New feature announcement">
  <strong>New Feature Available!</strong> Check out our new dashboard. 
  <a href="/dashboard">View Dashboard</a>
</GdsAlert>
```

## Icons

The `GdsAlert` component automatically displays an appropriate icon based on the variant. The icons are:

- **information**: Information icon (IconCircleInfo)
- **notice**: Notice icon 
- **positive**: Checkmark icon (IconCircleCheck)
- **warning**: Warning icon (IconTriangleExclamation)
- **negative**: Error icon (IconCircleX)

These icons are automatically included and styled by the component. You don't need to import or specify icons manually. For information about icons in general, see the [Icons documentation](./Icons.md).

## Related Components

- [Colors](./Colors.md) — Color palette with state colors for alerts
- [Spacing](./Spacing.md) — Spacing system for alert padding and layout
- [Accessibility](./Accessibility.md) — Accessibility principles and guidance
- [GdsDetails](./GdsDetails.md) — For collapsible content sections
- [GdsTheme](./GdsTheme.md) — Theme utility for controlling alert color schemes
- [GdsBadge](./GdsBadge.md) — For compact status indicators and counters
- [GdsButton](./GdsButton.md) — For action buttons within alerts
- [GdsDivider](./GdsDivider.md) — For separating multiple alerts
- [GdsFormSummary](./GdsFormSummary.md) — For form validation error summaries
- [GdsDialog](./GdsDialog.md) — For modal dialogs with alert messages
- [GdsCoachmark](./GdsCoachmark.md) — For user guidance and feature highlights
- [GdsFlex](./GdsFlex.md) — For layout of multiple alerts
- [GdsText](./GdsText.md) — For formatting alert content
- [Icons](./Icons.md) — Icon system (alerts use automatic variant-based icons)

## Notes

- Alerts are inline elements and will take the full width of their container
- Multiple alerts can be stacked using `GdsFlex` with appropriate spacing
- Auto-dismiss timers start when the alert is rendered
- Dismissing an alert removes it from the DOM
- The component handles focus management automatically

---

**Reference**: [SEB Green Core Storybook - Alert](https://storybook.seb.io/latest/core/?path=/docs/components-alert--docs)

Generated: 2025-11-12
