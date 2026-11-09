import React from "react";
import { theme } from "../theme";

// ── 模块顶层预计算：地球黄经查表（开普勒近似，禁 Math.random，禁组件内模拟）──
// 近日点约在黄经 270°（冬至后，1 月初）；角速度 = base * (1 + 0.0167 * 2 * cos(deg - 270°)) 近似
const TABLE_LEN = 1400; // 覆盖场景 3 一圈内每 0.05s 一档
const earthDegTable: number[] = (() => {
  const table: number[] = [];
  let deg = 0;
  const step = 0.05;
  for (let i = 0; i < TABLE_LEN; i++) {
    const angular = 360 / 26; // 基准角速度：26 秒一圈
    const speed = angular * (1 + 0.5 * Math.cos(((deg - 270) * Math.PI) / 180));
    deg = (deg + speed * step) % 360;
    table.push(deg);
  }
  return table;
})();

export function earthDegAt(sceneT: number, loop = true): number {
  const idx = Math.floor(sceneT / 0.05);
  return earthDegTable[loop ? idx % TABLE_LEN : Math.min(idx, TABLE_LEN - 1)];
}

const CX = 450;
const CY = 450;
const R = 330;

const TERM_LABELS: Array<{ deg: number; cn: string; en: string }> = [
  { deg: 0, cn: "春分", en: "0°" },
  { deg: 90, cn: "夏至", en: "90°" },
  { deg: 180, cn: "秋分", en: "180°" },
  { deg: 270, cn: "冬至", en: "270°" },
];

export type OrbitMode = "intro" | "run" | "ellipse" | "dual" | "final";

type Props = {
  sceneT: number;
  mode: OrbitMode;
  ringGrow?: number; // 0–1 轨道线生长
  tickProg?: number; // 0–1 刻度尺点亮进度
  litArc?: number; // 0–360 已扫亮弧
  markersOn?: boolean; // 四节气标注
  scale?: number;
  opacity?: number;
  starGlowPulse?: number;
  trail?: number; // 地球运动拖尾残影数量（0 = 无）
};

// 主形象：环形轨道盘（一个世界用到底）
export const OrbitDisk: React.FC<Props> = ({
  sceneT,
  mode,
  ringGrow = 1,
  tickProg = 0,
  litArc = 0,
  markersOn = false,
  scale = 1,
  opacity = 1,
  starGlowPulse = 0,
  trail = 0,
}) => {
  const earthDeg = mode === "final" ? 292 : earthDegAt(sceneT);
  const [ex, ey] = [CX + R * Math.cos((earthDeg * Math.PI) / 180 - Math.PI / 2), CY + R * Math.sin((earthDeg * Math.PI) / 180 - Math.PI / 2)];
  // 黄经 0°（春分）在正上方，顺时针
  const deg2xy = (d: number) => {
    const rad = ((d - 90) * Math.PI) / 180;
    return [CX + R * Math.cos(rad), CY + R * Math.sin(rad)];
  };
  const ringDash = 2075; // 2πR
  const breath = 0.75 + 0.25 * Math.sin(sceneT * 1.6);

  return (
    <svg width={900} height={900} style={{ transform: `scale(${scale})`, opacity, display: "block" }}>
      <defs>
        <radialGradient id="sunG">
          <stop offset="0%" stopColor="#FFEFC2" />
          <stop offset="55%" stopColor={theme.accent} />
          <stop offset="100%" stopColor="rgba(217,179,108,0)" />
        </radialGradient>
      </defs>

      {/* 外圈黄经刻度尺：24 格 */}
      <g>
        {Array.from({ length: 24 }, (_, i) => {
          const d = i * 15;
          const [x1, y1] = deg2xy(d);
          const rad = ((d - 90) * Math.PI) / 180;
          const x2 = CX + (R + 22) * Math.cos(rad);
          const y2 = CY + (R + 22) * Math.sin(rad);
          const lit = i / 24 <= tickProg;
          const major = d % 90 === 0;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={lit ? theme.accent : theme.line} strokeWidth={major ? 3 : 1.5} opacity={lit ? 0.95 : 0.4} />
          );
        })}
      </g>

      {/* 轨道环（生长） */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={theme.ink} strokeWidth={2.5} opacity={0.85} strokeDasharray={ringDash} strokeDashoffset={ringDash * (1 - ringGrow)} transform="rotate(-90 450 450)" />

      {/* 已点亮弧段（15° 概念） */}
      {litArc > 0 && (
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={theme.accent} strokeWidth={7} opacity={0.85}
          strokeDasharray={`${(ringDash / 360) * litArc} ${ringDash}`} transform="rotate(-90 450 450)" strokeLinecap="round" />
      )}

      {/* 平气叠影刻度（dual 模式：时间均分的 24 点，黄经上不等距） */}
      {mode === "dual" && (
        <g opacity={0.65}>
          {Array.from({ length: 24 }, (_, i) => {
            // 平气点：时间均分映射到查表黄经，天然不等距
            const dd = earthDegTable[Math.floor((i / 24) * (TABLE_LEN - 1))];
            const rad = ((dd - 90) * Math.PI) / 180;
            const x = CX + (R - 40) * Math.cos(rad);
            const y = CY + (R - 40) * Math.sin(rad);
            return <circle key={i} cx={x} cy={y} r={6} fill={theme.alert} opacity={0.8} />;
          })}
        </g>
      )}

      {/* 太阳 */}
      <circle cx={CX} cy={CY} r={72} fill="url(#sunG)" opacity={breath * (0.8 + 0.2 * starGlowPulse)} />
      <circle cx={CX} cy={CY} r={34} fill={theme.accent} />

      {/* 四节气标注（下方 180° 的秋分放环内侧，避免压进字幕区） */}
      {markersOn &&
        TERM_LABELS.map((m) => {
          const [x, y] = deg2xy(m.deg);
          const below = m.deg === 180; // 正下方：标注往环内偏
          return (
            <g key={m.deg}>
              <circle cx={x} cy={y} r={7} fill={theme.accent} />
              <text x={x} y={below ? y - 58 : y + 46} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={34} fill={theme.ink}>
                {m.cn}
              </text>
              <text x={x} y={below ? y - 24 : y + 80} textAnchor="middle" fontFamily={theme.fontMono} fontSize={22} fill={theme.inkDim}>
                {m.en}
              </text>
            </g>
          );
        })}

      {/* 地球拖尾残影（运动感） */}
      {trail > 0 &&
        Array.from({ length: trail }, (_, i) => {
          const k = (i + 1) / (trail + 1);
          const d = earthDegAt(Math.max(0, sceneT - (i + 1) * 0.07));
          const gx = CX + R * Math.cos((d * Math.PI) / 180 - Math.PI / 2);
          const gy = CY + R * Math.sin((d * Math.PI) / 180 - Math.PI / 2);
          return <circle key={`trail-${i}`} cx={gx} cy={gy} r={13 * (1 - k)} fill="#5B8DEF" opacity={0.34 * (1 - k)} />;
        })}

      {/* 地球 */}
      <g>
        <circle cx={ex} cy={ey} r={14} fill="#5B8DEF" stroke="#A9C6FF" strokeWidth={2} />
        <circle cx={ex} cy={ey} r={26} fill="none" stroke="#5B8DEF" strokeWidth={1} opacity={0.35} />
      </g>
    </svg>
  );
};
