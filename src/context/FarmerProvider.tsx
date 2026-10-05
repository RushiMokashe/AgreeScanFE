import type { ReactNode } from 'react'
import { useApi } from '../hooks/useApi'
import { api } from '../lib/api'
import { FarmerContext } from './farmer-context'

/** Loads the farmer's profile. FarmerLayout mounts it, so it only runs for a signed-in FARMER. */
export function FarmerProvider({ children }: { children: ReactNode }) {
  const { data } = useApi(() => api.farmer())
  return <FarmerContext value={data}>{children}</FarmerContext>
}
