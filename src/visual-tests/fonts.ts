export const FONT_FAMILY = 'BLKB Sans';

interface FontToken {
  file: string;
  value: string;
}

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

/**
 * Declares the fonts in CSS rather than with the FontFace API so DOM snapshot
 * tools that serialize stylesheets (such as Percy) also capture them.
 */
export function getFontFaceCss(sources: FontFaceSource[]): string {
  return sources
    .map(
      ({ url, weight, style }) =>
        `@font-face { font-family: "${FONT_FAMILY}"; src: url("${url}") format("woff"); font-weight: ${weight}; font-style: ${style}; }`,
    )
    .join('\n');
}

function isFontToken(value: unknown): value is FontToken {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Partial<FontToken>).file === 'string' &&
    typeof (value as Partial<FontToken>).value === 'string'
  );
}
