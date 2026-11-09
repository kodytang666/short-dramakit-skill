import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { Starfield, EraTag } from "../scenes/Hook";

// 场景二 V2：真实故事（圭表量影 → 淮南子竹简 → 埋悬念）14–40s，本地 t 0–26
export const StoryV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const gnomonIn = interpolate(t, [0.6, 2.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const shadowPh = interpolate(t, [3.0, 9.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const qMark = interpolate(t, [7.0, 7.6, 9.6, 10.2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sunIn = interpolate(t, [10.2, 12.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gnomonOut = interpolate(t, [12.6, 14.0], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scrollIn = interpolate(t, [13.4, 15.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const scrollOut = interpolate(t, [17.4, 19.2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blackIn = interpolate(t, [19.6, 20.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blackOut = interpolate(t, [22.6, 23.6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const orbitIn = interpolate(t, [23.4, 26.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shadowLen = 60 + 200 * shadowPh;
  const shadowOp = 0.28 + 0.15 * Math.sin(t * 3);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Starfield seed={23} drift={0.8} />
      <EraTag text="西汉 · 长安" from={0.5} />

      {/* 圭表：立杆 + 伸缩影子 + 地平刻度 */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", opacity: gnomonIn * gnomonOut, paddingBottom: 300 }}>
        <svg width={1000} height={560}>
          <line x1={60} y1={500} x2={940} y2={500} stroke={theme.line} strokeWidth={2} />
          {Array.from({ length: 13 }, (_, i) => (
            <line key={i} x1={140 + i * 60} y1={500} x2={140 + i * 60} y2={i % 4 === 0 ? 476 : 488} stroke={theme.line} strokeWidth={1.5} />
          ))}
          <line x1={500} y1={140} x2={500} y2={500} stroke={theme.ink} strokeWidth={7} strokeLinecap="round" />
          <circle cx={500} cy={136} r={6} fill={theme.accent} opacity={0.9} />
          <line x1={497} y1={496} x2={497 - shadowLen * 2.2} y2={496} stroke={theme.accent} strokeWidth={10} strokeLinecap="round" opacity={0.75} />
          <line x1={778} y1={192} x2={503} y2={142} stroke={theme.accent} strokeWidth={2} strokeDasharray="8 8" opacity={0.5 * sunIn} />
          <line x1={503} y1={146} x2={497 - shadowLen * 2.2 + 6} y2={494} stroke={theme.accent} strokeWidth={2} strokeDasharray="8 8" opacity={0.35 * sunIn} />
          <text x={497 - shadowLen * 1.1} y={534} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={28} fill={theme.inkDim}>
            {shadowPh < 0.5 ? "夏至 · 影短" : "冬至 · 影长"}
          </text>
          <text x={500} y={108} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={30} fill={theme.ink}>表 · 正午测影</text>
          {/* 问号（b07 悬念） */}
          <text x={500} y={190} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={64} fill={theme.accent} opacity={qMark}>？</text>
          {/* 月 → 日 */}
          <g opacity={sunIn}>
            <circle cx={780} cy={190} r={44} fill={theme.accent} opacity={0.9} />
            <circle cx={780} cy={190} r={60} fill="none" stroke={theme.accent} strokeWidth={1.5} opacity={0.4} />
            <text x={780} y={280} textAnchor="middle" fontFamily={theme.fontMono} fontSize={24} fill={theme.accent}>太阳</text>
          </g>
          <g opacity={1 - sunIn}>
            <circle cx={780} cy={190} r={36} fill="none" stroke={theme.inkDim} strokeWidth={2} />
            <circle cx={792} cy={182} r={34} fill={theme.bg0} />
          </g>
        </svg>
      </div>

      {/* 竹简《淮南子》 */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: scrollIn * scrollOut }}>
        <svg width={1100} height={420}>
          {Array.from({ length: 9 }, (_, i) => {
            const x = 40 + i * 122 + Math.sin(t * 1.2 + i) * 1.5;
            return (
              <g key={i} opacity={0.95}>
                <rect x={x} y={40} width={10} height={340} fill={theme.accent} opacity={0.55} rx={2} />
                <rect x={x + 10} y={40} width={104} height={340} fill="#0E0E1C" stroke={theme.line} strokeWidth={1} />
                {Array.from({ length: 6 }, (_, j) => (
                  <text key={j} x={x + 62} y={100 + j * 46} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={30} fill={j === 1 || j === 4 ? theme.accent : theme.inkDim} opacity={j === 1 || j === 4 ? 0.95 : 0.55}>
                    {["二", "十", "四", "节", "气", "·"][j]}
                  </text>
                ))}
              </g>
            );
          })}
          <g opacity={interpolate(t, [15.4, 16.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <rect x={880} y={300} width={110} height={110} rx={8} fill="none" stroke={theme.alert} strokeWidth={3} />
            <text x={935} y={352} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={34} fill={theme.alert}>淮南</text>
            <text x={935} y={392} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={34} fill={theme.alert}>子</text>
          </g>
        </svg>
      </div>

      {/* b11 强调：黑场重音（"地球跑得并不匀"） */}
      {blackIn * blackOut > 0.01 && (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 46%, rgba(217,179,108,0.10), rgba(5,5,16,0.96) 62%)", opacity: blackIn * blackOut }} />
      )}

      {/* b12 过渡：轨道线开始生长，接机制段 */}
      {orbitIn > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: orbitIn * 0.9 }}>
          <svg width={640} height={640}>
            <circle cx={320} cy={320} r={240} fill="none" stroke={theme.ink} strokeWidth={2} opacity={0.5}
              strokeDasharray={1508} strokeDashoffset={1508 * (1 - orbitIn)} transform="rotate(-90 320 320)" />
            <circle cx={320} cy={320} r={30} fill={theme.accent} opacity={0.8} />
          </svg>
        </div>
      )}
    </div>
  );
};
