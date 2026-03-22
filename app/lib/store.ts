"use client"

import { useEffect, useState, useCallback } from "react"
import { AppState, Mode } from "./types"
import { INITIAL_TOPICS } from "./initialData"

const STORAGE_KEY = "talk_theme_stocker_state"

function pickRandom4(topics: string[]): string[] {
  const shuffled = [...topics].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 4)
}

function defaultState(): AppState {
  const topics = INITIAL_TOPICS
  return {
    mode: "hidden",
    title: "どれが気になる？",
    topics,
    current4: pickRandom4(topics),
    selectedIndex: null,
    backgroundImage: null,
  }
}

function loadState(): AppState {
  if (typeof window === "undefined") return defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return JSON.parse(raw) as AppState
  } catch {
    return defaultState()
  }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useAppState() {
  const [state, setState] = useState<AppState>(defaultState)

  // 初回マウント時に localStorage から読み込む
  useEffect(() => {
    setState(loadState())
  }, [])

  // 他タブ(display)からの変更を検知して同期
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(JSON.parse(e.newValue) as AppState)
        } catch {}
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  const update = useCallback((patch: Partial<AppState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      saveState(next)
      return next
    })
  }, [])

  const setMode = useCallback((mode: Mode) => update({ mode }), [update])
  const setTitle = useCallback((title: string) => update({ title }), [update])
  const setBackgroundImage = useCallback(
    (backgroundImage: string | null) => update({ backgroundImage }),
    [update]
  )
  const setSelectedIndex = useCallback(
    (selectedIndex: number | null) => update({ selectedIndex }),
    [update]
  )
  const setCurrent4 = useCallback(
    (current4: string[]) => update({ current4, selectedIndex: null }),
    [update]
  )
  const setTopics = useCallback(
    (topics: string[]) => update({ topics }),
    [update]
  )

  const randomize4 = useCallback(() => {
    setState((prev) => {
      const next = {
        ...prev,
        current4: pickRandom4(prev.topics),
        selectedIndex: null,
      }
      saveState(next)
      return next
    })
  }, [])

  return {
    state,
    setMode,
    setTitle,
    setBackgroundImage,
    setSelectedIndex,
    setCurrent4,
    setTopics,
    randomize4,
  }
}

// display ページ用：読み取り専用 + storage イベントで自動更新
export function useDisplayState() {
  const [state, setState] = useState<AppState>(defaultState)

  useEffect(() => {
    setState(loadState())
  }, [])

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(JSON.parse(e.newValue) as AppState)
        } catch {}
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  // 同一タブでも定期ポーリング（OBS内蔵ブラウザ等への対応）
  useEffect(() => {
    const id = setInterval(() => {
      setState(loadState())
    }, 500)
    return () => clearInterval(id)
  }, [])

  return state
}
