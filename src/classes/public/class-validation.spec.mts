import { expect, test } from 'vitest';
import type {
  PublicApiStyle,
  PublicApiStyleGroup,
  PublicApiStyles,
} from '@blackbaud/skyux-branding-builder';

import borders from './borders.json';
import colors from './colors.json';
import elevation from './elevation.json';
import spacing from './spacing.json';
import typography from './typography.json';

/**
 * The builder ignores keys it doesn't recognize, so a misplaced key drops
 * classes from `public-api.css` with no error. These checks fail instead.
 *
 * The field tables use `satisfies Record<keyof T, FieldValidator>` so `tsc`
 * fails if the builder's types change.
 */

/** Not exported by the builder. */
type DemoMetadata = NonNullable<PublicApiStyle['demoMetadata']>;

type UnknownRecord = Record<string, unknown>;

type FieldValidator = (value: unknown, path: string, errors: string[]) => void;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const expectString: FieldValidator = (value, path, errors) => {
  if (typeof value !== 'string') {
    errors.push(`${path} must be a string.`);
  }
};

const expectBoolean: FieldValidator = (value, path, errors) => {
  if (typeof value !== 'boolean') {
    errors.push(`${path} must be a boolean.`);
  }
};

const expectArray: FieldValidator = (value, path, errors) => {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array.`);
  }
};

const expectStringArray: FieldValidator = (value, path, errors) => {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array of strings.`);
    return;
  }

  value.forEach((item, index) => {
    if (typeof item !== 'string') {
      errors.push(`${path}[${String(index)}] must be a string.`);
    }
  });
};

const expectStringRecord: FieldValidator = (value, path, errors) => {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  for (const [key, item] of Object.entries(value)) {
    if (typeof item !== 'string') {
      errors.push(`${path}.${key} must be a string.`);
    }
  }
};

/** A misspelled union member is silently ignored, so check the exact values. */
function expectOneOf(allowed: Set<string>): FieldValidator {
  return (value, path, errors) => {
    if (typeof value !== 'string' || !allowed.has(value)) {
      errors.push(
        `${path} must be one of: ${[...allowed].sort().join(', ')}. Received ${JSON.stringify(value)}.`,
      );
    }
  };
}

const DEMO_METADATA_TYPES = new Set(
  Object.keys({
    border: true,
    'border-color': true,
    'border-radius': true,
    'border-style': true,
    'border-width': true,
    'color-swatch': true,
    elevation: true,
    'icon-background-color': true,
    'icon-color': true,
    none: true,
    text: true,
    'text-color': true,
  } satisfies Record<NonNullable<DemoMetadata['type']>, true>),
);

const DEMO_METADATA_RENDER_AS = new Set(
  Object.keys({
    element: true,
    'multi-prop': true,
  } satisfies Record<NonNullable<DemoMetadata['renderAs']>, true>),
);

const DEMO_METADATA_FIELDS = {
  type: expectOneOf(DEMO_METADATA_TYPES),
  renderAs: expectOneOf(DEMO_METADATA_RENDER_AS),
  background: expectString,
  color: expectString,
  text: expectString,
  height: expectString,
  width: expectString,
} satisfies Record<keyof DemoMetadata, FieldValidator>;

const expectDemoMetadata: FieldValidator = (value, path, errors) => {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  checkFields(value, DEMO_METADATA_FIELDS, 'DemoMetadata', path, errors);
};

const STYLE_FIELDS = {
  name: expectString,
  className: expectString,
  selectors: expectStringArray,
  properties: expectStringRecord,
  description: expectString,
  deprecatedClassNames: expectStringArray,
  obsoleteClassNames: expectStringArray,
  excludeFromDocs: expectBoolean,
  demoMetadata: expectDemoMetadata,
} satisfies Record<keyof PublicApiStyle, FieldValidator>;

const GROUP_FIELDS = {
  name: expectString,
  description: expectString,
  demoMetadata: expectDemoMetadata,
  imageToken: expectString,
  // Recursed into separately, below.
  groups: expectArray,
  styles: expectArray,
} satisfies Record<keyof PublicApiStyleGroup, FieldValidator>;

const ROOT_FIELDS = {
  groups: expectArray,
  styles: expectArray,
} satisfies Record<keyof PublicApiStyles, FieldValidator>;

/** Rejects unknown keys and validates the value of known ones. */
function checkFields(
  node: UnknownRecord,
  fields: Record<string, FieldValidator>,
  typeName: string,
  path: string,
  errors: string[],
): void {
  for (const [key, value] of Object.entries(node)) {
    const validateField = fields[key] as FieldValidator | undefined;

    if (!validateField) {
      errors.push(
        `${path} has unknown property "${key}" (not part of ${typeName}).`,
      );
      continue;
    }

    validateField(value, `${path}.${key}`, errors);
  }
}

/**
 * Only groups can nest children. A `styles` entry with a "groups" key is valid
 * JSON, but the builder reads it as a leaf and drops everything under it.
 */
function validateStyle(style: unknown, path: string, errors: string[]): void {
  if (!isRecord(style)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  checkFields(style, STYLE_FIELDS, 'PublicApiStyle', path, errors);

  if (style.name === undefined) {
    errors.push(`${path} is missing a "name".`);
  }

  const emitsCss =
    isRecord(style.properties) &&
    Object.keys(style.properties).length > 0 &&
    (typeof style.className === 'string' || Array.isArray(style.selectors));

  // Entries documenting a class we no longer ship have nothing to emit.
  const documentsRemovedClass =
    Array.isArray(style.deprecatedClassNames) ||
    Array.isArray(style.obsoleteClassNames);

  if (!emitsCss && !documentsRemovedClass) {
    errors.push(
      `${path} ("${String(style.name)}") produces no CSS and would be silently ` +
        `dropped from public-api.css. A style needs "properties" plus a ` +
        `"className" or "selectors". To nest child classes underneath it, move ` +
        `it into a "groups" array and put the children in its "styles" array.`,
    );
  }
}

function validateGroup(group: unknown, path: string, errors: string[]): void {
  if (!isRecord(group)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  checkFields(group, GROUP_FIELDS, 'PublicApiStyleGroup', path, errors);

  if (group.name === undefined) {
    errors.push(`${path} is missing a "name".`);
  }

  // Childless groups are allowed: some only document custom properties.
  validateChildren(group, path, errors);
}

function validateChildren(
  node: UnknownRecord,
  path: string,
  errors: string[],
): void {
  if (Array.isArray(node.groups)) {
    node.groups.forEach((group, index) => {
      validateGroup(group, `${path}.groups[${String(index)}]`, errors);
    });
  }

  if (Array.isArray(node.styles)) {
    node.styles.forEach((style, index) => {
      validateStyle(style, `${path}.styles[${String(index)}]`, errors);
    });
  }
}

function getSchemaErrors(root: unknown): string[] {
  if (!isRecord(root)) {
    return ['The file must contain a JSON object.'];
  }

  const errors: string[] = [];

  checkFields(root, ROOT_FIELDS, 'PublicApiStyles', '<root>', errors);
  validateChildren(root, '<root>', errors);

  return errors;
}

/** Keep in sync with `publicStyles` in `src/tokens/token-config.mts`. */
const classFiles: Record<string, unknown> = {
  'borders.json': borders,
  'colors.json': colors,
  'elevation.json': elevation,
  'spacing.json': spacing,
  'typography.json': typography,
};

test.each(Object.keys(classFiles))(
  '%s should match the public API styles schema',
  (fileName) => {
    const errors = getSchemaErrors(classFiles[fileName]);

    expect(
      errors,
      `${fileName} does not match the public API styles schema:\n${errors
        .map((error) => `  - ${error}`)
        .join('\n')}`,
    ).toEqual([]);
  },
);
