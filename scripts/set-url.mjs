// Usage: node scripts/set-url.mjs https://your-site.netlify.app
// Writes your real site URL into the Open Graph tags (needed for WhatsApp/iMessage previews).
import { readFileSync, writeFileSync } from "node:fs";
const url = (process.argv[2] || "").replace(/\/+$/, "");
if (!/^https?:\/\//.test(url)) { console.error("Pass your full site URL, e.g. https://brar-invite.netlify.app"); process.exit(1); }
const file = new URL("../public/index.html", import.meta.url);
const html = readFileSync(file, "utf8");
const out = html.replace(/(content=")(?:SITE_URL|https?:\/\/[^"]*?)(\/(?:og-image\.png)?")/g, `$1${url}$2`);
writeFileSync(file, out);
console.log("Open Graph URLs set to", url);
