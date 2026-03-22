export type Mode = "grid" | "focus"

export type AppState = {
  mode: Mode
  title: string
  topics: string[]
  current4: string[]
  selectedIndex: number | null
  backgroundImage: string | null
}
