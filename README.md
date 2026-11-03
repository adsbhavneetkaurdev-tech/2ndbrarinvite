# Brar Mortgages – Interactive Invitation

A single-page, mobile-first gift-box invitation. Tap the wrapped box and the ribbon slides off, the lid lifts away, golden light glows, and the invitation card pops out.

Plain HTML/CSS/JS with no build step.

## Files

```
brar-invitation/
├── public/                     ← the website (deploy this folder)
│   ├── index.html              page markup + Open Graph tags
│   ├── styles.css              box, ribbon, bow, card, animation states
│   ├── script.js               open/replay sequence, calendar + maps links
│   ├── invitation.ics          calendar file (Apple / Outlook)
│   ├── og-image.png            1200×630 link-preview image (wrapped box)
│   ├── favicon.svg
│   ├── brar-mortgages-logo.png
│   └── morus-ai-logo.png
├── scripts/set-url.mjs         writes your live URL into the preview tags
├── netlify.toml                Netlify config (publish = public)
├── vercel.json                 Vercel config (outputDirectory = public)
└── package.json                `npm start` local server
```

## Run locally

```bash
npm start            # serves public/ on http://localhost:3000
# or, with no Node:
python3 -m http.server 3000 -d public
```

To test on your phone, open `http://<your-computer-IP>:3000` on the same Wi-Fi.

## Deploy

**Netlify (drag and drop):** go to app.netlify.com/drop and drop the `public` folder.
**Netlify (Git):** push this repo and import it. `netlify.toml` already sets `publish = "public"`.
**Vercel:** `npx vercel --prod` from this folder, or import the repo. `vercel.json` already sets the output folder.

### After the first deploy: set the link-preview URL

WhatsApp, iMessage and email previews need an absolute image URL. Once you know your site address:

```bash
npm run set-url -- https://your-site.netlify.app
```

Then redeploy. You can check the result with https://www.opengraph.xyz.
WhatsApp caches previews, so test with a fresh link (for example, add `?v=2`).

## Notes

- Event times are stored in UTC (6:00 PM MST = 01:00 UTC). The end time is assumed to be **10:00 PM**. Change `endUtc` in `script.js` and `DTEND` in `invitation.ics` if needed.
- Visitors with "reduce motion" turned on see a simple fade straight to the card.
- If a logo file is missing, the page shows styled text in its place.
