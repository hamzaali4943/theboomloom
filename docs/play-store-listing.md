# BoomLoom — Google Play Store Listing

This document contains every value to enter in Google Play Console when
creating the BoomLoom listing. Each section maps to a specific Play Console
form. Copy-paste the values directly.

**Status:**
- ⚠️ Items marked `[TO BE PROVIDED BY CLIENT]` are blocked until the client responds.
- All other fields are ready to submit.

---

## 1. App details (Create app dialog)

| Field | Value |
|---|---|
| App name | `BoomLoom` |
| Default language | `English (United States) – en-US` |
| App or game | App |
| Free or paid | Free |
| Declarations | ✅ Tick "Developer Program Policies" + ✅ Tick "US export laws" |

---

## 2. Main store listing

### App name
```
BoomLoom
```
*(8 characters, well under the 30-char limit)*

### Short description (max 80 characters)
```
Design weaving patterns. Visualize krokbragd, monk's belt and twill in real time.
```
*(80 characters)*

### Full description (max 4000 characters)
```
BoomLoom brings the pattern-picker tools from theboomloom.com to your phone — so you can design weaving patterns anywhere, anytime.

DESIGN AND VISUALIZE
• Krokbragd — bold geometric three-shaft Scandinavian weaving
• Monk's Belt — classic overshot patterns
• Plain Twill — foundational diagonal weaves

REAL-TIME PREVIEW
Adjust threading, treadling, and color sequences and see your design rendered instantly on a high-performance canvas. Tweak colors and shaft selections and watch the pattern update as you go.

SAVE YOUR FAVOURITE DESIGNS
Save designs locally on your device and revisit them whenever inspiration strikes. Your saved patterns stay private and never leave your phone.

PRIVACY-FIRST
BoomLoom does not collect, transmit, or share any personal data. Everything stays on your device.

PERFECT FOR
• Hand-weavers planning their next warp
• Fiber-arts students learning pattern theory
• Textile designers experimenting with colorways
• Anyone curious about traditional Scandinavian and overshot weaving

BoomLoom is a companion app to theboomloom.com — visit our website for looms, instructional videos, and more pattern-picker tools.
```
*(~1100 characters, well under 4000)*

### Category
```
Art & Design
```
*Alternatives: Education, Lifestyle. Art & Design fits best.*

### Tags (up to 5, optional but improves discoverability)
- `weaving`
- `textile design`
- `pattern design`
- `fiber arts`
- `loom`

### Store listing contact details
| Field | Value |
|---|---|
| Email | `[TO BE PROVIDED BY CLIENT]` |
| Phone | *(leave blank)* |
| Website | `https://www.theboomloom.com` |
| External marketing | `https://www.theboomloom.com/contact` |

### Privacy policy URL
```
[TO BE PROVIDED BY CLIENT — once /privacy is live on theboomloom.com]
```

---

## 3. Graphic assets

| Asset | Spec | Source file |
|---|---|---|
| App icon | 512×512 PNG, no transparency | Export from `assets/images/icon.png` (currently 1024×1024 — resize to 512) |
| Feature graphic | 1024×500 PNG | **TODO — create separately** |
| Phone screenshots | 1080×1920 portrait, 2–8 images | **TODO — capture from running app** |
| Tablet screenshots (7" + 10") | Optional, 1200×1920 | Skip for now |

---

## 4. Content rating questionnaire

Open the questionnaire (Policy → App content → Content rating). Answer:

| Question | Answer |
|---|---|
| Email address | `[TO BE PROVIDED BY CLIENT]` |
| Category | **Reference, News, or Educational** |
| Violence | No to all |
| Sexuality | No to all |
| Language | No to all |
| Controlled substances | No to all |
| Gambling | No to all |
| User-generated content | No (designs stay on-device only) |
| Sharing user location | No |
| Personal information | No |
| Sharing user-to-user | No |
| Digital purchases | No |
| Unrestricted internet | No (no web browser inside the app) |
| Prizes/contests | No |
| Real-money gambling | No |
| Social features | No |

**Expected rating result: Everyone (PEGI 3 / ESRB E)**

---

## 5. Target audience and content

| Question | Answer |
|---|---|
| Target age groups | `13+` (safest for a design tool — avoids stricter under-13 rules) |
| Stores or accesses personal info from children? | No |
| Does the app appeal to children? | No |
| Ads targeted to children? | No |

---

## 6. App access

```
○ All functionality is available without restrictions  ← SELECT THIS
○ All or some functionality is restricted (login required, etc.)
```

**Why:** BoomLoom has no login, paywall, or restricted features. Everything is free and open.

---

## 7. Ads declaration

```
○ Yes, my app contains ads
● No, my app does not contain ads  ← SELECT THIS
```

**Why:** BoomLoom contains zero ad SDKs.

---

## 8. Data safety form

This is the most detailed form. Here are the answers section by section.

### Data collection and security
| Question | Answer | Reason |
|---|---|---|
| Does your app collect or share any of the required user data types? | **No** | App stores nothing on servers. AsyncStorage is on-device only. |
| Is all user data encrypted in transit? | N/A (collect nothing) | |
| Do you provide a way for users to request that their data is deleted? | **Yes** | Users can delete saved designs in-app via the Saved Designs screen. |

### Data types (skip — answered "No" above)
Not applicable — we don't collect any data.

### Data usage and handling
Not applicable.

### Security practices
| Question | Answer |
|---|---|
| Data is encrypted in transit | N/A |
| Users can request data deletion | Yes |
| Committed to Play Families Policy | No (we do not specifically target children) |
| Independent security review | No |

---

## 9. News app declaration

```
○ My app is a news app
● My app is not a news app  ← SELECT THIS
```

---

## 10. COVID-19 contact tracing/status apps declaration

```
● My app is not a publicly available COVID-19 app  ← SELECT THIS
```

---

## 11. Government apps declaration

```
○ My app is owned by or developed on behalf of a government
● My app is not owned by or developed on behalf of a government  ← SELECT THIS
```

---

## 12. Health apps declaration

```
● My app is not a health app  ← SELECT THIS
```

---

## 13. Financial features declaration

```
● My app does not provide any financial features  ← SELECT THIS
```

---

## 14. App category and tags

| Field | Value |
|---|---|
| App category | `Art & Design` |
| Tags | `weaving`, `textile design`, `pattern design`, `fiber arts`, `loom` |

---

## 15. Release notes (for version 1.0.0)

When creating the first release, paste this in the Release notes box:

```xml
<en-US>
First release of BoomLoom — design weaving patterns on the go.

• Krokbragd, Monk's Belt, and Plain Twill pattern designers
• Real-time pattern preview with live color and threading updates
• Save and revisit your favourite designs
• Companion app to theboomloom.com
</en-US>
```

---

## 16. Pre-flight checklist before clicking "Save as draft"

Before saving the listing as a draft, every box below should be ticked:

- [ ] App name filled
- [ ] Short description filled
- [ ] Full description filled
- [ ] App icon (512×512) uploaded
- [ ] Feature graphic (1024×500) uploaded
- [ ] At least 2 phone screenshots uploaded
- [ ] Category set to Art & Design
- [ ] Contact email filled — **[BLOCKED on client]**
- [ ] Website filled
- [ ] **Privacy policy URL filled** — **[BLOCKED on client]**
- [ ] Content rating questionnaire completed → "Everyone"
- [ ] Target audience: 13+
- [ ] App access: Unrestricted
- [ ] Ads: No
- [ ] Data safety form completed
- [ ] News/COVID/government/health/financial: all "No"
- [ ] AAB uploaded to Internal testing release
- [ ] Release notes added
- [ ] Save draft (do NOT click "Start rollout")

---

## 17. After saving as draft — handover to client

Email template to client once draft is ready:

```
Subject: BoomLoom App — Ready in Play Console for your Review

Hi [Client],

The BoomLoom app is now set up in your Google Play Console as a draft,
ready for you to review and publish.

To preview the app:
1. Open Play Console (https://play.google.com/console)
2. Click on "BoomLoom"
3. Go to "Internal testing" → click the latest release → "Review release"
4. (Optional) Add yourself as an internal tester to install on your phone

To publish:
1. From the same Internal testing screen, click "Start rollout to Internal testing"
   — OR —
   To publish directly to production, go to "Production" → review → start rollout

Google review usually takes 1–7 days for first submissions. You'll get an
email when it's live on the Play Store.

Everything is filled in: store listing, screenshots, descriptions, content
rating, data safety, privacy policy URL. Let us know if you'd like changes
before publishing.

Best,

