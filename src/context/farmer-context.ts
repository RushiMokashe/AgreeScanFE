import { createContext, useContext } from 'react'
import type { FarmerProfile } from '../lib/types'

export const FarmerContext = createContext<FarmerProfile | undefined>(undefined)

/** The signed-in farmer's profile in the farmer app; undefined while it loads and outside the farmer app. */
export function useFarmer(): FarmerProfile | undefined {
  return useContext(FarmerContext)
}
