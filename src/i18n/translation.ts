import type { en } from './messages/en'

/**
 * The shape a translation must have: the English module's keys, with every text widened to `string` and
 * every function keeping its parameters. A missing key, an extra key or a changed parameter fails to compile.
 */
export type Translation<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends (...args: infer P) => string
      ? (...args: P) => string
      : Translation<T[K]>
}

/** Every text of the app in one language: `t.common.retry`, `t.nav.tabs.home`, `t.auth.phoneInvalid(10)`. */
export type Messages = Translation<typeof en>

/** Picks one text from the messages, for static configuration such as routes and menus: `(t) => t.nav.tabs.home`. */
export type MessageSelector = (t: Messages) => string
