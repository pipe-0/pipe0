import { DocsPage } from "@/lib/docs";
import { getBaseUrl } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

export const alt = "pipe0";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const url = `${getBaseUrl()}/api/docs/${slug}`;
  let docPage: DocsPage | null = null;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed with status: ${res.status}`);
    docPage = (await res.json()) as DocsPage;
  } catch (error) {
    console.error("Error fetching docPage:", error);
    return notFound();
  }

  console.log({ url, docPage });
  if (!docPage) return notFound();

  const [inter, calSans] = await Promise.all([
    fetch(new URL("../../../../assets/inter-light.ttf", import.meta.url)).then(
      (res) => res.arrayBuffer()
    ),
    fetch(
      new URL("../../../../assets/cal-sans-semibold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer()),
  ] as const);

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#0E172A",
          width: "100%",
          height: "100%",
          display: "flex",
          gap: "64px",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0px 128px",
        }}
      >
        <img
          src="https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/511b41c0-b91f-47ee-42f8-19df1b544100/ogimage"
          alt="pipe0 Logo"
          height="64"
        />
        <div style={{ color: "white", fontSize: 64, fontFamily: "Inter" }}>
          {docPage?.title || "pipe0 Documentation"}
        </div>
        <div style={{ color: "#A1A1AB", fontSize: 32 }}>
          {docPage?.description || "Pipe description missing"}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: inter,
          style: "normal",
          weight: 400,
        },
        {
          name: "Cal",
          data: calSans,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
