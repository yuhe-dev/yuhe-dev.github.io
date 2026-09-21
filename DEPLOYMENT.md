# Personal homepage deployment

The public homepage is https://yuhe-dev.github.io/.

GitHub Pages publishes only `site/` using `.github/workflows/deploy-pages.yml`.
Repository Settings → Pages → Source must be **GitHub Actions**. No Jekyll or
Node build is required. The previous Jekyll source remains in the repository;
it is not included in the published artifact.

## Updating the homepage

Edit `site/index.html` and the referenced assets in `site/assets/`. Keep the
font license files alongside their fonts. When replacing the CV, also update
`site/files/cv.pdf` so the previous download URL stays current. The CV is
currently labeled as a review draft on the homepage and inside the PDF.

Preview with `python3 -m http.server 4180 --directory site`, check desktop and
mobile layouts and resource links, then commit and push to `main`. The
**Deploy personal homepage** workflow publishes the update automatically.
It can also be run manually from the Actions tab.

The initial static release comes from the reviewed local `homepage-notebook`
preview. Design notes, screenshots, verification output, and figure provenance
records are intentionally excluded. `/about/`, `/about.html`, and `#about-me`
remain compatible with the previous homepage.

## Rollback

For future static releases, revert the relevant site commit and push `main`.
The previous Jekyll version is available at commit
`e4778272d9138c627b10b7d5b5587c5a5b8f7dd8`. To restore its publishing method,
disable the static deployment workflow, select **Deploy from a branch** with
`main` and `/ (root)` in Pages settings, and trigger a Pages build.
