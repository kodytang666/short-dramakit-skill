#!/usr/bin/env python3
"""
synth_bgm.py — Vibe 知识短片 BGM 合成器（纯 numpy，零采样、零虚拟乐器）

用法:
  python3 scripts/synth_bgm.py <out.wav> --duration 135 [--bpm 77] [--key Am] \
      --sections "0,8,pad;8,40,piano;40,95,full;95,110,arp;110,125,piano;125,135,outro" \
      [--beats <out.beats.json>]

风格（对齐参考片）:
  76–78 BPM 小调，低音 pad 长音 + 钢琴柱式和弦 + 轻打击。
  织体级别: pad < piano < full < arp < outro

输出:
  <out.wav>         44.1kHz 16bit 立体声 WAV，峰值 -1dB
  <out.beats.json>  节拍网格（每拍、每小节时间点），供 Remotion 卡点

依赖: numpy（python3 -m pip install numpy）
"""
import argparse
import json
import wave
import numpy as np

SR = 44100
NAMES = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
         'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}

# 小调 i - VI - III - VII（纪录片感）
PROGRESSIONS = {
    'Am': [['A2', 'E3', 'A3', 'C4', 'E4'], ['F2', 'C3', 'F3', 'A3', 'C4'],
           ['C3', 'G3', 'C4', 'E4', 'G4'], ['G2', 'D3', 'G3', 'B3', 'D4']],
    'Dm': [['D2', 'A2', 'D3', 'F3', 'A3'], ['Bb2', 'F3', 'Bb3', 'D4', 'F4'],
           ['F2', 'C3', 'F3', 'A3', 'C4'], ['C3', 'G3', 'C4', 'E4', 'G4']],
    'Em': [['E2', 'B2', 'E3', 'G3', 'B3'], ['C3', 'G3', 'C4', 'E4', 'G4'],
           ['G2', 'D3', 'G3', 'B3', 'D4'], ['D2', 'A2', 'D3', 'F#3', 'A3']],
}


def freq(name):
    midi = 12 * (int(name[-1]) + 1) + NAMES[name[:-1]]
    return 440.0 * 2 ** ((midi - 69) / 12)


def pad_tone(f, dur, amp=0.10):
    n = int(dur * SR)
    t = np.arange(n) / SR
    # 微失谐 = 合唱感
    w = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 2 * t)
         + 0.4 * np.sin(2 * np.pi * f * 0.5 * t) + 0.5 * np.sin(2 * np.pi * f * 1.005 * t))
    fade = min(int(1.2 * SR), n // 2)
    env = np.ones(n)
    env[:fade] = np.linspace(0, 1, fade)
    env[-fade:] = np.linspace(1, 0, fade)
    return amp * w * env / 2.2


def piano_tone(f, dur, amp=0.16):
    n = int(dur * SR)
    t = np.arange(n) / SR
    w = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2 * t)
         + 0.25 * np.sin(2 * np.pi * f * 3 * t) + 0.12 * np.sin(2 * np.pi * f * 4.02 * t))
    env = np.exp(-t * 1.7)
    attack = min(int(0.004 * SR), n)
    env[:attack] *= np.linspace(0, 1, attack)
    return amp * w * env / 2.0


def kick(dur=0.22, amp=0.30):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 110 * np.exp(-t * 24) + 42
    phase = 2 * np.pi * np.cumsum(f) / SR
    return amp * np.sin(phase) * np.exp(-t * 13)


def shaker(dur=0.06, amp=0.05):
    n = int(dur * SR)
    noise = np.random.default_rng(7).uniform(-1, 1, n)
    b = np.exp(-np.arange(n) / (n * 0.25))
    return amp * noise * b


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out", help="输出 WAV 路径")
    ap.add_argument("--bpm", type=float, default=77)
    ap.add_argument("--duration", type=float, required=True)
    ap.add_argument("--key", default="Am", choices=list(PROGRESSIONS))
    ap.add_argument("--sections", default="", help='"起秒,止秒,织体" 分号分隔')
    ap.add_argument("--beats", default="", help="可选：输出节拍网格 JSON 路径")
    args = ap.parse_args()

    rng = np.random.default_rng(42)
    total_n = int(args.duration * SR)
    mix = np.zeros(total_n)
    beat = 60.0 / args.bpm
    bar = beat * 4

    sections = []
    for s in args.sections.split(';'):
        s = s.strip()
        if not s:
            continue
        a, b, tex = s.split(',')
        sections.append((float(a), float(b), tex.strip()))

    def texture_at(t):
        for a, b, tex in sections:
            if a <= t < b:
                return tex
        return sections[-1][2] if sections else 'full'

    # 1) pad 铺满
    tpos, ci = 0.0, 0
    while tpos < args.duration:
        chord = PROGRESSIONS[args.key][ci % 4]
        dur = min(bar, args.duration - tpos)
        if dur < 0.4:
            break
        overlap = 0.6
        for i, note in enumerate(chord):
            amp = 0.09 if i == 0 else 0.055
            tone = pad_tone(freq(note), min(dur + overlap, args.duration - tpos), amp)
            i0 = int(tpos * SR)
            mix[i0:i0 + len(tone)] += tone[:max(0, total_n - i0)]
        tpos += dur
        ci += 1

    # 2) 钢琴柱式（每小节第一拍）
    tpos, ci = 0.0, 0
    while tpos < args.duration - 0.5:
        if texture_at(tpos) in ('piano', 'full', 'arp', 'outro'):
            chord = PROGRESSIONS[args.key][ci % 4]
            amp = 0.09 if texture_at(tpos) == 'outro' else 0.13
            for note in chord[2:]:
                tone = piano_tone(freq(note), beat * 3.6, amp)
                i0 = int(tpos * SR)
                mix[i0:i0 + len(tone)] += tone[:max(0, total_n - i0)]
        tpos += bar
        ci += 1

    # 3) 打击（full 段）
    tpos, bi = 0.0, 0
    while tpos < args.duration - 0.3:
        if texture_at(tpos) == 'full':
            if bi % 2 == 0:
                k = kick()
                i0 = int(tpos * SR)
                mix[i0:i0 + len(k)] += k[:max(0, total_n - i0)]
            for off in (0.0, beat / 2):
                sh = shaker()
                i0 = int((tpos + off) * SR)
                mix[i0:i0 + len(sh)] += sh[:max(0, total_n - i0)]
        tpos += beat
        bi += 1

    # 4) 琶音（arp 段）
    tpos, ci = 0.0, 0
    while tpos < args.duration - 0.3:
        if texture_at(tpos) == 'arp':
            chord = PROGRESSIONS[args.key][ci % 4]
            for k_i, note in enumerate(chord[1:]):
                tone = piano_tone(freq(note), beat * 0.9, 0.08)
                i0 = int((tpos + k_i * beat / 2) * SR)
                if i0 + len(tone) < total_n:
                    mix[i0:i0 + len(tone)] += tone
        tpos += bar
        ci += 1

    # 5) 空气感
    air = rng.uniform(-1, 1, total_n)
    air = np.convolve(air, np.ones(8) / 8, 'same') * 0.012
    breath = 0.85 + 0.15 * np.sin(np.arange(total_n) / SR * 2 * np.pi / 16)
    mix += air * breath

    # 6) 软限幅 + -1dB
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    mix = mix / (np.abs(mix).max() + 1e-9) * 0.891

    # 立体声微延迟展宽
    delay = int(0.012 * SR)
    L = mix
    R = np.concatenate([np.zeros(delay), mix[:-delay]]) * 0.96 + mix * 0.04
    stereo = np.stack([L, R], axis=1)
    pcm = (stereo * 32767).astype('<i2')
    with wave.open(args.out, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())

    if args.beats:
        beats = [round(i * beat, 3) for i in range(int(args.duration / beat) + 1)]
        bars = [round(i * bar, 3) for i in range(int(args.duration / bar) + 1)]
        with open(args.beats, 'w') as f:
            json.dump({'bpm': args.bpm, 'key': args.key, 'duration': args.duration,
                       'beat_sec': round(beat, 4), 'beats': beats, 'bars': bars},
                      f, ensure_ascii=False, indent=2)

    note = f"BGM 完成: {args.out}  {args.bpm}BPM  {args.duration}s  {args.key}小调"
    if args.beats:
        note += f"  节拍网格 -> {args.beats}"
    print(note)


if __name__ == "__main__":
    main()