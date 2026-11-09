# ffmpeg 直剪路线（可选工具路径）

> 决策表是权威，本文件只是"按表执行"的一种自动化路径（适配已安装 ffmpeg 的环境）。没有 ffmpeg 时用任意剪辑软件按表人工执行，产物质量相同。

## 前置自检

```bash
ffmpeg -version && ffprobe -version
```

缺失则本路线不可用（如实报告，不用其他手段近似——"没测"不写成"通过"）。

## 典型操作（对照决策表逐条执行）

```bash
# 1. 按入出点切段（CUT 条目：源 GEN-001-v1.mp4 入 0.50 出 3.80）
ffmpeg -i GEN-001-v1.mp4 -ss 0.50 -to 3.80 -c:v libx264 -c:a aac cut-001.mp4

# 2. 规格统一（素材分辨率不一致时）
ffmpeg -i cut-001.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -r 30 out-001.mp4

# 3. 拼接成片（切段全部转码为一致规格后）
printf "file 'cut-001.mp4'\nfile 'cut-002.mp4'\n" > concat.txt
ffmpeg -f concat -safe 0 -i concat.txt -c copy episode.mp4

# 4. 烧字幕（SRT 已逐字校对）
ffmpeg -i episode.mp4 -vf "subtitles=EP001.srt" -c:a copy episode-sub.mp4

# 5. 响度归一（目标响度按规格确认值）
ffmpeg -i episode-sub.mp4 -af "loudnorm=I=-14:TP=-1.5" episode-final.mp4
```

## 测量（质检用）

```bash
# 实际时长
ffprobe -v error -show_entries format=duration -of csv=p=0 episode-final.mp4
# 分辨率与帧率
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,avg_frame_rate -of csv=p=0 episode-final.mp4
# 响度（需要时用 loudnorm 的打印输出）
ffmpeg -i episode-final.mp4 -af loudnorm=print_format=summary -f null - 2>&1 | grep -A12 "Input Integrated"
```

## 画内文字叠加（Filter Complex 示例）

```bash
# 系统面板类文字：在承载位时段绘制文本框（内容取决策表叠加方案，不得临场改字）
ffmpeg -i cut-003.mp4 -vf "drawtext=text='【新任务】回收异常物品':fontsize=42:fontcolor=cyan:x=(w-text_w)/2:y=h*0.12:enable='between(t,1.0,4.0)'" -c:a copy cut-003-t.mp4
```

中文字体需显式指定 fontfile（如 `/System/Library/Fonts/PingFang.ttc`，macOS 路径按实际核对）。复杂面板建议改用剪辑软件图形层，ffmpeg 只做单行文本。

## 纪律

- 命令生成自决策表，不反向：改片先改表；
- 每步输出的实际数字（时长/分辨率）回填质检报告的"可测项"；
- 失败的命令如实报告（不静默跳过、不假装通过）。
