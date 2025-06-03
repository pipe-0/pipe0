import { PropsWithChildren } from "react";

export function ExamplePage({ children }: PropsWithChildren) {
  return <div className="max-w-6xl pt-12 pb-24 mx-auto">{children}</div>;
}
