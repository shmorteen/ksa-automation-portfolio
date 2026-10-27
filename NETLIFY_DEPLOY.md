# Deploy KSA Automation with GitHub and Netlify

This is a static HTML/CSS/JavaScript site. `index.html` and `netlify.toml` are at the repository root. Netlify needs **no build command** and publishes `.`.

## 1. Publish the reviewed project to GitHub

The public repository [shmorteen/ksa-automation-portfolio](https://github.com/shmorteen/ksa-automation-portfolio) already exists. Use its `main` branch. Authenticate the GitHub CLI using your own browser:

```powershell
gh auth login -h github.com
gh auth status
```

Before the first push, inspect `git status`, `git diff --cached --stat`, and `git diff --cached` for secrets or unrelated files. Confirm the target repository still has no unrelated commits; never force push. After public publication is approved, push the reviewed commit:

```powershell
git push -u origin main
```

Do not paste GitHub or Netlify tokens into chat or repository files.

## 2. Connect the repository in Netlify

1. Sign in at [Netlify](https://app.netlify.com/) in your browser.
2. Choose **Add new project → Import an existing project** and select **GitHub**.
3. Complete the GitHub authorization in your browser and select `shmorteen/ksa-automation-portfolio`.
4. Set **Branch to deploy** to `main`, leave **Build command** blank, and set **Publish directory** to `.` (the repository root). `netlify.toml` provides the same publish setting.
5. Start the Git-connected deployment and open the assigned `*.netlify.app` URL.

Check navigation, Upwork and GitHub contact links, all four browser demos, JSON copy/download, the `demo-workflows/` documentation page, and phone layout on the deployed URL. The demos must remain labeled as fictional examples.

## 3. Publish future updates

Test a change locally, then commit and push it to `main`:

```powershell
git add .
git diff --cached
git commit -m "Update KSA Automation portfolio"
git push origin main
```

Once connected, Netlify automatically starts a production deployment for each push to `main`. Check the deploy log and live URL after each push. There is no separate manual site upload.

## Troubleshooting

- **404 or blank homepage:** confirm `index.html` is at repository root and publish directory is `.`.
- **Missing styles or scripts:** confirm `assets/` is in the pushed commit and paths in `index.html` are relative to the root.
- **Repository missing in Netlify:** review the GitHub authorization and repository access in Netlify.
- **Demo documentation 404:** confirm `demo-workflows/index.html` is in the pushed commit.
- **Push rejected:** inspect the remote `main` history and reconcile it with local changes. Do not force push or replace unrelated commits.
