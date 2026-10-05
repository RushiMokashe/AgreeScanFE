import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useToast } from '../components/toast/toast-context'
import { useI18n } from '../i18n/i18n-context'
import { describeError } from '../lib/api'
import { useAuth } from './auth-context'
import { LOGIN_PATH } from './portals'

/** Signs out and opens the sign-in page; a toast explains when the server could not be reached. */
export function useSignOut() {
  const { logout } = useAuth()
  const { t } = useI18n()
  const toast = useToast()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  const signOut = async () => {
    setSigningOut(true)
    try {
      await logout()
      navigate(LOGIN_PATH, { replace: true })
    } catch (error) {
      toast.show(describeError(error, t.common.errors.unexpected), 'error')
    } finally {
      setSigningOut(false)
    }
  }

  return { signOut, signingOut }
}
