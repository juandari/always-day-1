import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  align?: "left" | "center" | "right"
  children?: React.ReactNode
}

const TextDivider = React.forwardRef<HTMLDivElement, TextDividerProps>(
  ({ className, orientation = "horizontal", align = "center", children, ...props }, ref) => {
    const isHorizontal = orientation === "horizontal"

    if (isHorizontal) {
      return (
        <div ref={ref} className={cn("flex items-center w-full my-4", className)} {...props}>
          <div
            className={cn(
              "h-px flex-grow bg-border",
              align === "left" ? "flex-grow-0 w-8" : "",
              align === "right" ? "flex-grow" : "",
            )}
          />

          {children && (
            <div
              className={cn(
                "px-3 text-sm text-muted-foreground",
                align === "left" ? "pl-0" : "",
                align === "right" ? "pr-0" : "",
              )}
            >
              {children}
            </div>
          )}

          <div
            className={cn(
              "h-px flex-grow bg-border",
              align === "left" ? "flex-grow" : "",
              align === "right" ? "flex-grow-0 w-8" : "",
            )}
          />
        </div>
      )
    }

    // Vertical orientation
    return (
      <div ref={ref} className={cn("inline-flex flex-col items-center h-full mx-2", className)} {...props}>
        <div className="w-px flex-grow bg-border" />

        {children && <div className="py-3 text-sm text-muted-foreground">{children}</div>}

        <div className="w-px flex-grow bg-border" />
      </div>
    )
  },
)

TextDivider.displayName = "TextDivider"

export { TextDivider }

