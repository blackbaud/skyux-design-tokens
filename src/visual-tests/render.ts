import { describeDemo, type DemoNode } from './demo';
import type { StyleApiItem, VisualTestPage } from './items';
import {
  BRANDS,
  MODES,
  SPACINGS,
  THEMES,
  type VisualTestSettings,
} from './settings';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** A generic table glyph standing in for the docs' `table` icon. */
const ICON_PATH =
  'M1 2h14v12H1z M2 3v3h5V3z M8 3v3h6V3z M2 7v3h5V7z M8 7v3h6V7z M2 11v2h5v-2z M8 11v2h6v-2z';

export function renderControls(
  settings: VisualTestSettings,
  pageKeys: string[],
): HTMLElement {
  const form = document.createElement('form');
  form.className = 'vt-controls';

  const selects: [keyof VisualTestSettings, readonly string[]][] = [
    ['page', ['all', ...pageKeys]],
    ['theme', THEMES],
    ['mode', MODES],
    ['brand', BRANDS],
    ['spacing', SPACINGS],
  ];

  for (const [name, options] of selects) {
    const label = document.createElement('label');
    label.textContent = `${name} `;

    const select = document.createElement('select');
    select.name = name;
    for (const option of options) {
      select.add(new Option(option, option));
    }
    select.value = settings[name] ?? 'all';
    select.addEventListener('change', () => {
      const params = new URLSearchParams();
      for (const [key, value] of new FormData(form)) {
        if (typeof value === 'string' && value !== 'all') {
          params.set(key, value);
        }
      }
      location.search = params.toString();
    });

    label.append(select);
    form.append(label);
  }

  return form;
}

export function renderPage(page: VisualTestPage): HTMLElement {
  const section = document.createElement('section');
  section.className = 'vt-page';

  const heading = document.createElement('div');
  heading.className = 'vt-heading';
  heading.textContent = page.name;
  section.append(heading);

  section.append(
    ...renderSection('Classes', page.classes),
    ...renderSection('Custom properties', page.tokens),
  );

  return section;
}

function renderSection(title: string, items: StyleApiItem[]): HTMLElement[] {
  const tiles = items.flatMap((item) => {
    const demo = describeDemo(item);
    return demo ? [renderTile(item.name, demo)] : [];
  });

  if (!tiles.length) {
    return [];
  }

  const heading = document.createElement('div');
  heading.className = 'vt-heading vt-subheading';
  heading.textContent = title;

  const grid = document.createElement('div');
  grid.className = 'vt-grid';
  grid.append(...tiles);

  return [heading, grid];
}

function renderTile(name: string, demo: DemoNode): HTMLElement {
  const tile = document.createElement('div');
  tile.className = 'vt-tile';

  const demoArea = document.createElement('div');
  demoArea.className = 'vt-tile-demo';
  demoArea.append(renderDemoNode(demo));

  const label = document.createElement('div');
  label.className = 'vt-tile-name';
  label.textContent = name;

  tile.append(demoArea, label);
  return tile;
}

function renderDemoNode(node: DemoNode): Element {
  const el = document.createElement(node.tag);

  if (node.classNames?.length) {
    el.classList.add(...node.classNames);
  }

  for (const [property, value] of Object.entries(node.style ?? {})) {
    el.style.setProperty(property, value);
  }

  if (node.icon) {
    el.append(renderIcon());
  } else if (node.text !== undefined) {
    el.textContent = node.text;
  }

  el.append(...(node.children ?? []).map(renderDemoNode));
  return el;
}

function renderIcon(): SVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ICON_PATH);
  path.setAttribute('fill', 'currentColor');
  path.setAttribute('fill-rule', 'evenodd');

  svg.append(path);
  return svg;
}
