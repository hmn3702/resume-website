import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nghia Ha | Data Analyst";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#020617",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Teal glow blob */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(20,184,166,0.12)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: 200,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(20,184,166,0.07)",
            filter: "blur(80px)",
          }}
        />

        {/* NH logo */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc", letterSpacing: -1 }}>
            NH<span style={{ color: "#14b8a6" }}>.</span>
          </span>
        </div>

        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ fontSize: 72, fontWeight: 800, color: "#f8fafc", letterSpacing: -2, lineHeight: 1 }}>
            Nghia Ha
          </span>

          {/* Title */}
          <span style={{ fontSize: 32, fontWeight: 500, color: "#14b8a6", letterSpacing: -0.5 }}>
            Data Analyst · Data Science Graduate
          </span>

          {/* Location */}
          <span style={{ fontSize: 24, color: "#94a3b8", marginTop: 8 }}>
            Brisbane, Australia · Open to opportunities
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 4,
            background: "#14b8a6",
            borderRadius: 2,
            marginTop: 48,
            marginBottom: 40,
          }}
        />

        {/* Skills row */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {["Python", "SQL", "Power BI", "Tableau", "Machine Learning"].map((skill) => (
            <div
              key={skill}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(20,184,166,0.4)",
                background: "rgba(20,184,166,0.08)",
                color: "#5eead4",
                fontSize: 20,
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
