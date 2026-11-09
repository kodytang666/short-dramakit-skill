---
name: short-drama-orchestrator
description: AI 短剧制作流水线总控。初始化短剧项目（统一目录与 project.json）、按用户意图路由到七个制作阶段 Skill（选题立项/故事开发/剧本/视觉资产/分镜/AI视频生成/后期交付）、校验阶段交接状态、登记跨阶段修改的影响传播、汇总版本与决策记录。用户说"创建短剧项目""看进度/下一步""这个需求该用哪个阶段""从小说做到成片的全流程""上游改了下游怎么办"，或任务横跨多个制作阶段时使用。不代行任何阶段的具体制作（各阶段 Skill 的职责）。
version: 1.0.0
license: MIT
requires-skills:
  - drama-concept
  - drama-story
  - drama-script
  - drama-assets
  - drama-storyboard
  - drama-generation
  - drama-post-production
---

# 短剧制作流水线总控

七个阶段是一条**单向数据流**，每个阶段只从上游的接口文档接收输入、只向下游的接口文档交付输出。本 Skill 只做四件事：初始化、路由、交接校验、修改传播。

```text
阶段一 drama-concept      → 制作简报（production-brief.md）
阶段二 drama-story        → 故事六件套（大纲/圣经/分集/节奏表/连续性/原著分析）
阶段三 drama-script       → 剧本四件套（剧本/场次表/台词本/自检）
阶段四 drama-assets       → 视觉五件套（风格指南/资产卡/IMG/登记表）
阶段五 drama-storyboard   → 分镜五件套（导演阐述/站位/SHOT/关键帧/批次表）
阶段六 drama-generation   → 生成四件套（MOTION/任务清单/生成记录/验收）
阶段七 drama-post-production → 成片六件套（素材清单/决策表/声音/字幕/质检/交付）
```

## 项目初始化

```bash
mkdir -p <项目名>/{01-选题立项,02-故事开发,03-剧本,04-视觉资产,05-分镜,06-生成,07-后期,决策记录}
```

`决策记录/decisions.md` 首版（全流水线共用决策总账）：

```markdown
# 决策记录（DEC 总账）
| 编号 | 日期 | 阶段 | 决策 | 理由 | 影响范围 |
|---|---|---|---|---|---|
```

项目根写 `project.json`：

```json
{
  "project_id": "PRJ-<slug>",
  "title": "",
  "created": "",
  "stage_status": {
    "concept": "not-started", "story": "not-started", "script": "not-started",
    "assets": "not-started", "storyboard": "not-started", "generation": "not-started",
    "post": "not-started"
  },
  "brief_version": null,
  "target_model": null,
  "gates_thresholds": {}
}
```

`stage_status` 取值：`not-started / in-progress / blocked / done`。每次阶段完成或阻塞时更新。

## 路由表

| 用户意图 | 路由 | 前置条件 |
|---|---|---|
| 评估点子/小说值不值得做、立项、制作简报 | drama-concept | 无（流水线起点） |
| 故事大纲/圣经/分集大纲/爽点节奏/原著改编 | drama-story | 简报 status=approved（无简报走阶段二 A2 裸点子入口） |
| 写/改单集剧本、台词、时长 | drama-script | 分集大纲该集六字段存在；人物档案（圣经）存在 |
| 拆角色/场景/道具、图片提示词、画风 | drama-assets | 剧本（至少目标集）status=approved |
| 分镜、镜头表、站位、关键帧提示词 | drama-storyboard | 剧本+视觉设定 双确认 |
| 视频提示词、Seedance/即梦方言、生成批次、验收返修 | drama-generation | 分镜 status=approved；目标模型已确认 |
| 剪成片、配音字幕、质检、交付 | drama-post-production | 通过验收的生成素材存在 |

路由纪律：
1. **前置条件不满足时，不跳过**——报告缺什么、需要先完成哪个阶段；用户坚持跳过（如直接写剧本）时，由对应阶段 Skill 的轻量入口处理（阶段一 C 入口、阶段二 A2 裸点子、阶段三轻量上游已定义；阶段四至七不提供跳过入口，强依赖上游确认），总控在 decisions.md 记录跳过决策。
2. 一个请求横跨多阶段时按顺序逐段执行，每段结束向用户汇报再继续；只在用户明确说"一路做完"时连续执行。
3. 阶段内部的创作细节（怎么评估、怎么切镜）由阶段 Skill 全权负责，总控不重复、不干预。

## 交接校验（每次跨阶段交付时执行）

| 校验项 | 规则 |
|---|---|
| project_id 一致 | 各文档 frontmatter 的 project_id 相同；不一致立即报告（示例文档数据不得混入） |
| 接口文档 status | 上游接口文档（简报→分集→剧本→视觉/分镜→MOTION→素材）status=approved 才交接 |
| 编号连续 | 下游新增 DEC 编号从总账最大编号顺延（阶段一简报附 DEC 全集摘要；无摘要时查总账） |
| ID 体系 | PRJ/DEC/CAND/RSK/CHAR/PROP/LOC/EP/FORE/SC/SHOT/KF/MOTION/GEN/CUT/IMG 全流水线唯一命名（见 ../_shared/ids.md） |

**留痕载体**：每次交接校验在 `决策记录/handoff-log.md` 追加一行（阶段交接方向 / 四项校验结果 / 接口文档与版本 / 日期）；校验不过的行写明阻塞原因与待办。

**status 跃迁路径**（含豁免）：`draft → pending → approved`（停靠确认）；`draft → approved`（"一次跑完"豁免，frontmatter `stops: waived` 或标注"未停靠自动确认"）；上游变更后 `approved → expired →（重做）→ draft → approved`。

## 修改传播（上游变更时的总控流程）

用户要求改上游内容时：

1. 在 decisions.md 记录变更（编号顺延）；
2. 按**影响链**列受影响阶段与文档，交用户确认范围：

```text
简报（定位/规模/约束）→ 大纲/圣经/分集 → 剧本 → 资产卡/IMG → 分镜/关键帧 → MOTION/任务 → 已生成素材/成片
台词修改            → 台词本/字幕/TTS →（不改分镜）
人物造型变更        → 资产卡/IMG/登记表过期 → 相关 SHOT/KF/MOTION → 相关素材返修
场景变更            → 场景卡/空景 → 相关 SHOT/KF/批次 → 相关素材返修
分镜改版            → 节拍认领重跑 → 相关 MOTION/任务 → 相关素材
```

3. **影响判定按内容变化，不按"文档被动过"**：上游文档改版（版本 +1）后，下游对账只比对影响链列出的**受影响字段**——字段内容实际变了（台词、站位、锚点等）才把下游接口文档标 expired（../_shared/ids.md 状态机）；无关变化（备注/排版/示例修正）不触发 expired，仅在 handoff-log 登记对账结论。重做后按 `expired → draft → approved` 复活；
4. 已生成素材对应旧版时在生成记录标"对应旧版"，返修清单给阶段六。

## 进度查询

用户问"进度/下一步"时：读 project.json 的 stage_status + 各目录文档 status → 报告当前阶段、阻塞项、下一步动作与前置条件。

## 边界

- 不代行阶段制作（评估/写稿/切镜/提示词由各 Skill 完成）；
- 不为补齐流水线伪造上游产物（各阶段 Skill 的降级入口是唯一合法跳过路径，且必须留痕）；
- 不存储凭据、不调用生成 API（生产在用户工具完成）。

## 按需加载

- **统一 ID 与数据结构**：[../_shared/ids.md](../_shared/ids.md)（安装后在目标 skills 目录同级；未安装时本文的交接校验节已含要点）
- **project.json 的 JSON Schema**：[references/project.schema.json](references/project.schema.json)（本 Skill 专属，校验项目档案用）
- **各阶段能力与触发词**：本文路由表；阶段细节不在此重复。
