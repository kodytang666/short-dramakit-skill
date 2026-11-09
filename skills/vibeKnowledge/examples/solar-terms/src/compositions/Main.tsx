import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { DURATION_SEC } from "../script";
import { Subtitle } from "../components/Subtitle";
import { Hook } from "../scenes/Hook";
import { Story } from "../scenes/Story";
import { Mechanism } from "../scenes/Mechanism";
import { Depth } from "../scenes/Depth";
import { Ending } from "../scenes/Ending";

// 场景表：起点秒（与 script.ts 对齐）+ 交叉淡化 0.8s
const SCENES: Array<{ from: number; Comp: React.FC }> = [
  { from: 0, Comp: Hook },
  { from: 14.5, Comp: Story },
  { from: 44, Comp: Mechanism },
  { from: 100, Comp: Depth },
  { from: 116.5, Comp: Ending },
];

const XFADE = 0.8;

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const totalFrames = Math.round(DURATION_SEC * fps);

  // BGM 包络：开头淡入 → 片名卡回落 → 机制段推起 → 结尾淡出（见 bgm-and-sync.md）
  const bgmVolume = (f: number) =>
    interpolate(
      f,
      [0, 2 * fps, 12 * fps, 15 * fps, 44 * fps, 100 * fps, 116.5 * fps, 131 * fps, totalFrames],
      [0, 0.62, 0.62, 0.45, 0.75, 0.68, 0.62, 0.6, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

  return (
    <AbsoluteFill style={{ background: "#050510" }}>
      <Audio src={staticFile("bgm.wav")} volume={bgmVolume} />
      {SCENES.map(({ from, Comp }, i) => {
        const nextFrom = i + 1 < SCENES.length ? SCENES[i + 1].from : DURATION_SEC;
        // 渲染窗口：前后各扩半个转场；Sequence 让场景拿到"本地帧号"（时间线按本地秒设计）
        const start = Math.max(0, from - XFADE / 2);
        const end = nextFrom + XFADE / 2;
        const durFrames = Math.round((end - start) * fps);
        if (t >= end || t < start) return null;
        const fadeIn = interpolate(t, [start, start + XFADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = i + 1 < SCENES.length ? interpolate(t, [nextFrom - XFADE / 2, nextFrom + XFADE / 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        return (
          <Sequence key={i} from={Math.round(start * fps)} durationInFrames={durFrames} style={{ opacity: fadeIn * fadeOut }}>
            <Comp />
          </Sequence>
        );
      })}
      <Subtitle />
    </AbsoluteFill>
  );
};
