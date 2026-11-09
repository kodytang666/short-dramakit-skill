# 阶段一（选题与项目立项）参考 Skill 清单

> 调研日期：2026-10-30。完整阅读范围见 skill-evaluation.md。

## 直接相关 Skill（4 个）

| # | Skill | 仓库 | 文件路径 | 相关部分 |
|---|---|---|---|---|
| 1 | short-drama-novel-analyze | drama-skills | `skills/short-drama-novel-analyze/SKILL.md` + `references/adaptation-triage.md` + `references/adaptation-value.md` | S1 改编价值快评（六件事）、S5 改编价值判定（三类判定/制作负担/桥段标签/分集候选量级） |
| 2 | webnovel-writing（中文网文写作） | Chinese-WebNovel-Skill | `SKILL.md` + `references/modules/concept_planning/{README,tutorial}.md` | 选材判断六问（题材消费点/卖点异常局面/眼前麻烦/故事引擎/目标长度/最小骨架） |
| 3 | short-drama-develop | drama-skills | `skills/short-drama-develop/SKILL.md` + `references/genre-cards.md`（索引） | 方向探索（机制不同的候选）、题材卡（压力来源/场面颗粒/制作负担） |
| 4 | short-drama-skill-finder（生态目录） | awesome-short-drama-skills | `skills/short-drama-skill-finder/SKILL.md` + `data/taxonomy.toml` + `data/skills.toml` + `evals/` | taxonomy 的 `market` 阶段定义；99 条生态条目中 market 类占比；premises 评测法 |

## 间接相关（阶段一仅借用个别概念）

| Skill | 仓库 | 借用点 |
|---|---|---|
| short-drama（总控） | drama-skills | 制作形态决策（实拍/二维/三维…）、production_profile 决策写入流程——立项阶段需要"制作形态初判" |
| short-drama-write | drama-skills | 单集目标时长/语速（format.pacing）概念——立项阶段需要时长与集数决策 |
| novel-outline | shuohao-skills | 集数×单集时长×题材三必问——立项参数的最小集 |

## 生态数据佐证（awesome-short-drama-skills 收录数据）

- `data/skills.toml` 收录 99 个条目，stages 含 `market` 的仅约 4 个（hongguo-shortdrama-screenwriting、analyze-hit-novel、narrative-to-screen-reader、screenwriting-skills 等），且全部是"爆款拆解/编剧方法论"而非完整立项流程。
- taxonomy.toml 定义了 `[stages.market] label = "选题 · IP 评估"`，说明生态**承认**该阶段存在，但收录的 Skill 均不覆盖：受众画像、商业化潜力、AI 制作可行性、立项书。
- 生态空白 = 本项目阶段一必须以原创设计为主，参考 Skill 只提供碎片方法论。

## 结论

阶段一相关的高质量素材集中在三个维度：

1. **"值不值得做"的判断方法论**（drama-skills 的快评六件事 + 三类判定）；
2. **"卖点/引擎能不能立住"的网文选材方法**（Chinese-WebNovel-Skill 的选材六问）；
3. **"制作可行性量级"的评估框架**（制作负担量级、题材卡的制作负担字段）。

缺失（需原创）：受众画像、市场需求分析、爽点与情绪价值的商业化评估、短剧行业商业模式（付费卡点/投流逻辑）、项目定位与规模、风险评估结构化、立项书与制作简报标准格式。
