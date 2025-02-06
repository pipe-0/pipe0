import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export default function EmailForm() {
  return (
    <div className="flex flex-col sm:flex-row items-center p-2 rounded-full border-2 border-white/40 bg-white/5">
      <Input
        type="email"
        placeholder="Business email"
        className="flex-grow bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-white/50"
      />
      <Button className="mt-2 sm:mt-0 font-normal text-black rounded-full sm:w-auto bg-green-200 hover:bg-green-300 ">
        Request Access
        <ArrowRight size={15} className="" />
      </Button>
    </div>
  );
}
