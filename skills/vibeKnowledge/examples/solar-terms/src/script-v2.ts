// 分镜数据 V2 · 单一数据源（按更新后方法论重写：structure-bible 十一条定律）
// 差异要点：① 钩子从"你手机里的日历"切入 ② 埋一个具体悬念 30–90s 后解
// ③ 三层反转（黄经 → 椭圆 → 岁差）④ 常驻黄经读数 ⑤ 中段转"你" ⑥ 拍间留无字幕间隙

export type Beat = {
  cn: string;
  en: string;
  start: number; // 秒
  dur: number;
  star?: boolean; // 强调位
  screen?: boolean; // 这句由画面大字承担，字幕层不再重复显示
};

export const FPS = 30;
export const DURATION_SEC = 135;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// 段落边界（MainV2 场景表与 BGM sections 共用）
export const SECTIONS = {
  hook: 0,
  story: 14,
  mechanism: 40,
  depth: 95,
  ending: 116.5,
  end: 135,
};

// 37 拍。★=强调位。拍与拍之间故意留 0.3–0.8s 间隙 → 无字幕纯画面约 26%
export const beats: Beat[] = [
  // ── 一、钩子 + 片名 0–14 ──
  { cn: "你手机日历上的冬至，去年 21 号。", en: "Last year, your calendar said the 21st.", start: 0.3, dur: 2.7 },
  { cn: "今年，变成 22 号了。", en: "This year: the 22nd.", start: 3.5, dur: 2.7 },
  { cn: "是日历排错了，还是太阳走慢了？", en: "Bad calendar — or a slower sun?", start: 6.8, dur: 2.8 },
  { cn: "太阳说了算", en: "THE SUN DECIDES", start: 10.4, dur: 3.4, star: true },

  // ── 二、真实故事：量影 → 淮南子 → 埋悬念 14–40 ──
  { cn: "公元前 2 世纪，长安，一根量日木杆。", en: "2nd c. BC: one pole, measuring the sun.", start: 14.6, dur: 2.6 },
  { cn: "正午量影：夏至最短，冬至最长。", en: "Noon shadow: shortest, then longest.", start: 17.6, dur: 3.0 },
  { cn: "影子年复一年循环，可一年有多长？", en: "Same loop — but how long is a year?", start: 21.2, dur: 2.8 },
  { cn: "答案不在月亮，在太阳。", en: "Not the moon — the sun.", start: 24.4, dur: 2.6 },
  { cn: "《淮南子》第一次写全二十四个节气。", en: "The Huainanzi listed all 24 first.", start: 27.4, dur: 3.0 },
  { cn: "可这套算法，两千年后才被换掉。", en: "Replaced only 2,000 years later.", start: 30.9, dur: 2.8 },
  { cn: "因为地球，跑得并不匀。", en: "Earth doesn't run evenly.", start: 34.1, dur: 2.8, star: true },
  { cn: "谁对？让太阳自己说。", en: "Let the sun speak.", start: 37.3, dur: 2.2 },

  // ── 三、机制演示：三层反转 40–95 ──
  { cn: "把地球一年的路，画成一个圆环。", en: "Earth's year, drawn as a ring.", start: 40.2, dur: 2.8 },
  { cn: "太阳的位置叫黄经，一圈 360 度。", en: "Sun's longitude: 360° a circle.", start: 43.6, dur: 2.8 },
  { cn: "每走满 15 度，就是一个节气。", en: "Every 15° — one solar term.", start: 46.9, dur: 2.8 },
  { cn: "春分 0°，夏至 90°，冬至 270°。", en: "0°, 90°, 270°: the anchors.", start: 50.2, dur: 3.0 },
  { cn: "24 个刻度，走完 365.2422 天。", en: "24 marks, 365.2422 days.", start: 53.9, dur: 3.0, star: true },
  { cn: "第一层：节气不认日历，认太阳。", en: "Layer one: the sun, not the calendar.", start: 59.5, dur: 2.8 },
  { cn: "更反直觉的是——", en: "More counterintuitive:", start: 62.8, dur: 2.0, screen: true },
  { cn: "地球的轨道，其实是个椭圆。", en: "Earth's orbit is an ellipse.", start: 65.2, dur: 2.8, star: true },
  { cn: "离太阳近时跑得快，远时反而慢。", en: "Faster near the sun, slower far.", start: 68.5, dur: 2.8 },
  { cn: "两个节气之间：有时 14 天，有时 16 天。", en: "Gaps: 14 to 16 days.", start: 71.8, dur: 3.0 },
  { cn: "老办法：一年均分 24 段，叫平气。", en: "Old rule: equal time — mean qi.", start: 75.4, dur: 3.0 },
  { cn: "时间均分，落到太阳上就不均了。", en: "Equal time ≠ equal angle.", start: 78.9, dur: 2.8 },
  { cn: "用时间切太阳，还是用太阳切时间？", en: "Cut time, or cut the sun?", start: 82.2, dur: 3.0, star: true },
  { cn: "更麻烦的，还在后头。", en: "And there's worse.", start: 87.5, dur: 2.0, screen: true },
  { cn: "地球的轴，两万五千年晃一圈——岁差。", en: "Precession: a wobble every 25,800 yr.", start: 90.0, dur: 3.0, star: true },

  // ── 四、历史纵深 95–116.5 ──
  { cn: "连冬至点，也在慢慢漂。", en: "Even the solstice point drifts.", start: 95.2, dur: 2.6 },
  { cn: "1645 年，《时宪历》改用定气法。", en: "1645: the true-solar reform.", start: 98.2, dur: 2.8 },
  { cn: "从那天起，节气按太阳刻度落定。", en: "Terms pinned to the sun's degree.", start: 101.4, dur: 2.8 },
  { cn: "今天紫金山天文台，还在算这件事。", en: "Purple Mountain still computes it.", start: 104.8, dur: 2.8 },
  { cn: "换了朝代，换了历法，刻度没换。", en: "Dynasties changed; degrees didn't.", start: 108.0, dur: 2.8, star: true },
  { cn: "你手机里的节气，用的是这套算法。", en: "Your phone still uses this rule.", start: 111.4, dur: 3.0 },

  // ── 五、收尾 116.5–135 ──
  { cn: "回到开头：冬至为什么差一天？", en: "So why the one-day shift?", start: 116.8, dur: 3.0 },
  { cn: "太阳到 270° 那刻，不落在同一格。", en: "270° lands on a different grid.", start: 120.2, dur: 3.1, star: true },
  { cn: "本片为科普示意，图示非精确比例。", en: "Illustrative, not to scale.", start: 124.0, dur: 2.8 },
  // b37 引用卡无字幕 127.2–135
];

export const CITATIONS = [
  "《淮南子·天文训》 西汉·刘安",
  "《时宪历》 1645 年颁行",
  "GB/T 33661-2017《农历的编算和颁行》",
  "紫金山天文台 · 中国天文年历",
  "UNESCO 人类非物质文化遗产名录 2016",
];

export const TITLE = {
  cn: "太阳说了算",
  sub: "二十四节气是怎么算的",
  en: "THE SUN DECIDES",
};

// 三层反转标注（机制段卡片）
export const LAYERS = [
  { tag: "第一层", text: "节气不认日历，认太阳" },
  { tag: "第二层", text: "可太阳的轨道并不圆" },
  { tag: "第三层", text: "连冬至点本身也在漂" },
];
