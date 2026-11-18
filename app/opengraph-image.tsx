import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nghia Ha | Data Analyst";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mirrors the site's default (light) palette in app/globals.css
const COLORS = {
  background: "#f5f5f7", // --card
  foreground: "#1d1d1f", // --foreground
  accent: "#0066cc",     // --accent
  muted: "#515154",      // --muted
  border: "#e0e0e0",     // --border
};

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: COLORS.background,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          borderBottom: `12px solid ${COLORS.accent}`,
        }}
      >
        {/* NH. wordmark (same as navbar) */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: COLORS.foreground, letterSpacing: -1 }}>
            NH<span style={{ color: COLORS.accent }}>.</span>
          </span>
        </div>

        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ fontSize: 80, fontWeight: 700, color: COLORS.foreground, letterSpacing: -2.5, lineHeight: 1 }}>
            Nghia Ha
          </span>

          {/* Title */}
          <span style={{ fontSize: 34, fontWeight: 500, color: COLORS.accent, letterSpacing: -0.5 }}>
            Data Analyst · Data Science Graduate
          </span>

          {/* Location */}
          <span style={{ fontSize: 24, color: COLORS.muted, marginTop: 8 }}>
            Brisbane, Australia · Open to opportunities
          </span>
        </div>

        {/* Skills row — outlined pills like .button-secondary */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 56 }}>
          {["Python", "SQL", "Power BI", "Tableau", "Machine Learning"].map((skill) => (
            <div
              key={skill}
              style={{
                padding: "10px 22px",
                borderRadius: 999,
                border: `1.5px solid ${COLORS.accent}`,
                background: "#ffffff",
                color: COLORS.accent,
                fontSize: 21,
                fontWeight: 500,
              }}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
