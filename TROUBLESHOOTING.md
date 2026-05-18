# Troubleshooting — Ustaad360 (Expo SDK 51)

> This project is pinned to **Expo SDK 51** and will not be upgraded during the hackathon.
> Follow the steps below if you hit common setup issues.

---

## 1. ❌ Expo Go says "SDK mismatch" (installed SDK 54, project uses SDK 51)

**Error message:**
```
The installed version of Expo Go is for SDK 54.
The project you opened uses SDK 51.
```

**Fix:**
Uninstall your current Expo Go app and install the SDK 51-compatible version directly:

👉 **[Install Expo Go for SDK 51 (Android)](https://expo.dev/go?sdkVersion=51&platform=android&device=true)**

Steps:
1. On your Android phone, open the link above
2. Download and install the APK (you may need to enable "Install from unknown sources")
3. Open Expo Go → Scan the QR code shown in your terminal
4. The app will load correctly on SDK 51

> ⚠️ Do NOT update Expo Go from the Play Store — it will install SDK 54 again.

---

## 2. ❌ `adb` is not recognized / Android SDK path not found

**Error message:**
```
Failed to resolve the Android SDK path.
Default install location not found: C:\Users\...\AppData\Local\Android\Sdk
Error: 'adb' is not recognized as an internal or external command
```

**This happens when Android Studio is not installed or not configured.**

**Option A — Use real phone QR scan (recommended for hackathon):**
1. Run `npx expo start --port 8083`
2. Scan the QR code shown in terminal with the SDK 51 Expo Go app
3. No Android Studio needed ✅

**Option B — Install Android Studio later (optional):**
1. Download [Android Studio](https://developer.android.com/studio)
2. Install the Android SDK via SDK Manager
3. Set the environment variable:
   ```powershell
   [System.Environment]::SetEnvironmentVariable("ANDROID_HOME","C:\Users\YourName\AppData\Local\Android\Sdk","User")
   ```
4. Add to PATH:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   ```
5. Restart terminal, then run `adb devices` to verify

---

## 3. ⚠️ Do NOT press `a` unless Android SDK is configured

When you run `npx expo start`, you will see:
```
› Press a │ open Android
```

**Do NOT press `a`** unless you have Android Studio + SDK installed and an emulator running.
Pressing `a` without Android SDK configured will throw the `adb not recognized` error.

**Use QR scan instead** — it works without any Android SDK setup.

---

## 4. 🔌 Port already in use

**Error:**
```
Port 8081 is being used by another process
```

**Fix — use a different port:**
```bash
npx expo start --port 8083
# or
npx expo start --port 8084
```

To kill the process on a specific port:
```bash
npx kill-port 8081
```

---

## 5. ✅ Confirmed Working Setup

| Tool | Version | Status |
|---|---|---|
| Expo SDK | 51.0.28 | ✅ Pinned |
| React Native | 0.74.5 | ✅ |
| Node.js | 18+ | ✅ Required |
| npm | 9+ | ✅ |
| Expo Go | SDK 51 APK | ✅ Use direct link above |
| Android Studio | Optional | ⚠️ Only for emulator |

---

## Quick Start (no Android Studio needed)

```bash
# 1. Install dependencies
npm install

# 2. Start Metro on a free port
npx expo start --port 8083

# 3. Scan QR code with Expo Go (SDK 51 APK from expo.dev/go?sdkVersion=51...)
# App loads on your phone ✅
```
