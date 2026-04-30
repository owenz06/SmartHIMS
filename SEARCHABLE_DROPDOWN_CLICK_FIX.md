# Searchable Dropdown Click Fix

## Issue
Items in the searchable dropdown were displaying correctly but couldn't be clicked/selected. They appeared as read-only display items rather than interactive options.

## Root Cause
The `CommandItem` component was using only the `label` as the `value` prop. When multiple items had similar labels or when the search filtering was applied, the command menu couldn't properly match the selected item, making them unclickable.

## Solution Applied

### 1. Fixed CommandItem Value Prop
Changed from using just the label to a unique combination:
```tsx
// Before
<CommandItem
  key={option.value}
  value={option.label}
  onSelect={() => { ... }}
>

// After
<CommandItem
  key={option.value}
  value={`${option.value}-${option.label}`}
  keywords={[option.label, option.description || ""]}
  onSelect={() => { ... }}
  className="cursor-pointer"
>
```

### 2. Added Keywords for Better Search
Added the `keywords` prop to ensure search works properly:
- Searches through both label and description
- Maintains proper filtering even with unique value prop

### 3. Added Visual Feedback
- Added `cursor-pointer` class to show items are clickable
- Maintained check icon for selected state

### 4. Improved Popover Width
Added dynamic width calculation to match the trigger button:
```tsx
const [width, setWidth] = React.useState<number | undefined>(undefined)
const buttonRef = React.useRef<HTMLButtonElement>(null)

React.useEffect(() => {
  if (buttonRef.current) {
    setWidth(buttonRef.current.offsetWidth)
  }
}, [])

// Applied to PopoverContent
<PopoverContent 
  className="p-0" 
  align="start" 
  style={{ width: width ? `${width}px` : undefined }}
>
```

## Technical Details

### Why the Fix Works
1. **Unique Values**: Using `${option.value}-${option.label}` ensures each CommandItem has a unique value for the command menu's internal state
2. **Keywords Array**: Separating search keywords from the value allows proper filtering while maintaining unique identifiers
3. **Cursor Feedback**: The `cursor-pointer` class provides visual feedback that items are interactive

### Command Menu Behavior
The `cmdk` library (Command Menu) uses the `value` prop to:
- Track which item is selected
- Filter items during search
- Handle keyboard navigation

By providing a unique value and separate keywords, we ensure all these features work correctly.

## Files Modified
- `resources/js/components/ui/searchable-select.tsx`

## Testing
To verify the fix:
1. Navigate to `/admin/stock-requests/create`
2. Click the "Item" dropdown
3. Verify items are clickable (cursor changes to pointer)
4. Click an item - it should select and close the dropdown
5. The selected item should appear in the button
6. Type to search - filtered items should still be clickable
7. Repeat for "Supplier" dropdown

## Benefits
- Items are now fully interactive
- Search filtering works correctly
- Visual feedback with cursor pointer
- Proper keyboard navigation
- Dropdown width matches trigger button
- Selected state is clearly indicated with checkmark

## Future Enhancements
- Add hover states for better visual feedback
- Add keyboard shortcuts (e.g., Ctrl+K to open)
- Add recent selections
- Add option grouping
- Add loading states for async data
