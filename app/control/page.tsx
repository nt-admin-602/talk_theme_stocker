"use client"

import { useState, useEffect } from "react"
import { useAppState } from "../lib/store"

export default function ControlPage() {
  const {
    state,
    setTitle,
    setBackgroundImage,
    setCurrent4,
    setTopics,
    randomize4,
  } = useAppState()

  const { title, topics, current4, backgroundImage } = state

  useEffect(() => {
    document.title = "お題を選ぶ"
  }, [])

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

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🎙️ お題を選ぶ</h1>
        <a
          href="/display"
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold text-sm transition"
        >
          4択へ →
        </a>
      </div>

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
