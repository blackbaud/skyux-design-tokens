/** The font family that `--sky-theme-font-family-primary` names first. */
export const FONT_FAMILY = 'BLKB Sans';

interface FontToken {
  file: string;
  value: string;
}

/** The part of `json/design-tokens.json` that holds the font files. */
export interface FontTokens {
  text?: {
    weight?: Record<string, FontToken | Record<string, FontToken> | undefined>;
    style?: { italic?: FontToken };
  };
}

export interface FontFaceSource {
  url: string;
  weight: string;
  style: 'normal' | 'italic';
}

/**
 * Lists the font files the design tokens define for the primary font family,
 * matching the `@font-face` rules SKY UX apps get from their theme. Nested
 * weight groups, such as the condensed family, are skipped.
 */
export function getFontFaceSources(tokens: FontTokens): FontFaceSource[] {
  const sources: FontFaceSource[] = [];
  const regular = tokens.text?.weight?.['regular'];

  for (const token of Object.values(tokens.text?.weight ?? {})) {
    if (isFontToken(token)) {
      sources.push({ url: token.file, weight: token.value, style: 'normal' });
    }
  }

  const italic = tokens.text?.style?.italic;
  if (italic && isFontToken(regular)) {
    sources.push({ url: italic.file, weight: regular.value, style: 'italic' });
  }

  return sources;
}

function isFontToken(value: unknown): value is FontToken {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Partial<FontToken>).file === 'string' &&
    typeof (value as Partial<FontToken>).value === 'string'
  );
}
