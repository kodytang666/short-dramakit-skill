# 阶段六（AI 视频生成与镜头制作）研究

## Skill 清单与评估

| # | Skill | 仓库 | 评估基础 | 评分 | 核心贡献 |
|---|---|---|---|---:|---|
| 1 | short-drama-video-prompts | drama-skills | SKILL.md 全文 + references/seedance-2.0.md 全文 | 93 | MOTION 条目结构、生成方式判定（图生/文生/PLAN 三态）、静态视觉锚点、状态链写法（静态锚点→起点→唯一动作→次级反应→运镜→声音→终点）、声音时间线、**模型方言分层**（seedance-2.0/2.5/minimax-h3/wan-3.0 各一份只读其一）、Seedance 方言实证文档（小样本验证：站位关系写法九次错三次的对照、{对白}语法、<声音>/（音乐）语法、三起点互斥、500 字建议的实测态度、参考图上限 9 张"是上限不是目标"） |
| 2 | short-drama-produce | drama-skills | SKILL.md 全文 | 90 | prepare→confirm→run 硬闸门（防误生产）、adapter 边界（凭据项目外）、中断不等于重跑（collect 优先）、audit 对账、失败证据回流负责技能 |
| 3 | seedance-2.0（主入口+prompt+子 Skill 群） | seedance-2.0 | SKILL.md 全文 + seedance-prompt 全文 + 子 Skill 清单 | 92 | Operating Loop 12 步门控、Director Formula 七槽、模式门（T2V/I2V/V2V/R2V/FLF2V）、**续接机制**（project_id/clip_id 传承、observed end state 优先于计划、rejected 不入 canon）、**权威序九层**、失败诊断子 Skill、反 slop、moderation pre-screen、shot table 先表后文 |
| 4 | video | visual-skills | frontmatter+主体 | 76 | 通用视频提示词知识（多模型）、分镜/剪辑概念（与本项目阶段五七重叠） |
| 5 | fight-video-create-skill | fight-video | SKILL.md 全文 | 82 | 动作链可生成性设计（阶段五已吸收，本阶段为其动作段服务） |

## 方言层知识核实状态（本项目特别要求：不编造、分层）

| 知识点 | 来源 | 证据强度 |
|---|---|---|
| Seedance 2.0 时长 4-15 秒整数 | drama-skills 方言（引火山引擎官方文档链接） | 可信（官方 API 文档） |
| 三种起点互斥（首帧/首尾帧/全模态参考） | 同上 | 可信（官方） |
| `{角色说："台词"}` 对白语法、`<声音>`、`（音乐）` | drama-skills 方言小样本 | 实测（小样本 n=3） |
| 全模态参考 0-9 图/3 视频/3 音频，视频音频各 2-15 秒合计 ≤15 秒，音频不能单独输入 | 同上官方 | 可信 |
| 中文 ≤500 字建议（实测 800 字不丢细节但环境铺陈会进画面） | 同上小样本 | 实测 |
| 站位关系写法（"隔着桌子面对面"九次放同侧；机位化改写后三次都对） | 同上小样本 | 实测（关键工艺） |
| 镜头序号响应、时间戳不响应 | 同上 | 官方说明 |
| 即梦（Jimeng/Dreamina）= Seedance 2.0 的消费端 surface | seedance-2.0 SKILL.md 列举 surface | 可信（仓库声明，具体 UI 操作差异标待验证） |
| 即梦界面的参考图槽位数/操作流 | 无参考 | **待验证**（本项目标注，不编造） |
| 即梦支持的分辨率/帧率档位 | 无参考 | **待验证** |

## 设计决策

- 名称 `drama-generation`。**严格双层**：SKILL.md 只写模型无关层（MOTION 条目=通用镜头生成描述），方言进 references 按目标模型只读其一。
- 方言文件 seedance.md：吸收 drama-skills 实证方言（标注来源与证据强度）+ seedance-2.0 的 Director Formula；jimeng.md：即梦 = Seedance 方言共用 + 平台操作差异区（大量待验证标注 + 操作核对清单）。
- 生成管理：吸收 produce 的确认闸门思想（本项目无 API 假设，改为"任务清单+生成记录+人工确认"轻量机制）。
- 失败诊断：吸收 troubleshoot + retake-protocol（诊断表：症状/可能原因/首修动作）。
- 不做的：不调 API、不自动生产（生成在用户自己的工具/账号完成）；不写分镜（阶段五）。
- 测试：A 常规（阶段五 SHOT → MOTION → Seedance 方言）、C 边界（续接段 + 失败返修）、D 基线。
