// 分镜数据 · 单一数据源（与 docs/storyboard.md 对齐）
export type Beat = {
  cn: string;
  en: string;
  start: number; // 秒
  dur: number;
  star?: boolean; // 强调位
};

export const FPS = 30;
export const DURATION_SEC = 135;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// 字幕逐拍（37 拍）。★=star
export const beats: Beat[] = [
  { cn: "去年冬至，12 月 21 日。", en: "Last solstice: Dec 21.", start: 0.5, dur: 3.0 },
  { cn: "今年，差了一天。", en: "This year, off by a day.", start: 3.5, dur: 3.0 },
  { cn: "是日历排错了，还是——", en: "Is the calendar wrong, or—", start: 7.0, dur: 3.5 },
  { cn: "节气 · 太阳的刻度", en: "SOLAR TERMS", start: 12.0, dur: 3.0, star: true },
  { cn: "公元前 2 世纪，中国人仰头看天。", en: "2nd century BC. Eyes on the sky.", start: 15.0, dur: 3.0 },
  { cn: "他们发现：影子，一年年循环。", en: "Shadows repeat every year.", start: 18.0, dur: 3.0 },
  { cn: "正午量影：夏至最短，冬至最长。", en: "Measure the noon shadow.", start: 21.0, dur: 4.0 },
  { cn: "可一年到底多长？节气定在哪天？", en: "How long is a year?", start: 25.0, dur: 3.0 },
  { cn: "答案不在月亮——在太阳。", en: "Not the moon — the sun.", start: 28.0, dur: 3.5 },
  { cn: "《淮南子》首次记全二十四节气。", en: "The Huainanzi listed all 24.", start: 31.5, dur: 3.0 },
  { cn: "但古人的算法，用了两千年才换。", en: "Their rule ran 2,000 years.", start: 34.5, dur: 3.5 },
  { cn: "因为地球，跑得并不匀。", en: "Earth doesn't run even.", start: 38.0, dur: 3.0, star: true },
  { cn: "谁对？让太阳说话。", en: "Let the sun speak.", start: 41.0, dur: 3.0 },
  { cn: "把地球一年的路，画成一个圆环。", en: "Earth's year, as a ring.", start: 44.0, dur: 4.0 },
  { cn: "太阳的位置，用黄经度量：一圈 360 度。", en: "Longitude: 360° around.", start: 48.0, dur: 3.5 },
  { cn: "每走满 15 度，就过一个节气。", en: "Every 15° — one term.", start: 51.5, dur: 3.5 },
  { cn: "春分 0 度，夏至 90 度，冬至 270 度。", en: "0° equinox; 90° solstice.", start: 55.0, dur: 4.0 },
  { cn: "24 个刻度，365.2422 天。", en: "24 marks; 365.2422 days.", start: 59.0, dur: 4.0, star: true },
  { cn: "没有神明安排，只有几何。", en: "No gods — geometry.", start: 63.0, dur: 3.5 },
  { cn: "问题来了——", en: "But here's the thing—", start: 66.5, dur: 2.5 },
  { cn: "轨道是椭圆：近日点快，远日点慢。", en: "Elliptic orbit: uneven pace.", start: 69.0, dur: 4.5, star: true },
  { cn: "两个节气之间：有时 14 天，有时 16 天。", en: "Gaps vary: 14 to 16 days.", start: 73.5, dur: 4.0 },
  { cn: "老办法：把一年均分成 24 段——平气法。", en: "Old rule: equal time.", start: 77.5, dur: 4.0 },
  { cn: "均分的段，落在黄道上就不均了。", en: "Equal time ≠ equal angle.", start: 81.5, dur: 4.0 },
  { cn: "用时间切太阳，还是用太阳切时间？", en: "Cut time, or cut the sun?", start: 85.5, dur: 3.5, star: true },
  { cn: "更麻烦的是：星空也在漂。", en: "Worse: the stars drift.", start: 89.0, dur: 3.0 },
  { cn: "地轴像陀螺，25800 年晃一圈——岁差。", en: "Precession: 25,800 years.", start: 92.0, dur: 4.5 },
  { cn: "节气不锚月亮，不锚星星——只锚太阳。", en: "Anchored to the sun alone.", start: 96.5, dur: 3.5, star: true },
  { cn: "1645 年，《时宪历》改用定气法。", en: "1645: true longitude.", start: 100.0, dur: 3.0 },
  { cn: "从此，节气按黄经刻度落定。", en: "Terms pinned to longitude.", start: 103.0, dur: 3.5 },
  { cn: "今天的紫金山天文台，算同一件事。", en: "Still computed today.", start: 106.5, dur: 3.5 },
  { cn: "换了朝代，换了历法，刻度没换。", en: "Dynasties changed; degrees didn't.", start: 110.0, dur: 3.0, star: true },
  { cn: "2016 年，入选人类非遗。", en: "2016: UNESCO heritage.", start: 113.0, dur: 3.5 },
  { cn: "回到开头：冬至为什么差一天？", en: "So why the one-day shift?", start: 116.5, dur: 4.0 },
  { cn: "节气不看日历——看太阳走到哪一刻度。", en: "The sun's degree decides.", start: 120.5, dur: 4.0, star: true },
  { cn: "本片为科普示意，图示非精确比例。", en: "Illustrative, not to scale.", start: 124.5, dur: 3.0 },
  // b37 引用卡无字幕
];

export const CITATIONS = [
  "《淮南子·天文训》 西汉·刘安",
  "《时宪历》 1645 年颁行",
  "GB/T 33661-2017《农历的编算和颁行》",
  "紫金山天文台 · 中国天文年历",
  "UNESCO 人类非物质文化遗产名录 2016",
];

export const TITLE = { cn: "节气", sub: "太阳的刻度", en: "SOLAR TERMS", q: "二十四节气是如何计算的？" };
