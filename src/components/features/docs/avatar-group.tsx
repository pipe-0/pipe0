"use client";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AvatarGroupProps {
  providers: string[];
  providerCatalog: Record<string, { logoUrl: string; name?: string }>;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarGroup({
  providers,
  providerCatalog,
  size = "md",
  className,
}: AvatarGroupProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If no providers, return null
  if (!providers.length) return null;

  // Get the first provider to display
  const primaryProvider = providers[0];
  const remainingCount = providers.length - 1;

  // Size mapping
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  // Counter bubble size
  const bubbleSizes = {
    sm: "h-4 w-4 text-[10px]",
    md: "h-6 w-6 text-xs",
    lg: "h-7 w-7 text-sm",
  };

  // Popover width based on size
  const popoverWidths = {
    sm: "w-48",
    md: "w-56",
    lg: "w-64",
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center relative">
          <PopoverTrigger asChild>
            <div
              className="flex items-center cursor-pointer"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <Avatar className={cn("rounded-md", sizeClasses[size])}>
                <AvatarImage
                  src={
                    providerCatalog[primaryProvider]?.logoUrl ||
                    "/placeholder.svg?height=40&width=40"
                  }
                  alt={`Provider ${primaryProvider}`}
                />
                <AvatarFallback className="rounded-md">
                  {primaryProvider.substring(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Only show the counter bubble if there are additional providers */}
              {remainingCount > 0 && (
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full bg-secondary text-secondary-foreground font-medium absolute left-0 top-0 -translate-x-1/2 -translate-y-1/3",
                    bubbleSizes[size]
                  )}
                >
                  +{remainingCount}
                </div>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent
            className={cn("p-2", popoverWidths[size])}
            side="bottom"
            align="start"
            sideOffset={5}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="space-y-2">
              <h4 className="text-sm font-medium mb-2">Providers</h4>
              <div className="space-y-1.5">
                {providers.map((providerId) => {
                  const provider = providerCatalog[providerId];
                  const providerName = provider?.name || providerId;

                  return (
                    <div key={providerId} className="flex items-center gap-2">
                      <Avatar className={cn("rounded-md", "h-6 w-6")}>
                        <AvatarImage
                          src={
                            provider?.logoUrl ||
                            "/placeholder.svg?height=24&width=24"
                          }
                          alt={`Provider ${providerName}`}
                        />
                        <AvatarFallback className="rounded-md text-xs">
                          {providerName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">{providerName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </div>
      </Popover>
    </div>
  );
}
