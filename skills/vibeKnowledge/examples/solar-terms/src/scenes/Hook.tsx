import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { theme, mulberry32 } from "../theme";
import { TITLE } from "../script";

// 年代戳（顶部标签带）
export const EraTag: React.FC<{ text: string; from: number }> = ({ text, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const opacity = interpolate(t, [from, from + 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 96,
        fontFamily: theme.fontMono,
        fontSize: theme.fontSize.era,
        color: theme.inkDim,
        letterSpacing: "0.35em",
        opacity,
        borderLeft: `2px solid ${theme.accent}`,
        paddingLeft: 18,
      }}
    >
      {text}
    </div>
  );
};

// 星空背景（固定种子，常驻慢漂移 = 密度红线）
export const Starfield: React.FC<{ seed?: number; drift?: number }> = ({ seed = 7, drift = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const rng = mulberry32(seed);
  const stars = React.useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        x: rng() * 1920,
        y: rng() * 1080,
        r: 0.6 + rng() * 1.8,
        ph: rng() * Math.PI * 2,
        sp: 0.3 + rng() * 0.8,
        key: i,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="42%" r="80%">
          <stop offset="0%" stopColor={theme.bg1} />
          <stop offset="100%" stopColor={theme.bg0} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#bgGrad)" />
      {stars.map((s) => (
        <circle
          key={s.key}
          cx={s.x + Math.sin(t * 0.05 * drift) * 6}
          cy={s.y}
          r={s.r}
          fill={theme.ink}
          opacity={0.12 + 0.3 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph))}
        />
      ))}
    </svg>
  );
};

// 场景一：钩子（日历页）+ 片名卡
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // b01-b03 日历：21 → 22 翻页；b04 片名卡
  const phase = t < 12 ? 0 : 1; // 0=日历 1=片名
  const calIn = spring({ frame: frame - 2, fps, damping: 200 });
  const to22 = interpolate(t, [3.8, 4.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const darken = interpolate(t, [7, 10, 12], [1, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleIn = interpolate(t, [12.3, 13.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const glow = 0.5 + 0.2 * Math.sin(t * 2);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Starfield seed={11} drift={0.4} />
      {phase === 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: darken, transform: `scale(${0.98 + 0.02 * calIn})` }}>
          <svg width={560} height={720}>
            <rect x={20} y={20} width={520} height={680} rx={14} fill="#10101E" stroke={theme.line} strokeWidth={1.5} />
            <text x={280} y={92} textAnchor="middle" fontFamily={theme.fontMono} fontSize={30} fill={theme.inkDim} letterSpacing={8}>DECEMBER</text>
            <line x1={60} y1={120} x2={500} y2={120} stroke={theme.line} />
            {/* 日历格 14-31，冬至高亮在 21/22 之间换 */}
            {Array.from({ length: 18 }, (_, i) => {
              const d = 14 + i;
              const col = (d - 14) % 7;
              const row = Math.floor((d - 14) / 7);
              const cx = 76 + col * 71;
              const cy = 172 + row * 92;
              const is21 = d === 21;
              const is22 = d === 22;
              const hl21 = is21 && to22 < 1;
              const hl22 = is22 && to22 >= 1;
              return (
                <g key={d} opacity={d === 14 || d === 15 ? 0.85 : 1}>
                  <text x={cx} y={cy} textAnchor="middle" fontFamily={theme.fontMono} fontSize={30} fill={hl21 || hl22 ? theme.alert : theme.inkDim}>
                    {d}
                  </text>
                  {(hl21 || hl22) && (
                    <circle cx={cx} cy={cy + 14} r={5} fill={theme.alert} opacity={0.8} />
                  )}
                </g>
              );
            })}
            <text x={280} y={660} textAnchor="middle" fontFamily={theme.fontSerif} fontSize={34} fill={theme.alert} opacity={0.95}>
              冬至 WINTER SOLSTICE
            </text>
          </svg>
        </div>
      )}
      {phase === 1 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: titleIn }}>
          <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.inkDim, letterSpacing: 14, marginBottom: 34 }}>VIBE 知识大赏</div>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: theme.fontSerif, fontSize: 170, color: theme.accent, letterSpacing: "0.25em", textShadow: `0 0 ${40 * glow}px rgba(217,179,108,0.6)` }}>
              {TITLE.cn}
            </div>
          </div>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 44, color: theme.ink, marginTop: 26, letterSpacing: "0.3em" }}>
            {TITLE.sub}
          </div>
          <div style={{ fontFamily: theme.fontSerif, fontStyle: "italic", fontSize: 27, color: theme.inkDim, marginTop: 22 }}>
            {TITLE.en} — {TITLE.q}
          </div>
        </div>
      )}
    </div>
  );
};
