import { ImageResponse } from "next/og";

// Edge runtime: the Node build of @vercel/og fails to prerender on Windows (Next 14.2.5)
export const runtime = "edge";

// Favicon — mirrors the "NH." wordmark in the navbar
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
          color: "#f5f5f7",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: -0.5,
          fontFamily: "sans-serif",
        }}
      >
        NH<span style={{ color: "#2997ff" }}>.</span>
      </div>
    ),
    { ...size }
  );
}
