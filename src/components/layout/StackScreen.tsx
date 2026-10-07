import type { ReactNode } from 'react'
import { StackHeader } from './StackHeader'

/** A full-screen flow of the farmer app (payment, …): the back header with its title, no tab bar. */
export function StackScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <StackHeader title={title} />
      <main className="flex flex-col relative w-full pt-header bg-surface pb-safe">{children}</main>
    </>
  )
}
