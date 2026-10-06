import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Alert,
  Button,
  ButtonLink,
  Checkbox,
  CopyButton,
  Dialog,
  Input,
  PasswordField,
  PasswordInput,
  Radio,
  Select,
  Table,
  Tabs,
  TextArea,
  IconButton,
  LanguageButton,
  ThemeButton,
  TextField,
  TextAreaField,
  SelectField,
  PageContainer,
  SiteHeader,
  SkipLink,
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
  Hint,
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
  for (const options of [{}, { size: 'sm', orientation: 'horizontal', stackAt: 0 }]) {
    const html = render(
      h(Segmented, {
        ...options,
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
      h(Segmented, { ...options, value: 'a', items: [{ value: 'a', label: 'A', href: '/a' }] })
    );
    assert.match(navigation, /href="\/a"/);
    assert.match(navigation, /aria-current="page"/);
    assert.doesNotMatch(navigation, /role="radio"/);
  }
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

test('header icon buttons retain native button and accessibility contracts', () => {
  const html = render(
    h(
      IconButton,
      {
        variant: 'header',
        label: 'Search',
        title: 'Search tools (Ctrl+K)',
        disabled: true,
        name: 'search',
        'aria-describedby': 'search-help',
        'aria-haspopup': 'dialog',
        'aria-keyshortcuts': 'Control+K',
        className: 'host-button',
      },
      h('svg', { width: 17, height: 17 })
    )
  );
  assert.match(html, /^<button\b/);
  assert.match(html, /type="button"/);
  assert.match(html, /data-lk="button"/);
  assert.match(html, /aria-label="Search"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /name="search"/);
  assert.match(html, /aria-describedby="search-help"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /aria-keyshortcuts="Control\+K"/);
  assert.match(html, /host-button/);
  assert.doesNotMatch(html, /title=|variant=|hint=|<span/);
});

test('fields preserve host accessibility metadata alongside descriptions and errors', () => {
  for (const Field of [TextField, TextAreaField, SelectField, PasswordField]) {
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

test('action hints preserve native trigger semantics and render no wrapper or popup on the server', () => {
  for (const [tag, props] of [
    ['button', { type: 'submit', name: 'save', 'aria-label': 'Save' }],
    ['input', { type: 'text', name: 'answer', 'aria-label': 'Answer' }],
    ['a', { href: '/settings', 'aria-label': 'Settings' }],
    ['span', { className: 'host-label' }],
  ]) {
    const html = render(
      h(
        Hint,
        { label: 'Help' },
        h(tag, { ...props, title: 'Native help', 'aria-describedby': 'external' })
      )
    );
    assert.match(html, new RegExp(`^<${tag}\\b`));
    assert.match(html, /aria-describedby="external"/);
    assert.doesNotMatch(html, /title=|role="tooltip"|tabindex=|aria-haspopup/);
    for (const [key, value] of Object.entries(props)) {
      const attribute = key === 'className' ? 'class' : key;
      assert.match(html, new RegExp(`${attribute}="${value}"`));
    }
  }
  assert.doesNotMatch(
    render(h(IconButton, { label: 'Close', title: 'Close dialog' }, '×')),
    /title=/
  );
  assert.doesNotMatch(render(h(Button, { title: 'Help' }, 'Save')), /title=/);
  assert.doesNotMatch(render(h(ButtonLink, { to: '/docs', title: 'Help' }, 'Docs')), /title=/);
});

test('layout dimensions include zero and panels retain customization hooks', () => {
  assert.match(render(h(PageContainer, { width: 720 }, 'Content')), /--lk-container-width:720px/);
  assert.match(render(h(Stack, { gap: 0 }, 'Content')), /--lk-stack-gap:0px/);
  assert.match(render(h(Cluster, { gap: 8 }, 'Content')), /--lk-cluster-gap:8px/);
  assert.match(render(h(Panel, { feature: true, tone: 'muted' }, 'Content')), /data-lk="panel"/);
});

test('site headers preserve host navigation, actions, and native attributes', () => {
  const html = render(
    h(SiteHeader, {
      brand: h('a', { href: '/' }, 'Academy'),
      mobileAction: h('button', { 'aria-expanded': false }, 'Menu'),
      navigation: h('nav', { 'aria-label': 'Main' }, h('a', { href: '/learn' }, 'Learn')),
      actions: h('button', { disabled: true }, 'Account'),
      position: 'fixed',
      fullWidth: true,
      width: 960,
      'aria-label': 'Application header',
    })
  );
  assert.match(html, /<header[^>]*aria-label="Application header"/);
  assert.match(html, /data-position="fixed"/);
  assert.doesNotMatch(html, /--lk-container-width:960px/);
  assert.match(render(h(SiteHeader, { brand: 'Tools', width: 960 })), /--lk-container-width:960px/);
  assert.match(html, /data-lk="header-mobile-action"[^>]*><button aria-expanded="false"/);
  assert.match(html, /<nav aria-label="Main"><a href="\/learn">Learn<\/a><\/nav>/);
  assert.match(html, /<button disabled="">Account<\/button>/);
  const minimal = render(h(SiteHeader, { brand: 'Tools' }));
  assert.doesNotMatch(minimal, /header-navigation|header-actions|header-mobile-action/);
  const skip = render(h(SkipLink, { href: '#content', 'aria-label': 'Skip navigation' }, 'Skip'));
  assert.match(skip, /href="#content"/);
  assert.match(skip, /data-lk="skip-link"/);
  assert.match(render(h(SkipLink, null, 'Skip')), /href="#main-content"/);
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

test('language buttons name the current and next language while preserving native attributes', () => {
  const html = render(
    h(LanguageButton, {
      locale: 'zh-Hans',
      onLocaleChange() {},
      disabled: true,
      name: 'language',
      'aria-describedby': 'language-help',
      className: 'host-button',
    })
  );
  assert.match(html, /type="button"/);
  assert.match(html, /data-lk="language-button"/);
  assert.match(html, /data-locale="zh-Hans"/);
  assert.match(html, /当前语言：中文，切换至 English/);
  assert.match(html, /disabled=""/);
  assert.match(html, /name="language"/);
  assert.match(html, /aria-describedby="language-help"/);
  assert.match(html, /host-button/);
  assert.match(html, />中<\/button>/);
  const english = render(h(LanguageButton, { locale: 'en', onLocaleChange() {} }));
  assert.match(english, /Current language: English. Switch to 中文/);
  assert.match(english, />EN<\/button>/);
  assert.match(
    render(h(LanguageButton, { locale: 'en', onLocaleChange() {}, label: 'Language' })),
    /aria-label="Language"/
  );
});

test('controlled theme buttons support host theme managers and localized accessible names', () => {
  for (const theme of ['light', 'dark']) {
    const html = render(
      h(ThemeButton, { theme, onThemeChange() {}, 'aria-describedby': 'theme-help' }),
      { locale: 'zh-Hans' }
    );
    assert.match(html, new RegExp(`data-theme="${theme}"`));
    assert.match(html, /data-lk="theme-button"/);
    assert.match(html, /当前主题：.*切换至/);
    assert.match(html, /aria-describedby="theme-help"/);
    assert.match(html, /width="17" height="17"/);
    assert.doesNotMatch(html, /aria-haspopup|aria-pressed/);
  }
  assert.match(
    render(h(ThemeButton, { theme: 'dark', onThemeChange() {} })),
    /Current theme: dark. Switch to light/
  );
  assert.match(
    render(
      h(
        ThemeProvider,
        { mode: 'system' },
        h(ThemeControl, { labels: { system: 'System', light: 'Light', dark: 'Dark' } })
      )
    ),
    /aria-pressed="true">System/
  );
});

test('new public component subpaths are available and old global styling is absent', async () => {
  for (const name of [
    'Avatar',
    'Brand',
    'EmptyState',
    'DropdownSelect',
    'Field',
    'Icon',
    'IconButton',
    'Hint',
    'LanguageButton',
    'ThemeButton',
    'Layout',
    'SiteHeader',
    'SkipLink',
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
  const withFallback = new Set([
    '--lk-container-width',
    '--lk-stack-gap',
    '--lk-cluster-gap',
    '--lk-header-brand-width',
  ]);
  for (const [, token] of css.matchAll(/var\((--lk-[\w-]+)/g)) {
    assert.ok(definitions.has(token) || withFallback.has(token), `Undefined token: ${token}`);
  }
});

test('unframed controls preserve native form attributes and accessible metadata', () => {
  for (const Control of [Input, TextArea, Select]) {
    const html = render(
      h(Control, {
        name: 'answer',
        disabled: true,
        'aria-label': 'Answer',
        'aria-describedby': 'help',
        invalid: true,
      })
    );
    assert.match(html, /name="answer"/);
    assert.match(html, /disabled=""/);
    assert.match(html, /aria-label="Answer"/);
    assert.match(html, /aria-describedby="help"/);
    assert.match(html, /aria-invalid="true"/);
  }
  for (const [Control, type] of [
    [Checkbox, 'checkbox'],
    [Radio, 'radio'],
  ]) {
    const html = render(
      h(Control, {
        id: 'choice',
        label: 'Remember',
        name: 'choice',
        description: 'Help',
        'aria-describedby': 'external',
        defaultChecked: true,
      })
    );
    assert.match(html, new RegExp(`type="${type}"`));
    assert.match(html, /for="choice"/);
    assert.match(html, /checked=""/);
    assert.match(html, /aria-describedby="external choice-description"/);
  }
});

test('password and copy controls render localized labels without browser globals', () => {
  assert.match(render(h(PasswordInput, { 'aria-label': 'Password' })), /type="password"/);
  assert.match(
    render(h(PasswordField, { label: '密码', name: 'password' }), { locale: 'zh-Hans' }),
    /aria-label="显示密码"/
  );
  assert.match(render(h(CopyButton, { value: 'text' }), { locale: 'zh-Hans' }), />复制</);
  assert.match(render(h(CopyButton, { value: '' })), /disabled=""/);
  assert.match(render(h(CopyButton, { value: 'text', label: 'Copy answer' })), />Copy answer</);
});

test('tabs retain panel associations and skip disabled choices in the tab order', () => {
  const html = render(
    h(Tabs, {
      value: 'missing',
      ariaLabel: 'Sections',
      onChange() {},
      items: [
        { value: 'disabled', label: 'Unavailable', disabled: true },
        { value: 'overview', label: 'Overview', id: 'overview-tab', panelId: 'overview-panel' },
      ],
    })
  );
  assert.match(html, /role="tablist" aria-label="Sections"/);
  assert.match(html, /aria-controls="overview-panel" tabindex="0"/);
  assert.match(html, /id="overview-tab"/);
  assert.match(html, /tabindex="-1" disabled=""/);
});

test('application surfaces preserve semantic roles and host routing', () => {
  assert.match(render(h(Alert, { variant: 'danger' }, 'Failed')), /role="alert"/);
  assert.match(render(h(Alert, { variant: 'success' }, 'Saved')), /role="status"/);
  assert.match(render(h(Alert, { role: 'note' }, 'Read this')), /role="note"/);
  assert.match(
    render(h(Dialog, { open: true, onClose() {}, label: 'Search' }, 'Body')),
    /<dialog[^>]*aria-label="Search"[^>]*aria-modal="true"/
  );
  assert.match(
    render(h(Table, null, h('caption', null, 'Results'))),
    /<table[^>]*>[\s\S]*<caption>Results<\/caption>/
  );
  assert.match(render(h(Card, { as: 'article' }, 'Content')), /^<article/);
  assert.match(
    render(h(ButtonLink, { to: '/learn' }, 'Learn'), {
      linkComponent: ({ to, ...props }) => h('a', { ...props, href: to, 'data-router': 'host' }),
    }),
    /data-router="host"/
  );
  const hiddenMeta = render(
    h(Progress, { label: 'Mastery', value: 25, showLabel: false, showValue: false })
  );
  assert.match(hiddenMeta, /aria-label="Mastery"/);
  assert.doesNotMatch(hiddenMeta, /<span/);
  assert.match(
    render(
      h(DataCard, {
        value: '75%',
        label: 'Mastery',
        icon: 'lucide:target',
        description: 'After 24 hours',
      })
    ),
    /75%[\s\S]*After 24 hours/
  );
});
