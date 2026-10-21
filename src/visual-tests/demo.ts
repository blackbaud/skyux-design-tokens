import type { DemoMetadata, StyleApiItem } from './items';

export interface DemoNode {
  tag: string;
  classNames?: string[];
  style?: Record<string, string>;
  text?: string;
  icon?: boolean;
  children?: DemoNode[];
}

const DEFAULT_DEMO_TEXT = 'Bb';
const ELEMENT_SELECTOR = /^[a-z][a-z0-9]*$/;
const SPACING_TOKEN =
  /^--sky-theme-space-(stacked|inline|inset|conditional-input)\b/;

export function describeDemo(item: StyleApiItem): DemoNode | undefined {
  const spacingDemo = describeSpacingDemo(item);
  if (spacingDemo) {
    return spacingDemo;
  }

  const meta = getDemoMetadata(item);
  const type = meta?.type;
  if (!meta || !type || type === 'none') {
    return undefined;
  }

  const isClasses = item.itemType === 'classes';
  const applyClassToText = isClasses && type === 'text';

  const classNames = ['vt-demo-box', `vt-demo-type-${type}`];
  if (isClasses && !applyClassToText && item.codeValue) {
    classNames.push(item.codeValue);
  }

  const style = item.multiPropRows?.length
    ? getMultiPropStyles(item, meta)
    : getBoxStyles(item, meta);

  return {
    tag: 'div',
    classNames,
    style,
    children: getBoxChildren(item, meta, applyClassToText),
  };
}

function getDemoMetadata(item: StyleApiItem): DemoMetadata | undefined {
  if (item.demoMetadata?.type) {
    return item.demoMetadata;
  }

  if (item.itemType === 'tokens' && item.cssProperty) {
    return { ...item.demoMetadata, type: 'text' };
  }

  return item.demoMetadata;
}

function getBoxChildren(
  item: StyleApiItem,
  meta: DemoMetadata,
  applyClassToText: boolean,
): DemoNode[] {
  const text = meta.text ?? DEFAULT_DEMO_TEXT;

  if (meta.type === 'icon-color' || meta.type === 'icon-background-color') {
    return [{ tag: 'span', icon: true }];
  }

  if (meta.renderAs === 'element') {
    const tag = item.selectors[0];
    return tag && ELEMENT_SELECTOR.test(tag) ? [{ tag, text }] : [];
  }

  if (meta.type === 'text' || meta.type === 'text-color') {
    const classNames = ['vt-demo-text'];
    if (applyClassToText && item.codeValue) {
      classNames.push(item.codeValue);
    }

    return [
      {
        tag: 'span',
        classNames,
        style: getTextStyles(item, meta),
        text,
      },
    ];
  }

  return [];
}

function getMetadataStyles(meta: DemoMetadata): Record<string, string> {
  const styles: Record<string, string> = {};

  if (meta.background) {
    styles['background-color'] = `var(${meta.background})`;
  }
  if (meta.color) {
    styles['color'] = `var(${meta.color})`;
  }
  if (meta.height) {
    styles['height'] = meta.height;
  }
  if (meta.width) {
    styles['width'] = meta.width;
  }

  return styles;
}

function getBoxStyles(
  item: StyleApiItem,
  meta: DemoMetadata,
): Record<string, string> {
  const styles = getMetadataStyles(meta);

  if (item.itemType === 'classes') {
    return styles;
  }

  const code = item.codeValue;

  switch (meta.type) {
    case 'color-swatch':
    case 'icon-background-color':
      styles['background-color'] = code;
      break;
    case 'border':
      styles['border-top'] = code;
      break;
    case 'border-color':
      styles['border-top-color'] = code;
      break;
    case 'border-width':
      styles['border-top-width'] = code;
      break;
    case 'border-style':
      styles['border-top-style'] = code;
      break;
    case 'border-radius':
      styles['border-radius'] = code;
      break;
    case 'elevation':
      styles['box-shadow'] = code;
      break;
    case 'icon-color':
      styles['color'] = code;
      break;
    default:
      break;
  }

  return styles;
}

function getTextStyles(
  item: StyleApiItem,
  meta: DemoMetadata,
): Record<string, string> {
  const styles: Record<string, string> = {};

  if (item.itemType === 'classes') {
    return styles;
  }

  if (meta.type === 'text-color') {
    styles['color'] = item.codeValue;
  } else if (meta.type === 'text' && item.cssProperty) {
    styles[item.cssProperty] = item.codeValue;
  }

  return styles;
}

function getMultiPropStyles(
  item: StyleApiItem,
  meta: DemoMetadata,
): Record<string, string> {
  const styles = getMetadataStyles(meta);

  for (const row of item.multiPropRows ?? []) {
    styles[row.cssProperty] = row.codeValue;
  }

  return styles;
}

export function describeSpacingDemo(item: StyleApiItem): DemoNode | undefined {
  return item.itemType === 'tokens'
    ? describeSpacingTokenDemo(item)
    : describeSpacingClassDemo(item);
}

function describeSpacingTokenDemo(item: StyleApiItem): DemoNode | undefined {
  const kind = SPACING_TOKEN.exec(item.customProperty ?? '')?.[1];

  switch (kind) {
    case 'stacked':
      return {
        tag: 'div',
        classNames: ['vt-spacing-bar', 'vt-spacing-bar-stacked'],
        style: { height: item.codeValue },
      };
    case 'inline':
    case 'conditional-input':
      return {
        tag: 'div',
        classNames: ['vt-spacing-bar', 'vt-spacing-bar-inline'],
        style: { width: item.codeValue },
      };
    case 'inset':
      return describePaddingFrame([], { padding: item.codeValue });
    default:
      return undefined;
  }
}

function describeSpacingClassDemo(item: StyleApiItem): DemoNode | undefined {
  const properties = Object.keys(item.properties ?? {});
  if (!item.codeValue || !properties.length) {
    return undefined;
  }

  if (properties.every((p) => p.startsWith('padding'))) {
    return describePaddingFrame([item.codeValue]);
  }

  if (properties.every((p) => p.startsWith('margin'))) {
    return {
      tag: 'div',
      classNames: ['vt-spacing-container'],
      children: [
        {
          tag: 'div',
          classNames: ['vt-spacing-content', item.codeValue],
        },
      ],
    };
  }

  return undefined;
}

function describePaddingFrame(
  classNames: string[],
  style?: Record<string, string>,
): DemoNode {
  return {
    tag: 'div',
    classNames: ['vt-spacing-frame', ...classNames],
    style,
    children: [{ tag: 'div', classNames: ['vt-spacing-content'] }],
  };
}
