import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Segmented, Tabs } from '../dist/index.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--report')) {
  throw new Error('Usage: npm run test:browser -- [--report path.json]');
}
const reportPath = args[1] && resolve(args[1]);
const browser = process.env.CHROMIUM_PATH || 'google-chrome';
const styles = await readFile(join(root, 'dist/styles.css'), 'utf8');
const theme = await readFile(join(root, 'dist/theme.css'), 'utf8');
const cases = [];
for (const component of ['segmented-button', 'segmented-link', 'tabs']) {
  for (const size of ['sm', 'md']) {
    for (const language of ['en', 'zh']) {
      for (const icons of ['none', 'all', 'mixed']) {
        for (const orientation of ['horizontal', 'vertical']) {
          const labels = language === 'en' ? ['Read gyp', 'Compare gyp'] : ['查看 gyp', '编辑 gyp'];
          const items = labels.map((label, index) => ({
            value: String(index),
            label,
            icon: icons === 'all' || (icons === 'mixed' && index === 0) ? 'lucide:eye' : undefined,
            href: component === 'segmented-link' ? `#item-${index}` : undefined,
          }));
          const props = { value: '0', items, size, orientation, ariaLabel: 'Alignment fixture' };
          const markup = renderToStaticMarkup(
            createElement(component === 'tabs' ? Tabs : Segmented, {
              ...props,
              ...(component === 'tabs' ? {} : { stackAt: 0 }),
            })
          );
          cases.push({ component, size, language, icons, orientation, markup });
        }
      }
    }
  }
}
for (const component of ['segmented-button', 'segmented-link', 'tabs']) {
  const items = ['Read gyp Áccented examples with a deliberately long label', 'Edit'].map(
    (label, index) => ({
      value: String(index),
      label,
      icon: 'lucide:eye',
      href: component === 'segmented-link' ? `#long-${index}` : undefined,
    })
  );
  cases.push({
    component,
    size: 'sm',
    language: 'en',
    icons: 'all',
    orientation: 'horizontal',
    long: true,
    markup: renderToStaticMarkup(
      createElement(component === 'tabs' ? Tabs : Segmented, {
        value: '0',
        items,
        size: 'sm',
        orientation: 'horizontal',
        stackAt: 0,
        ariaLabel: 'Long label fixture',
      })
    ),
  });
}
const markup = cases
  .map(
    ({ markup: control, long }, index) =>
      `<section data-case="${index}"${long ? ' style="width:180px"' : ''}>${control}</section>`
  )
  .join('');

function expectedProfiles(viewport) {
  return ['native', 'fallback'].flatMap((textMetricMode) =>
    ['system-ui, sans-serif', 'Arial, sans-serif', 'monospace'].flatMap((font) =>
      [14, 16, 20].flatMap((fontSize) =>
        ['light', 'dark'].map((theme) => ({ font, fontSize, theme, textMetricMode, viewport }))
      )
    )
  );
}

function validateResult(result) {
  const nonnegative = (value) => Number.isFinite(value) && value >= 0;
  const key = ({ font, fontSize, theme, textMetricMode, viewport }) =>
    JSON.stringify([font, fontSize, theme, textMetricMode, viewport]);
  assert.equal(cases.length, 75, 'expected 75 generated fixtures');
  assert(Array.isArray(result.frames) && result.frames.length === 2, 'expected two frames');
  assert.deepEqual(
    result.frames.map((frame) => frame.viewport).sort((a, b) => a - b),
    [390, 1440]
  );
  for (const frame of result.frames) {
    assert.equal(frame.fixtureCount, 75, 'incomplete fixture DOM');
    assert.equal(frame.measurements, 5400, 'incomplete frame measurements');
    assert(Array.isArray(frame.profiles) && frame.profiles.length === 36, 'incomplete profiles');
    assert(Array.isArray(frame.failures), 'missing failure collection');
    assert(
      nonnegative(frame.maxCenterError) && nonnegative(frame.maxCapError),
      'invalid frame metrics'
    );
    assert(
      frame.failures.length > 0 || (frame.maxCenterError <= 1 / 32 && frame.maxCapError <= 1 / 32),
      'missing failures for measured alignment errors'
    );
    assert.equal(typeof frame.capSupported, 'boolean', 'missing cap support result');
    const expectedCapMeasurements =
      cases.reduce(
        (count, fixture) =>
          count + (fixture.icons === 'all' ? 2 : fixture.icons === 'mixed' ? 1 : 0),
        0
      ) * 18;
    assert.equal(
      frame.capMeasurements,
      frame.capSupported ? expectedCapMeasurements : 0,
      'incomplete cap measurements'
    );
    const keys = frame.profiles.map(key);
    assert.equal(new Set(keys).size, 36, 'duplicate profiles');
    assert.deepEqual([...keys].sort(), expectedProfiles(frame.viewport).map(key).sort());
    for (const profile of frame.profiles) {
      assert.equal(profile.groups, 75, 'incomplete profile fixture coverage');
      assert.equal(profile.measurements, 150, 'incomplete profile measurements');
      assert(nonnegative(profile.maxCenterError), 'invalid profile metric');
      assert(
        frame.failures.length > 0 || profile.maxCenterError <= 1 / 32,
        'missing profile failures'
      );
    }
    for (const failure of frame.failures) {
      assert(Array.isArray(failure.reasons) && failure.reasons.length > 0, 'invalid failure');
      for (const value of Object.values(failure)) {
        if (typeof value === 'number') assert(Number.isFinite(value), 'invalid failure metric');
      }
    }
  }
}

// Completeness must be validated independently of the browser's failure count.
const validFixture = {
  frames: [1440, 390].map((viewport) => ({
    viewport,
    fixtureCount: 75,
    measurements: 5400,
    maxCenterError: 0,
    maxCapError: 0,
    capSupported: true,
    capMeasurements: 1404,
    failures: [],
    profiles: expectedProfiles(viewport).map((profile) => ({
      ...profile,
      groups: 75,
      measurements: 150,
      maxCenterError: 0,
    })),
  })),
};
assert.doesNotThrow(() => validateResult(validFixture));
for (const invalidate of [
  (result) => {
    result.frames = [];
  },
  (result) => {
    result.frames[1].viewport = 1440;
  },
  (result) => {
    result.frames[0].profiles[1] = result.frames[0].profiles[0];
  },
  (result) => {
    result.frames[0].measurements = 0;
  },
  (result) => {
    result.frames[0].profiles[0].maxCenterError = NaN;
  },
  (result) => {
    result.frames[0].capMeasurements = 0;
  },
  (result) => {
    result.frames[0].fixtureCount = 74;
  },
  (result) => {
    result.frames[0].profiles[0].maxCenterError = 1;
  },
]) {
  const invalid = structuredClone(validFixture);
  invalidate(invalid);
  assert.throws(() => validateResult(invalid));
}

// Measure the built package in a browser, including transforms and native button/link layout.
function measure(cases) {
  const tolerance = 1 / 32;
  const failures = [];
  let measurements = 0;
  let maxCenterError = 0;
  let maxCapError = 0;
  let capMeasurements = 0;
  const capSupported =
    CSS.supports('text-box-trim', 'trim-both') &&
    CSS.supports('text-box-edge', 'cap alphabetic') &&
    CSS.supports('overflow', 'clip visible');
  const sections = [...document.querySelectorAll('[data-case]')];
  if (
    sections.length !== cases.length ||
    new Set(sections.map((section) => section.dataset.case)).size !== cases.length ||
    sections.some((section, index) => Number(section.dataset.case) !== index)
  ) {
    throw new Error('Missing or duplicate fixture indices');
  }
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;display:block;width:1px;height:1cap';
  document.body.append(probe);
  const profiles = [];
  for (const textMetricMode of ['native', 'fallback']) {
    for (const label of document.querySelectorAll(
      '[data-lk="segmented-item"] > span, [data-lk="tab"] > span'
    )) {
      label.style.textBoxTrim = textMetricMode === 'fallback' ? 'none' : '';
    }
    for (const font of ['system-ui, sans-serif', 'Arial, sans-serif', 'monospace']) {
      for (const fontSize of [14, 16, 20]) {
        for (const theme of ['light', 'dark']) {
          document.documentElement.style.fontFamily = font;
          document.documentElement.style.fontSize = `${fontSize}px`;
          document.documentElement.dataset.theme = theme;
          const profile = { font, fontSize, theme, textMetricMode, viewport: innerWidth };
          const previousMeasurements = measurements;
          const capHeights = new Map();
          let profileMax = 0;
          for (const section of sections) {
            const fixture = cases[Number(section.dataset.case)];
            const control = section.firstElementChild;
            const items = control.querySelectorAll('[data-lk="segmented-item"], [data-lk="tab"]');
            if (items.length !== 2) throw new Error('Expected two native controls in each fixture');
            items.forEach((item, index) => {
              measurements++;
              const label = item.querySelector(':scope > span');
              const icon = item.querySelector(':scope > svg');
              if (!label) throw new Error('Missing label');
              const parentRect = item.getBoundingClientRect();
              const labelRect = label.getBoundingClientRect();
              const iconRect = icon?.getBoundingClientRect();
              const center = (rect) => rect.y + rect.height / 2;
              const labelError = Math.abs(center(labelRect) - center(parentRect));
              const iconError = iconRect ? Math.abs(center(iconRect) - center(parentRect)) : 0;
              const pairError = iconRect ? Math.abs(center(labelRect) - center(iconRect)) : 0;
              const error = Math.max(labelError, iconError, pairError);
              profileMax = Math.max(profileMax, error);
              maxCenterError = Math.max(maxCenterError, error);
              const reasons = [];
              const labelStyle = getComputedStyle(label);
              let capError;
              if (icon && capSupported && textMetricMode === 'native') {
                if (!capHeights.has(labelStyle.font)) {
                  probe.style.font = labelStyle.font;
                  capHeights.set(labelStyle.font, probe.getBoundingClientRect().height);
                }
                capError = Math.abs(labelRect.height - capHeights.get(labelStyle.font));
                maxCapError = Math.max(maxCapError, capError);
                capMeasurements++;
                if (capError > tolerance)
                  reasons.push('trimmed label height differs from inherited font 1cap');
              }
              if (error > tolerance) reasons.push('cross-axis center differs by more than 1/32px');
              const expectedIcon =
                fixture.icons === 'all' || (fixture.icons === 'mixed' && index === 0);
              if (Boolean(icon) !== expectedIcon) reasons.push('unexpected SVG slot presence');
              if (
                parentRect.width <= 0 ||
                parentRect.height <= 0 ||
                labelRect.width <= 0 ||
                labelRect.height <= 0
              ) {
                reasons.push('empty control or label');
              }
              if (iconRect && (iconRect.width <= 0 || iconRect.height <= 0))
                reasons.push('empty SVG slot');
              for (const rect of [labelRect, ...(iconRect ? [iconRect] : [])]) {
                if (
                  rect.left < parentRect.left - tolerance ||
                  rect.right > parentRect.right + tolerance ||
                  rect.top < parentRect.top - tolerance ||
                  rect.bottom > parentRect.bottom + tolerance
                ) {
                  reasons.push('content extends outside native control');
                }
              }
              const clipsLabel =
                labelStyle.textOverflow === 'ellipsis' &&
                ['hidden', 'clip'].includes(labelStyle.overflowX);
              const truncated = label.scrollWidth > label.clientWidth + 1;
              if (!fixture.long && innerWidth === 1440 && truncated) {
                reasons.push('short label is unnecessarily truncated on a wide viewport');
              }
              if (
                [...(clipsLabel ? [] : [label]), item, control].some(
                  (node) => node.scrollWidth > node.clientWidth + 1
                )
              ) {
                reasons.push('horizontal overflow');
              }
              if (fixture.long && index === 0) {
                if (
                  label.scrollWidth <= label.clientWidth + 1 ||
                  labelStyle.textOverflow !== 'ellipsis'
                ) {
                  reasons.push('long label does not use horizontal ellipsis');
                }
                if (capSupported && labelStyle.overflowY !== 'visible')
                  reasons.push('long label clips vertical glyph overflow');
              }
              if (
                getComputedStyle(item).fontFamily !== getComputedStyle(document.body).fontFamily
              ) {
                reasons.push('native control does not inherit host font');
              }
              if (
                fixture.size === 'sm' &&
                innerWidth <= 600 &&
                parentRect.height < 44 - tolerance
              ) {
                reasons.push('compact control is shorter than 44px on narrow viewport');
              }
              if (reasons.length) {
                failures.push({
                  ...profile,
                  ...fixture,
                  markup: undefined,
                  item: index,
                  reasons,
                  labelError,
                  iconError,
                  pairError,
                  capError,
                  height: parentRect.height,
                  labelTransform: labelStyle.transform,
                  overflow: Object.fromEntries(
                    [
                      ['label', label],
                      ['item', item],
                      ['control', control],
                    ].map(([name, node]) => {
                      const style = getComputedStyle(node);
                      return [
                        name,
                        {
                          clientWidth: node.clientWidth,
                          scrollWidth: node.scrollWidth,
                          width: node.getBoundingClientRect().width,
                          overflowX: style.overflowX,
                          overflowY: style.overflowY,
                          textOverflow: style.textOverflow,
                        },
                      ];
                    })
                  ),
                });
              }
            });
          }
          if (document.documentElement.scrollWidth > innerWidth + 1) {
            failures.push({ ...profile, reasons: ['fixture document overflows viewport'] });
          }
          profiles.push({
            ...profile,
            groups: sections.length,
            measurements: measurements - previousMeasurements,
            maxCenterError: profileMax,
          });
        }
      }
    }
  }
  probe.remove();
  return {
    viewport: innerWidth,
    fixtureCount: sections.length,
    measurements,
    maxCenterError,
    maxCapError,
    capSupported,
    capMeasurements,
    profiles,
    failures,
  };
}

const frameHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${theme}\n${styles}</style>
<style>*,*::before,*::after{box-sizing:border-box}body{margin:16px;font-family:inherit;line-height:1.65}section{width:100%;max-width:512px;margin-bottom:12px}</style>
</head><body>${markup}<script>window.measureAlignment = ${measure.toString()};</script></body></html>`;
const fixtures = cases.map(({ markup: _markup, ...fixture }) => fixture);
const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><script>
const cases = ${JSON.stringify(fixtures)};
Promise.all([1440, 390].map(width => new Promise((resolve, reject) => {
  const frame = document.createElement('iframe');
  frame.style.width = width + 'px';
  frame.style.height = '900px';
  frame.style.border = '0';
  frame.onload = async () => {
    try {
      await frame.contentDocument.fonts.ready;
      resolve(frame.contentWindow.measureAlignment(cases));
    } catch (error) { reject(error); }
  };
  frame.src = '/fixture';
  document.body.append(frame);
}))).then(frames => finish({frames}), error => finish({error: String(error)}));
function finish(result) {
  const output = document.createElement('pre');
  output.id = 'control-alignment-results';
  output.textContent = JSON.stringify(result);
  document.body.replaceChildren(output);
  fetch('/results', {method: 'POST', body: JSON.stringify(result)});
}
</script></body></html>`;

const temporary = await mkdtemp(join(tmpdir(), 'ui-control-alignment-'));
let receiveResult;
const received = new Promise((resolve) => {
  receiveResult = resolve;
});
const server = createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/results') {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      try {
        receiveResult(JSON.parse(body));
        response.end('ok');
      } catch {
        response.writeHead(400).end();
      }
    });
    return;
  }
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (request.url === '/') response.end(html);
  else if (request.url === '/fixture') response.end(frameHtml);
  else response.writeHead(404).end();
});
try {
  const htmlPath = join(temporary, 'index.html');
  await writeFile(htmlPath, html);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const execution = promisify(execFile)(
    browser,
    [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-background-networking',
      '--no-first-run',
      '--no-default-browser-check',
      '--dump-dom',
      '--virtual-time-budget=1000',
      '--window-size=1600,1000',
      `--user-data-dir=${join(temporary, 'profile')}`,
      `http://127.0.0.1:${server.address().port}/`,
    ],
    { encoding: 'utf8', timeout: 30000, maxBuffer: 8 * 1024 * 1024 }
  );
  let measured;
  try {
    measured = await Promise.race([
      received,
      execution.then(({ stdout, stderr }) => {
        const encoded = stdout.match(/<pre id="control-alignment-results">([\s\S]*?)<\/pre>/)?.[1];
        if (!encoded) throw new Error(`Chrome returned no measurement result: ${stderr}`);
        return JSON.parse(
          encoded
            .replaceAll('&lt;', '<')
            .replaceAll('&gt;', '>')
            .replaceAll('&quot;', '"')
            .replaceAll('&#39;', "'")
            .replaceAll('&amp;', '&')
        );
      }),
    ]);
  } finally {
    // Managed browsers may render the fixture but prevent --dump-dom from closing its context.
    execution.child.kill();
    await execution.catch(() => {});
  }
  if (measured.error) throw new Error(measured.error);
  validateResult(measured);
  const failures = measured.frames.flatMap((frame) => frame.failures);
  const report = {
    passed: failures.length === 0,
    browser,
    domGroups: cases.length * measured.frames.length,
    measurements: measured.frames.reduce((total, frame) => total + frame.measurements, 0),
    tolerance: 1 / 32,
    maxCenterError: Math.max(...measured.frames.map((frame) => frame.maxCenterError)),
    maxCapError: Math.max(...measured.frames.map((frame) => frame.maxCapError)),
    capSupported: measured.frames.every((frame) => frame.capSupported),
    capMeasurements: measured.frames.reduce((total, frame) => total + frame.capMeasurements, 0),
    artifacts: Object.fromEntries(
      [
        ['dist/styles.css', styles],
        ['dist/theme.css', theme],
        ['SSR fixture', markup],
      ].map(([name, content]) => [name, createHash('sha256').update(content).digest('hex')])
    ),
    profiles: measured.frames.flatMap((frame) => frame.profiles),
    failures,
  };
  if (reportPath) {
    await mkdir(dirname(reportPath), { recursive: true });
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  }
  console.log(
    `${report.passed ? 'PASS' : 'FAIL'}: ${report.domGroups} DOM groups, ${report.measurements} control measurements; maximum center error ${report.maxCenterError}px (limit ${report.tolerance}px).`
  );
  for (const failure of failures.slice(0, 8)) console.error(JSON.stringify(failure));
  if (failures.length > 8)
    console.error(`${failures.length - 8} more failures; use --report for full results.`);
  process.exitCode = report.passed ? 0 : 1;
} finally {
  await new Promise((resolve) => server.close(resolve));
  await rm(temporary, { recursive: true, force: true });
}
