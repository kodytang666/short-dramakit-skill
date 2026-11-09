import React from "react";
import { theme } from "../theme";

// 常驻读数：全片右上角一台"年度进度盘"，随剧情从第 1 天走到第 365 天
// （structure-bible §4 定律④：画面上永远有个在变的读数）
export const Readout: React.FC<{
  t: number; // 全片秒
  opacity: number;
}> = ({ t, opacity }) => {
  const span = 116.5 - 14;
  const day = Math.max(1, Math.min(365, Math.round(1 + ((t - 14) / span) * 364)));
  const ang = (day / 365) * 360 - 90;
  const rad = ang * (Math.PI / 180);
  const R = 30;
  return (
    <div
      style={{
        position: "absolute",
        right: 72,
        top: 56,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity,
        fontFamily: theme.fontMono,
      }}
    >
      <svg width={84} height={84}>
        <circle cx={42} cy={42} r={R} fill="none" stroke={theme.line} strokeWidth={1.5} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180);
          const inner = i % 3 === 0 ? 22 : 26;
          return (
            <line
              key={i}
              x1={42 + inner * Math.cos(a)}
              y1={42 + inner * Math.sin(a)}
              x2={42 + R * Math.cos(a)}
              y2={42 + R * Math.sin(a)}
              stroke={i % 3 === 0 ? theme.accent : theme.inkDim}
              strokeWidth={i % 3 === 0 ? 2 : 1}
              opacity={0.7}
            />
          );
        })}
        <line
          x1={42}
          y1={42}
          x2={42 + (R - 6) * Math.cos(rad)}
          y2={42 + (R - 6) * Math.sin(rad)}
          stroke={theme.accent}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={42} cy={42} r={3} fill={theme.accent} />
      </svg>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 19, color: theme.inkDim, letterSpacing: 3 }}>一年中的第</div>
        <div style={{ fontSize: 28, color: theme.accent, letterSpacing: 1 }}>
          {day}
          <span style={{ fontSize: 17, color: theme.inkDim }}> 天</span>
        </div>
      </div>
    </div>
  );
};
