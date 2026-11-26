# Quiet Company: open assets

Original 3D-printable figurines and the brand kit behind them. The idea: small, wry sculptures that borrow the calm of Buddhist iconography without borrowing anyone's copyrighted characters.

v1 is one calm monk in three poses (sitting, standing, walking) and 42 original heads that lift off and swap: archetypes like the robot and the wizard, plain people told apart by their hair, and animals like the frog and the owl. A short quiz picks one for you.

This repository is the public half of the project. The business repo is private.

## What is here

```
index.html                        home: poses, heads, finishes
quiz.html                         eight questions
buddy.html                        the card for any head and pose (?head=frog&body=walking)
credits.html 404.html
assets/style.css  favicon.svg
assets/buddies.js                 the line-up, quiz and card text
assets/site.js                    page behaviour
assets/figures/                   preview renders
brand/                            wordmark (pending)
models/                           printable STLs (published as Releases, not in git)
```

## Site

The site is static HTML at the repo root, served by GitHub Pages:

https://michael-borck.github.io/quiet-company-open/

No tracking, no build step, no dependencies. The gallery, quiz and card page use two small JavaScript files; nothing is sent or stored. Pages publishes from `main` / root. Edit and push.

## Licence

- **Original 3D models:** CC BY-NC 4.0. Print, remix, and share for yourself. Credit the source. No commercial selling.
- **Insight cards, brand, and photography:** all rights reserved.
- **Code:** MIT, where a file carries an MIT header. The quiz and card text inside `assets/buddies.js` is not MIT; it is all rights reserved.

See `LICENSE` for the full scope. Third-party models are credited in `CREDITS.md` and keep their own licences.

## Printing

- Layer height 0.2 mm, 0.6 mm nozzle, 3 perimeters, 10 to 15% gyroid. No supports.
- Print `joint-coupon.stl` first and check which numbered cap fits your printer. The heads use the cap 2 clearance (0.25 mm per side).
- Heads stand on a 17 mm neck: use a brim. Do not scale parts, or the neck joint will no longer fit. Keep fuzzy skin off the neck and the cup.
- Matte PLA. Rainbow is a gradient filament; every piece differs.
- These are decorative objects, not toys. Not for children under 14.

## Attribution

If you post a print, tag the project and link back. That is all the licence asks.

## Contributing

Corrections to the card text and print profiles are welcome. Do not submit models of copyrighted characters.
