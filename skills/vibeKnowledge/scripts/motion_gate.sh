#!/usr/bin/env bash
# motion_gate.sh —— vibe 知识短片渲染后量化门禁
# 判据移植自 huashu-art-motion 的 film_gate（方法论借鉴，独立实现；介质差异见下）：
#   - 静止占比（vibe 风格 DNA：静止秒 < 25%）
#   - 单次静止时长（常见错误：静止超 3 秒）
#   - 空画面（连续近黑场；片名卡黑场起落属正常，只查中段长黑场）
#   - 暗帧占比（0.2fps 采样，YAVG<45；黄灯 >50%，反"黑屏图表"）
#   - 镜头级变化（scene>0.3；90s 以上至少 3 次，防"全片只有淡化和缓推"）
# 不搬蓝紫底判定：vibe 全片本就是深蓝黑 DNA，该判据会整体误报。
# 用法：bash motion_gate.sh 成片.mp4 [无字幕占比目标下限，默认25]
# 依赖：ffmpeg。退出码 0=绿灯 1=红灯 2=黄灯。只报告，不修改任何文件。

set -euo pipefail

FILM="${1:?用法: motion_gate.sh 成片.mp4 [静止占比上限%]}"
SUB_CAP="${2:-25}"
# 只依赖 ffmpeg（部分环境无 ffprobe）：从 ffmpeg 探测输出解析时长（探测本身无输出文件，退出码非 0，须豁免）
DUR=$( { ffmpeg -hide_banner -i "$FILM" 2>&1 || true; } | awk '/Duration:/{n=split($2,t,":"); printf "%.2f", t[1]*3600+t[2]*60+t[3]; exit}')

echo "== motion gate = $FILM (时长 ${DUR}s) =="

# --- 1) 单次静止段（freeze = 画面几乎无变化）---
echo "--- 静止段（≥1.5s 才列出；红灯线 3s）---"
ffmpeg -hide_banner -i "$FILM" -vf "freezedetect=n=0.003:d=1.5" -f null - 2>&1 \
  | grep -E 'freeze_(start|duration)' | sed 's/.*] //' || true
LONG_FREEZE=$(ffmpeg -hide_banner -i "$FILM" -vf "freezedetect=n=0.003:d=3" -f null - 2>&1 \
  | grep -c 'freeze_start' || true)
if [ "$LONG_FREEZE" -gt 0 ]; then
  echo "红灯：有 ${LONG_FREEZE} 处静止 ≥3 秒（常见错误：静止超 3 秒——文字停留时也要有微动画）"
  EXIT=1
fi

# --- 2) 中段长黑场 / 空画面 ---
echo "--- 黑场段（≥0.8s 才列出；红灯线 1.2s；片头片尾 2s 内豁免）---"
ffmpeg -hide_banner -i "$FILM" -vf "blackdetect=d=0.8:pix_th=0.02" -f null - 2>&1 \
  | grep 'black_start' | sed 's/.*] //' | while read -r line; do
    START=$(echo "$line" | sed 's/black_start:\([0-9.]*\).*/\1/')
    PASS=$(awk -v s="$START" -v d="$DUR" 'BEGIN{print (s<2 || s>d-2) ? 1 : 0}')
    [ "$PASS" = "0" ] && echo "$line"
  done || true
LONG_BLACK=$( { ffmpeg -hide_banner -i "$FILM" -vf "blackdetect=d=1.2:pix_th=0.02" -f null - 2>&1 || true; } \
  | { grep 'black_start' || true; } | sed 's/.*] //' | awk -v d="$DUR" \
    '{split($0,a,"black_start:"); split(a[2],b," "); if (b[1]>2 && b[1]<d-2) c++} END{print c+0}')
if [ "$LONG_BLACK" -gt 0 ]; then
  echo "红灯：中段有 ${LONG_BLACK} 处黑场/空画面 ≥1.2 秒（主角或主物必须在画里）"
  EXIT=1
fi

# --- 3) 静止帧占比（每秒采样 5 帧，帧差 YDIF）---
echo "--- 静止帧占比（采样 5fps；黄灯线 ${SUB_CAP}%）---"
STATS=$(ffmpeg -hide_banner -i "$FILM" -vf "fps=5,scale=192:108,signalstats,metadata=print:key=lavfi.signalstats.YDIF:file=-" \
  -f null - 2>/dev/null || true)
TOTAL=$(printf '%s' "$STATS" | grep -c 'YDIF=' || true)
STILL=$(printf '%s' "$STATS" | awk -F= '/YDIF=/{if ($2+0 < 0.35) c++} END{print c+0}')
if [ "$TOTAL" -gt 0 ]; then
  PCT=$(awk -v s="$STILL" -v t="$TOTAL" 'BEGIN{printf "%.1f", s/t*100}')
  echo "采样 $TOTAL 帧，静止帧（YDIF<0.35）${STILL} 帧 = ${PCT}%"
  OVER=$(awk -v p="$PCT" -v c="$SUB_CAP" 'BEGIN{print (p>c) ? 1 : 0}')
  if [ "$OVER" = "1" ]; then
    echo "黄灯：静止帧占比 ${PCT}% 超 ${SUB_CAP}%（风格 DNA：静止秒 < 25%——给静止段补呼吸/辉光/缓移微动画）"
    [ "${EXIT:-0}" = "0" ] && EXIT=2
  fi
else
  echo "警告：YDIF 采样失败（ffmpeg 版本差异），本项跳过，请人工对六查#6"
fi

# --- 4) 整体亮度（采样 0.2fps；YAVG<45 记"暗帧"）---
echo "--- 画面亮度（采样 0.2fps；YAVG<45 记暗帧；黄灯线 50%）---"
LUM=$(ffmpeg -hide_banner -i "$FILM" -vf "fps=0.2,scale=192:108,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-" \
  -f null - 2>/dev/null || true)
LTOTAL=$(printf '%s' "$LUM" | grep -c 'YAVG=' || true)
LDARK=$(printf '%s' "$LUM" | awk -F= '/YAVG=/{if ($2+0 < 45) c++} END{print c+0}')
if [ "$LTOTAL" -gt 0 ]; then
  LPCT=$(awk -v d="$LDARK" -v t="$LTOTAL" 'BEGIN{printf "%.1f", d/t*100}')
  echo "采样 $LTOTAL 帧，暗帧（YAVG<45）${LDARK} 帧 = ${LPCT}%"
  OVER=$(awk -v p="$LPCT" 'BEGIN{print (p>50) ? 1 : 0}')
  if [ "$OVER" = "1" ]; then
    echo "黄灯：暗帧占比 ${LPCT}% 超 50%（反'黑屏图表'：补中间调/放大主体/加暖色锚点，见 visual-style.md §8）"
    [ "${EXIT:-0}" = "0" ] && EXIT=2
  fi
else
  echo "警告：YAVG 采样失败，本项跳过，请人工看 480px 小图"
fi

# --- 5) 镜头级变化（scene 检测；>90s 的片子至少 3 次）---
echo "--- 镜头级变化（scene>0.3；90s 以上至少 3 次）---"
CUTS=$( { ffmpeg -hide_banner -i "$FILM" -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 || true; } \
  | grep -c 'showinfo.*pts_time' || true)
echo "检测到镜头级变化 ${CUTS} 次"
if awk -v d="$DUR" 'BEGIN{exit !(d>90)}'; then
  if [ "$CUTS" -lt 3 ]; then
    echo "黄灯：全片镜头级变化 ${CUTS} 次（<3）——只有淡化和缓推，容易读成 PPT；每 20–25 秒至少一次景别变化（visual-style.md §9）"
    [ "${EXIT:-0}" = "0" ] && EXIT=2
  fi
fi

EXIT=${EXIT:-0}
case $EXIT in
  0) echo "绿灯：量化项全过——仍须人工过三问、六查与 480px 小图（门禁只拦硬伤，拦不住难看）" ;;
  2) echo "黄灯：可交付，但先把黄灯项修掉或写明理由再交片" ;;
  1) echo "红灯：修完重渲再跑一次；红灯不交付" ;;
esac
exit $EXIT
