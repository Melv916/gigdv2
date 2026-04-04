import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1rem] text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:transform-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_12px_28px_hsl(var(--primary)/0.26)] hover:-translate-y-0.5 hover:bg-primary/95",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_14px_28px_hsl(var(--destructive)/0.18)] hover:-translate-y-0.5 hover:bg-destructive/92",
        outline: "border border-input/90 bg-background/55 text-foreground hover:-translate-y-0.5 hover:bg-accent/80 hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/85",
        ghost: "hover:bg-accent/80 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "border border-white/10 bg-[linear-gradient(135deg,#2F8CFF_0%,#36B8FF_48%,#22D3EE_100%)] text-[#081525] font-semibold shadow-[0_18px_38px_rgba(34,211,238,0.18)] hover:-translate-y-0.5 hover:brightness-[1.03]",
        "hero-outline": "border border-primary/30 bg-[linear-gradient(180deg,rgba(16,28,51,0.72)_0%,rgba(12,21,38,0.8)_100%)] text-[#D7E8FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:-translate-y-0.5 hover:border-primary/55 hover:bg-primary/10",
        glow: "bg-[linear-gradient(135deg,rgba(47,140,255,0.9)_0%,rgba(34,211,238,0.95)_100%)] text-primary-foreground font-semibold shadow-[0_20px_44px_rgba(34,211,238,0.24)] hover:-translate-y-0.5 hover:brightness-[1.04]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-3.5 text-[13px]",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
