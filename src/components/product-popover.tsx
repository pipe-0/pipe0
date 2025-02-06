import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function ProductPopover() {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
        Product
        <ChevronDown className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] bg-black/90 backdrop-blur-sm border-white/10">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <h4 className="font-medium leading-none">Features</h4>
            <p className="text-sm text-gray-400">
              Explore what Pipe0 can do for you
            </p>
          </div>
          <div className="grid gap-2">
            <Link
              href="#"
              className="text-sm hover:bg-white/5 p-2 rounded-md transition-colors"
            >
              Pipeline Automation
            </Link>
            <Link
              href="#"
              className="text-sm hover:bg-white/5 p-2 rounded-md transition-colors"
            >
              AI Integration
            </Link>
            <Link
              href="#"
              className="text-sm hover:bg-white/5 p-2 rounded-md transition-colors"
            >
              Enterprise Solutions
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
