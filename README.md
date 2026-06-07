# Joel Van Der Werf — Chess Coach Website

Static site. No build step. Free on [Cloudflare Pages](https://pages.cloudflare.com/).

## Deploy to Cloudflare Pages

### Fastest: upload from the dashboard (no Git)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Zip this folder (or drag the folder contents in).
3. Name the project `joel-vanderwerf` → **Deploy**.
4. You get a URL like `https://joel-vanderwerf.pages.dev`.

### Recommended: Git + auto-deploy

1. Push this repo to GitHub:

```bash
git init
git add .
git commit -m "Initial site"
gh repo create joel-vanderwerf --public --source=. --push
```

(Or create a repo on GitHub manually and push.)

2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repo.
4. Build settings:
   - **Framework preset:** None
   - **Build command:** *(empty)*
   - **Build output directory:** `/`
5. **Save and Deploy**.

Every push to `main` redeploys automatically.

### CLI deploy (optional)

```bash
npx wrangler login
npx wrangler pages deploy . --project-name=joel-vanderwerf
```

### Custom domain

1. Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter `joelvanderwerf.com` (or your domain).
3. If the domain is already on Cloudflare, DNS is configured for you.

**Cost:** $0 on the free tier (unlimited static requests, SSL included).

## Before going live

- [ ] Replace `hello@joelvanderwerf.com` in `index.html` with Joel's real email
- [ ] Add Joel's photo (replace the placeholder in the hero)
- [ ] Swap placeholder games in `js/games-data.js` with real PGNs
- [ ] Submit the contact form once to activate [FormSubmit](https://formsubmit.co/) (check Joel's inbox for the confirmation link)

The contact form redirect (`?sent=1`) works on any URL automatically — no need to update it when you add a custom domain.

## Preview locally

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## File structure

```
index.html          Home page
games.html          Best games + interactive board
css/styles.css      Styles
css/games.css       Games page
js/main.js          Nav, form redirect, toast
js/board.js         Chess board
js/games-data.js    Game PGNs (edit this)
js/games.js         Game replay UI
favicon.svg
wrangler.toml       Optional CLI deploy config
```
