import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
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
        }}
      >
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M30 18 L78 48 L30 78 Z" fill="#0a0a0a" />
        </svg>
      </div>
    ),
    {
      width: 192,
      height: 192,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  )
}
