import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { theme } from "../theme";
import { OrbitDisk, earthDegAt } from "../components/OrbitDisk";
import { Starfield, EraTag } from "./Hook";

// 场景三：机制演示（主形象轨道盘，15 拍）44–100s（本地 t 0–56）
export const Mechanism: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // 逐拍驱动（本地秒）
  const ringGrow = interpolate(t, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const tickProg = interpolate(t, [4, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const litArc = interpolate(t, [7.5, 10.5], [0, 15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const counter = interpolate(t, [15, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const markersOn = t >= 11 && !(counter > 0 && counter < 1); // b18 数字是主角，节气标注让位
  const isEllipse = t >= 25 && t < 33.5;
  const isDual = t >= 33.5 && t < 45;
  const isSpin = t >= 45 && t < 52.5;
  const isFinal = t >= 52.5;
  const diskScale = interpolate(t, [22.5, 25], [1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(t, [14.5, 15.2, 18.8, 19.5], [1, 0.8, 0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // b22 数字对撞
  const numIn = interpolate(t, [29.5, 30.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // b23 时间轴均分
  const axisIn = interpolate(t, [33.5, 35.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // b25 对峙分屏
  const versusIn = interpolate(t, [41.5, 43], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // b27 陀螺
  const gyroIn = interpolate(t, [48, 49.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gyroOut = interpolate(t, [52, 52.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const dayCount = (365.2422 * counter).toFixed(4).replace(/\.?0+$/, "");
  const speed = 1 + 0.5 * Math.cos(((earthDegAt(t) - 270) * Math.PI) / 180);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Starfield seed={42} drift={isSpin ? 6 : 0.8} />
      <EraTag text="黄道 · 太阳的坐标" from={0.5} />

      {/* 轨道盘居中（各模式同一世界） */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: isDual && !versusIn ? 1 : 1 }}>
        <OrbitDisk
          sceneT={t}
          mode={isFinal ? "final" : isDual || versusIn ? "dual" : isEllipse ? "ellipse" : isSpin ? "run" : "intro"}
          ringGrow={ringGrow}
          tickProg={tickProg}
          litArc={litArc}
          markersOn={markersOn}
          scale={diskScale}
          starGlowPulse={isFinal ? 1 : 0}
          opacity={versusIn > 0 && isDual ? 1 - versusIn * 0 : 1}
        />
      </div>

      {/* b17 运行时标注（右侧读数） */}
      {markersOn && !isEllipse && !isDual && !isSpin && !isFinal && (
        <div style={{ position: "absolute", right: 110, top: 300, fontFamily: theme.fontMono, fontSize: 26, color: theme.inkDim, textAlign: "right", lineHeight: 2 }}>
          <div>黄经 = <span style={{ color: theme.accent }}>{Math.round(earthDegAt(t))}°</span></div>
          <div>公转速度 = <span style={{ color: theme.ink }}>{speed.toFixed(2)}×</span></div>
        </div>
      )}

      {/* b18 计数器（金）——放画面顶部，不与轨道盘交叠 */}
      {counter > 0 && counter < 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 88, color: theme.accent, textShadow: `0 0 ${20 + 6 * Math.sin(t * 3)}px rgba(217,179,108,0.5)` }}>
            {dayCount}
          </div>
          <div style={{ fontFamily: theme.fontMono, fontSize: 28, color: theme.inkDim, marginTop: 6 }}>DAYS · 回归年</div>
        </div>
      )}

      {/* b21 椭圆速度可视化：近/远日点标签 */}
      {isEllipse && (
        <>
          <div style={{ position: "absolute", left: 300, top: 720, fontFamily: theme.fontSerif, fontSize: 34, color: theme.alert, opacity: 0.95 }}>
            近日点 · 快 <span style={{ fontFamily: theme.fontMono, fontSize: 26 }}>1.5×</span>
          </div>
          <div style={{ position: "absolute", right: 300, top: 300, fontFamily: theme.fontSerif, fontSize: 34, color: theme.inkDim }}>
            远日点 · 慢 <span style={{ fontFamily: theme.fontMono, fontSize: 26 }}>0.5×</span>
          </div>
        </>
      )}

      {/* b22 两组数字对撞 */}
      {numIn > 0 && numIn < 1 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 160, opacity: interpolate(t, [32.5, 33.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 110, color: theme.ink }}>14.7</div>
            <div style={{ fontFamily: theme.fontSerif, fontSize: 30, color: theme.inkDim }}>天</div>
          </div>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 60, color: theme.accent }}>→←</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontMono, fontSize: 110, color: theme.alert }}>15.7</div>
            <div style={{ fontFamily: theme.fontSerif, fontSize: 30, color: theme.inkDim }}>天</div>
          </div>
        </div>
      )}

      {/* b23 平气时间轴（均分） */}
      {axisIn > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 780, display: "flex", justifyContent: "center", opacity: axisIn * interpolate(t, [40.5, 41.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <svg width={1300} height={90}>
            <line x1={20} y1={45} x2={1280} y2={45} stroke={theme.ink} strokeWidth={3} />
            {Array.from({ length: 25 }, (_, i) => {
              const x = 20 + (i * 1260) / 24;
              return <line key={i} x1={x} y1={25} x2={x} y2={65} stroke={theme.inkDim} strokeWidth={i % 6 === 0 ? 3 : 1.5} />;
            })}
            <text x={650} y={88} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={28} fill={theme.inkDim}>
              回归年 = 时间均分 24 段（平气）
            </text>
          </svg>
        </div>
      )}

      {/* b25 对峙分屏：时间切 vs 太阳切 */}
      {versusIn > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-around", opacity: versusIn * interpolate(t, [44, 45], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontSerif, fontSize: 52, color: theme.ink }}>用时间切</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.inkDim, marginTop: 16 }}>365.2422 ÷ 24</div>
          </div>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 40, color: theme.accent }}>VS</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: theme.fontSerif, fontSize: 52, color: theme.accent }}>用太阳切</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.inkDim, marginTop: 16 }}>360° ÷ 24</div>
          </div>
        </div>
      )}

      {/* b27 陀螺进动 */}
      {gyroIn > 0 && gyroOut > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: gyroIn * gyroOut }}>
          <svg width={700} height={700}>
            <ellipse cx={350} cy={240} rx={210} ry={70} fill="none" stroke={theme.accent} strokeWidth={2} opacity={0.7} strokeDasharray="10 8" />
            <line x1={350} y1={240} x2={350 + 205 * Math.cos(Math.sin(t * 2.2) * 0.22 - Math.PI / 2 + Math.PI / 2)} y2={240 + 200 * Math.sin(Math.sin(t * 2.2) * 0.22)} stroke={theme.ink} strokeWidth={5} strokeLinecap="round" />
            <circle cx={350} cy={240} r={40} fill="#5B8DEF" opacity={0.85} />
            <text x={350} y={420} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={32} fill={theme.inkDim}>
              地轴 · 进动周期 25,800 年
            </text>
            {/* 进动方向箭头 */}
            <path d="M 160 240 A 190 70 0 0 1 250 175" fill="none" stroke={theme.alert} strokeWidth={3} />
            <path d="M 250 175 l -18 -4 l 10 16 z" fill={theme.alert} />
          </svg>
        </div>
      )}
    </div>
  );
};
