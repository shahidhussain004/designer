# Accessibility

Accessibility is central to SEB’s digital experience. The Green Design System is designed to make our services usable for everyone — improving clarity, usability, and overall experience.

## Inclusive design benefits everyone

Approximately 20% of people experience permanent, temporary, or situational difficulties when using websites that lack accessible design. By creating an inclusive environment, we make it easier for all users to access and understand our content.

## Accessibility checklist

Every component in Green Design System has accessibility in mind. For each component, we review the following areas:

- Contrast
- Keyboard navigation
- ARIA & HTML semantics
- Focus behaviour
- Touch interactions
- Screen reader support
- Darkmode compatibility

## Contrast

### The importance of high contrast

High contrast ratios make content easier to read and navigate — especially for users with visual impairments. Strong contrast helps differentiate text, components, and sections on a page. By meeting accessibility standards, we ensure our content works for a wider audience, including those with significant vision difficulties.

### What we check for contrast and colour

We evaluate the contrast between elements to ensure readability and clarity. Components should have sufficient contrast between text, icons, backgrounds, and borders. Colours must be clearly distinguishable, even for users with colour vision deficiencies. When needed, we also use patterns or icons to support meaning and improve accessibility.

### Tools and standards we follow

- WCAG 2.1 - SC.1.4.3: Follow contrast ratio of 3:1 to 4.5:1, depending on text size and usage.
- Chrome DevTools: Use the Rendering > Emulate vision deficiencies feature to see how designs appear to users with various vision conditions.
- Silktide (Chrome extension): Offers a wide range of accessibility tools, including color blindness simulation. Approved for use within SEB.
- Contrast checkers: Tools like WebAIM Contrast Checker help you verify if color combinations meet contrast requirements.

### Future high contrast mode

In addition to the dark mode feature detailed in the color docs, we may introduce a high contrast mode in the future. This setting is becoming increasingly common on other websites. While it may not be the most visually appealing, it will enhance readability in poor lighting conditions, on suboptimal screens, or for users with visual impairments.

## Keyboard navigation

Components must be fully operable using a keyboard. If a component behaves differently from standard keyboard patterns, document it clearly.

- Components can be activated using Enter and/or Space, where appropriate.
- Arrow keys are used for navigation when relevant (e.g., in menus or dropdowns).
- If typing is allowed it should be easy to visibly see that.
- If typing is not allowed (e.g., read-only fields), this should be visually obvious and easy to understand.
- Avoid using disabled fields where possible — they often have poor contrast and can be confusing.

## ARIA & HTML semantics

We follow correct ARIA attributes and roles, and use semantic HTML as the foundation. ARIA should only be used when necessary — never as a replacement for proper HTML.

Common mistakes include:

- Misspellings — for example, id values are case-sensitive and must match exactly.
- Overuse — adding ARIA attributes where they aren't needed can cause confusion for assistive technologies.

## Focus behaviour

Proper focus handling is essential for keyboard and screen reader navigation.

When focus is implemented correctly:

- A visible focus ring should appear slightly outside the focused element (typically a few pixels away).
- Focus should typically appear when navigating with the keyboard, but not when using a mouse (to avoid visual clutter).
- The focus indicator must be clearly visible — it should not be hidden behind other elements or fall outside the viewport.
- The focus order should follow a logical sequence: usually starting from the top left, moving to the top right, then continuing downward, left to right.
- Focus traps should work effectively in pop-ups and modals, keeping the user inside until the interaction is complete. This applies to keyboard, mouse, and screen reader users alike.

## Touch interaction

Interactive elements should be easy to tap and match the visual design. Touch targets must be large enough to avoid mis-taps and support common gestures like pinching, zooming, and scrolling where applicable.

- Recommended minimum touch target size: `44×44` px (WCAG AAA).
- WCAG AA allows a minimum size of `24×24` px, if there's at least `44×44` px of clickable space around it.
- Touch targets should align with visual cues to avoid confusion or missed interactions.

## Screen reader support

Components should work consistently with screen readers, ensuring a seamless and understandable experience for users who rely on assistive technologies.

- Prioritise testing with NVDA (PC) and VoiceOver (macOS/iOS). Test TalkBack (Android) as lower priority.
- Ensure users can navigate by headings and landmarks.
- All meaningful content should be read aloud clearly — including labels, states, and instructions.
- Mark decorative images with appropriate attributes so they are ignored by screen readers.

## Dark mode compatibility

Check whether the component supports dark mode — and how well it adapts to it.

- Does anything change when switching to dark mode?
- Is the component still fully functional and visually clear?
- Are there any broken styles, missing contrasts, or unclear states?

Even if a component appears unchanged, verify that all colors, icons, and interactions remain accessible and consistent in dark mode.

## Summary

How accessible is the Green Design System?

Overall, the design system is built with accessibility in mind and performs well. However, occasional issues may arise, and new challenges can be reported as the system evolves.

If you come across an accessibility issue, please help us improve by submitting a report or creating a new issue.

## Useful links

- European Accessibility Act - EU Commission
- WCAG 2.1 - W3C
- Internal Sharepoint - Accessibility
- Internal CX Central - Accessibility
