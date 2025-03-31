import cn from "clsx";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, FC, ReactNode } from "react";

export const Feature: FC<
  {
    large?: boolean;
    centered?: boolean;
    children: ReactNode;
    lightOnly?: boolean;
    href?: string;
    index: number;
  } & ComponentProps<"div">
> = ({ large, centered, children, lightOnly, className, href, ...props }) => {
  return (
    <div
      className={cn(
        "relative p-6 md:p-7 bg-white text-black rounded-[1.78em] overflow-hidden",
        "shadow-[0_8px_16px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.03)]",
        "dark:bg-[#202020] dark:text-white dark:shadow-[0_0_0_1px_rgba(82,82,82,0.6)]",
        large && "md:col-span-2",
        centered && "text-center",
        lightOnly && "dark:bg-white dark:text-black",
        className
      )}
      {...props}
    >
      {children}
      {href && (
        <Link
          className={cn(
            "absolute right-4 bottom-4 z-[2] w-10 h-10",
            "bg-black/39 backdrop-blur-[10px] rounded-full",
            "flex justify-center items-center",
            "text-white/90",
            "shadow-[0_0_0_2px_rgba(154,154,154,0.56),0_0_30px_rgba(0,0,0,0.1)]",
            "hover:text-white hover:bg-[rgba(64,64,64,0.39)]",
            "hover:shadow-[0_0_0_2px_rgba(220,220,220,0.56),0_0_30px_rgba(0,0,0,0.1)]",
            "active:text-white/80 active:bg-[rgba(22,22,22,0.39)]",
            "active:shadow-[0_0_0_2px_rgba(178,178,178,0.56),0_0_30px_rgba(0,0,0,0.1)]",
            "focus-visible:nextra-focus"
          )}
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          <ArrowRightIcon height="24" />
        </Link>
      )}
    </div>
  );
};

export const Features: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
      {children}
    </div>
  );
};
