# dogo-site

The **built** Cynect web app, published to GitHub Pages. The domain it
serves is whatever `CNAME` in this repo says — read that file, do not
trust a domain written in prose here.

This repository holds compiled output only — no source code. It is public
because everything in it is served to every visitor of the website anyway;
the app's source stays private in `Dogo-platforms/Dogo`.

The repository is still named `dogo-site` and the brand is Cynect. Renaming
it needs the GitHub org owner and a look at the Pages settings afterwards,
so it was left alone deliberately rather than forgotten.

## Why this exists

The domain used to be hosted by the legacy BaaS. When the app moved off it
the backend went to Supabase, but nothing took over the *hosting* job, so
the domain kept pointing at a service that no longer claimed it. The result
was `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` — no certificate, because no
server recognised the hostname. This repo is the replacement host.

Supabase cannot do this job: it is the database, auth and storage backend,
not a static web host. It is already connected and working, and none of it
depends on this domain.

## What is served

| Path                        | What                                              |
|-----------------------------|---------------------------------------------------|
| `/`                         | the app (SPA)                                     |
| `/support.html`             | support page — App Store Connect **Support URL**  |
| `/privacy.html`             | privacy policy — App Store Connect **Privacy URL**|
| `/terms.html`               | terms of use                                      |
| `/third-party-notices.txt`  | third-party licence notices, linked from Settings |
| `/404.html`                 | copy of the app shell, so deep links reach the router |

`privacy.html` and `terms.html` are generated from `src/lib/legalContent/*`
in the app repo by `tools/build-landing.mjs`, so the published policy cannot
drift from the one users agreed to in the app.

`third-party-notices.txt` has a twin at `public/third-party-notices.txt` in
the app repo — that copy is what ships inside the iOS bundle, this one is
what the web app serves. They drifted once during the rebrand, with the app
copy already saying Cynect while this one still said the old name. Change
both or neither.

## Deploying an update

From the app checkout:

    npm run build -- --outDir dist_site
    node tools/build-landing.mjs /tmp/cynect_landing
    # then copy the landing pages in, drop business-plan.html, and sync here

**Never commit `public/business-plan.html`.** It is a confidential document
that lives in the app's `public/` folder and is therefore copied into every
build. It must be removed from the output before publishing.

Pushing to `main` here publishes to production immediately. There is no
staging step.
