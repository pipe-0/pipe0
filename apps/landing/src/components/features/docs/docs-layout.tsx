import CopyToClipboard from "@/components/copy-to-clipboard";
import { HeaderVideoSection } from "@/components/features/docs/header-video-section";
import { H1 } from "@/components/headings";
import { TextLink } from "@/components/text-link";
import { cn } from "@/lib/utils";
import { ProviderName } from "@pipe0/elements";
import { Fragment, PropsWithChildren, ReactNode } from "react";

export function CatalogHeader({
  children,
  label,
  deprecationAlert,
  id,
  description,
  video,
  availableVersions,
  tags,
}: PropsWithChildren<{
  defaultProviders: ProviderName[];
  label: string;
  deprecationAlert?: ReactNode;
  id: string;
  description: string;
  video: string | undefined;
  availableVersions?: {
    displayValue: ReactNode;
    link: string;
    isDeprecated: boolean;
  }[];
  tags?: string[];
}>) {
  const hasMetadata =
    (availableVersions && availableVersions.length > 0) ||
    (tags && tags.length > 0);

  return (
    <div>
      <div className="">
        <div className="flex gap-2">
          <H1>{label}</H1>
          {hasMetadata && availableVersions && availableVersions.length > 0 && (
            <div className="flex items-baseline gap-3">
              <div>
                {availableVersions.map((e, index) => (
                  <Fragment key={e.link + index}>
                    <TextLink
                      className={cn(
                        "text-sm",
                        e.isDeprecated && "line-through",
                      )}
                      href={e.link}
                    >
                      {e.displayValue}
                    </TextLink>
                    {index < availableVersions.length - 1 && ", "}
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="text-lg text-muted-foreground pb-3">{description}</p>

        <div className="flex items-center gap-3 pb-4">
          <CopyToClipboard value={id} className="" />
        </div>
      </div>

      <div className="space-y-9 py-5">
        {deprecationAlert}

        {children}

        {video && <HeaderVideoSection videoUrl={video} />}
      </div>
    </div>
  );
}

export function CatalogPageLayout({ children }: PropsWithChildren<{}>) {
  return <section className="">{children}</section>;
}
