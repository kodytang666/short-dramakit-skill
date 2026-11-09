import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { OrbitDisk, earthDegAt } from "../components/OrbitDisk";
import { Starfield, EraTag } from "../scenes/Hook";
import { LAYERS } from "../script-v2";

// 场景三 V2：机制演示（三层反转）40–95s，本地 t 0–55
export const MechanismV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  const ringGrow = interpolate(t, [0, 4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tickProg = interpolate(t, [4, 7.5], [0, 1], clamp);
  const litArc = interpolate(t, [7.5, 11], [0, 15], clamp);
  // 计数器是主角时，节气四个标注与右侧读数让位，避免压字
  const markersOn = t >= 11 && t < 19.5 && !(t >= 13.9 && t < 17.2);

  const counter = interpolate(t, [13.9, 17], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const counterOn = t >= 13.9 && t < 19.5;

  const isEllipse = t >= 25.2 && t < 31.8;
  const isDual = t >= 38.9 && t < 47.5;
  const isGyro = t >= 50 && t < 55;

  // 三层反转卡片
  const layer1 = interpolate(t, [19.5, 20.1, 22.2, 22.8], [0, 1, 1, 0], clamp);
  const moreCounter = interpolate(t, [22.8, 23.4, 24.2, 24.8], [0, 1, 1, 0], clamp);
  const moreWorse = interpolate(t, [47.5, 48.1, 49.4, 50.0], [0, 1, 1, 0], clamp);

  const numbersIn = interpolate(t, [31.8, 32.6, 34.8, 35.4], [0, 1, 1, 0], clamp);
  const axisIn = interpolate(t, [35.4, 36.4, 38.3, 38.9], [0, 1, 1, 0], clamp);
  const versusIn = interpolate(t, [42.2, 43.4, 46.8, 47.5], [0, 1, 1, 0], clamp);
  const gyroIn = interpolate(t, [50, 51, 54, 55], [0, 1, 1, 0], clamp);

  // 计数段把轨道盘平滑缩小，给顶部数字与锚点让出空间
  const counterScale = interpolate(t, [13.4, 14.2, 17.0, 17.8], [1, 0.8, 0.8, 1], clamp);
  const diskScale =
    interpolate(t, [0, 3], [0.7, 0.85], clamp) *
    interpolate(t, [24.4, 25.2], [1, 0.82], clamp) *
    interpolate(t, [49.4, 50.4], [1, 0.6], clamp) *
    counterScale;
  // 一镜一焦点：大字/时间轴/对峙出现时轨道盘压暗；计数器段也让位
  const numDim = numbersIn > 0 ? 0.16 : 1;
  const counterDim = counterOn ? 0.42 : 1;
  const overlayDim = Math.max(moreCounter * 0.6, moreWorse * 0.6, axisIn * 0.45, versusIn * 0.55);
  const diskOpacity = interpolate(t, [49.4, 50.6], [1, 0.12], clamp) * numDim * (1 - overlayDim) * counterDim;

  const dayCount = (365.2422 * counter).toFixed(4).replace(/\.?0+$/, "");
  const speed = 1 + 0.5 * Math.cos(((earthDegAt(t) - 270) * Math.PI) / 180);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Starfield seed={42} drift={isGyro ? 6 : 0.8} />
      <EraTag text="黄道 · 太阳的坐标" from={0.5} />

      {/* 主形象：轨道盘（同一世界用到底） */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <OrbitDisk
          sceneT={t}
          mode={isGyro ? "final" : isDual ? "dual" : isEllipse ? "ellipse" : "intro"}
          ringGrow={ringGrow}
          tickProg={tickProg}
          litArc={litArc}
          markersOn={markersOn}
          scale={diskScale}
          starGlowPulse={t >= 53 ? 1 : 0}
          opacity={diskOpacity}
          trail={8}
        />
      </div>

      {/* 运行读数（b16-b17 右侧） */}
      {markersOn && (
        <div style={{ position: "absolute", right: 110, top: 320, fontFamily: theme.fontMono, fontSize: 26, color: theme.inkDim, textAlign: "right", lineHeight: 2 }}>
          <div>黄经 = <span style={{ color: theme.accent }}>{Math.round(earthDegAt(t))}°</span></div>
          <div>公转 = <span style={{ color: theme.ink }}>{speed.toFixed(2)}×</span></div>
        </div>
      )}

      {/* b17 计数器：365.2422 */}
      {counterOn && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 104, textAlign: "center", opacity: counter < 1 ? 1 : interpolate(t, [17, 18], [1, 0], clamp) }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 84, color: theme.accent, textShadow: `0 0 ${20 + 6 * Math.sin(t * 3)}px rgba(217,179,108,0.5)` }}>
            {dayCount}
          </div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.inkDim, marginTop: 6 }}>DAYS · 回归年</div>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 24, color: theme.inkDim, marginTop: 8 }}>≈ 每 4 年多出 1 天——这就是闰年</div>
        </div>
      )}

      {/* 三层反转卡片 */}
      {layer1 > 0 && <LayerCard opacity={layer1} tag={LAYERS[0].tag} />}

      {/* b19「更反直觉的是」 */}
      {moreCounter > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: moreCounter }}>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 66, color: theme.ink, letterSpacing: "0.1em" }}>更反直觉的是——</div>
        </div>
      )}

      {/* b20-b21 椭圆速度标注 */}
      {isEllipse && (
        <>
          <div style={{ position: "absolute", left: 300, top: 700, fontFamily: theme.fontSerif, fontSize: 34, color: theme.alert, opacity: 0.95 }}>
            近日点 · 快 <span style={{ fontFamily: theme.fontMono, fontSize: 26 }}>1.5×</span>
          </div>
          <div style={{ position: "absolute", right: 300, top: 300, fontFamily: theme.fontSerif, fontSize: 34, color: theme.inkDim }}>
            远日点 · 慢 <span style={{ fontFamily: theme.fontMono, fontSize: 26 }}>0.5×</span>
          </div>
        </>
      )}

      {/* b22 同样 15°，两段不等长的弧：14 天 / 16 天 */}
      {numbersIn > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: numbersIn }}>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 34, color: theme.inkDim, letterSpacing: "0.12em", marginBottom: 16 }}>同样走 15°</div>
          <svg width={1200} height={320}>
            {/* 近太阳：弧短，14 天 */}
            <path d="M 220 100 Q 540 34 860 100" fill="none" stroke={theme.ink} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
            <circle cx={860} cy={100} r={11} fill={theme.ink} />
            <text x={970} y={118} textAnchor="middle" fontFamily={theme.fontMono} fontSize={96} fill={theme.ink}>14</text>
            <text x={970} y={158} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={27} fill={theme.inkDim}>天 · 近太阳</text>
            {/* 远太阳：弧长，16 天 */}
            <path d="M 160 250 Q 560 168 1000 250" fill="none" stroke={theme.alert} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
            <circle cx={1000} cy={250} r={11} fill={theme.alert} />
            <text x={1110} y={268} textAnchor="middle" fontFamily={theme.fontMono} fontSize={96} fill={theme.alert}>16</text>
            <text x={1110} y={308} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={27} fill={theme.inkDim}>天 · 远太阳</text>
          </svg>
        </div>
      )}

      {/* b23 平气：时间轴均分 24 段 */}
      {axisIn > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center", opacity: axisIn }}>
          <svg width={1300} height={90}>
            <line x1={20} y1={45} x2={1280} y2={45} stroke={theme.ink} strokeWidth={3} />
            {Array.from({ length: 25 }, (_, i) => {
              const x = 20 + (i * 1260) / 24;
              return <line key={i} x1={x} y1={25} x2={x} y2={65} stroke={theme.inkDim} strokeWidth={i % 6 === 0 ? 3 : 1.5} />;
            })}
            <text x={650} y={88} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={27} fill={theme.inkDim}>回归年 = 时间均分 24 段（平气）</text>
          </svg>
        </div>
      )}

      {/* b25 对峙：用时间切 vs 用太阳切 */}
      {versusIn > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-around", opacity: versusIn }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontSerif, fontSize: 52, color: theme.ink }}>用时间切太阳</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.inkDim, marginTop: 16 }}>365.2422 ÷ 24</div>
          </div>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 40, color: theme.accent }}>VS</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontSerif, fontSize: 52, color: theme.accent }}>用太阳切时间</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.inkDim, marginTop: 16 }}>360° ÷ 24</div>
          </div>
        </div>
      )}

      {/* b26「更麻烦的还在后头」 */}
      {moreWorse > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: moreWorse }}>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 66, color: theme.ink, letterSpacing: "0.1em" }}>更麻烦的，还在后头——</div>
        </div>
      )}

      {/* b27 岁差：陀螺进动 */}
      {gyroIn > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: gyroIn }}>
          <svg width={700} height={700}>
            <ellipse cx={350} cy={250} rx={210} ry={70} fill="none" stroke={theme.accent} strokeWidth={2} opacity={0.7} strokeDasharray="10 8" />
            <line x1={350} y1={250} x2={350 + 200 * Math.sin(Math.sin(t * 2.2) * 0.22)} y2={250 + 200 * Math.cos(Math.sin(t * 2.2) * 0.22)} stroke={theme.ink} strokeWidth={5} strokeLinecap="round" />
            <circle cx={350} cy={250} r={40} fill="#5B8DEF" opacity={0.85} />
            <text x={350} y={460} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={32} fill={theme.inkDim}>地轴 · 进动周期 25,800 年</text>
            <path d="M 160 250 A 190 70 0 0 1 250 185" fill="none" stroke={theme.alert} strokeWidth={3} />
            <path d="M 250 185 l -18 -4 l 10 16 z" fill={theme.alert} />
          </svg>
        </div>
      )}
    </div>
  );
};

const LayerCard: React.FC<{ opacity: number; tag: string }> = ({ opacity, tag }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", opacity }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 26px", borderRadius: 30, background: "rgba(16,16,40,0.72)", border: `1px solid ${theme.accent}` }}>
      <span style={{ fontFamily: theme.fontMono, fontSize: 22, color: theme.accent, letterSpacing: 6 }}>{tag}</span>
    </div>
  </div>
);
