import { PropsWithChildren, ReactNode } from "react";

export function ConditionalWrapper({
  condition,
  wrapper,
  children,
}: PropsWithChildren<{
  condition: boolean;
  wrapper: (children: ReactNode) => ReactNode;
}>) {
  return condition ? wrapper(children) : children;
}
