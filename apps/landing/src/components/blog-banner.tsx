import { HighlightSection } from "@/components/highlight-section";
import { LogoRaw } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function BlogBanner() {
  return (
    <Link href="/">
      <Card className="border-input mt-20">
        <CardHeader>
          <CardDescription className="text-2xl flex items-center flex-wrap gap-4">
            <div className="grow">
              <div className="pb-4">
                <LogoRaw />
              </div>
              <div className="max-w-[500px]">
                Add{" "}
                <HighlightSection>clay-like data enrichment</HighlightSection>{" "}
                to your application. <HighlightSection>Fast.</HighlightSection>
              </div>
            </div>
            <div className="grid place-items-center py-8">
              <Button variant="secondary" className="cursor-pointer" size="lg">
                Try pipe0 <ArrowRight />
              </Button>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
