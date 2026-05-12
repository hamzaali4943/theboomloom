# BoomLoom — Play Store Deployment Status

**Last updated:** 2026-05-04
**Goal:** Submit BoomLoom to Google Play Store as a complete draft for client review and publishing.
**Account:** Hotskova (Lauren E Puchowski) — Play Console personal account

---

## Quick Status

| Phase | Status |
|---|---|
| Project setup (EAS, package, icons) | ✅ Complete |
| Build the production AAB | ✅ Complete |
| Prepare store listing assets (copy, graphic, screenshots) | ✅ Complete |
| Play Console: create app entry | 🛑 Blocked on client |
| Play Console: configure setup checklist | ⏳ Pending (after unblock) |
| Play Console: upload AAB and assets | ⏳ Pending (after unblock) |
| Play Console: save as draft | ⏳ Pending (final step) |

---

## ✅ Done — from our side

### 1. Project & EAS setup
- [x] Migrated EAS project from previous developer (mubeenmoosani) → lead's account `hamzaali4942-2`
  - New project ID: `ed95d18b-522c-4770-89a3-625928e8068f`
  - Old orphaned project under `mubeenmoosani` is unused, can be ignored
- [x] Changed app identifiers to brand-aligned names:
  - Android package: `com.theboomloom.app` (was `com.mubeenmoosani.theboomloom`)
  - iOS bundle ID: `com.theboomloom.app`
  - **Locked permanently once first AAB is uploaded — do not change**
- [x] Configured `eas.json` production profile to output AAB:
  - `production.android.buildType = "app-bundle"`
  - `autoIncrement = true` (EAS manages versionCode automatically)
- [x] Removed redundant `versionCode` from `app.json` (EAS now controls it via remote)

### 2. App assets (icons & branding)
- [x] Sourced the official BoomLoom logo as SVG → `assets/images/boomloom-logo-master.svg`
- [x] Generated all 6 required icons from the master SVG:
  - `icon.png` (1024×1024) — main app icon
  - `splash-icon.png` (1024×1024) — splash screen
  - `android-icon-foreground.png` (1024×1024) — adaptive icon foreground
  - `android-icon-background.png` (1024×1024) — adaptive icon background (white)
  - `android-icon-monochrome.png` (1024×1024) — Android 13+ themed icon
  - `favicon.png` (48×48) — web favicon
- [x] Updated `app.json` adaptive icon background color: `#E6F4FE` → `#FFFFFF`
- [x] Deleted leftover Expo/React template files (`react-logo*.png`, `partial-react-logo.png`)

### 3. Production build
- [x] Logged into EAS CLI as `hamzaali4942-2` (lead's account, `hamzaali4942@gmail.com`)
- [x] Generated fresh Android signing keystore (stored on EAS, owned by lead's account)
- [x] Ran `eas build --platform android --profile production` successfully
- [x] Downloaded the AAB to local machine
- [x] AAB is also stored on EAS cloud: https://expo.dev/accounts/hamzaali4942-2/projects/theboomloom/builds

### 4. Store listing copy
- [x] Drafted all Play Store listing text in [play-store-listing.md](./play-store-listing.md):
  - App name: `BoomLoom`
  - Short description (80 chars)
  - Full description (~1100 chars, well under 4000 limit)
  - Category: Art & Design
  - Tags: weaving, textile design, pattern design, fiber arts, loom
  - Content rating questionnaire answers (all "No" → result: Everyone)
  - Data safety form answers (we collect nothing)
  - All Play Console declarations (Ads, News, COVID, Government, Health, Financial — all "No")
  - Release notes for v1.0.0
  - Handover email template for client

### 5. Marketing assets
- [x] Feature graphic (1024×500 PNG) → `assets/images/playstore_deployement/boomloom_banner.png`
  - White background, logo + wordmark + tagline "Design weaving patterns"
  - Decorative krokbragd-inspired bands top and bottom
- [x] Phone screenshots (5 PNG files, properly named in publish order) → `assets/images/playstore_deployement/`
  - `01-krokbragd-pattern.png` — multicolor krokbragd pattern (star shot)
  - `02-monks-belt.png` — monk's belt with warp tab
  - `03-home.png` — home screen with welcome banner
  - `04-color-picker.png` — color palette modal
  - `05-saved-designs.png` — 3 saved designs across patterns

### 6. Play Console access
- [x] Logged into Hotskova Play Console as authorized user
- [x] Confirmed Lauren E Puchowski is the account owner
- [x] Confirmed Android Developer Verification (Sept 2026 requirement) is **not** blocking today

---

## 🛑 Blocked on client — 3 items

These three are the **only things** stopping us from completing the draft. Already messaged to the client; awaiting response.

### Item 1 — Create app entry & accept Play App Signing ToS  *(CRITICAL, 5 min)*
**What's needed:** Lauren (account owner) must personally accept Google's Play App Signing Terms of Service when creating the new app. This is a one-time legal step that only the account owner can do — even with admin access, we cannot accept legal agreements on her behalf.

**What client needs to do:**
1. Open https://play.google.com/console
2. Click the blue **Create app** button on the home screen
3. Fill these exact values:
   - App name: `BoomLoom`
   - Package name: `com.theboomloom.app` (must be exact, locked permanently)
   - Default language: English (United States) – en-US
   - App or game: App
   - Free or paid: Free
4. In the Declarations section, tick **all three** boxes (including "Accept the Play App Signing Terms of Service")
5. Click **Create app**
6. Reply to confirm — we take over for everything else

**Why this is non-negotiable:**
- The AAB format requires Play App Signing
- Without this acceptance, the AAB upload will be rejected with a signature error
- Without the app entry existing, we cannot configure anything else

### Item 2 — Privacy policy URL on theboomloom.com  *(blocks final submission)*
**What's needed:** A privacy policy page hosted at a URL like `theboomloom.com/privacy`. Google requires this URL on the developer's own domain.

**What client needs to do:**
1. Ask whoever maintains theboomloom.com (Squarespace/Wix/etc.) to add a new page at `/privacy`
2. Paste in the privacy policy text we provided (already drafted, sent in earlier message)
3. Share the live URL with us

**Estimated time:** 10–15 min for client's web maintainer.

**Why it's a blocker:** Play Console will not accept the listing as a complete draft without this URL on file. The URL gets verified during Google review.

### Item 3 — Contact email for store listing  *(blocks final submission)*
**What's needed:** The email address Lauren wants displayed publicly on the Play Store listing for user contact.

**What client needs to do:** Reply with one of:
- The email that receives messages from theboomloom.com/contact form
- A role-based address like `info@theboomloom.com` or `hello@theboomloom.com`
- Any other preferred contact email

**Estimated time:** 1 min — just a reply.

**Why it's a blocker:** Play Store requires a publicly visible email in the store listing's Contact details section.

---

## 🔧 Left — from our side (after client unblocks us)

These all become unblocked the moment Lauren completes Item 1 (creating the app entry). Items 2 and 3 only block the final "Save as draft" action.

### After Item 1 is done — ~50 min of work

1. **Complete the "Set up your app" checklist** (~30 min)
   - App access → Unrestricted
   - Ads → No
   - Content rating questionnaire → all "No" → Everyone rating
   - Target audience → 13+
   - News apps → No
   - COVID-19 contact tracing → No
   - Data safety form → We collect nothing
   - Government apps → No
   - Health → No
   - Financial features → No
   - App category → Art & Design

2. **Fill in Main store listing** (~15 min)
   - App name, short description, full description (from play-store-listing.md)
   - Upload app icon (resize from 1024 to 512 first)
   - Upload feature graphic (`boomloom_banner.png`)
   - Upload 5 screenshots in order (01–05)
   - Set tags

3. **Create Internal testing release** (~10 min)
   - Upload the AAB to Internal testing track
   - Add release notes
   - Verify Play App Signing handles the signing correctly
   - Add yourself or lead as a test user (optional, for one final smoke test)

### After Items 2 & 3 are done — ~3 min of final work

4. **Paste in privacy policy URL** (1 min)
5. **Paste in contact email** (1 min)
6. **Verify dashboard checklist is fully green** (1 min)
7. **Save as draft** (do NOT click "Start rollout" — that publishes)
8. **Send handover email to client** (template ready in play-store-listing.md, section 17)

---

## Optional but recommended — before final submission

These don't block the draft but are worth doing for quality assurance:

- [ ] **Test the AAB on a real Android device** before submitting (run `eas build --platform android --profile preview` to get an installable APK, install on phone, smoke test all 5 screens)
- [ ] **Have the lead review** the store listing copy and screenshots before submitting
- [ ] **Share preview APK with client** so they can test the app on their own phone before publishing

---

## Critical-path summary

```
[Client does Item 1] ─── 5 min ───┐
                                  │
                                  ▼
[We do checklist + listing + AAB upload] ─── ~50 min ───┐
                                                        │
                                                        ▼
[Client provides Items 2 & 3] ─── 10–15 min ───────────┐│
                                                       ││
                                                       ▼▼
[We paste in URL + email, save as draft] ─── 3 min ───►[Draft ready]
                                                              │
                                                              ▼
                                                    [Client reviews
                                                     and publishes]
```

**Best case:** If Lauren replies today with Items 1, 2, 3 all in one go → draft ready within **~1 hour** of her reply.

**Realistic case:** Item 1 first (5 min), then we do 50 min of config, then wait for Items 2/3 (a few days), then 3 min finalisation → draft ready within **2–5 days**.

---

## Files reference

- **Source listing copy:** [play-store-listing.md](./play-store-listing.md)
- **Master logo:** `assets/images/boomloom-logo-master.svg`
- **App icons:** `assets/images/icon.png`, `splash-icon.png`, `android-icon-*.png`, `favicon.png`
- **Feature graphic:** `assets/images/playstore_deployement/boomloom_banner.png`
- **Screenshots:** `assets/images/playstore_deployement/01-*.png` through `05-*.png`
- **EAS config:** `eas.json`
- **App config:** `app.json`
- **AAB build:** stored locally + at https://expo.dev/accounts/hamzaali4942-2/projects/theboomloom/builds
