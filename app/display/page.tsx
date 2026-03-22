"use client"

import { useDisplayState, patchState } from "../lib/store"

export default function DisplayPage() {
  const state = useDisplayState()
  const { mode, title, current4, selectedIndex, backgroundImage } = state

  const bgStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {}

  const handleSelect = (index: number) => {
    patchState({ selectedIndex: index, mode: "focus" })
  }

  const handleBack = () => {
    patchState({ mode: "grid", selectedIndex: null })
  }

  if (mode === "focus") {
    const topic =
      selectedIndex !== null ? current4[selectedIndex] ?? null : null
    return (
      <div
        className="w-screen h-screen flex items-center justify-center bg-black"
        style={bgStyle}
      >
        {/* 戻るボタン */}
        <button
          onClick={handleBack}
          className="absolute top-5 left-5 bg-black/60 hover:bg-black/80 text-white/70 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          ← 戻る
        </button>
        <div className="bg-black/60 rounded-2xl px-12 py-10 max-w-3xl text-center">
          {selectedIndex !== null && (
            <p className="text-white/40 text-2xl font-bold mb-4">
              {selectedIndex + 1}
            </p>
          )}
          <p className="text-white text-4xl font-bold leading-snug">
            {topic ?? "―"}
          </p>
        </div>
      </div>
    )
  }

  // grid — 画面いっぱいに4枚を並べる
  return (
    <div
      className="w-screen h-screen flex flex-col bg-black"
      style={bgStyle}
    >
      <div className="flex items-center justify-between px-5 py-3">
        <a
          href="/control"
          className="bg-black/60 hover:bg-black/80 text-white/70 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          ✏️ 編集画面
        </a>
        {title && (
          <span className="text-white/60 text-xl font-bold">{title}</span>
        )}
        <div className="w-24" />{/* バランス用スペーサー */}
      </div>
      <div className="flex-1 grid grid-cols-2">
        {current4.map((topic, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className="flex flex-col items-start justify-end p-8 bg-black/40 hover:bg-black/60 active:bg-black/80 border border-white/10 transition cursor-pointer text-left"
          >
            <span className="text-white/30 text-5xl font-black leading-none mb-3 select-none">
              {i + 1}
            </span>
            <p className="text-white text-xl font-semibold leading-snug">{topic}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
