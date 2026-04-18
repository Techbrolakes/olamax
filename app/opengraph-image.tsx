import { ImageResponse } from "next/og";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/constants";

export const runtime = "edge";
export const alt = `${APP_NAME} — ${APP_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #050505 0%, #0a0a0a 45%, #140505 100%)",
          color: "#f7f7f7",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Ambient red glow, bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(220, 38, 38, 0.25)",
            filter: "blur(80px)",
          }}
        />

        {/* Header row — brand mark + eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 6,
              background: "#f7f7f7",
              color: "#050505",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 40,
              fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            O
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 14,
                letterSpacing: "0.3em",
                color: "#dc2626",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {APP_NAME}
            </div>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 14,
                letterSpacing: "0.22em",
                color: "rgba(247, 247, 247, 0.55)",
                textTransform: "uppercase",
              }}
            >
              Film concierge · AI
            </div>
          </div>
        </div>

        {/* Big headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 960,
          }}
        >
          <div
            style={{
              fontSize: 84,
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
              fontStyle: "italic",
              color: "#f7f7f7",
            }}
          >
            Don&rsquo;t know
            <br /> what to watch?
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.35,
              color: "rgba(247, 247, 247, 0.72)",
              fontFamily: "system-ui, sans-serif",
              maxWidth: 820,
            }}
          >
            {APP_DESCRIPTION}
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "system-ui, sans-serif",
            fontSize: 16,
            color: "rgba(247, 247, 247, 0.45)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: "#dc2626",
                boxShadow: "0 0 20px rgba(220, 38, 38, 0.8)",
              }}
            />
            Personalised picks · AI deep dives · Mood browsing
          </div>
          <div>{APP_TAGLINE}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
