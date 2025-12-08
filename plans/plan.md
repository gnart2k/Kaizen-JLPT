Error: A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.

src/components/ui/select.tsx (118:3) @ _c8


  116 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
  117 | >(({ className, children, ...props }, ref) => (
> 118 |   <SelectPrimitive.Item
      |   ^
  119 |     ref={ref}
  120 |     className={cn(
  121 |       "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
