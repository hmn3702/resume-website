import { ImageResponse } from "next/og";

// Edge runtime: the Node build of @vercel/og fails to prerender on Windows (Next 14.2.5)
export const runtime = "edge";

// iOS home-screen icon (iOS applies its own rounded mask)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1d1d1f",
          color: "#f5f5f7",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: -3,
          fontFamily: "sans-serif",
        }}
      >
        NH<span style={{ color: "#2997ff" }}>.</span>
      </div>
    ),
    { ...size }
  );
}
