import { ImageResponse } from "next/og";
import { PERSON_HEADLINE, PERSON_NAME } from "@/lib/identity";

export const alt = `${PERSON_NAME} | ${PERSON_HEADLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0c0c0e",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#7dd3fc" }}>
          Portfolio
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2, marginTop: 18 }}>{PERSON_NAME}</div>
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.78)", marginTop: 16 }}>{PERSON_HEADLINE}</div>
        <div style={{ fontSize: 22, color: "rgba(255,255,255,0.45)", marginTop: 36 }}>
          Potato Bazaar · Nexus · Resumind · CodeMace · Tybee Go
        </div>
      </div>
    ),
    size,
  );
}
