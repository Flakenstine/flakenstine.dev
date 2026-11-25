import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const head = await readFile(
    path.join(process.cwd(), "public/images/flak-head.png"),
    "base64",
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: 80,
          gap: 72,
          color: "#E1F8D4",
          background: "#000",
          backgroundImage:
            "radial-gradient(circle at 24% 50%, rgba(0,255,157,0.32), rgba(0,0,0,0) 50%)",
        }}
      >
        <img src={`data:image/png;base64,${head}`} alt="" width={277} height={370} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, color: "#00FF9D" }}>{site.name}</div>
          <div style={{ fontSize: 84, lineHeight: 1.05, marginTop: 20, display: "flex" }}>
            I like to make
          </div>
          <div style={{ fontSize: 84, lineHeight: 1.05, display: "flex" }}>
            cool&nbsp;<span style={{ color: "#00FF9D" }}>websites</span>.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
