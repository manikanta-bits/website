# Morrow Software

A responsive, dependency-free company website for a software development studio.

## Run locally

Python 3 is sufficient; no package installation or build step is required.

```powershell
python -m http.server 8000
```

Open <http://localhost:8000>.

## Before publishing

- Replace the draft company name and copy with your company's details. The contact address is `machkurimanikanta53@gmail.com`.
- The inquiry form sends submissions to FormSubmit for delivery to `machkurimanikanta53@gmail.com`. FormSubmit requires the recipient to confirm its activation email after the first real submission. Submitted names, email addresses, and messages are processed by FormSubmit.
- The hero photograph is served from Unsplash; the Google Fonts link is optional and falls back to local fonts.

## Publish on GitHub Pages

The workflow in `.github/workflows/pages.yml` deploys this static site whenever changes are pushed to `main`.

1. This project is in [manikanta-bits/website](https://github.com/manikanta-bits/website).
2. To publish or update it from this folder, commit and push changes to `main`:

	```powershell
	git add .
	git commit -m "Update company website"
	git push -u origin main
	```

3. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source if it is not already selected.
4. The workflow deploys every push to `main`. The expected Pages address is <https://manikanta-bits.github.io/website/> once the first deployment succeeds.