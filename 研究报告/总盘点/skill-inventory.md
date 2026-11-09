# 参考项目 Skill 总盘点清单（按七阶段分类）

> 调研日期：2026-10-30。对象：`参考skills/` 下 7 个仓库共 **51 个 SKILL.md**。
> 阶段定义：①选题与项目立项 ②故事开发与小说改编 ③剧本创作 ④视觉资产设计与管理 ⑤导演设计与分镜制作 ⑥AI视频生成与镜头制作 ⑦后期剪辑与成片交付。另有「跨阶段」类。
> 映射标注：`主` = 该 Skill 的核心职责落在此阶段；`次` = 部分内容可用于此阶段。

## 总览统计

| 仓库 | Skill 数 | 许可证 | 架构形态 |
|---|---:|---|---|
| drama-skills | 12 | MIT | 总控路由 + 11 个职责单一的阶段 Skill + 1 个维护者知识库 |
| seedance-2.0 | 28 | MIT | 主入口（Operating Loop）+ 27 个子 Skill 按域路由 |
| shuohao-skills | 7 | Apache-2.0 | 7 个独立 Skill 链式接力（JSON 文档交接） |
| Chinese-WebNovel-Skill | 1 | 无 LICENSE | 单体网文写作 Skill（模块化 references） |
| fight-video-create-skill | 1 | Apache-2.0 / CC BY-NC-ND | 单体打斗设计 Skill（加密资料包检索） |
| visual-skills | 2 | CC BY 4.0 | image / video 两个提示词 Skill |
| awesome-short-drama-skills | 1 (+数据) | CC0 | 生态目录 + 检索 Skill（99 条收录数据） |

## 阶段一：选题与项目立项（生态覆盖最薄弱的阶段）

| Skill | 仓库 | 相关内容 | 映射 |
|---|---|---|---|
| short-drama-novel-analyze | drama-skills | S1 改编价值快评（screen_ready/prose_only 密度、制作负担量级、改编风险）；S5 改编价值判定 | 主（仅限"小说值不值得改"维度） |
| webnovel-writing | Chinese-WebNovel-Skill | "这个点子值不值得写成网文/这本书到底卖什么"的选材判断、题材分类 | 次（网文视角，非短剧商业视角） |
| short-drama-develop | drama-skills | 方向探索（机制不同的候选）、genre-cards 题材卡（压力来源/场面颗粒/制作负担） | 次（定方向，不做商业评估） |
| short-drama-skill-finder + data/taxonomy.toml + data/skills.toml + evals/premises | awesome-short-drama-skills | taxonomy 的 `market` 阶段分类；99 个生态条目的阶段标注；premises 评测法 | 次（生态元数据，非可执行制作能力） |

**结论**：无任何参考 Skill 完整覆盖「受众画像、市场需求分析、商业化潜力评估、IP 适配评估、AI 制作可行性评估、项目立项书」。阶段一基本需要原创设计，只能借鉴上述碎片。

## 阶段二：故事开发与小说改编（覆盖最厚的阶段）

| Skill | 仓库 | 核心交付 | 映射 |
|---|---|---|---|
| short-drama-novel-analyze | drama-skills | 章节索引/改编价值快评/逐章功能提取/剧情单元与节奏聚合/人物归并/分集候选 | 主 |
| short-drama-develop | drama-skills | 创作简报/故事引擎/分集地图/改编映射/导演阐述候选 | 主 |
| novel-outline | shuohao-skills | 改编大纲五件套（改编说明/人物表/爽点表/分集梗概/资产清单），14 道质量门 | 主 |
| novel-characters | shuohao-skills | 角色表/人物画像/形象提示词/音色提示词 | 次（角色侧输入故事开发） |
| webnovel-writing | Chinese-WebNovel-Skill | 黄金三章/分卷章纲/节奏/章末钩子等网文结构知识 | 次（原著侧方法论） |

## 阶段三：剧本创作

| Skill | 仓库 | 核心交付 | 映射 |
|---|---|---|---|
| short-drama-write | drama-skills | 单集 Markdown 剧本（场次标题语法/生产标签/静默反查/时长估算脚本） | 主 |
| novel-script | shuohao-skills | script.json（场次+节拍流+逐句台词），10 道质量门，时长按语速折算 | 主 |
| webnovel-writing | Chinese-WebNovel-Skill | 对白/章末/反 AI 味等写作知识 | 次 |

## 阶段四：视觉资产设计与管理

| Skill | 仓库 | 核心交付 | 映射 |
|---|---|---|---|
| short-drama-assets | drama-skills | 视觉设定.md（身份/变体/镜头瞬态三层、识别锚点、连续性锁、画面代称） | 主 |
| short-drama-image-prompts | drama-skills | 图片提示词.md（IMG-* 条目：身份板/造型变体/地点板/道具板/Lookdev） | 主 |
| novel-characters | shuohao-skills | 角色设定图版面指令（半身像+三视图+细节条）、音色提示词 | 主 |
| novel-art | shuohao-skills | art.json（场景一致性锚点/光照变体/空景提示词；道具状态变体/白底提示词），10 道质量门 | 主 |
| character-refs | shuohao-skills | 角色参考图实际出图（锚点图+派生视图、多模型后端、过期标记） | 主 |
| image | visual-skills | Nano Banana / GPT Image 通用图像提示词 | 次（通用图像提示词知识） |

## 阶段五：导演设计与分镜制作

| Skill | 仓库 | 核心交付 | 映射 |
|---|---|---|---|
| short-drama-storyboard | drama-skills | 分镜.md（SHOT-*：唯一职责/起终状态/场景站位/轴线/冻结关键帧/视觉依据/REF-PLAN 挂图体系） | 主 |
| novel-storyboard | shuohao-skills | storyboard.json（段→分镜→分镜图三层、节拍认领、18 道质量门、H3+Seedance 双提示词） | 主 |
| novel-staging | shuohao-skills | staging.json（从场景图认家具、逐场排站位、可拖动 HTML 工具） | 主 |
| fight-video-create-skill | fight-video-create-skill | 打斗动作链/空间路线/动作分镜表（招式库/技能库/加密资料检索） | 次（动作戏专用） |
| video | visual-skills | 分镜/shot list/导演阐述等通用视频知识 | 次 |

## 阶段六：AI 视频生成与镜头制作

| Skill | 仓库 | 核心交付 | 映射 |
|---|---|---|---|
| short-drama-video-prompts | drama-skills | 视频提示词.md（MOTION-*：模型方言分层 seedance-2.0/2.5/minimax-h3/wan-3.0、状态链、声音时间线） | 主 |
| short-drama-produce | drama-skills | 确认后生产（prepare→confirm→run 硬闸门、adapter 契约、audit 对账） | 主 |
| seedance-20（主入口） | seedance-2.0 | Operating Loop 路由（12 步门控、Fast Lane、权威序） | 主 |
| seedance-prompt / prompt-short | seedance-2.0 | Director Formula 七槽提示词、模式门、压缩规则、shot table | 主 |
| seedance-camera / motion / lighting / style / filter / vfx / audio | seedance-2.0 | 镜头/动作/灯光/风格/滤镜/特效/声音七域专业知识 | 主 |
| seedance-characters / continuation / sequence | seedance-2.0 | 角色一致性、续拍、多镜头序列（project_id/clip_id 传承、observed end state） | 主 |
| seedance-troubleshoot | seedance-2.0 | 失败诊断（人脸漂移/镜头跳跃/泛化/动作忽略等） | 主 |
| seedance-pipeline / copyright / antislop / recipes / interview(-short) / examples-{zh,ja,ko} / vocab-{zh,en,ja,ko,ru,es} | seedance-2.0 | 平台事实、IP 安全、反套话、题材配方、访谈、多语言词汇 | 主（支撑域） |
| video | visual-skills | 通用视频生成提示词（多模型） | 次 |
| fight-video-create-skill | fight-video-create-skill | 动作链生成性设计（一打多不排队/末态起点） | 次 |

## 阶段七：后期剪辑与成片交付

| Skill | 仓库 | 核心交付 | 映射 |
|---|---|---|---|
| short-drama-edit | drama-skills | 剪辑单.md（CUT-*：入出点/取舍/字幕逐字对剧本/画面文字/音效/配音/环境声）+ edit_tool.py（check/render/verify） | 主 |
| short-drama-produce | drama-skills | TTS/音乐生产（声音侧） | 次 |
| novel-storyboard | shuohao-skills | 配音对齐单（台词↔镜号） | 次 |
| video | visual-skills | 通用剪辑/成片知识 | 次 |

## 跨阶段

| Skill | 仓库 | 核心交付 | 映射 |
|---|---|---|---|
| short-drama | drama-skills | 项目初始化、跨阶段路由、creator-first 五文档、决策发布生命周期、Dashboard、导出 | 总控 |
| short-drama-review | drama-skills | 跨阶段审查（10 个范围、四档严重度、REVISE/APPROVE 结论、证据式 finding） | 质检（全阶段） |
| short-drama-knowhow | drama-skills | 维护者知识治理（学习→盲测→独立审查→发布） | 维护 |
| short-drama-skill-finder | awesome-short-drama-skills | 生态检索推荐 | 生态 |

## 关键差距总结（跨七阶段俯瞰）

1. **阶段一几乎空白**：无受众分析、商业化评估、立项书类 Skill。
2. **阶段七覆盖薄**：仅 drama-skills/short-drama-edit 一个完整实现，声音设计（配音/音效/音乐混音）散落在 produce 与 video 通用知识中。
3. **生态不统一的 ID/文档体系**：drama-skills 用 creator-first 五文档 Markdown + 稳定 ID（EP/SC/SHOT/MOTION/CUT/IMG/REF/PLAN）；shuohao 用 JSON + 质量门脚本。两者思路相反（人读文档 vs 机读校验），各有优势。
4. **模型方言已分层但覆盖不同**：drama-skills 的 video-prompts 有 seedance/minimax/wan 方言分层（正确做法）；seedance-2.0 深度绑定 Seedance 2.0 且明确声明"工艺可迁移、数字不可迁移"；shuohao 内化 H3+Seedance 双协议。
5. **"真人感写实短剧"是共同默认**：各仓库均以真人短剧/漫剧为主，与本项目目标一致。
