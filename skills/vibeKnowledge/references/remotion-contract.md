# Remotion 契约：方法论到代码的映射

> 铁律只有一条：**画面 = 时间 t 的纯函数**。方法论的讲解设计、字幕稿、结构、质量门与渲染技术无关；本文管怎么落到 Remotion（React 时间线视频框架）。

## 1. 核心映射表

| 讲解纪律 | Remotion 对应物 |
|---|---|
| "第 N 秒是什么画面" | `useCurrentFrame()` 拿帧号 + `useVideoConfig().fps` 换算秒——**永远用 fps 换算，不许写死 30** |
| 分段动画（t 在 [a,b] 内播放） | `interpolate(frame, [a*fps, b*fps], [0,1], {extrapolateLeft/Right: "clamp", easing})`——**两端必须 clamp** |
| 缓动（进出场手感） | `Easing.bezier(...)` / `Easing.spring({damping})`；缩放在对数空间插值 `Math.exp(interpolate(f, r, [Math.log(a), Math.log(b)]))`（4.0.292 的 `interpolate` 没有 `output` 选项） |
| 逐拍时间线 | 一个场景一个组件；相邻场景用 `TransitionSeries.Sequence` + fade/slide 转场（**转场时长会缩短总时长，编排时计入**） |
| 固定种子 rng | 禁 `Math.random()`；模块顶层 `mulberry32(seed)`，全片同一序列 |
| 禁帧间状态 | CSS `transition` / `animation` / Tailwind 动画类**一律禁用**——它们不随帧渲染，输出会错；一切动效由帧号驱动 |
| 字幕永远最上 | 字幕做成顶层组件压在最上；水印/角标等全片常驻层同理 |
| 字体就绪再出帧 | 用 `@remotion/google-fonts` 官方包加载（阻塞到字体就绪），从根上消掉"前几帧回退字体"的坑 |
| 模拟不在渲染时跑 | 模块顶层算好（固定种子），组件里只查表——**不许在组件体内跑模拟** |
| 时长由数据驱动 | `calculateMetadata` 从分镜数据算总时长，不手写死 |
| 文本不溢出 | 标题/字幕最长行用 `@remotion/text-measure` 量宽，必要时自动缩字号 |

## 2. 工程结构约定

```
<solar-terms>/
├── package.json            # remotion 依赖
├── src/
│   ├── Root.tsx            # 注册合成，calculateMetadata 算总时长
│   ├── compositions/
│   │   └── Main.tsx        # 主合成：TransitionSeries 串起所有场景
│   ├── scenes/             # 一个场景（骨架段落）一个组件
│   │   ├── Hook.tsx        # 钩子+片名卡
│   │   ├── Story.tsx       # 历史锚点
│   │   ├── Mechanism.tsx   # 机制模拟（全片最长）
│   │   ├── Depth.tsx       # 历史纵深
│   │   └── Ending.tsx      # 回问+引用卡
│   ├── components/         # 复用件：Subtitle.tsx（顶层字幕）、EraTag.tsx（年代戳）、CiteCard.tsx（引用卡）
│   ├── script.ts           # 分镜数据（逐拍：字幕中英/主体/动作/强调位）——单一数据源
│   └── theme.ts            # 全片唯一配色/字号/字体令牌
└── out/                    # 渲染产物
```

## 3. 命令

```bash
# 脚手架（一次性）
npx create-video@latest --yes --blank solar-terms && cd solar-terms

# 预览（写代码时一直开着，边写边看）
npx remotion studio --no-open     # 打印本地网址，浏览器打开

# 抽查帧（先于全片：看图改图的依据）
npx remotion render Main out/stills --frames=0,30,90 --image-format=png

# 全片（先渲到本地 out/，再按交付规则改名落到交付目录）
npx remotion render Main out/final.mp4
mkdir -p "$HOME/Desktop/vibe知识大赏"
cp out/final.mp4 "$HOME/Desktop/vibe知识大赏/$(date +%F)-<主题title>.mp4"   # 例：2026-11-07-太阳说了算.mp4

# 音频（可选 BGM）
# BGM 与音效作为 <Audio> 层写进合成（from 定起点、volume 做包络）
```

## 4. 字幕组件纪律

- 字幕数据来自 `script.ts` 单一数据源，组件不手写字幕文本
- 每拍字幕的起止秒来自分镜表；强调拍（★）前留 0.5 秒空——停顿是代码的一部分，写进数据
- 中文主句 + 英文斜体小字两行固定布局（y≈85–91%）；提问句可加大一档字号
- 字幕淡入淡出用 `interpolate` 包络，不许 CSS 动画

## 5. 参数化（一次搭台，期期复用）

把分镜表做成 Zod schema（每拍的字幕、染色词、年代戳、画面类型），合成注册 defaultProps。做新一期只改一份 `script.ts` 数据——这正是"同一套版式换内容"的工程化形态。

## 6. 许可注意

Remotion 面向公司使用时按其官网授权条款执行（个人与小团队免费）；本文档为独立撰写，API 名称属公开技术事实，以其官方文档为准。
