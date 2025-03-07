"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function TableOfContents() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string>("");

  const [headings, setHeadings] = useState<
    { id: string; title: string; level: number }[]
  >([]);

  // Extract headings from the page for the table of contents
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2, h3, h4"));
    const extractedHeadings = elements.map((heading) => ({
      id: heading.id,
      title: heading.textContent || "",
      level: Number.parseInt(heading.tagName.substring(1)),
    }));
    setHeadings(extractedHeadings);

    const observer = new IntersectionObserver(
      (entries) => {
        let hasPrevious = false;
        entries.forEach((entry, i) => {
          if (
            entry.isIntersecting &&
            (!hasPrevious || i === entries.length - 1)
          ) {
            hasPrevious = true;
            setActiveId(entry.target.id);
          }
        });
        if (!hasPrevious && entries[0]?.target.id) {
          setActiveId(entries[0].target.id);
        }
      },
      { rootMargin: "20px 0% -80% 0%" }
    );

    // Observe all headings
    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [pathname]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <ul className="m-0 list-none p-0">
        {headings.map((heading) => {
          return (
            <li key={heading.id} className="mt-0 pt-2">
              <a
                href={`#${heading.id}`}
                className={cn(
                  "inline-block no-underline transition-colors hover:text-foreground",
                  activeId === heading.id
                    ? "font-medium text-brand"
                    : "text-muted-foreground",
                  heading.level === 3 && "pl-4",
                  heading.level === 4 && "pl-8"
                )}
              >
                {heading.title.replace(/#+/, "")}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
