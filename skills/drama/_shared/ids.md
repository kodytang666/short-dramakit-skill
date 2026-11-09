# 统一 ID 与数据结构规范（全流水线）

> 七个阶段 Skill 与总控共用。ID 的唯一目的是**可引用、可对账、可追溯**。

## 1. ID 命名表

| 前缀 | 含义 | 产生阶段 | 示例 |
|---|---|---|---|
| PRJ- | 项目 | 阶段一（立项） | PRJ-zhuixu-rongyao |
| DEC- | 决策 | 全阶段（总账唯一连续） | DEC-1 / DEC-12 |
| CAND- | 选题候选 | 阶段一 | CAND-1 |
| RSK- | 风险 | 阶段一（后续阶段可追加） | RSK-2 |
| GEN-{题材}- | 题材卡 | 阶段一 | GEN-01 |
| CHAR- | 人物 | 阶段二 | CHAR-3 |
| PROP- | 叙事道具 | 阶段二 | PROP-1 |
| LOC- | 主场景 | 阶段二 | LOC-2 |
| EP | 集 | 阶段二 | EP01 |
| FORE- | 伏笔 | 阶段二 | FORE-4 |
| SC | 场次 | 阶段三（EPxxx-SCyyy） | EP001-SC002 |
| IMG- | 图片提示词条目 | 阶段四 | IMG-101（人物区 1xx / 场景区 2xx / 道具区 3xx，区间可按项目扩展） |
| LOCK- | 连续性锁 | 阶段四 | LOCK-C1-2（人物 CHAR-1 的第 2 锁） |
| SHOT | 镜头 | 阶段五（EPxxx-SCyyy-SHOTnn） | EP001-SC001-SHOT03 |
| KF- | 关键帧 | 阶段五（KF-EPxxx-SCyyy-nn，尾帧 E 后缀） | KF-EP001-SC001-03 |
| MOTION- | 视频生成条目 | 阶段六 | MOTION-02（与 SHOT 对应关系在条目中声明） |
| GEN-{数字} | 生成任务 | 阶段六（注意与题材卡 GEN- 前缀区分：任务 ID 用连字符+三位数字） | GEN-001 |
| CUT- | 剪辑段 | 阶段七 | CUT-003 |
| R- | 返修记录 | 阶段六 | R-EP001-SC001-SHOT05-v2 |

## 2. 变体编号规则

| 类型 | 格式 | 示例 |
|---|---|---|
| 人物造型/状态 | CHAR-x-Vn；同造型下子状态 -a | CHAR-1-V2 / CHAR-1-V2-a（湿身） |
| 场景时段 | LOC-x-Vn | LOC-1-V1（夜） |
| 道具状态 | PROP-x-Vn | PROP-1-V2（已签字） |

## 3. 文档 frontmatter 最小集

所有阶段产物 Markdown 头部：

```yaml
---
project_id: PRJ-xxx
doc_type: {类型见下表}
version: 1
date: YYYY-MM-DD
status: draft | pending | approved
---
```

| doc_type | 产生阶段 |
|---|---|
| topic-report / project-charter / production-brief | 一 |
| source-analysis / story-outline / story-bible / episode-map / rhythm-table / continuity | 二 |
| episode-script / scene-table / dialogue-book | 三 |
| visual-style / asset-registry / asset-card-* / image-prompt | 四 |
| director-brief / storyboard / shot-list / keyframe-prompt | 五 |
| motion-entry / generation-plan / generation-log / acceptance | 六 |
| footage-list / edit-decision-list / sound-design / qc-report / delivery-list | 七 |

## 4. 状态机

| 状态 | 含义 | 交接规则 |
|---|---|---|
| draft | 起草中 | 不可交接 |
| pending | 停靠待确认（或"一次跑完"豁免标注） | 不可交接 |
| approved | 已确认 | **唯一可交接状态** |
| expired | 过期（依赖变更） | 重做后恢复 |

豁免标注：`stops: waived`（各阶段 SKILL 定义的位置）。

## 5. 跨阶段接口文档一览

| 上游 → 下游 | 接口文档 | 关键字段 |
|---|---|---|
| 一→二 | production-brief.md | 已定事实（含出处）/可探索空间/边界约束/DEC 全集摘要 |
| 二→三 | episode-map（单集六字段）+ story-bible（人物档案） | 进入状态/钩子/追求/转折兑现/出去压力/交接事实 |
| 三→四 | episode-script + scene-table + dialogue-book | SC 清单/出场人物/画面文字/连续性标签 |
| 三→五 | episode-script（节拍=动作行+台词行） | 节拍认领对账 |
| 四→五 | 视觉设定 + 视觉风格指南 | CHAR/LOC/PROP 变体 + 锁 + 画风句 |
| 五→六 | storyboard + keyframe + shot-list（批次） | SHOT 状态链/KF/参考图依赖 |
| 六→七 | generation-plan + generation-log + acceptance | 任务 ID-版本/可用素材/hold 裁切 DEC |
| 二→四 | continuity + story-bible | 世界观硬规则/时间线（连续性锁的种子） |

## 6. 修改传播最小集

上游文档 version+1 时，按下表同步（详细影响链见总控 SKILL）：

| 变更 | 必须同步 |
|---|---|
| 简报已定事实 | 大纲/圣经/分集 version+1；决策总账登记 |
| 分集六字段 | 该集剧本 version+1；节奏表对账 |
| 台词 | 台词本/字幕/TTS 计划 |
| 人物造型 | 资产卡/IMG/登记表（过期联动）/相关 KF 与 MOTION |
| 场景 | 场景卡/空景 IMG/相关 SHOT 与批次 |
| SHOT | 相关 MOTION/任务清单；节拍认领重跑 |
| 参考图重出 | 登记表过期 + 依赖任务重核 |
