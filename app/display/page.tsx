"use client"

import { useDisplayState } from "../lib/store"

export default function DisplayPage() {
  const state = useDisplayState()
  const { mode, title, current4, selectedIndex, backgroundImage } = state

  const bgStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {}

  if (mode === "hidden") {
    return <div className="w-screen h-screen bg-black" />
  }

  if (mode === "focus") {
    const topic =
      selectedIndex !== null ? current4[selectedIndex] ?? null : null
    return (
      <div
        className="w-screen h-screen flex items-center justify-center bg-black"
        style={bgStyle}
      >
        <div className="bg-black/60 rounded-2xl px-12 py-10 max-w-3xl text-center">
          {selectedIndex !== null && (
            <p className="text-white/50 text-2xl font-bold mb-4">
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

  // grid
  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center bg-black gap-6 p-8"
      style={bgStyle}
    >
      {title && (
        <h1 className="text-white text-2xl font-bold drop-shadow">{title}</h1>
      )}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {current4.map((topic, i) => (
          <div
            key={i}
            className="bg-black/60 border border-white/20 rounded-xl p-5 flex gap-3 items-start"
          >
            <span className="text-white/40 text-3xl font-black leading-none mt-0.5 select-none">
              {i + 1}
            </span>
            <p className="text-white text-lg font-semibold leading-snug">{topic}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
