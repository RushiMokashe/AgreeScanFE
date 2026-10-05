import { useMemo, useState } from 'react'
import { Outlet } from 'react-router'
import { AssistantContext } from '../../assistant/assistant-context'
import { AssistantSheet } from '../../assistant/AssistantSheet'
import { FarmerProvider } from '../../context/FarmerProvider'
import { PhoneFrame } from './PhoneFrame'

/**
 * The farmer app around its tab and full-screen pages: the phone frame, the farmer's profile, and the voice
 * assistant, whose sheet is mounted once here and opened with useAssistant().open().
 */
export function FarmerLayout() {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const assistant = useMemo(() => ({ open: () => setAssistantOpen(true) }), [])

  return (
    <FarmerProvider>
      <AssistantContext value={assistant}>
        <PhoneFrame>
          <Outlet />
        </PhoneFrame>
        <AssistantSheet open={assistantOpen} onClose={() => setAssistantOpen(false)} />
      </AssistantContext>
    </FarmerProvider>
  )
}
