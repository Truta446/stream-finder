import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "ReelHuntr — find where to watch any movie or TV show"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OG() {
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
          background:
            "radial-gradient(1200px 600px at 20% 0%, rgba(34,197,94,0.2), transparent), linear-gradient(180deg, #0a0a0a 0%, #111 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              background: "#22c55e",
              borderRadius: 16,
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            ▶
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>ReelHuntr</div>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            maxWidth: 1000,
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: -1.5,
          }}
        >
          Find where to watch any movie or show
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#9ca3af",
            marginTop: 28,
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          Netflix · Prime Video · Disney+ · Max · Apple TV+ · Paramount+ · and more
        </div>
      </div>
    ),
    size,
  )
}
