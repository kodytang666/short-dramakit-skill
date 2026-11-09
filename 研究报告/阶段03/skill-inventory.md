# 阶段三（剧本创作）参考 Skill 清单

> 调研日期：2026-10-30

## 直接相关 Skill（3 个）

| # | Skill | 仓库 | 已读 |
|---|---|---|---|
| 1 | short-drama-write | drama-skills | SKILL.md 全文（113 行） |
| 2 | novel-script | shuohao-skills | SKILL.md 全文（Step 0-4 与 10 道质量门） |
| 3 | webnovel-writing（dialogue/anti_ai_voice/chapter_ending 模块） | Chinese-WebNovel-Skill | 模块清单抽查（dialogue/anti_ai_voice README） |

## 间接相关

| Skill | 借用点 |
|---|---|
| short-drama-storyboard | 下游消费剧本：场次 ID、[画面文字] 的后期承载——反推剧本格式 |
| short-drama-edit | 字幕"逐字取自剧本"——剧本台词的权威性要求 |
| short-drama-produce | TTS 从剧本读原句——台词格式必须 TTS 友好 |

## 两种剧本哲学对照（本阶段核心研究结论）

| 维度 | short-drama-write（drama-skills） | novel-script（shuohao） |
|---|---|---|
| 载体 | 人读 Markdown 剧本（每集一份 剧本.md） | 机读 JSON（script.json）+ 渲染 Markdown |
| 场景标题 | `## EP001-SC001 内 · 地点 · 时间/天气` | sceneIndex + 场次结构化 |
| 台词 | `角色（表演提示）：台词` 行式 | 说话人/台词/语气结构化条目（TTS 直喂） |
| 节拍 | 散文动作叙述 | **动作节拍 ⇄ 台词行交替**（节拍流，AI 生成友好） |
| 时长 | 估时脚本（screenplay_index + duration_estimate，语速换算）+ 通读压稿 | 语速折算门（4.5 字/秒、2.5 秒/拍）±15% |
| 生产标签 | [VO]/[OS]/[SFX]/[画面文字]/[连续性]/[转场] | hookBeat/悬念结构化 |
| 质量控制 | 语义自检（静默反查）+ 可选机械核对 | 10 道量化门（脚本强制） |
| 批量 | 整集自动续跑 | 一批 ≤3 集，小批快拍板 |

结论：**两种哲学都需要**——下游（分镜/TTS/剪辑）要结构化纪律（shuohao 的节拍流+量化门），创作者要人读剧本（drama-skills 的 Markdown 格式）。融合方案：人读 Markdown 为载体 + 节拍流的行式纪律 + 量化自检清单（agent 执行）+ 生产标签体系。
