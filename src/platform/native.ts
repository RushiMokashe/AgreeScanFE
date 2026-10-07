import { Capacitor } from '@capacitor/core'

/** Whether AgriScan runs as the installed Android app (Capacitor) rather than in a browser. */
export const isNativeApp: boolean = Capacitor.isNativePlatform()
