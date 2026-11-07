import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-DEFAULT text-body-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-forest text-white hover:bg-primary active:bg-forest/95 shadow-sm",
        primary:
          "bg-primary text-white hover:bg-forest active:bg-forest/95 shadow-sm",
        secondary:
          "bg-surface-secondary text-text-primary border border-border hover:bg-sage/20",
        outline:
          "border border-border bg-surface text-text-primary hover:bg-surface-secondary hover:border-sage",
        ghost:
          "text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
        danger:
          "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger",
        "danger-outline":
          "border border-danger/30 bg-danger-subtle text-danger hover:bg-danger/15",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-sm px-3 text-caption",
        lg: "h-11 rounded-lg px-5 text-body",
        icon: "h-9 w-9 rounded-DEFAULT",
        "icon-sm": "h-8 w-8 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
