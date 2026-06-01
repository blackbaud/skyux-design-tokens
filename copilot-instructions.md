# Copilot Instructions

This repository contains SKY UX design tokens, generated styles, and supporting prompt assets.

## Work style

- Keep edits small and focused.
- Prefer repo conventions over introducing new structure.
- Avoid changing light-theme tokens unless the task explicitly calls for it.
- Treat snapshot updates as part of token-output changes.

## Validation

- Run `npm test` after token or style-dictionary changes.
- Run `npm run build` when the change affects generated output.
- Update Vitest snapshots intentionally with `vitest run --update` when output changes are expected.

## Prompt and agent assets

- Keep discoverable prompt files under `.github/prompts`.
- Keep workspace-level instruction files at the repo root.
- Avoid nonstandard prompt locations when a standard Copilot path exists.

## Generated files

- Do not commit build artifacts, caches, or local migration bundles.
- Treat `dist/` and other generated outputs as disposable.