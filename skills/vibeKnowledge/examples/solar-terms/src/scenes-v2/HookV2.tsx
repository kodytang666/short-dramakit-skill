import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { theme } from "../theme";
import { Starfield } from "../scenes/Hook";
import { TITLE } from "../script-v2";

// 场景一 V2：钩子（手机日历 App）+ 片名卡 0–14s
export const HookV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const phoneIn = spring({ frame: frame - 2, fps, damping: 200 });
  const to22 = interpolate(t, [3.3, 3.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const darken = interpolate(t, [7.0, 9.8, 10.4], [1, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleIn = interpolate(t, [10.6, 12.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const sweep = interpolate(t, [11.8, 13.4], [-25, 125], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = 0.55 + 0.2 * Math.sin(t * 2);

  const cellX = (day: number) => 66 + ((day - 1) % 7) * 66;
  const cellY = (day: number) => 330 + Math.floor((day - 1) / 7) * 100;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Starfield seed={11} drift={0.4} />

      {/* 手机日历 */}
      {t < 10.4 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: darken,
            transform: `translateY(${(1 - phoneIn) * 40}px) scale(${0.97 + 0.03 * phoneIn})`,
          }}
        >
          <svg width={540} height={980}>
            {/* 机身 */}
            <rect x={6} y={6} width={528} height={968} rx={62} fill="#16161F" stroke="#33333F" strokeWidth={3} />
            <rect x={24} y={24} width={492} height={932} rx={46} fill="#0B0B14" />
            {/* 刘海 */}
            <rect x={214} y={36} width={112} height={26} rx={13} fill="#000" />
            {/* 状态栏 */}
            <text x={62} y={92} fontFamily={theme.fontMono} fontSize={22} fill={theme.inkDim}>9:41</text>
            <text x={470} y={92} textAnchor="end" fontFamily={theme.fontMono} fontSize={20} fill={theme.inkDim}>▮▮▮</text>
            {/* 月份 */}
            <text x={62} y={168} fontFamily={theme.fontSerif} fontSize={52} fill={theme.ink}>12月</text>
            <text x={470} y={166} textAnchor="end" fontFamily={theme.fontMono} fontSize={22} fill={theme.inkDim} letterSpacing={4}>DECEMBER</text>
            <line x1={60} y1={196} x2={480} y2={196} stroke={theme.line} />
            {/* 星期 */}
            {["一", "二", "三", "四", "五", "六", "日"].map((w, i) => (
              <text key={w} x={66 + i * 66} y={250} textAnchor="middle" fontFamily={theme.fontMono} fontSize={20} fill={theme.inkDim} opacity={0.7}>{w}</text>
            ))}
            {/* 日期 */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
              const hl21 = d === 21 && to22 < 1;
              const hl22 = d === 22 && to22 >= 1;
              const hl = hl21 || hl22;
              return (
                <g key={d}>
                  <text x={cellX(d)} y={cellY(d)} textAnchor="middle" fontFamily={theme.fontMono} fontSize={28} fill={hl ? theme.alert : theme.inkDim} opacity={hl ? 1 : 0.62}>{d}</text>
                  {hl && <circle cx={cellX(d)} cy={cellY(d) + 12} r={5} fill={theme.alert} />}
                </g>
              );
            })}
            {/* 事件条 */}
            <g opacity={0.9}>
              <rect x={60} y={900} width={420} height={54} rx={12} fill="rgba(232,93,74,0.12)" stroke={theme.alert} strokeWidth={1.5} />
              <text x={82} y={936} fontFamily={theme.fontSerif} fontSize={26} fill={theme.alert}>冬至 · 太阳黄经 270°</text>
            </g>
          </svg>
        </div>
      )}

      {/* 片名卡 */}
      {t >= 10.4 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: titleIn, overflow: "hidden" }}>
          {/* 光扫：全片仅此一次 */}
          <div style={{ position: "absolute", top: -100, bottom: -100, width: 80, left: `${sweep}%`, transform: "rotate(16deg)", background: "linear-gradient(90deg, transparent, rgba(255,245,220,0.16), transparent)", filter: "blur(20px)", mixBlendMode: "screen", pointerEvents: "none" }} />
          <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.inkDim, letterSpacing: 14, marginBottom: 30 }}>VIBE 知识大赏</div>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 156, color: theme.accent, letterSpacing: "0.18em", textShadow: `0 0 ${38 * glow}px rgba(217,179,108,0.6)` }}>
            {TITLE.cn}
          </div>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 42, color: theme.ink, marginTop: 24, letterSpacing: "0.28em" }}>{TITLE.sub}</div>
          <div style={{ fontFamily: theme.fontSerif, fontStyle: "italic", fontSize: 26, color: theme.inkDim, marginTop: 20 }}>{TITLE.en}</div>
        </div>
      )}
    </div>
  );
};
