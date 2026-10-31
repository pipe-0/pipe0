import { readFile } from "fs/promises";
import { join } from "path";
import { renderPng } from "./render";

const size = {
  width: 1200,
  height: 630,
};

type OgElement = {
  title: string;
  description: string;
};

export async function resourcesImage() {
  const interLight = await readFile(
    join(process.cwd(), "assets/inter-light.ttf"),
  );
  const calSemiBold = await readFile(
    join(process.cwd(), "assets/cal-sans-semibold.ttf"),
  );

  const logo = await readFile(join(process.cwd(), "public/logo-dark.svg"));

  const element: OgElement = {
    title: "pipe0 | Documentation",
    description:
      "Enrich people and company data in infinite ways with one mighty API. Powered by AI.",
  };

  return renderPng(
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
        src={`data:image/svg+xml;base64,${logo.toString("base64")}`}
        alt="pipe0 Logo"
        height={64}
      />
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
