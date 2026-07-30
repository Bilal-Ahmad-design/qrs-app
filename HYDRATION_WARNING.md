# Hydration Mismatch Warning (Browser Extensions)

## What You're Seeing

In development mode, you may see console warnings like:

```
A tree hydrated but some attributes of the server rendered HTML didn't match 
the client properties. This won't be patched up.
```

With a diff showing:
```
- cz-shortcut-listen="true"
```

## Why This Happens

Browser extensions (like shortcut/productivity tools, accessibility helpers, etc.) inject attributes into the HTML **after the page loads but before React hydrates**. This causes a mismatch between what was rendered on the server and what React sees on the client.

## Is This a Problem?

**No.** This is:

- ✅ **Harmless** — The app functions correctly
- ✅ **Expected** — Happens only in development with extensions
- ✅ **Suppressed** — We have `suppressHydrationWarning` on the `<body>` tag
- ✅ **Production safe** — Won't appear in production (extensions don't run there)

## Root Cause

The extension `cz-shortcut-listen` (or similar) is adding attributes to the DOM before React hydrates, creating a perceived mismatch.

## Solution

**No action needed.** The `suppressHydrationWarning` attribute in `app/(frontend)/layout.tsx` tells React to ignore this specific type of mismatch.

If the warning is distracting, you can:

1. **Disable the browser extension temporarily** while developing
2. **Ignore the warning** — it's safe and expected
3. **Check production** — the warning won't appear there

## Technical Details

- File: `app/(frontend)/layout.tsx`
- Line: `<body ... suppressHydrationWarning>`
- React Docs: https://react.dev/link/hydration-mismatch

This is a known issue with React SSR when third-party scripts modify the DOM, and it has zero impact on app functionality or production builds.
