---
name: vibe-knowledge-video
description: >
  抖音「Vibe知识大赏」式知识短片制作：一个知识点 → 一条 1:30–2:45、无旁白、纯代码逐帧渲染的 1080p 横屏短片。
  观众读底部双语字幕，同时看屏上把这句话演出来；结尾学术引用收尾。全片由 Remotion（React 时间线）代码画出，
  不依赖任何视频生成模型、不需要 TTS 配音。核心是讲解设计：给每个概念找一个外行认得的形象，
  句子里的动词屏上真的发生；先找形象再写文案，配图不是讲解。
  触发：做一条 vibe 知识大赏 / 知识科普短片 / 把某个概念拍成大片 / 用代码做知识视频 / 像运气的形状、信息论那样的片子。
  不用于：有旁白配音的讲解片、竖屏短视频、剧情短剧（用 drama 系列）、需要真实素材剪辑的片子。
version: 1.1.0
license: MIT
---

# Vibe 知识短片 · 代码成片工作室

一个知识点 → 一条无旁白的精品知识短片。观众读字幕，看屏上把知识**演**出来；全片由代码逐帧渲染，没有一帧来自视频模型。

做这种片子的人是科普作者兼导演。色、字、辉光、片名卡都是皮；片子好不好，看观众能不能一眼认出屏上的东西、看见它在变、看完讲得出"因为……所以……"。

**动手前先读 [references/visualization.md](references/visualization.md)。** 找形象的方法、六种画法、什么时候不画、两版分镜对照、看图改图的毛病表都在那里。本文件只是流程。

## 成品长什么样

| 维度 | 规范 |
|---|---|
| 画幅 | 1920×1080 横屏，30fps，MP4 |
| 时长 | 1:30–2:45（标准片约 130 秒 ≈ 40 句字幕） |
| 声音 | 无旁白、无 TTS；纯器乐 BGM（76–78 BPM 沉静节奏）或无声；用户指定曲优先 |
| 外观 | 一条片一套色板、字体、画法；每种颜色全片一个意思（默认深蓝黑底，见 visual-style.md） |
| 布局 | 顶部单行场景/时代标签；中央主体；y≈85–91% 双语字幕（中文主句 + 英文斜体小字），其上不放杂物 |
| 字幕 | 每句 2.5–4 秒，中文 ≤ 20 字 |
| 片名 | 先演一个具体的小东西，6–20 秒处才落片名 |
| 收尾 | 最后一镜回到主形象的状态反转；末句是片名回声；引用卡在其后 |

## 六条铁律

1. **配图不是讲解。** 检验法：这个画面换给另一段文案还成立吗？成立就是配图。屏上的主体叫得出日常名字、长得像它本身；点、线、圈、柱子只当小字。
2. **先找形象，再写文案。** 每个概念按 visualization.md 第一节的顺序找形象；句子里要有屏上看得见的东西和动作。画不出来的句子，改句子。
3. **句子里的动词，屏上真的做。** "砍掉一半"就盖住一半；数是真算的；示意处写明"示意"。
4. **该画的画，该停的停。** 提问、命名、结论、出处不配新画面，约占 1/5。一个场景撑两句以上，每句只改一处。
5. **没出处不上屏。** 年份、人名、数字、引文全部进事实表（templates/facts.md），带来源与把握程度；分歧两说并列；查不到就换例子。
6. **画面 = 帧号的纯函数。** 禁 `Math.random()`（用固定种子）、禁 CSS transition/animation；模拟在模块顶层算好，组件里只查表。见 [references/remotion-contract.md](references/remotion-contract.md)。

## 七步流程（每步有过关标准，没过不往下走）

### 1. 立题
一句话论点；观众该记住的那一句话；3–12 个概念，每个用大白话写"要观众明白什么"和"外行卡在哪"。
选题过 [structure-bible.md](references/structure-bible.md) §1 四项打分；没方向翻 [topic-seeds.md](references/topic-seeds.md)。
过关：论点一口气说得完；每个概念你能不用术语讲给外行听——讲不出来先去弄懂，含糊的句子都是没弄懂时写出来的。

### 2. 事实表
每个年份、人名、数字的出处和把握程度（`[实测]/[官方]/[推断]/[待验证]`）。把握不足去查，查不到换例子。
过关：无裸断言。

### 3. 找形象（决定片子好坏的一步，时间主要花在这里）
先判题型，读 references/formats/ 对应模板（叙事场景 / 机制演绎 / 概念对话 / 具身隐喻）。再对每个概念按 visualization.md 第一节逐个问；定全片**一个**形象、**一把**尺子、哪些东西回场。
过关：每个形象叫得出日常名字；至少一半概念有生活锚；没有哪个形象换给别的文案也成立；说得出全片哪一下最让人"哦——"。
**停靠**：给用户看方案（钩子三个方向 + 一个推荐 + 形象清单 + 题型），确认后再写。用户说"直接做"可不等，但照样写出来。

### 4. 文案与分镜表一起写
按 [templates/storyboard.md](templates/storyboard.md) 一句一行写：画法、屏上是什么在干什么、小字、观众明白了什么。字幕规范见 [copywriting.md](references/copywriting.md)；叙事定律和功能位置用 [structure-bible.md](references/structure-bible.md)、[beat-scaffold.md](references/beat-scaffold.md) 当检查表，不当填空题。
过关：分镜表底部自检全过。
**停靠**：字幕稿 + 分镜表给用户确认。

### 5. 建工程，先做最难的一镜
按 [remotion-contract.md](references/remotion-contract.md) 建工程（`npx create-video --blank`）：一个场景一个组件；字幕做顶层组件；`calculateMetadata` 由分镜数据算总时长。
先做分镜里**最难画的那一镜**，`npx remotion still` 截帧过三问；过了再做开头 30 秒给用户看，再铺全片。
过关：最难那一镜遮住字幕答得出"这是什么、在干什么"；`npx remotion studio` 预览跑通。

### 6. 渲染与看图改图
按 [quality-gate.md](references/quality-gate.md) 三步走：`motion_gate.sh` 扫硬伤 → 480px 小图网格看清晰 → 遮字幕三问看讲解；毛病按 visualization.md 第十节的表改。
过关：**至少改两轮再给用户看**；每轮列毛病 → 改 → 重截同样时刻 → 确认改掉、没改坏别的。

### 7. 交付
**交付目录**：`~/Desktop/vibe知识大赏/`（不存在先 `mkdir -p`）。
**成片命名**：`<YYYY-MM-DD>-<主题 title>.mp4`；同一天同一主题重渲时覆盖前先确认。
成片 + 事实表 + 分镜表 + 引用卡。按 quality-gate.md §4 终检；**交片时说实话**：不满意的地方、没做的东西、没完整看过的部分直接列出。
**交片后回填**：验证过的做法写进 [lessons.md](references/lessons.md)（一句结论 + 用在哪），坑写进对应 reference。

## 力气不够时

1. **不跳步。** 尤其第 3、4 步：没有形象和分镜表，后面改多少轮都救不回来。
2. **拿不准就查表。** 这一句怎么演，查 visualization.md 第三节；毛病怎么改，查第十节。
3. **画面现写，不套模板。** `examples/` 看的是做法，不是零件库。
4. **宁可少，不要糊。** 时间只够做好三个概念，就只做三个。

## 按需加载

| 文件 | 内容 |
|---|---|
| [references/visualization.md](references/visualization.md) | **讲解设计**：找形象、六种画法、画与不画、理解加速器、两版分镜对照、看图改图 |
| [references/structure-bible.md](references/structure-bible.md) | 选题打分、四种骨架、十一条叙事定律 |
| [references/beat-scaffold.md](references/beat-scaffold.md) | 130 秒的功能位置检查表 |
| [references/copywriting.md](references/copywriting.md) | 字幕稿：量、句式、删句、禁用清单 |
| [references/formats/](references/formats/) | 四种题型的骨架、视觉系统、招牌手法 |
| [references/visual-style.md](references/visual-style.md) | 配色、字体、构图、动效、亮度层次、镜头、版面 |
| [references/quality-gate.md](references/quality-gate.md) | 质量门三步 + 终检 |
| [references/remotion-contract.md](references/remotion-contract.md) | Remotion 映射表、纪律、命令 |
| [references/bgm-and-sync.md](references/bgm-and-sync.md) | BGM 合成（`scripts/synth_bgm.py`）与卡点 |
| [references/citation-policy.md](references/citation-policy.md) | 引用落位分级 |
| [references/topic-seeds.md](references/topic-seeds.md) | 选题种子库 |
| [references/lessons.md](references/lessons.md) | 经验回流 |
| `scripts/motion_gate.sh` | 量化门禁（静止/黑场/暗帧） |
| `templates/` | 事实表、分镜表模板 |
| `examples/solar-terms/` | 完整示例工程（二十四节气，V1/V2 对比）；渲染入口 `npx remotion still src/Root.tsx MainV2 ...` |

## 与其他 Skill 的边界

- 剧情/短剧类 → `drama-*` 系列
- 需要旁白配音的知识讲解 → 本 Skill 不做 TTS；可交付后自行配音
- 方法借鉴：vibe-knowledge 三仓与 vibe-knowledge-film（MIT），文本独立重写
