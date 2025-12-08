# Plan: Implement Target Difficulty Level Dropdown in Header

## Plan Name
Implement target difficulty level dropdown in header with user update functionality

## Files to be Created
- `/src/components/layout/TargetLevelSelector.tsx` - Dropdown component for selecting target level
- `/src/hooks/use-target-level.ts` - Hook to manage target level state and updates
- `/src/app/api/user/target-level/route.ts` - API endpoint to update user's target level

## File Location
All files will be located within the existing project structure under the `src/` directory.

## Description
Implement a user-friendly dropdown in the application header that allows users to select and update their target difficulty level (e.g., N5, N4, N3, N2, N1 for Japanese). This will be displayed prominently in the header and will persist the user's choice to their profile.

## File Structure

### 1. Target Level Selector Component (`/src/components/layout/TargetLevelSelector.tsx`)
```typescript
interface TargetLevelSelectorProps {
  currentLevel?: string;
  onLevelChange: (levelId: string) => void;
  disabled?: boolean;
}

export function TargetLevelSelector({ 
  currentLevel, 
  onLevelChange, 
  disabled = false 
}: TargetLevelSelectorProps) {
  // Dropdown with difficulty levels
  // Show current selection
  // Loading states
  // Error handling
  // Responsive design
}
```

### 2. Target Level Hook (`/src/hooks/use-target-level.ts`)
```typescript
interface UseTargetLevelResult {
  targetLevelId: string | null;
  targetLevel: DifficultyLevel | null;
  isLoading: boolean;
  error: Error | null;
  updateTargetLevel: (levelId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useTargetLevel(): UseTargetLevelResult {
  // Fetch user's current target level
  // Update target level API call
  // State management
  // Error handling
  // Optimistic updates
}
```

### 3. Update User API (`/src/app/api/user/target-level/route.ts`)
```typescript
export async function PUT(request: Request) {
  // 1. Authenticate user
  // 2. Validate target level exists
  // 3. Update user's target_level_id in database
  // 4. Return updated user data
  // 5. Handle errors gracefully
}
```

### 4. Update App Header (`/src/components/layout/AppHeader.tsx`)
```typescript
// Integrate TargetLevelSelector into header
// Position appropriately in layout
// Handle responsive design
// Connect to user state
```

### 5. Update User Store (`/src/store/user-store.ts`)
```typescript
// Add target level state management
// Sync with backend updates
// Provide reactive updates to components
```

## Implementation Steps

### Phase 1: Backend Infrastructure
1. Create API endpoint for updating user target level
2. Add validation for difficulty level existence
3. Update user schema if needed for target level tracking
4. Test API with authentication

### Phase 2: Frontend Components
1. Build TargetLevelSelector component with dropdown UI
2. Create useTargetLevel hook for state management
3. Implement optimistic updates for better UX
4. Add loading and error states

### Phase 3: Integration
1. Integrate selector into AppHeader component
2. Connect to user authentication state
3. Update user store for global state sync
4. Handle responsive design for mobile

### Phase 4: Polish & Testing
1. Add animations and transitions
2. Test with different user roles
3. Verify persistence across sessions
4. Add accessibility features

## Key Features

### User Experience
- **Prominent Display**: Clearly visible in header
- **Easy Access**: One-click level changes
- **Visual Feedback**: Loading states and success indicators
- **Responsive**: Works on all screen sizes
- **Accessible**: Keyboard navigation and screen reader support

### Technical Features
- **Real-time Updates**: Immediate UI updates with optimistic changes
- **Persistence**: Changes saved to user profile
- **Validation**: Only shows valid difficulty levels
- **Error Handling**: Graceful failure with user feedback
- **Performance**: Efficient state management and API calls

### Integration Points
- **Authentication**: Only visible to logged-in users
- **Language Filtering**: Shows levels for current language only
- **User Store**: Global state synchronization
- **Dashboard**: May affect dashboard analytics and recommendations

## Database Considerations

### User Table Updates
```sql
-- Ensure target_level_id exists and is properly indexed
ALTER TABLE users ADD CONSTRAINT fk_target_level 
  FOREIGN KEY (target_level_id) REFERENCES difficulty_levels(id);
```

### Performance
- Add index on target_level_id for faster queries
- Cache user's target level in session
- Batch updates if multiple changes needed

## Success Criteria

### Functional Requirements
1. ✅ Dropdown shows all available difficulty levels for current language
2. ✅ User can select new target level from dropdown
3. ✅ Selection immediately updates user's profile
4. ✅ Change persists across browser sessions
5. ✅ Only authenticated users can change target level
6. ✅ Current selection is clearly displayed in header

### Technical Requirements
1. ✅ API handles concurrent updates safely
2. ✅ Frontend shows loading states during updates
3. ✅ Error messages are user-friendly
4. ✅ Component is responsive and accessible
5. ✅ Changes reflect immediately in UI (optimistic updates)
6. ✅ Existing header functionality remains intact

### User Experience Requirements
1. ✅ No page reload required for level changes
2. ✅ Smooth transitions and animations
3. ✅ Clear visual indication of current level
4. ✅ Works on mobile and desktop
5. ✅ Intuitive interaction patterns

## Future Enhancements

### Advanced Features
- **Level Progress**: Show progress toward current target
- **Recommendations**: Suggest next level based on progress
- **Goals**: Set specific goals for each level
- **Achievements**: Unlock badges for level completion
- **Social**: Share level achievements with friends

### Analytics Integration
- Track level change frequency
- Monitor level progression patterns
- Analyze difficulty distribution
- Generate insights for learning paths