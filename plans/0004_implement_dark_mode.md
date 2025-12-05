## Plan Name
Implement Dark Mode

## Files to be Created
No new files will be created. This feature involves modifying existing files.

## File Location
N/A (Modifying existing files)

## Description
Implement a dark mode feature for the application. This will involve:
1.  Modifying `tailwind.config.ts` to enable dark mode based on the `class` strategy.
2.  Updating `src/app/layout.tsx` to apply the dark mode class to the `<html>` element based on a user preference or system setting.
3.  Updating `src/components/layout/AppHeader.tsx` to include a dark mode toggle button (using `src/components/ui/switch.tsx` or similar).
4.  Ensuring all existing components and utility classes support dark mode styling using Tailwind CSS variants (e.g., `dark:bg-gray-800`).

## File Structure
### `tailwind.config.ts`
```typescript
// ... existing config
export default {
  darkMode: ['class'], // Add this line
  // ... rest of config
}
```

### `src/app/layout.tsx`
```tsx
// ... existing imports
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable
      )}>
        {/* Add a mechanism to set the 'dark' class on the html element */}
        {children}
      </body>
    </html>
  );
}
```

### `src/components/layout/AppHeader.tsx`
```tsx
// ... existing component
const AppHeader = () => {
  // ... logic to manage dark mode state and toggle function
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      {/* ... existing content */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle (e.g., a Switch component) */}
      </div>
    </header>
  );
};
```