/** Sign-in page and the password rules (platform). */
export const auth = {
  tagline: 'AI crop doctor, mandi rates and farm services in one app',
  title: 'Sign in',
  subtitle: 'Use the mobile number registered with AgriScan.',
  phone: 'Mobile number',
  phoneInvalid: (digits: number) => `Enter your ${digits}-digit mobile number.`,
  password: 'Password',
  passwordRequired: 'Enter your password.',
  showPassword: 'Show password',
  submit: 'Sign in',
  submitting: 'Signing in…',
  forgotPassword: 'Forgot your password? Ask your AgriScan administrator to reset it.',
  noAccess: 'This account has no access to AgriScan yet. Please contact your administrator.',
  passwordRules: {
    title: 'Your password needs',
    length: (min: number, max: number) => `${min} to ${max} characters`,
    letter: 'At least one letter',
    digit: 'At least one number',
    met: 'done',
    unmet: 'missing',
  },
  demo: {
    title: 'Demo accounts',
    hint: 'Development only · tap an account to fill the form',
  },
}
