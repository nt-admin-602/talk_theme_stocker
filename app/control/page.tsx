"use client"

import { useState } from "react"
import { useAppState } from "../lib/store"
import { Mode } from "../lib/types"

export default function ControlPage() {
  const {
    state,
    setMode,
    setTitle,
    setBackgroundImage,
    setSelectedIndex,
    setCurrent4,
    setTopics,
    randomize4,
  } = useAppState()

  const { mode, title, topics, current4, selectedIndex, backgroundImage } = state

  // ローカル編集用
  const [bgInput, setBgInput] = useState(backgroundImage ?? "")
  const [newTopic, setNewTopic] = useState("")

  const handleBgApply = () => {
    setBackgroundImage(bgInput.trim() || null)
  }

  const handleAddTopic = () => {
    const t = newTopic.trim()
    if (!t) return
    setTopics([...topics, t])
    setNewTopic("")
  }

  const handleCurrent4Change = (slotIndex: number, value: string) => {
    const next = [...current4]
    next[slotIndex] = value
    setCurrent4(next)
  }

  const modes: Mode[] = ["hidden", "grid", "focus"]
  const modeLabel: Record<Mode, string> = {
    hidden: "非表示",
    grid: "4択グリッド",
    focus: "フォーカス",
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🎙️ コントロールパネル</h1>
        <a
          href="/display"
          target="_blank"
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold text-sm transition"
        >
          🖥️ 表示画面を開く
        </a>
      </div>

      {/* モード切替 */}
      <Section title="表示モード">
        <div className="flex gap-2 flex-wrap">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                mode === m
                  ? "bg-indigo-500 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {modeLabel[m]}
            </button>
          ))}
        </div>
        <p className="text-zinc-500 text-sm mt-2">
          現在: <span className="text-zinc-300">{modeLabel[mode]}</span>
        </p>
      </Section>

      {/* フォーカス番号選択 */}
      {mode === "focus" && (
        <Section title="フォーカス選択（1〜4）">
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
                className={`w-12 h-12 rounded-lg text-xl font-bold transition ${
                  selectedIndex === i
                    ? "bg-amber-400 text-black"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* タイトル */}
      <Section title="タイトル">
        <input
          className="bg-zinc-800 rounded-lg px-3 py-2 w-full text-white outline-none focus:ring-2 focus:ring-indigo-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="どれが気になる？"
        />
      </Section>

      {/* 背景画像 */}
      <Section title="背景画像 URL">
        <div className="flex gap-2">
          <input
            className="bg-zinc-800 rounded-lg px-3 py-2 flex-1 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            value={bgInput}
            onChange={(e) => setBgInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <button
            onClick={handleBgApply}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold"
          >
            適用
          </button>
          {backgroundImage && (
            <button
              onClick={() => { setBgInput(""); setBackgroundImage(null) }}
              className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg font-semibold"
            >
              解除
            </button>
          )}
        </div>
      </Section>

      {/* 現在の4件 */}
      <Section title="現在の4択">
        <div className="grid grid-cols-1 gap-2 mb-3">
          {current4.map((topic, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-zinc-500 font-bold w-6 text-right shrink-0">{i + 1}</span>
              <select
                className="bg-zinc-800 rounded-lg px-3 py-2 flex-1 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                value={topic}
                onChange={(e) => handleCurrent4Change(i, e.target.value)}
              >
                {topics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button
          onClick={randomize4}
          className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg font-semibold"
        >
          🎲 ランダム配置
        </button>
      </Section>

      {/* 話題ストック */}
      <Section title={`話題ストック（${topics.length}件）`}>
        <div className="flex gap-2 mb-3">
          <input
            className="bg-zinc-800 rounded-lg px-3 py-2 flex-1 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
            placeholder="新しい話題を追加..."
          />
          <button
            onClick={handleAddTopic}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold"
          >
            追加
          </button>
        </div>
        <ul className="max-h-64 overflow-y-auto space-y-1">
          {topics.map((t, i) => (
            <li
              key={i}
              className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2 text-sm gap-2"
            >
              <span className="text-zinc-200 flex-1">{t}</span>
              <button
                onClick={() => {
                  const next = topics.filter((_, idx) => idx !== i)
                  setTopics(next)
                }}
                className="text-zinc-500 hover:text-red-400 font-bold shrink-0"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </Section>


    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}
