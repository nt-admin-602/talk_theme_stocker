"use client"

import { useEffect } from "react"
import { useDisplayState, patchState } from "../lib/store"

export default function DisplayPage() {
  const state = useDisplayState()
  const { mode, title, current4, selectedIndex, backgroundImage } = state

  const bgStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {}

  useEffect(() => {
    if (mode === "focus") {
      document.title = "トークテーマ"
    } else {
      document.title = title || "4択"
    }
  }, [mode, title])

  const handleSelect = (index: number) => {
    patchState({ selectedIndex: index, mode: "focus" })
  }

  const handleBack = () => {
    patchState({ mode: "grid", selectedIndex: null })
  }

  const cellColors = [
    { bg: "bg-rose-200",   text: "text-rose-900",   numColor: "text-rose-300",   hover: "hover:brightness-95" },
    { bg: "bg-violet-200", text: "text-violet-900", numColor: "text-violet-300", hover: "hover:brightness-95" },
    { bg: "bg-teal-200",   text: "text-teal-900",   numColor: "text-teal-300",   hover: "hover:brightness-95" },
    { bg: "bg-amber-200",  text: "text-amber-900",  numColor: "text-amber-300",  hover: "hover:brightness-95" },
  ]

  if (mode === "focus") {
    const topic = selectedIndex !== null ? current4[selectedIndex] ?? null : null
    const color = selectedIndex !== null ? cellColors[selectedIndex] : cellColors[0]
    return (
      <div
        className="w-screen h-screen flex flex-col items-center justify-center bg-zinc-800 p-4 gap-3"
        style={bgStyle}
      >
        {/* 戻るボタン */}
        <div className="w-full flex">
          <button
            onClick={handleBack}
            className="bg-white/20 hover:bg-white/30 text-white/80 hover:text-white px-4 py-2 rounded-full text-sm font-bold transition"
          >
            ← 戻る
          </button>
        </div>
        {/* カード */}
        <div
          className={`relative flex items-center justify-center rounded-2xl shadow-2xl overflow-hidden ${color.bg} w-full flex-1`}
        >
          {/* 背景数字 */}
          {selectedIndex !== null && (
            <span
              className={`absolute inset-0 flex items-center justify-center font-black select-none pointer-events-none ${color.numColor}`}
              style={{ fontSize: "22rem", lineHeight: 1 }}
            >
              {selectedIndex + 1}
            </span>
          )}
          {/* 話題テキスト */}
          <p className={`relative z-10 text-5xl font-black leading-snug text-center px-16 ${color.text}`}>
            {topic ?? "―"}
          </p>
        </div>
      </div>
    )
  }

  // grid — カード4枚を並べる
  return (
    <div
      className="w-screen h-screen flex flex-col bg-zinc-800"
      style={bgStyle}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <a
          href="/control"
          className="bg-white/20 hover:bg-white/30 text-white/80 hover:text-white p-2 rounded-full text-xl transition"
          title="編集画面"
        >
          ⚙️
        </a>
        {title && (
          <span className="text-white text-xl font-bold px-4 py-1 rounded-full bg-black/40 backdrop-blur-sm">{title}</span>
        )}
        <div className="w-12" />{/* バランス用スペーサー */}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-3 p-3 pt-1">
        {current4.map((topic, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`relative flex flex-col items-center justify-center rounded-2xl overflow-hidden ${cellColors[i].bg} ${cellColors[i].hover} active:brightness-90 transition cursor-pointer shadow-lg`}
          >
            <span
              className={`absolute inset-0 flex items-center justify-center font-black select-none pointer-events-none ${cellColors[i].numColor}`}
              style={{ fontSize: "16rem", lineHeight: 1 }}
            >
              {i + 1}
            </span>
            <p className={`relative z-10 text-3xl font-black leading-snug text-center px-8 ${cellColors[i].text}`}>
              {topic}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
