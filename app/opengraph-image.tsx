import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "BuzzieWorld — Learning, Playing & Growing Together";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F4EC",
        color: "#303746",
        padding: "70px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 92,
          fontWeight: 800,
          color: "#6B5A97",
          letterSpacing: "-4px",
        }}
      >
        BuzzieWorld
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 34,
          fontWeight: 500,
          color: "#526078",
          textAlign: "center",
        }}
      >
        Learning, playing & growing together
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 44,
          fontSize: 24,
          color: "#9A91AC",
        }}
      >
        Toys • Games • Books • Learning
      </div>
    </div>,
    size,
  );
}
