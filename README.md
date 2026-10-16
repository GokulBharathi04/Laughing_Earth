# Laughing Earth

A static, GitHub Pages-ready website prototype for a landscape and stone studio, with a gifts and seed-ball enquiry path. There is no build step; HTML, CSS and JavaScript modules are served directly.

**Stack:** three.js for the real-time paving and seed-ball hero, Motion (motion.dev) for entrance and scroll-linked animation, and Lenis for smooth scrolling. Libraries and Google Fonts load from CDNs, so a network connection is needed for those enhancements. The page content remains readable if the modules do not load.

## Run locally

From this directory, run `python3 -m http.server 8000` and open `http://localhost:8000`. ES modules need an HTTP server rather than `file://`.

## Publish on GitHub Pages

Push the repository to GitHub, then choose **Settings > Pages > Build and deployment > GitHub Actions**. The included `.github/workflows/pages.yml` deploys the static site on pushes to `main` and on manual dispatch.

## Before publishing

- Replace the placeholder phone, WhatsApp number, email, address, hours, testimonials and statistics in `index.html` and the JSON-LD. Search for `placeholder` and `00000` to find them.
- The enquiry form opens the visitor’s email application; it does not submit to a server. Replace `hello@laughingearth.example` in `index.html` and `main.js` with the real enquiry address.
- Add an owned, compressed looping video at `assets/hero.mp4` and its poster at `assets/hero.jpg`. The page has a photo and gradient fallback when those optional files are absent.
- The stone and gallery photographs currently use optimized Unsplash image URLs as visual placeholders. Replace them with approved project photography before launch.
- Update the page title, description, social metadata and business details to match the final studio information.

## Files

- `index.html` contains the page sections, responsive styles, metadata and LocalBusiness JSON-LD.
- `main.js` contains navigation, motion, 3D, carousel, lightbox and mailto-form behavior.
- `.github/workflows/pages.yml` publishes the repository to GitHub Pages.
- `assets/` is the location for the optional hero video and poster.
