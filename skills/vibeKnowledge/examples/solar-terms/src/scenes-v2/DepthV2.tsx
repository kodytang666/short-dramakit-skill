import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { theme } from "../theme";
import { OrbitDisk } from "../components/OrbitDisk";
import { Starfield, EraTag } from "../scenes/Hook";

// 场景四 V2：历史纵深 95–116.5s，本地 t 0–21.5
export const DepthV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  const driftIn = interpolate(t, [0.2, 1.2, 2.6, 3.2], [0, 1, 1, 0], clamp);
  const bookIn = spring({ frame: frame - Math.round(3.2 * fps), fps, damping: 200 });
  const bookOut = interpolate(t, [6.0, 6.8], [1, 0], clamp);
  const diskIn = interpolate(t, [6.4, 7.4], [0, 1], clamp);
  const diskOut = interpolate(t, [9.4, 10.0], [1, 0], clamp);
  const obIn = interpolate(t, [9.8, 11.0], [0, 1], clamp);
  const obOut = interpolate(t, [12.6, 13.2], [1, 0], clamp);
  const quoteIn = interpolate(t, [13.0, 13.8, 15.6, 16.2], [0, 1, 1, 0], clamp);
  const youIn = interpolate(t, [16.4, 17.4], [0, 1], clamp);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Starfield seed={77} drift={driftIn > 0.5 ? 5 : 0.6} />
      <EraTag text="清 · 1645 定气法" from={0.5} />

      {/* b28 冬至点漂移 */}
      {driftIn > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: driftIn }}>
          <svg width={820} height={520}>
            <circle cx={410} cy={250} r={160} fill="none" stroke={theme.line} strokeWidth={2} strokeDasharray="6 10" />
            <circle cx={410} cy={250} r={24} fill={theme.accent} />
            <circle cx={410 + 160 * Math.cos(-Math.PI / 2 + Math.sin(t * 0.8) * 0.12)} cy={250 + 160 * Math.sin(-Math.PI / 2 + Math.sin(t * 0.8) * 0.12)} r={9} fill={theme.alert} />
            <text x={410} y={470} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={30} fill={theme.inkDim}>冬至点 · 沿黄道缓慢西移</text>
            <path d="M 560 110 A 150 150 0 0 1 640 210" fill="none" stroke={theme.alert} strokeWidth={3} />
            <path d="M 640 210 l -16 4 l 12 12 z" fill={theme.alert} />
          </svg>
        </div>
      )}

      {/* b29 历书《时宪历》 */}
      {bookIn > 0 && bookOut > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: bookIn * bookOut }}>
          <svg width={620} height={720}>
            <rect x={40} y={40} width={540} height={640} rx={6} fill="#101020" stroke={theme.accent} strokeWidth={2.5} opacity={0.95} />
            <rect x={64} y={64} width={492} height={592} fill="none" stroke={theme.line} strokeWidth={1} />
            <text x={310} y={200} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={92} fill={theme.accent} letterSpacing={18}>時憲</text>
            <text x={310} y={310} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={92} fill={theme.accent} letterSpacing={18}>曆</text>
            <line x1={160} y1={360} x2={460} y2={360} stroke={theme.line} />
            <text x={310} y={430} textAnchor="middle" fontFamily={theme.fontMono} fontSize={26} fill={theme.inkDim}>依太阳黄经定节气</text>
            <text x={310} y={478} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={30} fill={theme.ink} opacity={0.85}>清顺治二年 · 颁行</text>
          </svg>
        </div>
      )}

      {/* b30 轨道盘网格点亮 */}
      {diskIn > 0 && diskOut > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: diskIn * diskOut }}>
          <OrbitDisk sceneT={t + 8} mode="run" tickProg={interpolate(t, [6.4, 8.8], [0, 1], clamp)} markersOn scale={0.72} starGlowPulse={1} />
        </div>
      )}

      {/* b31 紫金山天文台 + 星轨 */}
      {obIn > 0 && obOut > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: obIn * obOut }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 5 }, (_, i) => (
              <circle key={i} cx={960} cy={1300} r={400 + i * 90} fill="none" stroke={theme.inkDim} strokeWidth={1.4} opacity={0.35} strokeDasharray="6 10" />
            ))}
            <path d="M 780 980 L 780 850 A 180 180 0 0 1 1140 850 L 1140 980 Z" fill="#0A0A18" stroke={theme.line} strokeWidth={2} />
            <rect x={860} y={840} width={100} height={12} fill={theme.line} transform="rotate(-18 910 846)" />
            <text x={960} y={1030} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={30} fill={theme.inkDim}>紫金山天文台 · 历书编算</text>
          </svg>
        </div>
      )}

      {/* b32 金句 */}
      {quoteIn > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: quoteIn }}>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 58, color: theme.accent, letterSpacing: "0.14em", textShadow: "0 0 30px rgba(217,179,108,0.55)" }}>换了朝代，换了历法，刻度没换</div>
          <div style={{ display: "flex", gap: 26, marginTop: 34, fontFamily: theme.fontMono, fontSize: 24, color: theme.inkDim }}>
            <span>明</span><span>→</span><span>清</span><span>→</span><span>今</span><span>·</span><span style={{ color: theme.accent }}>360°</span>
          </div>
        </div>
      )}

      {/* b33 转到"你"：手机 + 轨道盘 */}
      {youIn > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 60, opacity: youIn }}>
          <svg width={300} height={540} style={{ transform: `translateY(${(1 - youIn) * 30}px)` }}>
            <rect x={6} y={6} width={288} height={528} rx={40} fill="#16161F" stroke="#33333F" strokeWidth={3} />
            <rect x={20} y={20} width={260} height={500} rx={28} fill="#0B0B14" />
            <rect x={104} y={28} width={92} height={18} rx={9} fill="#000" />
            <text x={150} y={150} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={40} fill={theme.ink}>12月</text>
            <text x={150} y={210} textAnchor="middle" fontFamily={theme.fontMono} fontSize={34} fill={theme.alert}>21 冬至</text>
            <text x={150} y={252} textAnchor="middle" fontFamily={theme.fontMono} fontSize={30} fill={theme.inkDim}>黄经 270°</text>
            <rect x={40} y={320} width={220} height={1} fill={theme.line} />
            <text x={150} y={380} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={26} fill={theme.inkDim}>你看到的日期</text>
            <text x={150} y={430} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={26} fill={theme.accent}>由太阳决定</text>
          </svg>
          <OrbitDisk sceneT={2} mode="final" tickProg={1} markersOn scale={0.5} starGlowPulse={1} />
        </div>
      )}
    </div>
  );
};
