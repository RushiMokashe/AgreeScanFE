/** The password policy the server enforces (types.ts): 8–64 characters with at least one letter and one digit. */
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 64

/** Which rules of the policy a password meets. */
export interface PasswordCheck {
  length: boolean
  letter: boolean
  digit: boolean
}

export function checkPassword(password: string): PasswordCheck {
  return {
    length: password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH,
    letter: /\p{L}/u.test(password),
    digit: /\d/.test(password),
  }
}

export function isValidPassword(password: string): boolean {
  const check = checkPassword(password)
  return check.length && check.letter && check.digit
}
