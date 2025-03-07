import { DocsPage } from "@/lib/docs";
import { getBaseUrl } from "@/lib/utils";
import { readFile } from "fs/promises";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { join } from "path";

export const alt = "pipe0";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const interLight = await readFile(
    join(process.cwd(), "src/assets/inter-light.ttf")
  );
  const calSemiBold = await readFile(
    join(process.cwd(), "src/assets/cal-sans-semibold.ttf")
  );

  const docPage = (await fetch(`${getBaseUrl()}/api/docs/${params.slug}`).then(
    (res) => {
      if (!res.ok) return notFound();
      return res.json();
    }
  )) as DocsPage;
  // const docPage = await getDocPageBySlug(params.slug);

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
        <div style={{ color: "#A1A1AB", fontSize: 32, fontFamily: "Cal" }}>
          {docPage?.description || "Pipe description missing"}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interLight,
          style: "normal",
          weight: 400,
        },
        {
          name: "Cal",
          data: calSemiBold,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
