# AgriScan as an Android app

This page explains how the AgriScan web app becomes an Android app: how to make an install file (APK) for
testers, and how to publish on the Google Play Store. You do not need to know Android development to follow it.

---

## 1. The idea in one minute

- The app is the **same React code** as the website. We wrap it in a small native Android shell with
  **[Capacitor](https://capacitorjs.com)** (version 8). There is no second codebase to maintain.
- The Android project lives in `frontend/android/`. Android Studio can open it like any Android app.
- Two kinds of files come out of it:

| File | What it is for | How people install it |
|---|---|---|
| **APK** (`app-debug.apk`) | Sending to testers before the Play Store | Send the file (WhatsApp, Drive, email); they tap it and allow "Install unknown apps" |
| **AAB** (`app-release.aab`) | Uploading to the Play Store | Google Play builds the phone downloads from it |

- **App name:** AgriScan. **App id:** `com.myagree.agriscan`. The id is the app's permanent identity on the Play
  Store: once published it can never change. If you want another id, change it in `capacitor.config.ts` and
  `android/app/build.gradle` **before** the first upload.

---

## 2. The one thing to set: where the backend is

On a phone the app cannot reach `localhost` on your computer, so every build is told the backend's address in
`VITE_API_BASE_URL`:

| Who uses the build | Backend address | Notes |
|---|---|---|
| Android emulator on your computer | `http://10.0.2.2:8080` | The default in `.env.android` (10.0.2.2 is the emulator's name for your computer) |
| A real phone on the same Wi-Fi | `http://<your computer's IP>:8080`, e.g. `http://192.168.1.20:8080` | Find the IP with `ipconfig`; allow port 8080 in Windows Firewall |
| Testers anywhere, and the Play Store | `https://api.your-domain.in` | The backend must be deployed on a server with HTTPS (see section 6) |

- On your computer, put your value in `frontend/.env.android.local`, which Git ignores. For example:
  `VITE_API_BASE_URL=http://192.168.1.20:8080`
- On GitHub, set the repository variable `AGRISCAN_API_BASE_URL` (see section 3).

A build with an `http://` address is only for testing. Play Store builds must use `https://`, and the app
switches off plain-http access for them automatically.

---

## 3. Easiest: let GitHub build the APK (no Android Studio needed)

Every pull request and every push to `main` runs the **Android app** workflow (`.github/workflows/android.yml`).
It checks the code and builds a debug APK.

1. Open the repository on GitHub → **Actions** → **Android app** → the latest run.
2. At the bottom, under **Artifacts**, download **agriscan-debug-apk** (a zip with `app-debug.apk` inside).
3. Send `app-debug.apk` to your testers.
4. On the phone: tap the file → allow **Install unknown apps** for the app that opened it → **Install**.

To choose the backend for these builds, go to **Settings → Secrets and variables → Actions → Variables** and add
`AGRISCAN_API_BASE_URL` with your backend's address. To make one build for another backend, open **Actions →
Android app → Run workflow** and fill in **api_base_url**.

---

## 4. Build it on your own computer

**Install once:**
- [Android Studio](https://developer.android.com/studio). It brings the Android SDK and a Java 21 runtime, which
  Capacitor 8 needs. The machine's Java 17 is enough for the backend, not for Android.
- Node.js 24 (already used for the frontend).

**Every time you want a fresh app:**

```powershell
cd frontend
npm install              # first time, or after package.json changes
npm run android:sync     # builds the web app with .env.android and copies it into android/
npm run android:open     # opens the Android project in Android Studio
```

In Android Studio:
- **Run on the emulator or a USB-connected phone:** press the green ▶ Run button.
- **Make an APK file:** *Build → Build App Bundle(s) / APK(s) → Build APK(s)*. The file is
  `frontend/android/app/build/outputs/apk/debug/app-debug.apk`.

Or from the terminal, after `npm run android:sync`:

```powershell
cd frontend\android
.\gradlew.bat assembleDebug      # → app\build\outputs\apk\debug\app-debug.apk
```

> After changing any React code, run `npm run android:sync` again before building. The app only contains the
> web build from the last sync.

---

## 5. What is different in the app (and why)

| Area | In the app |
|---|---|
| **Sign-in** | Browsers keep the sign-in in a cookie. The app can't use that cookie, so it keeps the sign-in token in its private storage and sends it in a header. The backend supports both (`NativeClient` in the backend). Users stay signed in for 30 days, like on the web. |
| **Back button** | Closes an open sheet first, then goes back a screen, then leaves the app from the first screen. |
| **Status bar and gesture bar** | The app draws edge to edge, and the header and tab bar leave room for the phone's bars. |
| **Camera (crop scan)** | Android asks for camera permission the first time. Picking a photo from the gallery also works. |
| **Phone links** ("Call owner", helplines) | Open the phone dialer. |
| **Photos from the backend** | Loaded from the backend's address (`apiUrl` in `src/platform/api-base.ts`). |
| **Voice search and read-aloud** | Android's web view has no built-in speech recognition, so the microphone shows "voice is not supported" for now. A native speech plugin can be added later. |
| **Live notifications** | Arrive while the app is open. Notifications to a closed app need Firebase Cloud Messaging (a later step). |
| **Payments** | The simulated, Stripe and Razorpay checkouts run inside the app. Before going live, test UPI app hand-off with Razorpay test keys on a real phone. |

**Where the code is:**

| File | What it does |
|---|---|
| `capacitor.config.ts` | App id and name, and the web build folder; allows plain http only for http test backends |
| `.env.android` | The backend address for app builds (override in `.env.android.local`) |
| `android/` | The native Android project (generated by Capacitor, committed) |
| `assets/*.svg` → `assets/*.png` | Sources of the launcher icon and launch screen (see section 7) |
| `src/platform/api-base.ts` | `apiUrl()`: the backend's address on the web (same origin) and in the app |
| `src/platform/session-transport.ts` | Where the sign-in token lives: browser cookie, or app storage plus header |
| `src/platform/native-app.ts` | Android back button |
| `src/platform/native.ts` | `isNativeApp`: running as the app or in a browser |
| `.github/workflows/android.yml` | Builds the APK / AAB on GitHub |

---

## 6. Publishing on the Google Play Store

### a. Put the backend online (needed before testers outside your Wi-Fi or the Play Store)

- Host the Spring Boot backend on a server with an **HTTPS** address, for example `https://api.your-domain.in`.
- The backend's demo database (H2) lives in memory and is wiped on every restart. A real launch needs a real
  database (for example PostgreSQL or MySQL), plus MongoDB for the payment log.
- Set its environment variables: `AGRISCAN_JWT_SECRET` (a long random secret), payment keys, and
  `AGRISCAN_CORS_ALLOWED_ORIGINS`. If you set that variable, keep `https://localhost` and `capacitor://localhost` in
  it: those are the app's origins.

### b. Create the upload key (once, keep it safe forever)

Play Store builds must be signed with *your* key. Make one with the JDK's `keytool`:

```powershell
keytool -genkeypair -v -keystore agriscan-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias agriscan
```

- Store `agriscan-upload.jks` and its passwords in a password manager. **Never commit it to Git.**
- If it is ever lost, Google can reset the upload key (with Play App Signing), but that takes time, so keep backups.

### c. Let GitHub sign the release

Turn the keystore into text, then add four repository **secrets** (Settings → Secrets and variables → Actions →
Secrets):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("agriscan-upload.jks")) | Set-Content agriscan-upload.b64
```

| Secret | Value |
|---|---|
| `AGRISCAN_KEYSTORE_BASE64` | The contents of `agriscan-upload.b64` |
| `AGRISCAN_KEYSTORE_PASSWORD` | The keystore password |
| `AGRISCAN_KEY_ALIAS` | `agriscan` (the alias used above) |
| `AGRISCAN_KEY_PASSWORD` | The key password |

From then on, every push to `main` (or **Run workflow**) also produces the artifact **agriscan-release**, with
`app-release.aab` (for the Play Store) and a signed `app-release.apk` (for testers). The version number goes up
by itself with each run.

To sign on your own computer instead, set the same four values as environment variables, with
`AGRISCAN_KEYSTORE_FILE` (the path to the `.jks` file) in place of the base64 secret. Then run
`.\gradlew.bat bundleRelease -PversionCode=2 -PversionName=1.0.2` in `frontend\android`.

### d. In the Google Play Console

1. Create a developer account at [play.google.com/console](https://play.google.com/console) (one-time fee of
   US$25).
2. **Create app** → name *AgriScan*, app, free.
3. Fill in the **store listing**: short and full description, screenshots, a 512×512 icon (use
   `assets/icon-only.png`, resized) and a 1024×500 feature graphic.
4. Complete **App content**:
   - a **privacy policy URL** (required: the app uses the camera and the farmer's phone number)
   - the **Data safety** form (name and phone number, crop photos, payments handled by Stripe or Razorpay)
   - content rating and target audience
5. **Testing → Internal testing** → create a release → upload `app-release.aab` → add testers' email addresses.
   They get a Play Store link within minutes. This is the best way to send the app to testers once you have a
   developer account.
6. New **personal** developer accounts must run a **closed test with at least 12 testers for 14 days** before Google
   allows a production release. Company accounts are exempt.
7. **Production** → create a release with the same AAB (or a newer one) → send for review. The first review usually
   takes a few days.

Each new upload needs a higher version code. The GitHub workflow takes care of this.

---

## 7. Changing the icon or launch screen

The sources are the SVG files in `frontend/assets/`. After editing them:

1. Render each SVG to a PNG of the same name and size (1024×1024 for the icons, 2732×2732 for the splash screens).
   You can use Chrome's headless screenshot, Inkscape or Figma.
2. Regenerate every Android size:

```powershell
cd frontend
npx @capacitor/assets generate --android --iconBackgroundColor '#1B5E20' --iconBackgroundColorDark '#1B5E20' --splashBackgroundColor '#f7f9ff' --splashBackgroundColorDark '#10140f'
```

---

## 8. Commands at a glance

| What | Command (in `frontend`) |
|---|---|
| Website, for development | `npm run dev` → http://localhost:5173 |
| Build the app and copy it into `android/` | `npm run android:sync` |
| Open in Android Studio | `npm run android:open` |
| Debug APK from the terminal | `cd android; .\gradlew.bat assembleDebug` |
| Signed AAB for the Play Store | `cd android; .\gradlew.bat bundleRelease -PversionCode=N -PversionName=1.0.N` (with the signing variables set) |
