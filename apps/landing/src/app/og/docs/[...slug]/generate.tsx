import type { ReactNode } from "react";
import { readFile } from "fs/promises";
import { join } from "path";

export interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
}

const font = readFile(join(process.cwd(), "assets/inter-light.ttf")).then(
  (data) => ({
    name: "Inter",
    data,
    weight: 400 as const,
  }),
);

const fontBold = readFile(
  join(process.cwd(), "assets/cal-sans-semibold.ttf"),
).then((data) => ({
  name: "Inter",
  data,
  weight: 600 as const,
}));

export async function getImageResponseOptions() {
  return {
    width: 1200,
    height: 630,
    fonts: await Promise.all([font, fontBold]),
  };
}

export function generate({ title, description }: GenerateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#FAFAFA",
        fontFamily: "Inter",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "6px",
          background: "linear-gradient(90deg, #2B2B2B 0%, #888 100%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "60px 72px",
          justifyContent: "space-between",
        }}
      >
        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: 600,
              color: "#1A1A1A",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </span>
          {description && (
            <span
              style={{
                fontSize: "28px",
                color: "#6B6B6B",
                lineHeight: 1.5,
              }}
            >
              {description}
            </span>
          )}
        </div>

        {/* Footer: Logo + site name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 1194 1215"
            fill="none"
          >
            <path
              d="M958.437 779.284L884.995 774.301L925.069 833.976C936.02 850.271 936.853 871.075 927.232 887.739L854.48 1013.75C844.859 1030.41 826.428 1040.09 806.839 1038.76L392.743 1010.66C376.369 1009.55 361.338 1000.87 352.191 987.243L120.8 642.672C109.859 626.384 109.028 605.581 118.649 588.917L191.401 462.907C201.022 446.243 219.451 436.565 239.03 437.892L312.473 442.876L272.399 383.2C261.458 366.911 260.626 346.108 270.247 329.444L342.999 203.434C352.62 186.77 371.05 177.092 390.629 178.419L804.731 206.523C821.103 207.636 836.134 216.314 845.283 229.936L1076.67 574.504C1087.62 590.799 1088.45 611.602 1078.83 628.267L1006.08 754.276C996.458 770.941 978.027 780.618 958.437 779.284Z"
              stroke="#5C5E63"
              strokeWidth="120"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M237.186 436.769L651.288 464.873C667.66 465.985 682.692 474.664 691.841 488.285L923.225 832.853C934.176 849.148 935.009 869.952 925.388 886.616L852.636 1012.63C843.015 1029.29 824.584 1038.97 804.994 1037.63L390.898 1009.53C374.525 1008.42 359.493 999.745 350.346 986.12L118.956 641.549C108.015 625.261 107.184 604.458 116.805 587.794L189.556 461.784C199.177 445.12 217.607 435.442 237.186 436.769Z"
              fill="#E8E8E8"
              stroke="#5C5E63"
              strokeWidth="37"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M388.785 177.295L802.888 205.399C819.259 206.511 834.291 215.19 843.44 228.812L1074.82 573.38C1085.78 589.675 1086.61 610.478 1076.99 627.143L1004.24 753.152C994.614 769.816 976.184 779.494 956.594 778.16L542.497 750.06C526.126 748.948 511.094 740.269 501.945 726.647L270.555 382.076C259.615 365.787 258.783 344.984 268.404 328.32L341.156 202.31C350.777 185.646 369.207 175.968 388.785 177.295Z"
              fill="white"
              stroke="#5C5E63"
              strokeWidth="37"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
            }}
          >
            pipe0
          </span>
          <span
            style={{
              fontSize: "22px",
              color: "#999",
              marginLeft: "8px",
            }}
          >
            Documentation
          </span>
        </div>
      </div>
    </div>
  );
}
