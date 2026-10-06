import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Dialog, DropdownSelect, DropdownSelectField, LaikitProvider } from '../dist/index.js';

const options = [
  { value: '', label: 'All content' },
  { value: 'alpha', label: 'Alpha project' },
  { value: 'beta', label: 'Beta project', disabled: true },
];
const render = (node) => renderToStaticMarkup(h(LaikitProvider, { locale: 'en' }, node));

test('dropdown selects have matching root and component-subpath exports', async () => {
  const component = await import('../dist/components/DropdownSelect/index.js');
  assert.equal(component.default, DropdownSelect);
  assert.equal(component.DropdownSelect, DropdownSelect);
  assert.equal(component.DropdownSelectField, DropdownSelectField);
  const declarations = await readFile('dist/components/DropdownSelect/index.d.ts', 'utf8');
  for (const name of ['DropdownSelectOption', 'DropdownSelectProps', 'DropdownSelectFieldProps']) {
    assert.match(declarations, new RegExp(`export (?:type|interface) ${name}\\b`));
  }
});

test('server-rendered dropdowns expose a named button and selected label without a popup', () => {
  const html = render(
    h(DropdownSelect, {
      options,
      defaultValue: 'alpha',
      id: 'project',
      'aria-label': 'Project',
      className: 'project-trigger',
    })
  );
  assert.match(html, /<button[^>]*type="button"/);
  assert.match(html, /<button[^>]*id="project"[^>]*role="combobox"/);
  assert.match(html, /aria-label="Project"/);
  assert.match(html, /aria-haspopup="listbox"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /<button[^>]*class="[^"]*project-trigger/);
  assert.match(html, /Alpha project/);
  assert.doesNotMatch(html, /data-lk="dropdown-select-popup"/);
});

test('empty string selections retain their option labels and unset values show placeholders', () => {
  for (const selection of [{ defaultValue: '' }, { value: '' }]) {
    const html = render(
      h(DropdownSelect, { options, ...selection, placeholder: 'Choose a project' })
    );
    assert.match(html, /All content/);
    assert.doesNotMatch(html, /Choose a project/);
  }
  for (const selection of [{}, { value: '' }]) {
    const html = render(
      h(DropdownSelect, {
        options: options.slice(1),
        ...selection,
        placeholder: 'Choose a project',
        'aria-label': 'Project',
      })
    );
    assert.match(html, /Choose a project/);
  }
});

test('dropdown form metadata preserves the submitted value, required state, and disabled state', () => {
  const required = render(
    h(DropdownSelect, {
      options,
      name: 'project',
      form: 'project-form',
      defaultValue: 'alpha',
      required: true,
      'aria-label': 'Project',
    })
  );
  assert.match(required, /<button[^>]*aria-required="true"/);
  assert.match(required, /<button[^>]*form="project-form"/);
  assert.match(required, /<input[^>]*form="project-form"/);
  assert.match(required, /<input[^>]*required=""[^>]*name="project"[^>]*value="alpha"/);
  const disabled = render(
    h(DropdownSelect, { options, name: 'project', defaultValue: 'alpha', disabled: true })
  );
  assert.match(disabled, /<button[^>]*disabled=""/);
  assert.match(disabled, /<input[^>]*disabled=""[^>]*name="project"/);
});

test('dropdown fields link visible labels, caller descriptions, help, and errors to the trigger', () => {
  const html = render(
    h(DropdownSelectField, {
      options,
      id: 'project',
      label: 'Project',
      description: 'Choose the destination.',
      error: 'A destination is required.',
      'aria-describedby': 'external-help',
      wrapperClassName: 'project-field',
    })
  );
  assert.match(html, /<div[^>]*class="[^"]*project-field/);
  assert.match(html, /<label[^>]*for="project">Project<\/label>/);
  assert.match(html, /<button[^>]*id="project"/);
  assert.match(html, /aria-describedby="external-help project-description project-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /<p id="project-description"[^>]*>Choose the destination\.<\/p>/);
  assert.match(html, /<p id="project-error"[^>]*role="alert">A destination is required\.<\/p>/);
});

test('dropdown field generated IDs remain internally associated during server rendering', () => {
  const html = render(
    h(DropdownSelectField, { options, label: 'Project', description: 'Choose a destination.' })
  );
  const fieldId = html.match(/<label[^>]*for="([^"]+)"/)?.[1];
  assert.ok(fieldId);
  assert.ok(html.includes(`id="${fieldId}"`));
  assert.ok(html.includes(`aria-describedby="${fieldId}-description"`));
  assert.ok(html.includes(`id="${fieldId}-description"`));
});

test('dropdown fields render inside native dialogs without browser globals', () => {
  const html = renderToStaticMarkup(
    h(
      LaikitProvider,
      { locale: 'zh-Hans' },
      h(
        Dialog,
        { open: true, onClose() {}, label: '选择项目' },
        h(DropdownSelectField, {
          label: '项目',
          options: [{ value: 'tools', label: '工具' }],
          defaultValue: 'tools',
        })
      )
    )
  );
  assert.match(html, /<dialog[^>]*aria-label="选择项目"/);
  assert.match(html, /<label[^>]*>项目<\/label>/);
  assert.match(html, /工具/);
  assert.doesNotMatch(html, /data-lk="dropdown-select-popup"/);
});
