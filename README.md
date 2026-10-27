# KSA Automation — Portfolio Website

A static portfolio for Abdulmateen Abimbola / KSA Automation. The site uses HTML, CSS, and browser JavaScript, with no npm dependencies or build step. It presents selected projects and four interactive **concept demos** using fictional data. The demos are not client deliveries and do not connect to live services.

## Project layout

- `index.html` — portfolio and interactive demos
- `assets/` — styles, JavaScript, favicon, and social preview artwork
- `demo-workflows/` — demo documentation, Python reference code, fictional CSV samples, and tests
- `netlify.toml` — Netlify publish directory (`.`), which is the repository root containing `index.html`
- `NETLIFY_DEPLOY.md` — deployment checklist and troubleshooting

## Preview and test locally

From the repository root:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000/` and check the homepage, menu, contact links, four playground demos, and `demo-workflows/` page at desktop and mobile widths. To run the Python reference tests:

```powershell
python -m unittest discover -s demo-workflows/tests -v
```

To check browser JavaScript syntax with Node.js:

```powershell
Get-Content assets/main.js -Raw | node --check
```

Python 3 is only needed for the reference scripts and local preview. Google Fonts load from the web, with system font fallbacks when offline. The website itself requires no API keys, environment variables, framework, or package installation.

## GitHub and Netlify continuous deployment

The production source is the public [shmorteen/ksa-automation-portfolio](https://github.com/shmorteen/ksa-automation-portfolio) repository on `main`. A repository already exists; do not create a second repository or force push. Before the first push, inspect the exact staged files for credentials and unrelated artifacts.

1. Authenticate the GitHub CLI in your own browser with `gh auth login -h github.com`, then confirm `gh auth status` shows `shmorteen`.
2. Push the reviewed local `main` commit to `origin` after approving public publication.
3. In [Netlify](https://app.netlify.com/), choose **Add new project → Import an existing project → GitHub**. Complete GitHub authorization in your browser and select `shmorteen/ksa-automation-portfolio`.
4. Set production branch to `main`, leave **Build command** blank, and set **Publish directory** to `.`. `netlify.toml` also specifies the publish directory. Start the Git-connected deployment.
5. Check the generated `*.netlify.app` URL on desktop and mobile, including the demo documentation page and all four browser demos.

After the repository is linked, each successful push to `main` triggers a new Netlify production deployment. Preview and test changes locally, commit them, then run `git push origin main`. No manual drag-and-drop deployment is needed. See [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md) for the full checklist.

## Demo scope and source

The Automation Playground provides lead qualification, contact CSV cleanup, order and stock exception checks, and sales reporting. Each runs locally in the visitor's browser, validates sample input, produces JSON, and can export that JSON. Matching Python reference scripts and tests live under `demo-workflows/`. None of these demos sends data to a CRM, store, email service, payment system, or scheduler.

The site does not claim client results from these concepts. The Catastro ETL and Property Viewer cards link to public GitHub repositories; the other selected work is described without linking private code.

## Contact and content maintenance

The contact button currently points to Abdulmateen's Upwork profile. Add a different contact channel only after verifying its URL and deciding to make it public. Do not commit credentials, client data, `.env` files, or `.netlify` state. `GITHUB_PROFILE_README.md` is an optional template for a separate GitHub profile repository and is not used by Netlify.

The SVG social preview may not render on every social network. If a custom domain is added, update the canonical and Open Graph URLs to absolute production URLs.
