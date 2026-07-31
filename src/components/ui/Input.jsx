import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(({ className, type, label, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-2.5 h-4 w-4 text-gray-500">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:placeholder:text-gray-400 dark:focus-visible:ring-primary-400",
            Icon && "pl-9",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && <p className="text-[0.8rem] font-medium text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
