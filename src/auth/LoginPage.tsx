import { lazy, Suspense, useRef, useState, type FormEvent } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { FormError } from '../components/form/FormError'
import { PasswordField } from '../components/form/PasswordField'
import { PhoneField } from '../components/form/PhoneField'
import { SubmitButton } from '../components/form/SubmitButton'
import { Icon } from '../components/Icon'
import { LanguagePicker } from '../components/LanguagePicker'
import { APP_NAME, BRAND_MARK_URL } from '../components/layout/constants'
import { SplashScreen } from '../components/SplashScreen'
import { useI18n } from '../i18n/i18n-context'
import { describeError } from '../lib/api'
import { PHONE_DIGITS, isValidPhone } from '../lib/phone'
import type { LoginRequest } from '../lib/types'
import { useAuth } from './auth-context'
import { homePath, primaryRole, safeNextPath } from './portals'

/** One-tap demo sign-ins. Production builds drop this branch and never contain the module. */
const DemoAccounts = import.meta.env.DEV
  ? lazy(() => import('./DemoAccounts').then((module) => ({ default: module.DemoAccounts })))
  : null

interface LoginErrors {
  phone?: string
  password?: string
  /** Why signing in failed, from the server (wrong password, deactivated account, offline, …). */
  form?: string
}

/**
 * Sign-in with mobile number and password (D1). Signed-in visitors go on to the page that sent them here
 * (`?next=`), else to their primary role's home.
 */
export default function LoginPage() {
  const { t } = useI18n()
  const { status, user, login, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const phoneRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const submitRef = useRef<HTMLButtonElement>(null)

  if (status === 'loading') return <SplashScreen />
  if (user && primaryRole(user.roles)) {
    return <Navigate to={safeNextPath(searchParams.get('next')) ?? homePath(user.roles)} replace />
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const invalid: LoginErrors = {
      phone: isValidPhone(phone) ? undefined : t.auth.phoneInvalid(PHONE_DIGITS),
      password: password ? undefined : t.auth.passwordRequired,
    }
    setErrors(invalid)
    const firstInvalid = invalid.phone ? phoneRef : invalid.password ? passwordRef : undefined
    if (firstInvalid) {
      firstInvalid.current?.focus()
      return
    }

    setSubmitting(true)
    try {
      const signedIn = await login({ phone, password })
      if (!primaryRole(signedIn.roles)) {
        setErrors({ form: t.auth.noAccess })
        logout().catch(() => undefined) // best effort: the account cannot use the app either way
      }
    } catch (error) {
      setErrors({ form: describeError(error, t.common.errors.unexpected) })
    } finally {
      setSubmitting(false)
    }
  }

  const fillDemoAccount = (credentials: LoginRequest) => {
    setPhone(credentials.phone)
    setPassword(credentials.password)
    setErrors({})
    submitRef.current?.focus()
  }

  return (
    <div className="min-h-dvh bg-surface-container-low">
      <div className="rounded-b-[2rem] bg-gradient-to-br from-primary to-primary-container pb-16 pt-safe">
        <div className="mx-auto w-full max-w-md px-margin">
          <div className="flex h-16 items-center justify-end">
            <LanguagePicker />
          </div>
          <div className="flex flex-col items-center gap-space-xs text-center">
            <img alt="" src={BRAND_MARK_URL} className="h-16 w-16 rounded-2xl shadow-lg ring-4 ring-on-primary/15" />
            <h1 className="mt-space-xs font-display-lg-mobile text-display-lg-mobile text-on-primary">{APP_NAME}</h1>
            <p className="max-w-xs font-body-md text-body-md text-on-primary/85">{t.auth.tagline}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-10 flex w-full max-w-md flex-col gap-space-lg px-margin pb-[calc(2.5rem_+_env(safe-area-inset-bottom,0px))]">
        <main className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl">
          <div className="flex flex-col gap-space-xs">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">{t.auth.title}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t.auth.subtitle}</p>
          </div>
          <form noValidate onSubmit={submit} className="flex flex-col gap-space-md">
            <PhoneField
              ref={phoneRef}
              label={t.auth.phone}
              name="phone"
              autoComplete="username"
              value={phone}
              onValueChange={setPhone}
              error={errors.phone}
            />
            <PasswordField
              ref={passwordRef}
              label={t.auth.password}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={errors.password}
            />
            {errors.form && <FormError message={errors.form} />}
            <SubmitButton ref={submitRef} busy={submitting} busyLabel={t.auth.submitting} icon="login">
              {t.auth.submit}
            </SubmitButton>
          </form>
          <p className="flex items-start gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <Icon name="help" className="mt-0.5 text-[18px] text-secondary" />
            <span>{t.auth.forgotPassword}</span>
          </p>
        </main>
        {DemoAccounts && (
          <Suspense fallback={null}>
            <DemoAccounts onPick={fillDemoAccount} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
