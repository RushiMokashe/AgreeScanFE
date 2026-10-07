/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** The backend's address for the installed app, e.g. "https://api.example.in"; unset on the web (same origin). */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
