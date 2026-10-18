# Original site + Team Valor

The original local homepage is restored, including its uncommitted factual updates. Its original layout, wording, research descriptions, seven apps, daily Duolingo counter, and links are retained, with the requested tile, icon, marquee, and typography updates below. All content is back in `index.html`; there is no separate content archive. The art page uses Times New Roman where it previously used JetBrains Mono; its content and images, and the Git configuration, are unchanged. See the repository history and GitHub Pages deployment status for publication details.

## Additions

- Team Valor logo beside the navigation name, as a faint hero background mark, in the existing Pokémon GO fact tile, beside the research heading, and beside the footer signature.
- A 2.8-second opening: a small folded Team Valor bird opens both wings, grows, then expands past the viewport while an opening in the dark overlay reveals the original site.
- A cursive LW signature draws over the phoenix: L, W, then an underline, timed to the unfolding wings. The signature is vector strokes and scales with the bird.
- A footer “Replay intro” button, plus a skip button in the intro.
- The Chinese-decks and discourse-clusters hero tiles are now “2 Published papers” and Ravenclaw with the official Harry Potter website’s crest. Research and project descriptions are preserved.
- Local Poké Ball, painted bunting, Duo owl, Ravenclaw crest, and NBC images replace the five hobby emojis. Sources and licenses are listed in `assets/hobbies/credits.html`.
- Great Vibes is self-hosted for the scrolling bar. All former JetBrains Mono text on both pages uses Times New Roman.
- Running Pikachu crosses the scrolling bar beneath the text. A keyboard-accessible Pause/Play control stops the marquee and hides the animated GIF while paused. Reduced motion disables the scrolling and omits Pikachu.

The entrance uses the actual vector shape. Wings are separate clipped portions of the source path while unfolding; the complete uninterrupted path replaces them when open. Zooming changes the SVG viewBox, so the logo is redrawn as vectors instead of enlarging a cached bitmap. No feathered artwork appears in the active site.

The entrance plays once per tab session. Escape, Tab, scrolling, touch, the skip button, and reduced-motion preferences bypass or dismiss it. It never waits for external images: the animation's SVG geometry is inline, and the content stays available beneath the decorative overlay. A direct section link bypasses the entrance. The footer control explicitly replays it.

## Open locally

Open `index.html` in a browser. Alternatively, from this directory run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:4173/`. Use “Replay intro” at the bottom to repeat the animation.

## Verification

Chrome browser checks at 320, 390, 768, 1024, and 1440 pixels confirmed no horizontal overflow, all five logo placements loaded, all seven apps present, and no JavaScript exceptions. Desktop and mobile screenshots were reviewed. Measured animation stages confirm small/folded, unfolding, fully open, and expanding/revealing states. Pointer skip, Escape, Tab dismissal, same-session suppression, replay, and reduced-motion suppression were exercised.

The initial restoration was checked against the original factual backup. Subsequent changes are confined to the requested tiles, hobby icons, typography, scrolling-bar animation, and intro signature. The Git configuration remains unchanged.

Screenshots and browser reports: `../valor-preview/`. Browser testing used desktop Chrome with mobile viewport emulation, not physical phones or Safari. Existing external app services and original decorative effects were not redesigned or comprehensively retested.

## Assets and recovery

- Active logo and animation files: `assets/valor/`.
- Logo vector source: [Meritt Thomas, “Valor: Pokemon GO Team Logo [Vector Download]”](https://dribbble.com/shots/2832004-Valor-Pokemon-GO-Team-Logo-Vector-Download). Source SVG is retained as `team-valor-original.svg`; `team-valor.svg` retains its path geometry and uses the site's crimson. The entrance uses that same geometry with a warm red/gold fill.
- Original factual homepage and working files: `../astra-before-redesign-20261017-231257/`.
- Superseded first prototype and feathered assets: `../astra-first-prototype-20261017-233034/`. These have been removed from the active site.

## Latest local preview

Desktop and mobile captures and automated browser reports for the hobby updates and signature are in `../hobby-preview/`. All new images and Great Vibes loaded; the pause control and reduced-motion behavior passed, with no JavaScript exceptions. Recovery copy before these edits: `../before-hobby-updates-20261017-235123/`.

## Final content and icon updates

- The scrolling banner emphasizes current research, intended minors, and interests; legacy coursework and Chinese-app commit counts are omitted from the banner.
- The Ravenclaw statistics tile uses a red outline crest.
- The painted bunting hobby icon uses a transparent PNG cutout.
- Both published papers are identified as first-author work.
