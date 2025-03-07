import { getPipePageBySlug } from "@/lib/pipes";
import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { join } from "path";

export const alt = "pipe0";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ slug }: { slug: string }) {
  const pipePage = await getPipePageBySlug(slug);

  const interLight = await readFile(
    join(process.cwd(), "src/assets/inter-light.ttf")
  );
  const calSemiBold = await readFile(
    join(process.cwd(), "src/assets/cal-sans-semibold.ttf")
  );

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
          {pipePage?.label || "pipe0 Documentation: Pipes"}
        </div>
        <div style={{ color: "#A1A1AB", fontSize: 32 }}>
          {pipePage?.description || "Pipe description missing"}
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
