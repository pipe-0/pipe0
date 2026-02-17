import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export function H1({ children, className, ...rest }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn("text-3xl font-semibold pb-2 tracking-tight", className)}
      {...rest}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className, ...rest }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-2xl tracking-tight font-semibold", className)}
      {...rest}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className, ...rest }: ComponentProps<"h3">) {
  return (
    <h3 className={cn("text-lg", className)} {...rest}>
      {children}
    </h3>
  );
}

export function H4({ children, className, ...rest }: ComponentProps<"h4">) {
  return (
    <h4 className={cn("text-md", className)} {...rest}>
      {children}
    </h4>
  );
}

export function H5({ children, className, ...rest }: ComponentProps<"h5">) {
  return (
    <h5 className={cn("text-sm", className)} {...rest}>
      {children}
    </h5>
  );
}

export function H6({ children, className, ...rest }: ComponentProps<"h6">) {
  return (
    <h6 className={cn("text-sm", className)} {...rest}>
      {children}
    </h6>
  );
}
