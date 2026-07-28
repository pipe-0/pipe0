import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "pipe0";
export const size = {
  width: 1200,
  height: 630,
};

type OgElement = {
  title: string;
  description: string;
};

export const contentType = "image/png";

export default async function Image() {
  const interLight = await readFile(
    join(process.cwd(), "assets/inter-light.ttf"),
  );
  const calSemiBold = await readFile(
    join(process.cwd(), "assets/cal-sans-semibold.ttf"),
  );

  const element: OgElement = {
    title: "Revenue systems, at any scale.",
    description:
      "A Slack copilot for reps, always-on plays for the team, and the enrichment and routing infrastructure underneath.",
  };

  return new ImageResponse(
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
      <img src="https://pipe0.com/logo-dark.svg" alt="pipe0 Logo" height={64} />
      <div style={{ color: "white", fontSize: 64, fontFamily: "Inter" }}>
        {element.title}
      </div>
      <div style={{ color: "#A1A1AB", fontSize: 32 }}>
        {element.description}
      </div>
    </div>,
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
    },
  );
}
