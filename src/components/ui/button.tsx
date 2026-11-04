import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-[color,background-color,transform] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5e5e3] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 disabled:active:scale-100",
  {
    variants: {
      variant: {
        default: "bg-[#e5e5e3] text-[#1b1b1b] hover:bg-[#d8d8d5]",
        outline:
          "border border-[#e4e4e2] bg-[#ffffff] text-[#1b1b1b] hover:border-[#e5e5e3]",
      },
      size: {
        default: "min-h-12 px-5",
        sm: "min-h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  size,
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  );
}
