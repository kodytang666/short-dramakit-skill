import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { beats } from "../script";
import { theme } from "../theme";

// 顶层字幕层：永远压在最上，数据来自 script.ts 单一数据源
export const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const beat = beats.find((b) => t >= b.start && t < b.start + b.dur + 0.5);

  if (!beat) return null;

  const local = t - beat.start;
  const FIN = 0.35;
  const FOUT = 0.4;
  const opacity = interpolate(local, [0, FIN, beat.dur - FOUT, beat.dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rise = interpolate(local, [0, FIN], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const isTitle = beat.cn === "节气 · 太阳的刻度";
  const scale = beat.star && !isTitle ? 1.06 : 1;
  const starGlow = beat.star
    ? `drop-shadow(0 0 ${14 + 4 * Math.sin(t * 2.2)}px rgba(217,179,108,0.55))`
    : "none";

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 852,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `translateY(${rise}px) scale(${scale})`,
        filter: starGlow,
      }}
    >
      <div
        style={{
          fontFamily: theme.fontSerif,
          fontSize: beat.star ? theme.fontSize.subtitle + 4 : theme.fontSize.subtitle,
          color: beat.star ? theme.accent : theme.ink,
          letterSpacing: "0.08em",
          textShadow: "0 2px 18px rgba(0,0,0,0.85)",
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        {beat.cn}
      </div>
      <div
        style={{
          fontFamily: theme.fontSerif,
          fontStyle: "italic",
          fontSize: theme.fontSize.subtitleEn,
          color: theme.inkDim,
          marginTop: 10,
          letterSpacing: "0.06em",
          opacity: 0.9,
        }}
      >
        {beat.en}
      </div>
    </div>
  );
};
