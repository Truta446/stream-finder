import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

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
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "44px solid transparent",
            borderBottom: "44px solid transparent",
            borderLeft: "72px solid #0a0a0a",
            marginLeft: 14,
          }}
        />
      </div>
    ),
    size,
  )
}
