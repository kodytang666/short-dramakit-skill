import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { OrbitDisk } from "../components/OrbitDisk";
import { Starfield } from "../scenes/Hook";
import { CITATIONS } from "../script-v2";

// 场景五 V2：回场 + 片名回声 + 引用卡 116.5–135s，本地 t 0–18.5
export const EndingV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  const duoIn = interpolate(t, [0.2, 1.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const duoDim = interpolate(t, [3.4, 5.0], [1, 0.22], clamp);
  const echoIn = interpolate(t, [3.7, 4.8, 6.6, 7.2], [0, 1, 1, 0], clamp);
  const disclaimer = interpolate(t, [7.5, 8.5, 10.0, 10.6], [0, 1, 1, 0], clamp);
  const citeOn = interpolate(t, [10.7, 11.5], [0, 1], clamp);
  const dimAll = interpolate(t, [3.4, 4.4], [1, 0.05], clamp);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Starfield seed={99} drift={0.5} />

      {/* b34 回场：手机日历 + 轨道盘同框 */}
      <div style={{ position: "absolute", inset: 0, opacity: duoIn * dimAll }}>
        <div style={{ position: "absolute", left: 150, top: 0, bottom: 0, display: "flex", alignItems: "center", opacity: duoDim }}>
          <svg width={380} height={660}>
            <rect x={6} y={6} width={368} height={648} rx={48} fill="#16161F" stroke="#33333F" strokeWidth={3} />
            <rect x={24} y={24} width={332} height={612} rx={34} fill="#0B0B14" />
            <rect x={130} y={32} width={120} height={20} rx={10} fill="#000" />
            <text x={190} y={150} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={44} fill={theme.ink}>12月</text>
            <text x={190} y={230} textAnchor="middle" fontFamily={theme.fontMono} fontSize={52} fill={theme.alert}>21 ↔ 22</text>
            <text x={190} y={290} textAnchor="middle" fontFamily={theme.fontMono} fontSize={24} fill={theme.inkDim}>冬至 · 差一天</text>
          </svg>
        </div>
        <div style={{ position: "absolute", right: 80, top: 0, bottom: 0, display: "flex", alignItems: "center", opacity: duoIn }}>
          <OrbitDisk sceneT={0} mode="final" tickProg={1} markersOn scale={0.6} starGlowPulse={1} />
        </div>
      </div>

      {/* b35 因果链 + 片名回声：太阳到 270° → 刻度落定 → 日历 21/22 */}
      {echoIn > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: echoIn }}>
          <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
            {/* A 太阳走到 270°（冬至在左） */}
            <CauseCell label="太阳到 270°">
              <svg width={210} height={210}>
                <circle cx={105} cy={105} r={74} fill="none" stroke={theme.line} strokeWidth={2} />
                {Array.from({ length: 24 }, (_, i) => {
                  const a = ((i * 15 - 90) * Math.PI) / 180;
                  return (
                    <line
                      key={i}
                      x1={105 + 66 * Math.cos(a)}
                      y1={105 + 66 * Math.sin(a)}
                      x2={105 + 74 * Math.cos(a)}
                      y2={105 + 74 * Math.sin(a)}
                      stroke={i === 18 ? theme.accent : theme.line}
                      strokeWidth={i === 18 ? 3 : 1}
                      opacity={i === 18 ? 1 : 0.4}
                    />
                  );
                })}
                <line x1={105} y1={105} x2={31} y2={105} stroke={theme.accent} strokeWidth={2.5} />
                <circle cx={105} cy={105} r={14} fill={theme.accent} />
                <circle cx={31} cy={105} r={8} fill="#5B8DEF" stroke="#A9C6FF" strokeWidth={2} />
              </svg>
            </CauseCell>
            <Arrow />
            {/* B 刻度落定 */}
            <CauseCell label="刻度落定">
              <div style={{ fontFamily: theme.fontMono, fontSize: 64, color: theme.accent, textShadow: "0 0 26px rgba(217,179,108,0.5)" }}>270°</div>
            </CauseCell>
            <Arrow />
            {/* C 日历 21 → 22 */}
            <CauseCell label="日历 21 → 22">
              <svg width={140} height={176}>
                <rect x={8} y={8} width={124} height={160} rx={10} fill="#10101E" stroke={theme.line} strokeWidth={1.5} />
                <text x={70} y={42} textAnchor="middle" fontFamily={theme.fontMono} fontSize={17} fill={theme.inkDim}>12月</text>
                <text x={70} y={98} textAnchor="middle" fontFamily={theme.fontMono} fontSize={40} fill={theme.alert}>21↔22</text>
                <text x={70} y={134} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={17} fill={theme.inkDim}>冬至</text>
              </svg>
            </CauseCell>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 52 }}>
            <span style={{ fontFamily: theme.fontSerif, fontSize: 44, color: theme.inkDim, letterSpacing: "0.1em" }}>日历只是结果</span>
            <span style={{ fontFamily: theme.fontSerif, fontSize: 70, color: theme.accent, letterSpacing: "0.14em", textShadow: "0 0 32px rgba(217,179,108,0.55)" }}>太阳说了算</span>
          </div>
        </div>
      )}

      {/* b36 声明 */}
      {disclaimer > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", opacity: disclaimer, fontFamily: theme.fontSerif, fontSize: 28, color: theme.inkDim, letterSpacing: "0.14em" }}>
          本片为科普示意 · 图示非精确比例 · 事实依据见引用
        </div>
      )}

      {/* b37 引用卡 */}
      {citeOn > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", opacity: citeOn }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.inkDim, letterSpacing: 8, marginBottom: 30 }}>REFERENCES · 引用</div>
          {CITATIONS.map((c, i) => {
            const rowIn = interpolate(t, [11.1 + i * 0.4, 11.8 + i * 0.4], [0, 1], clamp);
            return (
              <div key={i} style={{ fontFamily: theme.fontSerif, fontSize: 33, color: theme.ink, marginTop: 24, opacity: rowIn * 0.95, letterSpacing: "0.06em" }}>
                [{i + 1}] {c}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 因果链单格：图形 + 下方标签
const CauseCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
    {children}
    <div style={{ fontFamily: theme.fontSerif, fontSize: 24, color: theme.inkDim, letterSpacing: "0.08em" }}>{label}</div>
  </div>
);

const Arrow: React.FC = () => <div style={{ fontFamily: theme.fontSerif, fontSize: 44, color: theme.accent }}>→</div>;
