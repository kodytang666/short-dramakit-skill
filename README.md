# AI 短剧制作 Skills 工具箱

面向**真人感写实风格短剧**（网文改编 + 原创）的七阶段 AI 影视制作流水线，兼容 **Codex** 与 **Trae**。覆盖从选题立项到成片交付的完整链路，目标视频生成工具为 **Seedance / 即梦**（可扩展）。另含 **vibeKnowledge**：「Vibe知识大赏」式知识短片 Skill（纯代码渲染，零视频模型依赖）。

## 工具箱组成

| Skill | 阶段 | 职责 | 测试评分 |
|---|---|---|---:|
| `short-drama-orchestrator` | 总控 | 项目初始化、阶段路由、交接校验、修改传播 | 联调通过 |
| `drama-concept` | 一 | 选题评估六维、立项书、制作简报 | 94/100 |
| `drama-story` | 二 | 原著分析、故事引擎、故事圣经、分集大纲、节奏表 | 92/100 |
| `drama-script` | 三 | 单集剧本、场次表、台词本、时长预算 | 93/100 |
| `drama-assets` | 四 | 角色三视图锚点体系、场景/道具资产卡、图片提示词 | 95/100 |
| `drama-storyboard` | 五 | 导演阐述、站位调度、分镜脚本、冻结关键帧 | 95/100 |
| `drama-generation` | 六 | MOTION 条目、Seedance/即梦方言、生成批次、验收返修 | 99/100 |
| `drama-post-production` | 七 | 剪辑决策表、声音设计、逐字字幕、质检交付 | 96/100 |
| `vibeKnowledge` | 知识片 | 「Vibe知识大赏」式无旁白知识短片：事实表→找形象→逐拍字幕→Remotion 代码成片（零视频模型依赖），附《节气·太阳的刻度》验证片 | 验证通过 |

每个 Skill 均独立触发可用；阶段一/二/三提供轻量入口（缺上游时降级运行），阶段四至七强依赖上游确认，也可由总控串成全流程。

## 安装

```bash
# Codex 全局
./scripts/install.sh --codex

# Trae 项目级
/Users/canday/Desktop/短剧创作/影视制作skills/scripts/install.sh --trae

# 自定义目录
./scripts/install.sh ~/.your-skills-dir
```

依赖：无硬依赖（零脚本运行时——所有 Skill 为纯 Markdown 指令集）；阶段七的 ffmpeg 直剪路线为可选增强（未安装时用任意剪辑软件按决策表人工执行）。

## 快速开始

```text
用户：帮我评估这个点子能不能做短剧：「上门女婿替岳家还了三年债，离婚当天，家族集团来人跪下叫他少爷。」
→ 自动路由 drama-concept（阶段一）→ 评估报告 → 确认立项 → 制作简报

用户：好，立项。开始开发故事，70 集。
→ drama-story（阶段二）→ 骨架拍板 → 故事圣经 + 分集大纲

用户：写 EP01 剧本。
→ drama-script（阶段三）……依此直到 drama-post-production 出成片。
```

或一句话直达：`用 short-drama-orchestrator 初始化项目，从阶段一做到阶段三。`

## 目录结构

```text
├── skills/drama/               # 短剧流水线：8 个 Skill + _shared/ids.md（跨阶段统一 ID 规范，单一源）
├── skills/vibeKnowledge/       # 知识短片 Skill（SKILL.md + references + templates + examples/solar-terms 验证工程）
├── scripts/install.sh          # 安装脚本
├── 参考skills/                 # 15 个参考仓库（只读研究资料）
├── 研究报告/                   # 总盘点 + 各阶段研究（逐 Skill 评估）
├── 设计方案/                   # 各阶段设计方案
├── 测试报告/                   # 各阶段测试报告 + 总控联调
└── templates/  examples/  docs/ # （预留；模板内嵌于各 Skill）
```

## 核心设计理念

1. **流水线单向数据流**：每阶段只认上游接口文档（制作简报 → 分集大纲 → 剧本 → 视觉设定 → 分镜 → MOTION → 素材清单），`approved` 才交接，上游变更走影响链传播。
2. **证据分级**：全部 Skill 共用四级标注 `[实测]/[官方]/[推断]/[待验证]`——不编造市场数据、模型能力与平台参数。
3. **AI 生成约束前置**：阶段三就执行"常见动作原则"、阶段五控制动作量与多主体、阶段四建锚点与连续性锁——一致性靠参考图体系，不靠运气。
4. **通用知识与模型方言分层**（阶段六）：MOTION 条目是模型无关合同，Seedance/即梦方言独立成文件、只读其一，未验证能力全部标注。
5. **量化门 + 语义判断双轨**：可数的（角色上限/爽点间隔/时长 ±15%/节拍认领）用门卡，不可数的（因果真实/升级有效）用语义自检；数字配方永不替代因果判断。

## 研究与质量记录

- 研究方法与逐 Skill 评估：`研究报告/`（7 仓库 51 个参考 Skill 的清单、评分与七阶段映射）
- 测试方法与结果：`测试报告/`（每阶段功能/边界/基线对照测试 + 评分表 + 修复记录）
- 总体研发报告：`研究报告/总体研发报告.md`；质量评估：`研究报告/质量评估报告.md`

## 许可证

本工具箱：MIT。参考仓库的许可与使用边界见 `参考skills/README.md`（其中 Chinese-WebNovel-Skill 无 LICENSE，仅方法论借鉴、未复制文本；fight-video-create-skill 数据资产 CC BY-NC-ND 4.0，未搬运其数据文件）。
