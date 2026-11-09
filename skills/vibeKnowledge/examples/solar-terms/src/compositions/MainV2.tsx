import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { DURATION_SEC, SECTIONS } from "../script-v2";
import { SubtitleV2 } from "../components/SubtitleV2";
import { Readout } from "../components/Readout";
import { GrainVignette } from "../components/GrainVignette";
import { HookV2 } from "../scenes-v2/HookV2";
import { StoryV2 } from "../scenes-v2/StoryV2";
import { MechanismV2 } from "../scenes-v2/MechanismV2";
import { DepthV2 } from "../scenes-v2/DepthV2";
import { EndingV2 } from "../scenes-v2/EndingV2";

// 场景表（起点秒，与 script-v2 SECTIONS 对齐）+ 交叉淡化 0.8s
const SCENES: Array<{ from: number; Comp: React.FC }> = [
  { from: SECTIONS.hook, Comp: HookV2 },
  { from: SECTIONS.story, Comp: StoryV2 },
  { from: SECTIONS.mechanism, Comp: MechanismV2 },
  { from: SECTIONS.depth, Comp: DepthV2 },
  { from: SECTIONS.ending, Comp: EndingV2 },
];

const XFADE = 0.8;

export const MainV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const totalFrames = Math.round(DURATION_SEC * fps);

  // 常驻读数：故事段起、纵深段末收起
  const readoutOpacity = interpolate(
    t,
    [SECTIONS.story, SECTIONS.story + 1, SECTIONS.ending - 1, SECTIONS.ending],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // BGM 包络：开头淡入 → 片名卡回落 → 机制推起 → 结尾淡出
  const bgmVolume = (f: number) =>
    interpolate(
      f,
      [0, 2 * fps, 10 * fps, 14 * fps, SECTIONS.mechanism * fps, SECTIONS.depth * fps, SECTIONS.ending * fps, 131 * fps, totalFrames],
      [0, 0.6, 0.6, 0.44, 0.74, 0.66, 0.6, 0.58, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

  // 纵深→结尾两场构图相同（手机+轨道盘回场），交叉淡化会叠影：此边界过一次极短黑场
  const dip = interpolate(t, [116.15, 116.45, 116.7, 117.0], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#050510" }}>
      <Audio src={staticFile("bgm-v2.wav")} volume={bgmVolume} />
      {SCENES.map(({ from, Comp }, i) => {
        const nextFrom = i + 1 < SCENES.length ? SCENES[i + 1].from : DURATION_SEC;
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
      <GrainVignette />
      <Readout t={t} opacity={readoutOpacity} />
      <SubtitleV2 />
      {dip > 0 && <AbsoluteFill style={{ background: "#050510", opacity: dip }} />}
    </AbsoluteFill>
  );
};
