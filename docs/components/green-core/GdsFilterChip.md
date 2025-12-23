# GdsFilterChip

The filter chip is a sub-component of the filter chips component, and should generally not be used on its own.

## Overview

GdsFilterChip is a selectable chip component used within the GdsFilterChips container to create filter interfaces. Each chip represents a filterable option that users can toggle on or off. When selected, the chip displays a visual indicator showing it's active.

Filter chips are commonly used for:
- **Filtering content** by multiple criteria
- **Category selection** in search interfaces
- **Tag-based filtering** in lists or grids
- **Multi-select options** where checkboxes would be too formal

**Important**: GdsFilterChip is designed to be used within a GdsFilterChips container. While it can technically be used standalone, it's not recommended as the container provides proper grouping, keyboard navigation, and accessibility features.

## Import

```tsx
// Use as JSX element in React
import { GdsFilterChip } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsFilterChip>Filter chip</GdsFilterChip>
</GdsTheme>
```

## Recommended Usage with GdsFilterChips

```tsx
import { GdsFilterChips, GdsFilterChip } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsFilterChips>
    <GdsFilterChip value="all">All</GdsFilterChip>
    <GdsFilterChip value="active">Active</GdsFilterChip>
    <GdsFilterChip value="pending">Pending</GdsFilterChip>
    <GdsFilterChip value="completed">Completed</GdsFilterChip>
  </GdsFilterChips>
</GdsTheme>
```

## API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `selected` | `boolean` | `false` | Whether the chip is selected |
| `value` | `any` | `undefined` | The value of the chip (used for filtering logic) |
| `size` | `'small' \| 'large'` | `'large'` | Size of the chip |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `selected` | `boolean` | Whether the chip is selected |
| `value` | `any` | Value associated with the chip |
| `size` | `'small' \| 'large'` | Chip size |
| `isDefined` | `boolean` | Whether element is defined in custom element registry |
| `styleExpressionBaseSelector` | `string` | Base selector for style expressions (`:host`) |
| `semanticVersion` | `string` | Semantic version of the element |
| `gdsElementName` | `string` | Unscoped name of the element (read-only) |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when element disconnects from DOM |
| `click` | `MouseEvent` | Fired when chip is clicked (inherited behavior) |

## Examples

### Basic Filter Chip (Standalone)

**Note**: Standalone use is not recommended. Use within GdsFilterChips container.

```tsx
<GdsTheme>
  <GdsFilterChip>Filter chip</GdsFilterChip>
</GdsTheme>
```

### Selected State

```tsx
<GdsTheme>
  <GdsFilterChip selected>Selected chip</GdsFilterChip>
</GdsTheme>
```

### With Value

```tsx
<GdsTheme>
  <GdsFilterChip value="electronics">Electronics</GdsFilterChip>
</GdsTheme>
```

### Small Size

```tsx
<GdsTheme>
  <GdsFilterChip size="small">Small chip</GdsFilterChip>
</GdsTheme>
```

### Large Size (Default)

```tsx
<GdsTheme>
  <GdsFilterChip size="large">Large chip</GdsFilterChip>
</GdsTheme>
```

### With Click Handler

```tsx
<GdsTheme>
  <GdsFilterChip 
    value="category1"
    onClick={(e) => console.log('Chip clicked:', e.target.value)}
  >
    Category 1
  </GdsFilterChip>
</GdsTheme>
```

### Controlled Selection

```tsx
import { useState } from 'react'

function ControlledChip() {
  const [isSelected, setIsSelected] = useState(false)
  
  return (
    <GdsTheme>
      <GdsFilterChip 
        selected={isSelected}
        onClick={() => setIsSelected(!isSelected)}
      >
        Toggle me
      </GdsFilterChip>
    </GdsTheme>
  )
}
```

### Within GdsFilterChips Container (Recommended)

```tsx
import { GdsFilterChips, GdsFilterChip } from '@sebgroup/green-core/react'
import { useState } from 'react'

function FilterExample() {
  const [selectedFilters, setSelectedFilters] = useState(['all'])
  
  const handleFilterChange = (value) => {
    setSelectedFilters(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }
  
  return (
    <GdsTheme>
      <GdsFilterChips>
        <GdsFilterChip 
          value="all" 
          selected={selectedFilters.includes('all')}
          onClick={() => handleFilterChange('all')}
        >
          All
        </GdsFilterChip>
        <GdsFilterChip 
          value="active" 
          selected={selectedFilters.includes('active')}
          onClick={() => handleFilterChange('active')}
        >
          Active
        </GdsFilterChip>
        <GdsFilterChip 
          value="pending" 
          selected={selectedFilters.includes('pending')}
          onClick={() => handleFilterChange('pending')}
        >
          Pending
        </GdsFilterChip>
        <GdsFilterChip 
          value="completed" 
          selected={selectedFilters.includes('completed')}
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </GdsFilterChip>
      </GdsFilterChips>
    </GdsTheme>
  )
}
```

### Category Filters

```tsx
<GdsTheme>
  <GdsFilterChips>
    <GdsFilterChip value="electronics">Electronics</GdsFilterChip>
    <GdsFilterChip value="clothing">Clothing</GdsFilterChip>
    <GdsFilterChip value="home">Home & Garden</GdsFilterChip>
    <GdsFilterChip value="sports">Sports</GdsFilterChip>
    <GdsFilterChip value="books">Books</GdsFilterChip>
  </GdsFilterChips>
</GdsTheme>
```

### Status Filters with Small Size

```tsx
<GdsTheme>
  <GdsFilterChips>
    <GdsFilterChip size="small" value="all" selected>All</GdsFilterChip>
    <GdsFilterChip size="small" value="open">Open</GdsFilterChip>
    <GdsFilterChip size="small" value="in-progress">In Progress</GdsFilterChip>
    <GdsFilterChip size="small" value="closed">Closed</GdsFilterChip>
  </GdsFilterChips>
</GdsTheme>
```

### Date Range Filters

```tsx
<GdsTheme>
  <GdsFilterChips>
    <GdsFilterChip value="today">Today</GdsFilterChip>
    <GdsFilterChip value="week">This Week</GdsFilterChip>
    <GdsFilterChip value="month">This Month</GdsFilterChip>
    <GdsFilterChip value="year">This Year</GdsFilterChip>
    <GdsFilterChip value="custom">Custom Range</GdsFilterChip>
  </GdsFilterChips>
</GdsTheme>
```

### Priority Filters

```tsx
<GdsTheme>
  <GdsFilterChips>
    <GdsFilterChip value="high">High Priority</GdsFilterChip>
    <GdsFilterChip value="medium">Medium Priority</GdsFilterChip>
    <GdsFilterChip value="low">Low Priority</GdsFilterChip>
  </GdsFilterChips>
</GdsTheme>
```

### Tag-Based Filtering

```tsx
<GdsTheme>
  <GdsFilterChips>
    <GdsFilterChip value="urgent">Urgent</GdsFilterChip>
    <GdsFilterChip value="review">Needs Review</GdsFilterChip>
    <GdsFilterChip value="approved">Approved</GdsFilterChip>
    <GdsFilterChip value="archived">Archived</GdsFilterChip>
  </GdsFilterChips>
</GdsTheme>
```

### Single-Select Behavior

```tsx
import { useState } from 'react'

function SingleSelectFilter() {
  const [selected, setSelected] = useState('all')
  
  return (
    <GdsTheme>
      <GdsFilterChips>
        <GdsFilterChip 
          value="all" 
          selected={selected === 'all'}
          onClick={() => setSelected('all')}
        >
          All
        </GdsFilterChip>
        <GdsFilterChip 
          value="active" 
          selected={selected === 'active'}
          onClick={() => setSelected('active')}
        >
          Active
        </GdsFilterChip>
        <GdsFilterChip 
          value="inactive" 
          selected={selected === 'inactive'}
          onClick={() => setSelected('inactive')}
        >
          Inactive
        </GdsFilterChip>
      </GdsFilterChips>
    </GdsTheme>
  )
}
```

### Multi-Select Behavior

```tsx
import { useState } from 'react'

function MultiSelectFilter() {
  const [selected, setSelected] = useState(['all'])
  
  const toggleFilter = (value) => {
    setSelected(prev => 
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }
  
  return (
    <GdsTheme>
      <GdsFilterChips>
        <GdsFilterChip 
          value="all" 
          selected={selected.includes('all')}
          onClick={() => toggleFilter('all')}
        >
          All
        </GdsFilterChip>
        <GdsFilterChip 
          value="active" 
          selected={selected.includes('active')}
          onClick={() => toggleFilter('active')}
        >
          Active
        </GdsFilterChip>
        <GdsFilterChip 
          value="pending" 
          selected={selected.includes('pending')}
          onClick={() => toggleFilter('pending')}
        >
          Pending
        </GdsFilterChip>
      </GdsFilterChips>
    </GdsTheme>
  )
}
```

### With Content Filtering

```tsx
import { useState } from 'react'

function FilteredList() {
  const [activeFilter, setActiveFilter] = useState('all')
  
  const items = [
    { id: 1, name: 'Item 1', status: 'active' },
    { id: 2, name: 'Item 2', status: 'pending' },
    { id: 3, name: 'Item 3', status: 'completed' },
    { id: 4, name: 'Item 4', status: 'active' },
  ]
  
  const filteredItems = activeFilter === 'all' 
    ? items 
    : items.filter(item => item.status === activeFilter)
  
  return (
    <GdsTheme>
      <GdsFlex flex-direction="column" gap="m">
        <GdsFilterChips>
          <GdsFilterChip 
            value="all" 
            selected={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          >
            All ({items.length})
          </GdsFilterChip>
          <GdsFilterChip 
            value="active" 
            selected={activeFilter === 'active'}
            onClick={() => setActiveFilter('active')}
          >
            Active ({items.filter(i => i.status === 'active').length})
          </GdsFilterChip>
          <GdsFilterChip 
            value="pending" 
            selected={activeFilter === 'pending'}
            onClick={() => setActiveFilter('pending')}
          >
            Pending ({items.filter(i => i.status === 'pending').length})
          </GdsFilterChip>
          <GdsFilterChip 
            value="completed" 
            selected={activeFilter === 'completed'}
            onClick={() => setActiveFilter('completed')}
          >
            Completed ({items.filter(i => i.status === 'completed').length})
          </GdsFilterChip>
        </GdsFilterChips>
        
        <GdsFlex flex-direction="column" gap="s">
          {filteredItems.map(item => (
            <GdsCard key={item.id}>
              <GdsText>{item.name} - {item.status}</GdsText>
            </GdsCard>
          ))}
        </GdsFlex>
      </GdsFlex>
    </GdsTheme>
  )
}
```

## Best Practices

### Container Usage
- **Always use with GdsFilterChips**: The container provides proper grouping and accessibility
- Don't use standalone unless you have a specific reason
- The container handles keyboard navigation and ARIA attributes

### Value Assignment
- Always provide a `value` attribute for filtering logic
- Use meaningful, unique values (e.g., `'active'`, `'pending'`, not `'1'`, `'2'`)
- Values should be stable and not change between renders

### Selection State
- Control selection state through the `selected` attribute
- Implement click handlers to toggle selection
- Consider single-select vs multi-select behavior based on use case

### Size Selection
- Use `large` (default) for primary filtering interfaces
- Use `small` for compact layouts or secondary filters
- Be consistent with size across all chips in a group

### Labeling
- Keep chip labels short and descriptive (1-3 words)
- Use sentence case, not title case
- Include counts when helpful (e.g., "Active (5)")

### Accessibility
- The GdsFilterChips container provides ARIA role and label
- Individual chips are focusable and keyboard-navigable
- Selected state is communicated to screen readers

### Performance
- For large lists, consider virtualizing or paginating filtered results
- Debounce filter changes if triggering expensive operations
- Use React.memo or useMemo for filtered results

## Common Patterns

### All/None Filter
```tsx
<GdsFilterChip value="all" selected>All</GdsFilterChip>
```

### Status Filter Group
```tsx
<GdsFilterChips>
  <GdsFilterChip value="all">All</GdsFilterChip>
  <GdsFilterChip value="active">Active</GdsFilterChip>
  <GdsFilterChip value="inactive">Inactive</GdsFilterChip>
</GdsFilterChips>
```

### Small Compact Filters
```tsx
<GdsFilterChip size="small" value="filter">Filter</GdsFilterChip>
```

## TypeScript Types

```tsx
import type { GdsFilterChip } from '@sebgroup/green-core/react'

// Chip size
type ChipSize = 'small' | 'large'

// Component props type
interface GdsFilterChipProps extends React.HTMLAttributes<HTMLElement> {
  selected?: boolean
  value?: any
  size?: ChipSize
  
  // Events
  onClick?: (event: MouseEvent) => void
  'onGds-element-disconnected'?: (event: CustomEvent) => void
}

// Filter state management
interface FilterState {
  activeFilters: string[]
  toggleFilter: (value: string) => void
  clearFilters: () => void
}
```

## Related Components

- [GdsFilterChips](./GdsFilterChips.md) — Container for filter chips (required)
- [GdsButton](./GdsButton.md) — For action buttons near filters
- [GdsCheckbox](./GdsCheckbox.md) — Alternative for formal filtering
- [GdsDropdown](./GdsDropdown.md) — For filtering with many options
- [GdsCard](./GdsCard.md) — For filtered content display
- [GdsFlex](./GdsFlex.md) — For layout of chips and filtered content

## Accessibility

- **Container Required**: Use within GdsFilterChips for proper ARIA support
- **Keyboard Navigation**: Tab to focus, Enter/Space to toggle
- **Screen Readers**: Selected state is announced
- **Focus Indicators**: Clear visual focus state
- **Touch Targets**: Adequate size for touch interaction (minimum 44x44px)

## Notes

- GdsFilterChip is a sub-component of GdsFilterChips
- **Not recommended for standalone use** - always use within GdsFilterChips container
- The container provides proper grouping, keyboard navigation, and accessibility
- Default size is `large`
- Selected state must be controlled by parent component
- Use `value` attribute for filtering logic
- Supports both single-select and multi-select patterns
- Visual indicator shows selected state
- Works well with content filtering and search interfaces
- Consider using GdsDropdown for filters with many options (10+)
- Keep chip labels concise (1-3 words)
- Use meaningful values for filtering logic
