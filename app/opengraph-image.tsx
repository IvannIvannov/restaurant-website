import { ImageResponse } from "next/og";

export const alt = "RESTAURANT — Dining, menu and reservations";

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

        position: "relative",

        display: "flex",

        alignItems: "center",
        justifyContent: "center",

        overflow: "hidden",

        background: "#151815",

        color: "#f4efe5",
      }}
    >
      <div
        style={{
          position: "absolute",

          width: "760px",
          height: "760px",

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(65,88,67,0.55) 0%, rgba(65,88,67,0.18) 38%, transparent 70%)",

          top: "-280px",
          right: "-180px",
        }}
      />

      <div
        style={{
          position: "absolute",

          width: "550px",
          height: "550px",

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(65,88,67,0.28) 0%, transparent 70%)",

          bottom: "-300px",
          left: "-100px",
        }}
      />

      <div
        style={{
          position: "absolute",

          inset: "38px",

          border: "1px solid rgba(244,239,229,0.12)",

          display: "flex",
        }}
      />

      <div
        style={{
          position: "relative",

          display: "flex",

          width: "100%",

          flexDirection: "column",

          alignItems: "center",
          justifyContent: "center",

          padding: "80px",

          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",

            marginBottom: "34px",

            color: "#8ea18f",

            fontSize: "20px",

            fontWeight: 600,

            letterSpacing: "8px",
          }}
        >
          DINING · MOMENTS
        </div>

        <div
          style={{
            display: "flex",

            color: "#f4efe5",

            fontFamily: "serif",

            fontSize: "112px",

            fontWeight: 500,

            lineHeight: 0.9,

            letterSpacing: "-5px",
          }}
        >
          RESTAURANT
        </div>

        <div
          style={{
            display: "flex",

            marginTop: "38px",

            color: "rgba(244,239,229,0.62)",

            fontSize: "22px",

            letterSpacing: "2px",
          }}
        >
          MENU · EVENTS · RESERVATIONS
        </div>

        <div
          style={{
            display: "flex",

            width: "64px",
            height: "3px",

            marginTop: "42px",

            background: "#415843",
          }}
        />
      </div>
    </div>,
    {
      ...size,
    },
  );
}
