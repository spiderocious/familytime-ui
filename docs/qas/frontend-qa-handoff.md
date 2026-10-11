# Frontend QA Handoff — Family Quiz

**Date:** 2026-10-11
**Build:** Lint ✅ · Typecheck ✅ · Unit tests ✅ · Build ✅
**Frontend URL:** `http://localhost:5173` (use the network address for phones)

## How this repo tests

| Tier | Where | What it covers |
|---|---|---|
| Unit (Vitest) | `src/**/__tests__/*.test.ts` | pure helpers: duration estimate, matching-question count, ordinals |
| End to end | `docs/qas/scripts/ui-e2e.mjs` | the real UI in headless Chrome: one big screen and two phones in separate browser contexts play a whole game against the running backend |

There are no component tests. The end-to-end script is the verification
surface for screens.

```bash
# puppeteer-core is not a project dependency; install it wherever you run from
npm i puppeteer-core
BASE=http://<network-address>:5173 SHOTS=./shots node docs/qas/scripts/ui-e2e.mjs
```

It asserts, among other things: the setup rail's totals; the room opens with a
code and QR; a duplicate name shows the server's own message under the field;
both players appear on the big screen; the phone and the big screen show the
same question; a phone with questions hidden shows shapes only; one option is
the database's correct answer; the big screen names the fastest player; the
final table's numbers; a refreshed phone returns to its own result; Play again
restarts for everyone; and no console errors on any device.

**Verified 2026-10-11:** passes, run over the LAN address.

## Screens

| Route | Screen | Notes |
|---|---|---|
| `/` | Home | game shelf, join box |
| `/host/:gameId` | Host setup | settings; opens the room |
| `/host/room/:code` | Big screen | lobby and every game phase; only the browser that opened the room |
| `/join`, `/join/:code` | Join | code, then name and avatar |
| `/play/:code` | Phone | controller; redirects to join if this phone has no seat |
| `/preview` | Design system | every token and component, live |

## Worth checking by hand

- **On real phones over wifi.** Verified here only in headless Chrome at phone size.
- **Sound.** The synthesiser runs in a real browser after the first tap; headless Chrome cannot confirm how it sounds.
- **A phone that locks mid-question** and wakes: it should reconnect on its own and be back in the game.
- **A TV-sized screen** (1920×1080 and up). Verified at 1600×900.
- **Reduced motion** turned on in the device settings: same game, no bouncing.

## Out of scope

- Safari and Firefox were not run.
- No offline support.
