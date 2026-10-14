import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BottomSheet } from '../../components/BottomSheet'
import { FormError } from '../../components/form/FormError'
import { Icon } from '../../components/Icon'
import { useToast } from '../../components/toast/toast-context'
import { useI18n } from '../../i18n/i18n-context'
import { api, describeError } from '../../lib/api'

/** Takes a vehicle off AgriScan after a confirmation; the server refuses while it has open bookings. */
export function RemoveVehicleSection({ listingId }: { listingId: number }) {
  const { t } = useI18n()
  const toast = useToast()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState<string>()

  const remove = async () => {
    setRemoving(true)
    setError(undefined)
    try {
      await api.owner.deleteListing(listingId)
      toast.show(t.owner.form.removed, 'info')
      navigate('/owner/vehicles', { replace: true })
    } catch (failure) {
      setError(describeError(failure, t.common.errors.unexpected))
      setRemoving(false)
    }
  }

  const close = () => {
    setConfirming(false)
    setError(undefined)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex min-h-[48px] w-full items-center justify-center gap-space-xs rounded-xl border border-error/40 font-label-lg text-label-lg text-error active:bg-error-container"
      >
        <Icon name="delete" className="text-[20px]" />
        {t.owner.form.remove}
      </button>
      {confirming && (
        <BottomSheet title={t.owner.form.removeTitle} onClose={close}>
          <div className="flex flex-col gap-space-md pt-space-xs">
            <p className="font-body-md text-body-md text-on-surface-variant">{t.owner.form.removeMessage}</p>
            {error && <FormError message={error} />}
            <button
              type="button"
              disabled={removing}
              aria-busy={removing}
              onClick={() => void remove()}
              className="flex min-h-[52px] w-full items-center justify-center gap-space-sm rounded-xl bg-error font-label-lg text-label-lg text-on-error disabled:opacity-60"
            >
              <Icon name={removing ? 'progress_activity' : 'delete'} className={`text-[20px] ${removing ? 'animate-spin' : ''}`} />
              {removing ? t.owner.form.removing : t.owner.form.removeConfirm}
            </button>
            <button
              type="button"
              onClick={close}
              className="min-h-[48px] rounded-xl font-label-lg text-label-lg text-primary active:bg-surface-container"
            >
              {t.owner.form.keep}
            </button>
          </div>
        </BottomSheet>
      )}
    </>
  )
}
