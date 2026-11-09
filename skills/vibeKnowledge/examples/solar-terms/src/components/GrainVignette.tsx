import React from "react";

// 全片常驻材质：细颗粒 grain + 暗角 vignette（见 visual-style.md §7.3）
// 噪声用 data-URI SVG 背景图，浏览器只栅格化一次，不逐帧重算；强度克制，不压字幕。
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const GrainVignette: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: NOISE,
        backgroundSize: "140px 140px",
        opacity: 0.05,
        mixBlendMode: "overlay",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)",
      }}
    />
  </div>
);
