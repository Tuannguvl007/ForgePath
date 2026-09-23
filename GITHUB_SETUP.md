# Push ForgePath V4.0 to GitHub

Target repository: `Tuangnvu1007/ForgePath`

From PowerShell in this project folder:

```powershell
git init
git branch -M main
git remote add origin https://github.com/Tuangnvu1007/ForgePath.git
git add .
git commit -m "ForgePath V4.0 Web foundation"
git push -u origin main
```

If `origin` already exists, use:

```powershell
git remote set-url origin https://github.com/Tuangnvu1007/ForgePath.git
git push -u origin main
```

## Cloudflare Pages later

Use Git integration with the repository above.

- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist`

`dist/` is generated and intentionally ignored by Git.
