import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { OrbitDisk } from "../components/OrbitDisk";
import { Starfield } from "./Hook";
import { CITATIONS } from "../script";

// 场景五：回场 + 末句 + 引用卡 116.5–135s（本地 t 0–18.5）
export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const duoIn = interpolate(t, [0, 1.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const calDim = interpolate(t, [4, 8], [1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gridGlow = interpolate(t, [4, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dimAll = interpolate(t, [8, 10], [1, 0.32], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const disclaimer = interpolate(t, [8, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const citeOn = interpolate(t, [11, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Starfield seed={99} drift={0.5} />
      <div style={{ position: "absolute", inset: 0, opacity: dimAll }}>
        {/* 左：日历页（回场） */}
        <div style={{ position: "absolute", left: 130, top: 0, bottom: 0, display: "flex", alignItems: "center", opacity: duoIn * calDim }}>
          <svg width={430} height={560}>
            <rect x={15} y={15} width={400} height={530} rx={12} fill="#10101E" stroke={theme.line} strokeWidth={1.5} />
            <text x={215} y={80} textAnchor="middle" fontFamily={theme.fontMono} fontSize={26} fill={theme.inkDim} letterSpacing={6}>DECEMBER</text>
            <line x1={45} y1={100} x2={385} y2={100} stroke={theme.line} />
            {Array.from({ length: 18 }, (_, i) => {
              const d = 14 + i;
              const cx = 65 + ((d - 14) % 7) * 55;
              const cy = 152 + Math.floor((d - 14) / 7) * 68;
              const hl = d === 21 || d === 22;
              return (
                <text key={d} x={cx} y={cy} textAnchor="middle" fontFamily={theme.fontMono} fontSize={24} fill={hl ? theme.alert : theme.inkDim} opacity={hl ? 1 : 0.6}>
                  {d}
                </text>
              );
            })}
            <text x={215} y={510} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={28} fill={theme.alert}>
              冬至 12/21 ↔ 12/22
            </text>
          </svg>
        </div>
        {/* 右：轨道盘定格，刻度全亮 */}
        <div style={{ position: "absolute", right: 60, top: 0, bottom: 0, display: "flex", alignItems: "center", opacity: duoIn }}>
          <OrbitDisk sceneT={0} mode="final" tickProg={1} markersOn scale={0.62} starGlowPulse={gridGlow} />
        </div>
      </div>

      {/* 声明行 */}
      {disclaimer > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 730, textAlign: "center", opacity: disclaimer, fontFamily: theme.fontSerif, fontSize: 28, color: theme.inkDim, letterSpacing: "0.15em" }}>
          本片为科普示意 · 图示非精确比例 · 事实依据见引用
        </div>
      )}

      {/* 引用卡滚动 */}
      {citeOn > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: citeOn }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.inkDim, letterSpacing: 8, marginBottom: 34 }}>REFERENCES · 引用</div>
          {CITATIONS.map((c, i) => {
            const rowIn = interpolate(t, [11.5 + i * 0.45, 12.2 + i * 0.45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ fontFamily: theme.fontSerif, fontSize: 34, color: theme.ink, marginTop: 26, opacity: rowIn * 0.95, letterSpacing: "0.08em" }}>
                [{i + 1}] {c}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
