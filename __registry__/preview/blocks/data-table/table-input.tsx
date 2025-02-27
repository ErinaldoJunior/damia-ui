"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  focused?: boolean;
  label?: string;
  helperText?: string;
  /** Define the width of the input container, e.g. "500px", "100%", etc. */
  width?: string;
  variant?: "default" | "searchWithBadge" | "inputWithSelect" | "inputNote";
  searchItem?: string;
  searchFocus?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      error,
      success,
      disabled,
      width,
      value,
      variant,
      searchFocus,
      focused,
      ...props
    },
    ref
  ) => {
    if (variant === "searchWithBadge") {
      const StartIcon = startIcon;

      return (
        <div
          className={cn("flex flex-col items-start gap-1", className)}
          style={{ width: width || "360px" }}
        >
          <div className="w-full relative">
            {StartIcon && (
              <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2">
                <StartIcon size={16} className="text-[#474752]" />
              </div>
            )}
            <input
              type={type}
              disabled={disabled}
              className={cn(
                "flex h-9 w-full pl-8 rounded-md border border-input bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#474752] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className,
                searchFocus ? "bg-prim-surf-subtle" : ""
              )}
              ref={ref}
              {...props}
            />
          </div>

          {props.helperText && (
            <p
              style={{
                fontSize: "12px",
              }}
              className={cn(
                "text-grey-text-caption",
                error
                  ? "text-error-text-label"
                  : success
                  ? "text-succ-text-label"
                  : ""
              )}
            >
              {props.helperText}
            </p>
          )}
        </div>
      );
    } else if (variant === "inputWithSelect") {
      return (
        <input
          type={type}
          value={value}
          className={cn(
            "flex h-9 w-[40%] rounded-md border border-input rounded-l-none bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      );
    } else if (variant === "inputNote") {
      return (
        <input
          type={type}
          value={value}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "flex w-full px-2 py-3 bg-transparent text-body-small rounded-md   transition-colors focus-visible:border file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring",
            focused ? "border border-grey-border-medium" : "",
            className
          )}
          ref={ref}
          {...props}
        />
      );
    } else {
      return (
        <input
          type={type}
          value={value}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-0 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-body-small",
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }
  }
);

Input.displayName = "Input";

export { Input };
