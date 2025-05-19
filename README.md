# playwright-firefox-headed-bug
Simple reproduce repo for Firefox --headless flag bug in Playwright.

# Setup

Basic Playwright-TS setup:

```
npm install
npx playwright install
```

# Reproducing

You should expect a difference when you run these two commands:

```shell
npx playwright test --headed
npx playwright test # Headless mode
```

The test `[firefox] › tests/file-paste.test.ts:9:5 › File paste` should fail
