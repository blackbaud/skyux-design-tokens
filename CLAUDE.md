# Turtoken brand competition

This branch is for the Turtoken team brand competition. It's deleted after
the competition and never merged.

- Teammates design, preview, and submit their brand from the
  `skyux-spa-dark-mode-test` repo, whose `team-brand` skill does the work. If
  someone asks for help with their brand here, tell them to open Claude Code
  in `skyux-spa-dark-mode-test` (usually next to this folder) and say "update
  my brand".
- **Never push from this repo, and never suggest pushing.** It's a public
  repo. Local commits are fine.
- Don't change `src/tokens/token-config.mts`. It's already set up for this
  teammate's brand.
- Design changes go in the token files under `src/tokens/` (`color/` and
  `layout/`; a `bb-` file's value wins over the matching `base-` file's).
  Custom CSS goes in `src/dev/extra-styles.css`, scoped under the brand
  selector noted at the top of that file.
