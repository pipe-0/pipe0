import CopyToClipboard from "@/components/copy-to-clipboard";
import { AvatarGroup } from "@/components/features/docs/avatar-group";
import { HeaderVideoSection } from "@/components/features/docs/header-video-section";
import { TextLink } from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { providerCatalog, ProviderName } from "@pipe0/client-sdk";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Fragment, PropsWithChildren, ReactNode } from "react";

export function CatalogHeader({
  children,
  defaultProviders,
  label,
  deprecationAlert,
  id,
  description,
  video,
}: PropsWithChildren<{
  defaultProviders: ProviderName[];
  label: string;
  deprecationAlert?: ReactNode;
  id: string;
  description: string;
  video: string | undefined;
}>) {
  return (
    <div className="space-y-8 px-4 py-5 bg-accent border">
      <div>
        <div className="flex items-end gap-2">
          <AvatarGroup
            providers={defaultProviders}
            providerCatalog={providerCatalog}
          />
          <h1 className="text-3xl font-bold text-left pb-4 leading-3">
            {label}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">{description}</p>
        <CopyToClipboard value={id} className="mt-3" />
      </div>

      {deprecationAlert}

      {children}

      {video && <HeaderVideoSection videoUrl={video} />}
    </div>
  );
}

export function CatalogPageLayout({
  breadCrumps,
  backLink,
  sidebar,
  children,
}: PropsWithChildren<{
  breadCrumps: ReactNode;
  backLink: string;
  sidebar: ReactNode;
}>) {
  return (
    <div className="max-w-[var(--nextra-content-width)] pt-6 pb-24 grid md:grid-cols-[200px_1fr] gap-3 mx-auto px-7">
      <aside className="space-y-8 hidden md:block">
        <div>
          <Link href={backLink}>
            <Button variant="ghost" className="px-0">
              <ArrowLeft /> Return to Catalog
            </Button>
          </Link>
        </div>
        <div>{sidebar}</div>
      </aside>
      <section className="">
        <div className="pb-3">{breadCrumps}</div>
        <div>{children}</div>
      </section>
    </div>
  );
}

export function AvailableVersions({
  availableVersions,
}: {
  availableVersions: {
    displayValue: ReactNode;
    link: string;
    isDeprecated: boolean;
  }[];
}) {
  return (
    <div>
      <h3 className="font-semibold text-sm pb-4">Available versions</h3>
      <div>
        {availableVersions.map((e, index) => {
          return (
            <Fragment key={e.link}>
              <TextLink
                className={cn("text-sm", e.isDeprecated && "line-through")}
                href={e.link}
              >
                {e.displayValue}
              </TextLink>
              {index < availableVersions.length - 1 && ", "}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="max-w-[150px]">
      <h3 className="font-semibold text-sm pb-4">Tags</h3>
      {tags && tags.length > 0 && (
        <div className="text-sm">
          {tags.map((tag, index) => (
            <Fragment key={tag}>
              <TextLink
                href={`/resources/search-catalog?type=tag&value=${encodeURI(
                  tag
                )}`}
              >
                {tag}
              </TextLink>
              {index < tags.length - 1 && ", "}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
