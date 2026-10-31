import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), 'laikit-interactions-'));
const browser = process.env.CHROMIUM_PATH || 'google-chrome';
const entry = join(temporary, 'fixture.jsx');
const source = `
import React, {useState} from ${JSON.stringify(join(root, 'node_modules/react/index.js'))};
import {createRoot} from ${JSON.stringify(join(root, 'node_modules/react-dom/client.js'))};
import {GitHub, Hint, IconButton, LaikitProvider, LinkCard, Segmented, Slider, TextField} from ${JSON.stringify(join(root, 'dist/index.js'))};
import ${JSON.stringify(join(root, 'dist/theme.css'))};
import ${JSON.stringify(join(root, 'dist/styles.css'))};
window.requests = 0;
window.phase = 'timeout';
window.fetch = (url, options = {}) => {
  if (!String(url).startsWith('https://api.github.com/repos/')) return Promise.reject(new Error('Unexpected network request'));
  window.requests++;
  if (window.phase === 'timeout') return new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError')), {once: true});
  });
  if (window.phase === 'error') return Promise.resolve(new Response('', {status: 503}));
  return new Promise(resolve => setTimeout(() => resolve(new Response(JSON.stringify({
    description: 'Recovered repository', language: 'TypeScript', stargazers_count: 42,
    forks_count: 3, license: {spdx_id: 'MIT'}
  }), {status: 200})), 350));
};
window.commits = [];
function App() {
  const [selected, setSelected] = useState('a');
  const [value, setValue] = useState(50);
  const [hintText,setHintText] = useState('A deliberately long title that overflows its compact row');
  window.setHintText = setHintText;
  const items = [{value: 'a', label: 'Day'}, {value: 'b', label: 'Week'}, {value: 'c', label: 'Month'}];
  return <main style={{width: 'min(100%, 420px)', boxSizing:'border-box', padding:16}}>
    <Hint label={hintText} onlyWhenTruncated truncationTarget="[data-truncated-title]">
      <a id="hint-long" href="#after" style={{display:'block',width:160}}><span data-truncated-title style={{display:'block',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{hintText}</span></a>
    </Hint>
    <Hint label="Nested article title" onlyWhenTruncated truncationTarget="[data-nested-title]" delay={0}>
      <a id="hint-row" href="#after" style={{display:'block',width:160}}>
        <span data-nested-title style={{display:'block',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>A long nested article title that does not fit</span>
        <Hint label="Exact publication date" delay={0}><time id="hint-date" dateTime="2026-10-31">Today</time></Hint>
      </a>
    </Hint>
    <Hint label="Short" onlyWhenTruncated><a id="hint-short" href="#after" style={{display:'block',width:160}}>Short</a></Hint>
    <IconButton id="icon-xs" size="xs" label="Small action" hint={false}><span><svg viewBox="0 0 24 24"><path strokeWidth="2" d="M6 6L18 18" /></svg></span></IconButton>
    <IconButton id="icon-sm" size="sm" label="Header action" variant="header" hint={false}><svg viewBox="0 0 24 24"><path strokeWidth="2" d="M6 6L18 18" /></svg></IconButton>
    <TextField id="invalid-field" label="Required" error="Required value" />
    <div id="hint-card" style={{width:280}}><LinkCard href="#after" title="A very long linked card title with ellipsis" description="A descriptive sentence that also overflows" /></div>
    <section id="stack-default"><Segmented orientation="horizontal" value={selected} onChange={setSelected} items={items} ariaLabel="Default range" /></section>
    <section id="stack-narrow"><Segmented orientation="horizontal" stackAt={360} value={selected} onChange={setSelected} items={items} ariaLabel="Narrow range" /></section>
    <section id="stack-never"><Segmented orientation="horizontal" stackAt={0} value={selected} onChange={setSelected} items={items} ariaLabel="Fixed range" /></section>
    <Slider label="Value" value={value} valueLabel={String(value)} min={0} max={100} onChange={setValue} onCommit={value => window.commits.push(value)} />
    <LaikitProvider locale="en"><GitHub repo="qa/recovery" /></LaikitProvider>
    <LaikitProvider locale="zh-Hans"><GitHub repo="qa/recovery" /></LaikitProvider>
    <a href="#after" id="after">After cards</a>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
window.ready = true;
`;
let server;
let chrome;
let socket;
try {
  await writeFile(entry, source);
  const output = join(temporary, 'output');
  await build({
    configFile: false,
    logLevel: 'error',
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    build: {
      outDir: output,
      minify: false,
      lib: { entry, formats: ['es'], fileName: () => 'fixture.js', cssFileName: 'fixture' },
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
  });
  const script = await readFile(join(output, 'fixture.js'));
  const css = await readFile(join(output, 'fixture.css'));
  server = createServer((request, response) => {
    if (request.url === '/fixture.js') {
      response.setHeader('Content-Type', 'text/javascript');
      response.end(script);
    } else if (request.url === '/fixture.css') {
      response.setHeader('Content-Type', 'text/css');
      response.end(css);
    } else {
      response.setHeader('Content-Type', 'text/html');
      response.end(
        '<!doctype html><html><head><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/fixture.css"></head><body style="margin:0"><div id="root"></div><script type="module" src="/fixture.js"></script></body></html>'
      );
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  chrome = spawn(
    browser,
    [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-background-networking',
      '--no-first-run',
      '--no-default-browser-check',
      '--remote-debugging-port=0',
      `--user-data-dir=${join(temporary, 'profile')}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );
  const endpoint = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Chrome startup timed out')), 10000);
    chrome.once('error', reject);
    chrome.stderr.on('data', (chunk) => {
      const match = String(chunk).match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) {
        clearTimeout(timeout);
        resolve(match[1]);
      }
    });
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  const pending = new Map();
  let nextId = 0;
  const browserErrors = [];
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown')
      browserErrors.push(message.params.exceptionDetails.exception?.description);
    const task = pending.get(message.id);
    if (!task) return;
    pending.delete(message.id);
    if (message.error) task.reject(new Error(message.error.message));
    else task.resolve(message.result);
  };
  socket.onclose = () => {
    for (const task of pending.values()) task.reject(new Error('Chrome disconnected'));
    pending.clear();
  };
  const command = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
  const { targetId } = await command('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await command('Target.attachToTarget', { targetId, flatten: true });
  const evaluate = async (expression) => {
    const result = await command(
      'Runtime.evaluate',
      { expression, awaitPromise: true, returnByValue: true },
      sessionId
    );
    if (result.exceptionDetails)
      throw new Error(
        result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description
      );
    return result.result.value;
  };
  const waitFor = async (expression, timeout = 3000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await evaluate(`Boolean(${expression})`)) return;
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    throw new Error('Condition timed out: ' + expression + '\n' + browserErrors.join('\n'));
  };
  await command('Page.enable', {}, sessionId);
  await command('Runtime.enable', {}, sessionId);
  await command('Page.navigate', { url: `http://127.0.0.1:${server.address().port}` }, sessionId);
  await waitFor('window.ready && document.querySelector("[role=radiogroup]")');
  await command(
    'Emulation.setDeviceMetricsOverride',
    { width: 1280, height: 1000, deviceScaleFactor: 1, mobile: false },
    sessionId
  );
  await evaluate(
    `document.documentElement.dataset.theme='light'; document.querySelector('#hint-long').focus()`
  );
  await waitFor(
    `document.querySelector('[role=tooltip]')?.textContent.includes('deliberately long')`
  );
  await command(
    'Input.dispatchKeyEvent',
    { type: 'keyDown', key: 'Escape', code: 'Escape' },
    sessionId
  );
  await command(
    'Input.dispatchKeyEvent',
    { type: 'keyUp', key: 'Escape', code: 'Escape' },
    sessionId
  );
  await waitFor(`!document.querySelector('[role=tooltip]')`);
  await evaluate(
    `document.querySelector('#hint-short').focus(); document.querySelector('#hint-long').focus()`
  );
  await waitFor(
    `document.querySelector('[role=tooltip]')?.textContent.includes('deliberately long')`
  );
  await evaluate(`document.querySelector('#hint-long').style.width='1200px'`);
  await waitFor(`!document.querySelector('[role=tooltip]')`);
  await evaluate(`document.querySelector('#hint-short').focus()`);
  assert.equal(
    await evaluate(`document.querySelector('[role=tooltip]')?.textContent ?? null`),
    null
  );
  await evaluate(
    `document.querySelector('#hint-long').style.width='160px'; document.querySelector('#hint-long').focus()`
  );
  await waitFor(
    `document.querySelector('[role=tooltip]')?.textContent.includes('deliberately long')`
  );
  await evaluate(`window.setHintText('Now short')`);
  await waitFor(`!document.querySelector('[role=tooltip]')`);
  assert.equal(
    await evaluate(`document.querySelector('#hint-long').querySelector('[tabindex]') !== null`),
    false
  );
  await command(
    'Emulation.setDeviceMetricsOverride',
    { width: 375, height: 1000, deviceScaleFactor: 1, mobile: false },
    sessionId
  );
  await evaluate(`document.getElementById('hint-row').focus()`);
  await waitFor(`document.querySelector('[role=tooltip]')?.textContent === 'Nested article title'`);
  const nestedDatePoint = await evaluate(
    `(()=>{const r=document.getElementById('hint-date').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`
  );
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', ...nestedDatePoint }, sessionId);
  await waitFor(
    `document.querySelectorAll('[role=tooltip]').length===1 && document.querySelector('[role=tooltip]').textContent==='Exact publication date'`
  );
  assert.equal(
    await evaluate(`document.getElementById('hint-row').getAttribute('aria-describedby')`),
    null
  );
  const nestedTitlePoint = await evaluate(
    `(()=>{const r=document.querySelector('[data-nested-title]').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`
  );
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', ...nestedTitlePoint }, sessionId);
  await waitFor(
    `document.querySelectorAll('[role=tooltip]').length===1 && document.querySelector('[role=tooltip]').textContent==='Nested article title'`
  );
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 350, y: 900 }, sessionId);
  await evaluate(`document.getElementById('hint-short').focus()`);
  await waitFor(`!document.querySelector('[role=tooltip]')`);
  await command(
    'Emulation.setDeviceMetricsOverride',
    { width: 1280, height: 1000, deviceScaleFactor: 1, mobile: false },
    sessionId
  );
  const iconGeometry = await evaluate(
    `['icon-xs','icon-sm'].map(id=>{const el=document.getElementById(id),css=getComputedStyle(el);return{width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,radius:css.borderRadius,color:css.color,iconWidth:el.querySelector('svg').getBoundingClientRect().width,stroke:getComputedStyle(el.querySelector('path')).strokeWidth};})`
  );
  assert.deepEqual(
    iconGeometry.map(({ width, height }) => [width, height]),
    [
      [28, 28],
      [32, 32],
    ]
  );
  assert.equal(iconGeometry[0].radius, iconGeometry[1].radius);
  assert.equal(iconGeometry[0].color, iconGeometry[1].color);
  assert.equal(iconGeometry[0].stroke, '1.75px');
  assert.equal(iconGeometry[0].iconWidth, 16);
  await evaluate(`document.getElementById('invalid-field').focus()`);
  await waitFor(
    `getComputedStyle(document.getElementById('invalid-field')).borderColor === 'rgb(215, 0, 21)'`
  );
  const invalidFocus = await evaluate(
    `({border:getComputedStyle(document.getElementById('invalid-field')).borderColor,shadow:getComputedStyle(document.getElementById('invalid-field')).boxShadow})`
  );
  assert.equal(invalidFocus.border, 'rgb(215, 0, 21)');
  assert.notEqual(invalidFocus.shadow, 'none');
  await evaluate(`document.documentElement.dataset.theme='dark'`);
  await waitFor(
    `getComputedStyle(document.getElementById('invalid-field')).borderColor === 'rgb(255, 69, 58)'`
  );
  assert.equal(
    await evaluate(`getComputedStyle(document.getElementById('invalid-field')).borderColor`),
    'rgb(255, 69, 58)'
  );
  await evaluate(`document.documentElement.dataset.theme='light'`);
  assert.equal(
    await evaluate(
      `document.querySelector('#hint-card a').querySelector('[tabindex="0"],button,[role=button]') !== null`
    ),
    false
  );
  assert.equal(
    await evaluate(`document.querySelector('#hint-card a').hasAttribute('title')`),
    false
  );
  const orientations = [];
  for (const width of [800, 400, 320, 800]) {
    await command(
      'Emulation.setDeviceMetricsOverride',
      { width, height: 1000, deviceScaleFactor: 1, mobile: false },
      sessionId
    );
    const expected = [
      width <= 480 ? 'vertical' : 'horizontal',
      width <= 360 ? 'vertical' : 'horizontal',
      'horizontal',
    ];
    await waitFor(
      `Array.from(document.querySelectorAll('[role=radiogroup]')).every((element,index) => element.getAttribute('aria-orientation') === ${JSON.stringify(expected)}[index])`
    );
    const result = await evaluate(
      `Array.from(document.querySelectorAll('[role=radiogroup]')).map(element => ({aria: element.getAttribute('aria-orientation'), css: getComputedStyle(element).flexDirection}))`
    );
    result.forEach((item, index) => {
      assert.equal(item.aria, expected[index]);
      if (index !== 2) assert.equal(item.css, expected[index] === 'vertical' ? 'column' : 'row');
    });
    for (const [index, id] of ['stack-default', 'stack-narrow', 'stack-never'].entries()) {
      const key = expected[index] === 'vertical' ? 'ArrowDown' : 'ArrowRight';
      await evaluate(`document.querySelector('#${id} button').focus()`);
      await command('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key }, sessionId);
      await command('Input.dispatchKeyEvent', { type: 'keyUp', key }, sessionId);
      await waitFor(
        `document.querySelectorAll('#${id} button')[1].getAttribute('aria-checked') === 'true'`
      );
      await evaluate(`document.querySelector('#${id} button').click()`);
    }
    orientations.push({ width, groups: result });
  }
  const slider = await evaluate(
    `(() => {const el=document.querySelector('input[type=range]'); const r=el.getBoundingClientRect(); const track=el.previousElementSibling.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,trackCenter:track.y+track.height/2,inputCenter:r.y+r.height/2};})()`
  );
  assert(slider.height >= 40, 'Slider needs a real expanded native input hit area');
  assert(
    Math.abs(slider.trackCenter - slider.inputCenter) < 0.1,
    'Slider track must remain centered'
  );
  const sliderValues = [];
  for (const offset of [-12, 12]) {
    const x = slider.x + slider.width * (offset < 0 ? 0.8 : 0.2);
    const y = slider.inputCenter + offset;
    await command(
      'Input.dispatchMouseEvent',
      { type: 'mousePressed', x, y, button: 'left', clickCount: 1 },
      sessionId
    );
    await command(
      'Input.dispatchMouseEvent',
      { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 },
      sessionId
    );
    const value = await evaluate('Number(document.querySelector("input[type=range]").value)');
    assert(
      offset < 0 ? value > 70 : value < 30,
      `Slider offset ${offset}px should update through the native range input`
    );
    sliderValues.push({ offset, value });
  }
  const beforeKey = await evaluate('Number(document.querySelector("input[type=range]").value)');
  await command(
    'Input.dispatchKeyEvent',
    { type: 'keyDown', key: 'ArrowLeft', code: 'ArrowLeft' },
    sessionId
  );
  await command(
    'Input.dispatchKeyEvent',
    { type: 'keyUp', key: 'ArrowLeft', code: 'ArrowLeft' },
    sessionId
  );
  await waitFor(`Number(document.querySelector('input[type=range]').value) === ${beforeKey - 1}`);
  assert(
    (await evaluate('window.commits')).includes(beforeKey - 1),
    'Slider keyboard release still commits'
  );
  await waitFor(`document.querySelectorAll('[data-lk=github] button').length === 2`, 12000);
  assert.equal(
    await evaluate('window.requests'),
    1,
    'Identical cards share the initial timed-out request'
  );
  assert.equal(await evaluate('document.querySelectorAll("[data-lk=github] a button").length'), 0);
  const retryLabels = await evaluate(
    `Array.from(document.querySelectorAll('[data-lk=github] button')).map(el=>el.textContent)`
  );
  assert.deepEqual(retryLabels, ['Retry', '重试']);
  await evaluate(`window.phase='error'; document.querySelector('[data-lk=github] button').click()`);
  await waitFor(
    `window.requests === 2 && document.querySelector('[data-lk=github] button').textContent === 'Retry'`
  );
  assert.equal(
    await evaluate('window.requests'),
    2,
    'Timed-out shared requests are cleared before retry'
  );
  await evaluate(
    `window.phase='success'; const buttons=document.querySelectorAll('[data-lk=github] button'); buttons[0].click(); buttons[1].focus(); buttons[1].click()`
  );
  await waitFor(
    `document.querySelectorAll('[data-lk=github] button[aria-disabled=true][aria-busy=true]').length === 2`
  );
  await waitFor(`document.querySelectorAll('[data-lk=github] button').length === 0`);
  assert.equal(await evaluate('window.requests'), 3, 'Concurrent retries deduplicate');
  assert.equal(
    await evaluate('document.activeElement.href'),
    'https://github.com/qa/recovery',
    'Recovery restores the focused retry to its repository link'
  );
  assert.equal(
    await evaluate(
      `Array.from(document.querySelectorAll('[data-lk=github]')).every(el=>el.textContent.includes('Recovered repository'))`
    ),
    true
  );
  console.log(
    JSON.stringify(
      {
        passed: true,
        orientations,
        slider,
        sliderValues,
        requests: await evaluate('window.requests'),
        commits: await evaluate('window.commits'),
      },
      null,
      2
    )
  );
} finally {
  socket?.close();
  if (chrome?.pid && chrome.exitCode === null && chrome.signalCode === null) {
    const closed = new Promise((resolve) => chrome.once('exit', resolve));
    chrome.kill();
    await closed;
  }
  if (server) await new Promise((resolve) => server.close(resolve));
  await rm(temporary, { recursive: true, force: true });
}
