import { useState } from 'react'
import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import type { VehicleOwnerProfile } from '../../lib/types'
import { BusinessSheet } from './BusinessSheet'

interface BusinessCardProps {
  profile: VehicleOwnerProfile
  onChange: (profile: VehicleOwnerProfile) => void
}

/** Who farmers see as the operator of the owner's vehicles, and the hub they serve, with an edit button. */
export function BusinessCard({ profile, onChange }: BusinessCardProps) {
  const { t } = useI18n()
  const toast = useToast()
  const [editing, setEditing] = useState(false)

  const saved = (updated: VehicleOwnerProfile) => {
    onChange(updated)
    setEditing(false)
    toast.show(t.owner.business.saved)
  }

  return (
    <section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex flex-col min-w-0">
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">{t.owner.business.title}</span>
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{profile.name}</span>
          {profile.businessName && (
            <span className="font-body-sm text-body-sm text-on-surface-variant">{profile.businessName}</span>
          )}
        </div>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setEditing(true)}
          className="min-h-[44px] flex items-center gap-1 rounded-lg bg-surface-container px-space-sm font-label-md text-label-md text-primary active:bg-surface-container-high"
        >
          <Icon name="edit" className="text-[18px]" />
          {t.owner.business.edit}
        </button>
      </div>
      <span className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
        <Icon name="location_on" className="text-[18px] text-secondary" />
        {t.owner.business.hub}: {profile.hubName}
      </span>
      {editing && <BusinessSheet profile={profile} onSaved={saved} onClose={() => setEditing(false)} />}
    </section>
  )
}
