import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { beats, TITLE } from "../script-v2";
import { theme } from "../theme";

// 顶层字幕层：永远压在最上；严格按 [start, start+dur] 显示，
// 拍与拍之间自然留出无字幕纯画面（无字幕预算 25–40%）
export const SubtitleV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const beat = beats.find((b) => t >= b.start && t < b.start + b.dur);

  if (!beat) return null;
  // 片名卡不重复出字幕；screen 拍由画面大字承担，字幕层不重复
  if (beat.cn === TITLE.cn || beat.screen) return null;

  const local = t - beat.start;
  const FIN = 0.32;
  const FOUT = 0.35;
  const opacity = interpolate(local, [0, FIN, beat.dur - FOUT, beat.dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rise = interpolate(local, [0, FIN], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const scale = beat.star ? 1.05 : 1;
  const starGlow = beat.star
    ? `drop-shadow(0 0 ${13 + 4 * Math.sin(t * 2.2)}px rgba(217,179,108,0.5))`
    : "none";

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 850,
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
