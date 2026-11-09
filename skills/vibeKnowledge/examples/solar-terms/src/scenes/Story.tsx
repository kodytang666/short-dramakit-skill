import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { Starfield, EraTag } from "./Hook";

// 场景二：历史故事（星空 → 圭表量影 → 淮南子竹简）14.5–44s
export const Story: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // 场景本地时间：从 0 起（Main 里 from=14.5）

  // 分段不透明度：圭表段 21→31.5，竹简段 31.5→41，收束 41→44
  const gnomonIn = interpolate(t, [5.5, 7.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const shadowPh = interpolate(t, [6.5, 10.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const sunIn = interpolate(t, [13, 14.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gnomonOut = interpolate(t, [16.5, 18.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scrollIn = interpolate(t, [17, 19], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const scrollOut = interpolate(t, [23, 24.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 影长：夏至短 → 冬至长（正弦往复）
  const shadowLen = 60 + 200 * shadowPh;
  const shadowOp = 0.25 + 0.15 * Math.sin(t * 3);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Starfield seed={23} drift={0.8} />
      <EraTag text="西汉 · 长安" from={0.5} />

      {/* 圭表：立杆 + 伸缩影子 + 地平线刻度 */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", opacity: gnomonIn * gnomonOut, paddingBottom: 180 }}>
        <svg width={1000} height={560}>
          {/* 地面 */}
          <line x1={60} y1={500} x2={940} y2={500} stroke={theme.line} strokeWidth={2} />
          {/* 刻度（尺） */}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={i} x1={140 + i * 60} y1={500} x2={140 + i * 60} y2={i % 4 === 0 ? 478 : 488} stroke={theme.line} strokeWidth={1.5} />
          ))}
          {/* 立杆 */}
          <line x1={500} y1={140} x2={500} y2={500} stroke={theme.ink} strokeWidth={7} strokeLinecap="round" />
          <circle cx={500} cy={136} r={6} fill={theme.accent} opacity={0.9} />
          {/* 影子（向左伸长） */}
          <line x1={497} y1={496} x2={497 - shadowLen * 2.2} y2={496} stroke={theme.accent} strokeWidth={10} strokeLinecap="round" opacity={0.75} />
          {/* 光照方向：太阳 → 杆顶 → 影（虚线） */}
          <line x1={778} y1={192} x2={503} y2={142} stroke={theme.accent} strokeWidth={2} strokeDasharray="8 8" opacity={0.5 * sunIn} />
          <line x1={503} y1={146} x2={497 - shadowLen * 2.2 + 6} y2={494} stroke={theme.accent} strokeWidth={2} strokeDasharray="8 8" opacity={0.35 * sunIn} />
          {/* 标注 */}
          <text x={497 - shadowLen * 1.1} y={530} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={28} fill={theme.inkDim}>
            {shadowPh < 0.5 ? "夏至 · 影短" : "冬至 · 影长"}
          </text>
          <text x={500} y={110} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={30} fill={theme.ink}>
            表 · 正午测影
          </text>
          {/* 太阳替代月亮（b09） */}
          <g opacity={sunIn}>
            <circle cx={780} cy={190} r={44} fill={theme.accent} opacity={0.9} />
            <circle cx={780} cy={190} r={60} fill="none" stroke={theme.accent} strokeWidth={1.5} opacity={0.4} />
            <text x={780} y={280} textAnchor="middle" fontFamily={theme.fontMono} fontSize={24} fill={theme.accent}>太阳</text>
          </g>
          {/* 淡出的月亮 */}
          <g opacity={1 - sunIn}>
            <circle cx={780} cy={190} r={36} fill="none" stroke={theme.inkDim} strokeWidth={2} />
            <circle cx={792} cy={182} r={34} fill={theme.bg0} />
          </g>
        </svg>
      </div>

      {/* 竹简：《淮南子》 */}
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
          {/* 印章 */}
          <g opacity={interpolate(t, [20.5, 21.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <rect x={880} y={300} width={110} height={110} rx={8} fill="none" stroke={theme.alert} strokeWidth={3} />
            <text x={935} y={352} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={34} fill={theme.alert}>淮南</text>
            <text x={935} y={392} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={34} fill={theme.alert}>子</text>
          </g>
        </svg>
      </div>
    </div>
  );
};
