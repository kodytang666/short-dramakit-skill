#!/usr/bin/env bash
# AI 短剧制作 Skills 工具箱 - 安装脚本
# 用法:
#   ./install.sh                       # 交互安装（选择目标）
#   ./install.sh ~/.codex/skills       # 指定目标目录安装
#   ./install.sh --trae /path/to/proj  # 装到 <项目>/.trae/skills（项目级）
#   ./install.sh --trae-global         # 装到 ~/.trae-cn/skills（Trae 全局）
#   ./install.sh --codex               # 装到 ~/.codex/skills（全局）
set -euo pipefail

SKILLS=(drama-concept drama-story drama-script drama-assets drama-storyboard drama-generation drama-post-production short-drama-orchestrator)
SRC_DIR="$(cd "$(dirname "$0")/.." && pwd)/skills/drama"
EXTRA_SKILLS=(vibeKnowledge)   # 知识短片 Skill（skills/ 下独立目录）
EXTRA_SRC="$(cd "$(dirname "$0")/.." && pwd)/skills"

install_to() {
  local dest="$1"
  echo "安装到: $dest"
  mkdir -p "$dest"
  for s in "${SKILLS[@]}"; do
    if [ ! -f "$SRC_DIR/$s/SKILL.md" ]; then
      echo "错误: 缺少 $SRC_DIR/$s/SKILL.md" >&2; exit 1
    fi
    rm -rf "$dest/$s"
    cp -R "$SRC_DIR/$s" "$dest/$s"
    echo "  ✓ $s"
  done
  for s in "${EXTRA_SKILLS[@]}"; do
    if [ ! -f "$EXTRA_SRC/$s/SKILL.md" ]; then
      echo "错误: 缺少 $EXTRA_SRC/$s/SKILL.md" >&2; exit 1
    fi
    rm -rf "$dest/$s"
    cp -R "$EXTRA_SRC/$s" "$dest/$s"
    # 示例工程仅仓库内保留：安装版排除 examples（含 node_modules / public 音频 / out 成片）
    rm -rf "$dest/$s/examples"
    echo "  ✓ ${s}（已排除 examples 示例工程）"
  done
  mkdir -p "$dest/_shared"
  cp "$SRC_DIR/_shared/ids.md" "$dest/_shared/ids.md" 2>/dev/null && echo "  ✓ _shared/ids.md（统一 ID 规范）" || true
  echo "安装完成。"
}

case "${1:-}" in
  --codex) install_to "$HOME/.codex/skills" ;;
  --trae-global) install_to "$HOME/.trae-cn/skills" ;;
  --trae)
    # Trae 项目级：装到 <目标项目>/.trae/skills。可带路径参数，也可交互输入。
    proj="${2:-}"
    if [ -z "$proj" ]; then
      read -r -p "输入目标项目根目录（要用本工具箱的那个项目，不是工具箱仓库本身；回车=当前目录）: " proj
      proj="${proj:-.}"
    fi
    # 展开 ~
    proj="${proj/#\~/$HOME}"
    install_to "$proj/.trae/skills"
    ;;
  "")
    read -r -p "安装目标目录（如 ~/.codex/skills 或项目 .trae/skills）: " dest
    [ -z "$dest" ] && { echo "未提供目标目录，退出。"; exit 0; }
    install_to "${dest/#\~/$HOME}"
    ;;
  *) install_to "${1/#\~/$HOME}" ;;
esac
