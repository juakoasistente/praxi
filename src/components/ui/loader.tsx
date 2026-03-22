import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const loaderVariants = cva(
  "inline-block animate-spin",
  {
    variants: {
      variant: {
        spinner: "border-2 border-current border-t-transparent rounded-full",
        skeleton: "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer",
        pulse: "bg-current rounded-full animate-pulse"
      },
      size: {
        sm: "size-4",
        md: "size-6",
        lg: "size-8"
      }
    },
    defaultVariants: {
      variant: "spinner",
      size: "md"
    }
  }
)

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, variant, size, ...props }, ref) => {
    if (variant === "skeleton") {
      return (
        <div
          ref={ref}
          className={cn(loaderVariants({ variant, size, className }))}
          {...props}
        />
      )
    }

    if (variant === "pulse") {
      return (
        <div
          ref={ref}
          className={cn(loaderVariants({ variant, size, className }))}
          {...props}
        />
      )
    }

    // Default spinner variant with dots
    return (
      <div
        ref={ref}
        className={cn("relative", loaderVariants({ size }), className)}
        {...props}
      >
        <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
)

Loader.displayName = "Loader"

// PageLoader component for full page loading
const PageLoader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { text?: string }
>(({ className, text = "Cargando...", ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center min-h-[200px] gap-4", className)}
    {...props}
  >
    <Loader size="lg" className="text-primary" />
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
))

PageLoader.displayName = "PageLoader"

export { Loader, PageLoader, loaderVariants }