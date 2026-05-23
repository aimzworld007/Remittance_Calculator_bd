# Remittance Calculator BD (Material UI)

A bilingual remittance calculator built with React + Material UI.
It calculates BDT payout with Bangladesh's 2.5% incentive in both forward and reverse modes.

## Stack

- React (Vite)
- Material UI (MUI)
- Emotion (MUI styling)

## Features

- Send mode: foreign currency to BDT with fee and incentive
- Reverse mode: target BDT to required foreign currency
- Bilingual UI: Bangla / English
- Dark and light theme toggle
- Preset Gulf/US/UK currencies + custom currency mode

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Vercel Deployment Setup

This repo is preconfigured for Vercel using [vercel.json](/vercel.json):

- `framework`: `vite`
- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- SPA fallback rewrite to `/`

### Deploy via GitHub

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Vercel will detect `vercel.json` and use the configured build/output settings.
4. Click **Deploy**.

### Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## Author

Ainul Islam
