export const [OPENING_STATE, OPENED_STATE, CLOSING_STATE, CLOSED_STATE] = [
  "opening",
  "opened",
  "closing",
  "closed"
] as const

export const processStates = [
  OPENING_STATE,
  OPENED_STATE,
  CLOSING_STATE,
  CLOSED_STATE
] as const

export type ProcessState = typeof processStates[number]
