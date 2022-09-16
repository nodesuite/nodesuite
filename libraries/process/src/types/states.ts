export const [
  PROCESS_OPENING_STATE,
  PROCESS_OPENED_STATE,
  PROCESS_CLOSING_STATE,
  PROCESS_CLOSED_STATE
] = ["opening", "opened", "closing", "closed"] as const

export const processStates = [
  PROCESS_OPENING_STATE,
  PROCESS_OPENED_STATE,
  PROCESS_CLOSING_STATE,
  PROCESS_CLOSED_STATE
] as const

export type ProcessState = typeof processStates[number]
