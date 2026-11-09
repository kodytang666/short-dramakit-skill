// 全片唯一配色/字号令牌（visual-style.md）
export const theme = {
  bg0: "#050510",
  bg1: "#101028",
  ink: "#F5F2E9",
  inkDim: "#9A97A8",
  accent: "#D9B36C",
  alert: "#E85D4A",
  glow: "rgba(217,179,108,0.18)",
  line: "rgba(245,242,233,0.25)",
  fontSerif: `"Songti SC","Noto Serif SC","STSong",serif`,
  fontMono: `"SF Mono","JetBrains Mono",Menlo,monospace`,
  fontSize: {
    subtitle: 46,
    subtitleEn: 25,
    title: 118,
    sub: 40,
    note: 30,
    era: 26,
  },
};

// 固定种子随机（禁 Math.random）
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
