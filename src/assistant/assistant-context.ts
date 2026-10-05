import { createContext, useContext } from 'react'

export interface Assistant {
  /** Shows the voice assistant sheet. */
  open: () => void
}

export const AssistantContext = createContext<Assistant | null>(null)

/** The farmer app's voice assistant; FarmerLayout mounts its sheet once for every farmer screen. */
export function useAssistant(): Assistant {
  const assistant = useContext(AssistantContext)
  if (!assistant) throw new Error('useAssistant() must be used inside the farmer app (FarmerLayout)')
  return assistant
}
