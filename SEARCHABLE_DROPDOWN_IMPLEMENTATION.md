# Searchable Dropdown Implementation

## Overview
Added searchable dropdown functionality to the Stock Request create page, replacing standard HTML select elements with an interactive, searchable combobox component.

## Components Created

### 1. Command Component (`resources/js/components/ui/command.tsx`)
- Based on the `cmdk` library (Command Menu)
- Provides the foundation for searchable command palettes and comboboxes
- Includes sub-components:
  - `Command` - Main container
  - `CommandInput` - Search input with icon
  - `CommandList` - Scrollable list of items
  - `CommandEmpty` - Empty state message
  - `CommandGroup` - Grouping items
  - `CommandItem` - Individual selectable items
  - `CommandSeparator` - Visual separator
  - `CommandShortcut` - Keyboard shortcut display

### 2. Popover Component (`resources/js/components/ui/popover.tsx`)
- Based on Radix UI Popover primitive
- Provides the floating container for the dropdown
- Handles positioning, animations, and portal rendering
- Includes:
  - `Popover` - Root component
  - `PopoverTrigger` - Trigger button
  - `PopoverContent` - Floating content container

### 3. SearchableSelect Component (`resources/js/components/ui/searchable-select.tsx`)
- Reusable searchable dropdown component
- Combines Command and Popover for a complete solution
- Features:
  - Type-to-search functionality
  - Keyboard navigation
  - Visual selection indicator (checkmark)
  - Optional descriptions for items
  - Customizable placeholders and empty states
  - Disabled state support

#### Props:
```typescript
interface SearchableSelectProps {
  options: SearchableSelectOption[]  // Array of options
  value: string                      // Selected value
  onValueChange: (value: string) => void  // Change handler
  placeholder?: string               // Button placeholder
  searchPlaceholder?: string         // Search input placeholder
  emptyText?: string                 // No results message
  className?: string                 // Additional CSS classes
  disabled?: boolean                 // Disabled state
}

interface SearchableSelectOption {
  value: string       // Unique identifier
  label: string       // Display text
  description?: string  // Optional subtitle
}
```

## Implementation in Stock Request Create Page

### Before:
```tsx
<select
    id="item_id"
    value={data.item_id}
    onChange={(e) => setData('item_id', e.target.value)}
    className="w-full mt-1 px-3 py-2 bg-background border border-sidebar-border rounded-md"
>
    <option value="">Select an item</option>
    {items.map((item) => (
        <option key={item.id} value={item.id}>
            {item.name}
        </option>
    ))}
</select>
```

### After:
```tsx
<SearchableSelect
    options={itemOptions}
    value={data.item_id}
    onValueChange={(value) => setData('item_id', value)}
    placeholder="Select an item"
    searchPlaceholder="Search items..."
    emptyText="No items found."
    className="mt-1"
/>
```

## Features

### User Experience:
1. Click to open dropdown
2. Type to filter options in real-time
3. Use arrow keys to navigate
4. Press Enter to select
5. Click outside or press Escape to close
6. Visual feedback with checkmark for selected item

### Developer Experience:
1. Simple, declarative API
2. Type-safe with TypeScript
3. Reusable across the application
4. Consistent styling with design system
5. Accessible by default (ARIA attributes)

## Dependencies Installed
- `cmdk` - Command menu library for React

## Files Modified
1. `resources/js/pages/admin/stock-requests-create.tsx` - Updated to use SearchableSelect
2. Created `resources/js/components/ui/command.tsx`
3. Created `resources/js/components/ui/popover.tsx`
4. Created `resources/js/components/ui/searchable-select.tsx`

## Usage in Other Pages

To add searchable dropdowns to other pages:

```tsx
import { SearchableSelect, type SearchableSelectOption } from '@/components/ui/searchable-select';

// Convert your data to options
const options: SearchableSelectOption[] = items.map((item) => ({
    value: item.id.toString(),
    label: item.name,
    description: item.description, // Optional
}));

// Use in your form
<SearchableSelect
    options={options}
    value={selectedValue}
    onValueChange={setSelectedValue}
    placeholder="Select..."
    searchPlaceholder="Search..."
/>
```

## Future Enhancements
- Add multi-select support
- Add option grouping
- Add custom option rendering
- Add loading states for async data
- Add option to clear selection
- Add keyboard shortcuts display

## Accessibility
- Full keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader friendly
- High contrast mode support

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design for mobile devices
