import * as React from "react";

import { cn } from "@/lib/utils";

export interface DropdownProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}

const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <select
        className={cn(
          `flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        ref={ref}
        {...props}
      >
        <option value="">Select an artist</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);
Dropdown.displayName = "Dropdown";

export { Dropdown };
