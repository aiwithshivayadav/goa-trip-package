import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Goa Trip Package — Premium Goa Experiences";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #05000F 0%, #0A0020 50%, #120030 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 20%, rgba(201,168,76,0.12) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(201,168,76,0.08) 0%, transparent 50%)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, #C9A84C 0%, #E8D48B 50%, #C9A84C 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                fontWeight: 800,
                color: "#05000F",
              }}
            >
              G
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 48, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 }}>
                Goa Trip
              </span>
              <span style={{ fontSize: 48, fontWeight: 800, color: "#C9A84C", lineHeight: 1.1 }}>
                Package
              </span>
            </div>
          </div>

          <div
            style={{
              width: 120,
              height: 2,
              background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
              display: "flex",
            }}
          />

          <span
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
              maxWidth: 600,
              lineHeight: 1.4,
            }}
          >
            Premium Cruises • Yachts • Packages • Activities
          </span>

          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 16,
            }}
          >
            {["1,200+ Happy Guests", "Best Price Guarantee", "24/7 Concierge"].map(
              (text) => (
                <div
                  key={text}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    border: "1px solid rgba(201,168,76,0.3)",
                    background: "rgba(201,168,76,0.08)",
                    fontSize: 14,
                    color: "#C9A84C",
                    display: "flex",
                  }}
                >
                  {text}
                </div>
              )
            )}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 24,
            fontSize: 14,
            color: "rgba(255,255,255,0.35)",
            display: "flex",
          }}
        >
          goatrippackage.in
        </div>
      </div>
    ),
    { ...size }
  );
}
