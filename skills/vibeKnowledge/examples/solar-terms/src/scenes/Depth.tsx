import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { theme } from "../theme";
import { OrbitDisk } from "../components/OrbitDisk";
import { Starfield, EraTag } from "./Hook";

// 场景四：历史纵深 100–116.5s（本地 t 0–16.5）
export const Depth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const bookIn = spring({ frame: frame - 5, fps, damping: 200 });
  const bookOut = interpolate(t, [6, 7], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const diskIn = interpolate(t, [7, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const obIn = interpolate(t, [10, 11], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sealDrop = spring({ frame: frame - (13 * fps) | 0, fps, damping: 12, mass: 0.8 });
  const obOut = interpolate(t, [15, 16], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Starfield seed={77} drift={0.6} />
      <EraTag text="清 · 1645 定气法" from={0.5} />

      {/* 历书 */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: bookIn * bookOut }}>
        <svg width={620} height={720}>
          <rect x={40} y={40} width={540} height={640} rx={6} fill="#101020" stroke={theme.accent} strokeWidth={2.5} opacity={0.95} />
          <rect x={64} y={64} width={492} height={592} fill="none" stroke={theme.line} strokeWidth={1} />
          <text x={310} y={200} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={92} fill={theme.accent} letterSpacing={18}>
            時憲
          </text>
          <text x={310} y={310} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={92} fill={theme.accent} letterSpacing={18}>
            曆
          </text>
          <line x1={160} y1={360} x2={460} y2={360} stroke={theme.line} />
          <text x={310} y={430} textAnchor="middle" fontFamily={theme.fontMono} fontSize={26} fill={theme.inkDim}>
            依太阳黄经定节气
          </text>
          <text x={310} y={478} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={30} fill={theme.ink} opacity={0.85}>
            清顺治二年 · 颁行
          </text>
        </svg>
      </div>

      {/* 小号轨道盘：网格闪亮（15° 一格） */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: diskIn * obOut }}>
        <OrbitDisk sceneT={t + 8} mode="run" tickProg={interpolate(t, [7, 9.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} markersOn scale={0.72} starGlowPulse={1} />
      </div>

      {/* 天文台剪影 + 星轨 */}
      <div style={{ position: "absolute", inset: 0, opacity: obIn * obOut }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* 星轨弧线（圆弧同心） */}
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} cx={960} cy={1300} r={400 + i * 90} fill="none" stroke={theme.inkDim} strokeWidth={1.4} opacity={0.35}
              strokeDasharray="6 10" style={{ transformOrigin: "960px 1300px" }} />
          ))}
          {/* 圆顶剪影 */}
          <path d="M 780 980 L 780 850 A 180 180 0 0 1 1140 850 L 1140 980 Z" fill="#0A0A18" stroke={theme.line} strokeWidth={2} />
          <rect x={860} y={840} width={100} height={12} fill={theme.line} transform="rotate(-18 910 846)" />
          <text x={960} y={1040} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={30} fill={theme.inkDim}>
            紫金山天文台 · 历书编算
          </text>
        </svg>
      </div>

      {/* 非遗印章 */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: sealDrop }}>
        <svg width={420} height={420} style={{ transform: `translateY(${(1 - sealDrop) * -60}px)` }}>
          <rect x={60} y={60} width={300} height={300} rx={16} fill="none" stroke={theme.accent} strokeWidth={4} />
          <text x={210} y={175} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={56} fill={theme.accent}>
            人类非遗
          </text>
          <text x={210} y={245} textAnchor="middle" fontFamily={theme.fontMono} fontSize={28} fill={theme.accent}>
            UNESCO · 2016
          </text>
          <text x={210} y={310} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={30} fill={theme.inkDim}>
            二十四节气
          </text>
        </svg>
      </div>
    </div>
  );
};
