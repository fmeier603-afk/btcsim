# Cosmic Hash - Bitcoin Brute-Force Benchmark App (Android & Web)

Demonstriert die rechnerische und physikalische Unmöglichkeit von Bitcoin-Brute-Force-Angriffen ($2^{256}$ Zahlenraum) im Vergleich zum Volumen des bekannten Universums und der Anzahl der Atome im Kosmos.

---

## 📱 Automatische Android APK Erstellung via GitHub Actions

Dieses Repository enthält bereits einen vollautomatischen GitHub Actions Workflow (`.github/workflows/build-apk.yml`), der ohne die lokale Installation von Android Studio eine fertige `.apk` Datei für dein Smartphone baut!

### So baust und lädst du die APK herunter:

1. **Repository auf GitHub hochladen / forken**.
2. Klicke oben auf den Reiter **Actions**.
3. Wähle links den Workflow **Build Android APK** aus.
4. Klicke auf **Run workflow** (oder mache einfach einen `git push`).
5. Nach ca. 2–3 Minuten ist der Build fertig (grünes Häkchen).
6. Klicke auf den erfolgreichen Durchlauf. Unter **Artifacts** kannst du die Datei **`CosmicHash-Android-Debug-APK`** herunterladen.
7. Entpacke die ZIP-Datei und installiere die darin enthaltene `app-debug.apk` direkt auf deinem Android-Smartphone!

---

## 🛠️ Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktion Build erstellen
npm run build
```

---

## 🚀 Lokaler Android Studio Build (Alternative)

```bash
# Capacitor initialisieren (falls noch nicht geschehen)
npx cap add android

# Änderungen synchronisieren
npx cap sync android

# In Android Studio öffnen
npx cap open android
```
In Android Studio: Menü **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
