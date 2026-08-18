import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
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
          borderRadius: 110,
          background: "linear-gradient(135deg, #f2c14e 0%, #e0a93a 100%)",
          fontSize: 300,
          fontWeight: 800,
          color: "#3a1d10",
          letterSpacing: -20,
          boxShadow: "inset 0 0 0 14px rgba(58,29,16,0.12)",
        }}
      >
        Af
      </div>
    ),
    { ...size }
  );
}