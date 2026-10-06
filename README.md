# WAGORA website

Static marketing + support site for the WAGORA app. No build step: Vercel serves the folder as-is.

| Page | File | URL |
|---|---|---|
| Home | `index.html` | `/` |
| Support Centre (search, guides, contact form) | `support.html` | `/support` |
| Privacy Policy | `privacy.html` | `/privacy` |
| Terms of Use | `terms.html` | `/terms` |
| Delete your account (Play Console "account deletion" URL) | `delete-account.html` | `/delete-account` |

Shared code: `assets/styles.css`, `assets/main.js`, images in `assets/img/`.

## Deploy
Import the repo in Vercel (framework: **Other**, no build command, output = root). `vercel.json` sets clean URLs, caching and security headers.

## Things to set before going live
- **Domain.** Pages use `https://wagorawebsite.vercel.app` in canonical/OG/sitemap. If your Vercel URL differs, find & replace it in `*.html`, `sitemap.xml`, `robots.txt`.
- **Emails.** `wagora.support@gmail.com` appears in the HTML and in `assets/main.js` (`SUPPORT_EMAIL`, `PRIVACY_EMAIL`). Make sure the mailboxes exist, or replace them.
- **Contact form.** With `SUPPORT_ENDPOINT = ''` in `assets/main.js` the form opens the visitor's email app with the message pre-filled. Put a JSON endpoint there later to send from the page instead.
- **Play Store link.** `https://play.google.com/store/apps/details?id=com.wagora.app` goes live once the app is published.
- **Legal text.** `privacy.html` / `terms.html` mirror `Wagora_Backend/api/legal/*.md`. Keep them in sync, and bump "Last updated".
