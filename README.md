# dogo-site

The **built** Dogo web app, published to GitHub Pages at https://dogo-il.com

This repository holds compiled output only — no source code. It is public
because everything in it is served to every visitor of the website anyway;
the app's source stays private in `albenda/Dogo`.

## Why this exists

`dogo-il.com` used to be hosted by Base44. When Dogo moved off Base44 the
backend went to Supabase, but nothing took over the *hosting* job, so the
domain kept pointing at a Render service that no longer claimed it. The
result was `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` — no certificate, because
no server recognised the hostname. This repo is the replacement host.

Supabase cannot do this job: it is the database, auth and storage backend,
not a static web host. It is already connected and working, and none of it
depends on this domain.

## What is served

| Path             | What                                              |
|------------------|---------------------------------------------------|
| `/`              | the app (SPA)                                     |
| `/support.html`  | support page — App Store Connect **Support URL**  |
| `/privacy.html`  | privacy policy — App Store Connect **Privacy URL**|
| `/terms.html`    | terms of use                                      |
| `/offline.html`  | offline fallback served by the service worker     |
| `/404.html`      | copy of the app shell, so deep links reach the router |

`privacy.html` and `terms.html` are generated from `src/lib/legalContent/*`
in the app repo by `tools/build-landing.mjs`, so the published policy cannot
drift from the one users agreed to in the app.

## Deploying an update

From the app checkout:

    npm run build -- --outDir dist_site
    node tools/build-landing.mjs /tmp/dogo_landing
    # then copy the landing pages in, drop business-plan.html, and sync here

**Never commit `public/business-plan.html`.** It is a confidential document
that lives in the app's `public/` folder and is therefore copied into every
build. It must be removed from the output before publishing.
