import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Button,
  IconButton,
  TextField,
  TextAreaField,
  SelectField,
  PageContainer,
  Stack,
  Cluster,
  Panel,
  Progress,
  ThemeProvider,
  ThemeControl,
  Card,
  Badge,
  Chart,
  DataCard,
  Donut,
  GitHub,
  Icon,
  LaikitProvider,
  MDTitle,
  PageTitle,
  Quote,
  Segmented,
  TitleCard,
  Tooltip,
  WindowPanel,
  formatBytes,
  formatCompact,
  selectPluralMessage,
} from '../dist/index.js';

const render = (node, props = {}) => renderToStaticMarkup(h(LaikitProvider, props, node));

test('async icons reserve their SVG slot during server rendering', () => {
  for (const node of [
    h(Badge, { icon: 'lucide:flag' }, 'Country'),
    h(Segmented, { value: 'a', items: [{ value: 'a', label: 'A', icon: 'lucide:sun' }] }),
    h(TitleCard, { title: 'Views', icon: 'lucide:eye', size: 'sm' }, 'Content'),
  ]) {
    const html = render(node);
    assert.match(html, /<svg[^>]*class="[^"]+"[^>]*width="1em"[^>]*height="1em"/);
    assert.doesNotMatch(html, /<span><\/span>/);
  }
});

test('icon slots retain explicit dimensions, styling, and accessible attributes', () => {
  const html = render(
    h(Icon, {
      icon: 'flag:cn-4x3',
      width: 20,
      height: 15,
      className: 'country-flag',
      style: { position: 'absolute', color: 'red' },
      'aria-hidden': false,
      'aria-label': 'China',
    })
  );
  assert.match(html, /<svg/);
  assert.match(html, /width="20" height="15"/);
  assert.match(html, /class="country-flag"/);
  assert.match(html, /position:absolute/);
  assert.match(html, /aria-label="China"/);
  assert.doesNotMatch(html, /aria-hidden="true"/);
  for (const dimensions of [{ width: 18 }, { height: 18 }]) {
    assert.match(render(h(Icon, { icon: 'lucide:eye', ...dimensions })), /width="18" height="18"/);
  }
});

test('renders standalone links and delegates routing without introducing a wrapper', () => {
  assert.match(render(h(Card, { to: '/docs' }, 'Docs')), /href="\/docs"/);
  const linkComponent = ({ to, children, ...props }) =>
    h('a', { ...props, href: `/zh-Hans${to}`, 'data-router': 'host' }, children);
  const html = render(h(Card, { to: '/docs' }, 'Docs'), { linkComponent });
  assert.match(html, /^<a[^>]*href="\/zh-Hans\/docs"/);
  assert.match(html, /data-router="host"/);
});

test('heading adapter receives the original attributes and personal content is host-owned', () => {
  const headingComponent = ({ as, ...props }) => h(as, { ...props, 'data-heading': 'host' });
  assert.match(
    render(h(PageTitle, { title: 'Hello <em>world</em>', description: 'Text' }), {
      headingComponent,
    }),
    /Hello <em>world<\/em>/
  );
  const html = render(h(MDTitle, { title: 'About' }), { headingComponent });
  assert.match(html, /data-heading="host"/);
  assert.match(html, />About<\/h1>/);
  assert.doesNotMatch(html, /lailai|🎉/);
});

test('localized labels use provider overrides and plural rules', () => {
  assert.equal(selectPluralMessage(1, 'Country|Countries'), 'Country');
  assert.equal(selectPluralMessage(2, 'Country|Countries'), 'Countries');
  assert.equal(selectPluralMessage(2, '国家', 'zh-Hans'), '国家');
  assert.equal(selectPluralMessage(2, 'one|few|many|other', 'ru'), 'few');
  assert.match(
    render(h(DataCard, { value: 2, label: 'Country|Countries', icon: 'lucide:flag' })),
    /Countries/
  );
  assert.match(
    render(h(DataCard, { value: 2, label: 'value', icon: 'lucide:flag' }), {
      selectMessage: () => '国家',
    }),
    /国家/
  );
  assert.match(
    render(h(Quote, { author: 'Author' }, 'Text'), { messages: { quoteAttributionDash: 'By ' } }),
    /By /
  );
  assert.match(render(h(Quote, { author: '作者' }, '正文'), { locale: 'zh-Hans' }), /——/);
});

test('nested providers inherit routing and localization', () => {
  const linkComponent = ({ to, ...props }) =>
    h('a', { ...props, href: to, 'data-router': 'outer' });
  const html = render(
    h(LaikitProvider, { messages: { other: '其余' } }, h(Card, { to: '/test' }, 'Test')),
    { locale: 'zh-Hans', linkComponent }
  );
  assert.match(html, /data-router="outer"/);
});

test('controls preserve disabled state, accessible names, and roving tab order', () => {
  assert.match(render(h(Button, { disabled: true }, 'Save')), /disabled=""/);
  const html = render(
    h(Segmented, {
      value: 'b',
      ariaLabel: 'View',
      items: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ],
    })
  );
  assert.match(html, /role="radiogroup" aria-label="View"/);
  assert.match(html, /aria-checked="false" tabindex="-1"/);
  assert.match(html, /aria-checked="true" tabindex="0"/);
  const navigation = render(
    h(Segmented, { value: 'a', items: [{ value: 'a', label: 'A', href: '/a' }] })
  );
  assert.match(navigation, /href="\/a"/);
  assert.match(navigation, /aria-current="page"/);
  assert.doesNotMatch(navigation, /role="radio"/);
});

test('charts distinguish loading, empty, error, and successful data', () => {
  const props = { title: 'Visitors', type: 'bar', data: [], emptyText: 'Empty dataset' };
  assert.match(render(h(Chart, props)), /Empty dataset/);
  assert.match(
    render(h(Chart, { ...props, error: 'Offline', errorAction: h(Button, null, 'Retry') })),
    /Offline.*Retry/s
  );
  assert.doesNotMatch(render(h(Chart, { ...props, loading: true })), /Empty dataset/);
  const html = render(
    h(Chart, { ...props, data: [{ key: 'a', value: 12, tooltipLabel: 'January' }] })
  );
  assert.match(html, /<caption>Visitors<\/caption>/);
  assert.match(html, /<th scope="row">January<\/th><td>12<\/td>/);
});

test('donut folds the long tail and uses the localized other label', () => {
  const html = render(
    h(Donut, {
      title: 'Browsers',
      icon: 'lucide:globe',
      maxSlices: 2,
      emptyText: 'Empty',
      items: [
        { x: 'A', y: 80 },
        { x: 'B', y: 15 },
        { x: 'C', y: 5 },
      ],
    }),
    { locale: 'zh-Hans' }
  );
  assert.match(html, /其他/);
  assert.match(html, /80\.0%/);
  assert.match(html, /20\.0%/);
});

test('server rendering browser-dependent components is safe', () => {
  assert.doesNotThrow(() => render(h(GitHub, { repo: 'lailai0916/ui' })));
  assert.match(
    render(h(Tooltip, null, h(Tooltip.Label, null, 'Label'), h(Tooltip.Value, null, '42'))),
    /Label.*42/s
  );
  assert.doesNotThrow(() =>
    render(
      h(WindowPanel, {
        tabs: [{ label: 'Tab', content: 'Body' }],
        collapseLabel: 'Collapse',
        expandLabel: 'Expand',
      })
    )
  );
});

test('formatters retain the website numeric contract', () => {
  assert.equal(formatCompact(1250, 'en'), '1.25K');
  assert.equal(formatCompact(NaN), '–');
  assert.equal(formatBytes(1536), '1.50 KB');
});

test('published files are framework-neutral and retain client boundaries', async () => {
  const entries = await readdir('dist', { recursive: true });
  for (const entry of entries.filter((entry) => /\.(js|css|d\.ts)$/.test(entry))) {
    const content = await readFile(`dist/${entry}`, 'utf8');
    assert.doesNotMatch(content, /@site\/|@docusaurus\/|@theme\/|--ifm-/, entry);
    if (entry.endsWith('.js')) assert.match(content, /^"use client";/, entry);
  }
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  assert.deepEqual(pkg.files, ['dist']);
  assert.ok(pkg.peerDependencies.react);
  assert.ok(!pkg.dependencies.react);
  assert.deepEqual(pkg.sideEffects, ['**/*.css']);
  await readFile('dist/theme.css');
  await readFile('dist/styles.css');
  await readFile('dist/index.d.ts');
});

test('migrated buttons share variants, sizes, and explicit toggle semantics', () => {
  assert.doesNotMatch(render(h(Button, null, 'Save')), /aria-pressed/);
  assert.match(render(h(Button, { active: false }, 'Toggle')), /aria-pressed="false"/);
  const danger = render(h(Button, { variant: 'danger', size: 'lg' }, 'Delete'));
  assert.match(danger, /variant_danger/);
  assert.match(danger, /size_lg/);
  assert.match(render(h(IconButton, { label: 'Close', size: 'sm' }, '×')), /aria-label="Close"/);
});

test('fields preserve host accessibility metadata alongside descriptions and errors', () => {
  for (const Field of [TextField, TextAreaField, SelectField]) {
    const html = render(
      h(Field, {
        id: 'name',
        label: 'Name',
        description: 'Help',
        error: 'Required',
        'aria-describedby': 'external',
      })
    );
    assert.match(html, /for="name"/);
    assert.match(html, /aria-describedby="external name-description name-error"/);
    assert.match(html, /aria-invalid="true"/);
    assert.match(html, /id="name-error"[^>]*role="alert"/);
    assert.match(
      render(h(Field, { label: 'Name', 'aria-invalid': 'spelling' })),
      /aria-invalid="spelling"/
    );
  }
});

test('layout dimensions include zero and panels retain customization hooks', () => {
  assert.match(render(h(PageContainer, { width: 720 }, 'Content')), /--lk-container-width:720px/);
  assert.match(render(h(Stack, { gap: 0 }, 'Content')), /--lk-stack-gap:0px/);
  assert.match(render(h(Cluster, { gap: 8 }, 'Content')), /--lk-cluster-gap:8px/);
  assert.match(render(h(Panel, { feature: true, tone: 'muted' }, 'Content')), /data-lk="panel"/);
});

test('progress clamps invalid and out-of-range data', () => {
  for (const [value, max, expected, percent] of [
    [25, 50, 25, 50],
    [150, 100, 100, 100],
    [-10, 100, 0, 0],
    [NaN, 100, 0, 0],
    [10, 0, 0, 0],
    [10, Infinity, 0, 0],
  ]) {
    const html = render(h(Progress, { label: 'Progress', value, max }));
    assert.match(html, new RegExp(`aria-valuenow="${expected}"`));
    assert.match(html, new RegExp(`width:${percent}%`));
    assert.doesNotMatch(html, /NaN|Infinity/);
  }
});

test('standalone theme controls render without browser globals', () => {
  const labels = { system: 'System', light: 'Light', dark: 'Dark' };
  const html = render(h(ThemeProvider, null, h(ThemeControl, { labels })));
  assert.match(html, /aria-pressed="true">System/);
  assert.match(
    render(h(ThemeProvider, null, h(ThemeControl, { labels, variant: 'compact' }))),
    /aria-haspopup="menu"/
  );
});

test('new public component subpaths are available and old global styling is absent', async () => {
  for (const name of [
    'Avatar',
    'Brand',
    'EmptyState',
    'Field',
    'Icon',
    'IconButton',
    'Layout',
    'Panel',
    'Progress',
    'ThemeControl',
    'ThemeProvider',
  ]) {
    assert.ok(Object.keys(await import(`../dist/components/${name}/index.js`)).length);
    await readFile(`dist/components/${name}/index.d.ts`);
  }
  const css = await readFile('dist/styles.css', 'utf8');
  assert.doesNotMatch(css, /--lui-|\.lui-/);
  const theme = await readFile('dist/theme.css', 'utf8');
  const definitions = new Set(
    [...`${css}\n${theme}`.matchAll(/(--lk-[\w-]+)\s*:/g)].map((match) => match[1])
  );
  const withFallback = new Set(['--lk-container-width', '--lk-stack-gap', '--lk-cluster-gap']);
  for (const [, token] of css.matchAll(/var\((--lk-[\w-]+)/g)) {
    assert.ok(definitions.has(token) || withFallback.has(token), `Undefined token: ${token}`);
  }
});
