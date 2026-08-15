import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf8f4",
          backgroundImage:
            "linear-gradient(135deg, #f1ece2 0%, #faf8f4 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            color: "#1f6f5c",
            letterSpacing: -2,
          }}
        >
          日本旅行図鑑
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 36,
            color: "#83786c",
          }}
        >
          日本を旅して、図鑑を埋めよう。
        </div>
      </div>
    ),
    { ...size }
  );
}
