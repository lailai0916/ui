import { useState } from 'react';
import {
  Button,
  Checkbox,
  Cluster,
  Dialog,
  DropdownSelect,
  DropdownSelectField,
  Stack,
  TitleCard,
  type DropdownSelectOption,
} from '../src/index';

export default function DropdownSelectDemo({ chinese }: { chinese: boolean }) {
  const text = chinese
    ? {
        title: '下拉选择',
        basic: '选项与状态',
        view: '显示内容',
        overview: '概览',
        details: '详情',
        all: '全部内容（空字符串值）',
        disabled: '不可用的选项',
        long: '包含完整名称、补充说明和很长文本的选项，用于检查窄屏截断与弹层换行',
        help: '支持方向键、首尾键和输入选项名称。',
        changes: '变更次数',
        empty: '空字符串也是有效选项值。',
        disabledControl: '禁用的选择器',
        many: '滚动与对话框',
        item: '选项',
        manyLabel: '较长的选项列表',
        manyHelp: '40 个选项；长列表在弹层内滚动。',
        open: '在对话框内选择',
        dialog: '对话框内的选择器',
        dialogHelp: '弹层保持在原生对话框内，关闭后焦点返回打开按钮。',
        close: '关闭对话框',
        form: '表单与重置',
        required: '必填项目',
        placeholder: '请选择项目',
        requiredHelp: '提交前必须选择一个非空值。',
        priority: '优先级',
        normal: '普通',
        high: '高',
        submit: '提交',
        reset: '重置',
        preventReset: '阻止表单重置',
        submitted: '提交值',
        idle: '尚未提交；重置会恢复初始值。',
      }
    : {
        title: 'Dropdown Select',
        basic: 'Options and states',
        view: 'Content view',
        overview: 'Overview',
        details: 'Details',
        all: 'All content (empty string value)',
        disabled: 'Unavailable option',
        long: 'An option with a complete title, supporting detail, and a very long label to check narrow triggers and wrapped popup text',
        help: 'Use arrow keys, Home, End, or type an option name.',
        changes: 'Changes',
        empty: 'An empty string is also a valid option value.',
        disabledControl: 'Disabled select',
        many: 'Scrolling and dialogs',
        item: 'Option',
        manyLabel: 'Long option list',
        manyHelp: '40 options; long lists scroll inside the popup.',
        open: 'Select inside a dialog',
        dialog: 'Select inside a dialog',
        dialogHelp: 'The popup stays in the native dialog. Closing restores focus to its opener.',
        close: 'Close dialog',
        form: 'Forms and reset',
        required: 'Required project',
        placeholder: 'Choose a project',
        requiredHelp: 'Choose a nonempty value before submitting.',
        priority: 'Priority',
        normal: 'Normal',
        high: 'High',
        submit: 'Submit',
        reset: 'Reset',
        preventReset: 'Prevent form reset',
        submitted: 'Submitted values',
        idle: 'Not submitted; reset restores the initial values.',
      };
  const [view, setView] = useState('overview');
  const [changes, setChanges] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [project, setProject] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [preventReset, setPreventReset] = useState(false);
  const views: DropdownSelectOption[] = [
    { value: '', label: text.all },
    { value: 'overview', label: text.overview },
    { value: 'unavailable', label: text.disabled, disabled: true },
    { value: 'details', label: text.details },
    { value: 'long', label: text.long },
  ];
  const manyOptions: DropdownSelectOption[] = Array.from({ length: 40 }, (_, index) => ({
    value: `option-${index + 1}`,
    label: `${text.item} ${String(index + 1).padStart(2, '0')}${index === 6 ? ` — ${text.long}` : ''}`,
    disabled: index === 16,
  }));
  return (
    <section aria-labelledby="dropdown-select">
      <h2 id="dropdown-select">{text.title}</h2>
      <div className="grid">
        <TitleCard title={text.basic}>
          <Stack>
            <DropdownSelectField
              id="demo-dropdown-view"
              label={text.view}
              description={text.help}
              options={views}
              value={view}
              onValueChange={(next) => {
                setView(next);
                setChanges((current) => current + 1);
              }}
            />
            <output id="demo-dropdown-changes">{`${text.changes}: ${changes}`}</output>
            <DropdownSelect
              id="demo-dropdown-empty"
              aria-label={text.all}
              options={views}
              defaultValue=""
            />
            <p>{text.empty}</p>
          </Stack>
        </TitleCard>
        <TitleCard title={text.many}>
          <Stack>
            <DropdownSelectField
              id="demo-dropdown-many"
              label={text.manyLabel}
              description={text.manyHelp}
              options={manyOptions}
              defaultValue="option-1"
            />
            <Button id="demo-dropdown-dialog-open" onClick={() => setDialogOpen(true)}>
              {text.open}
            </Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} label={text.dialog}>
              <Stack>
                <h2>{text.dialog}</h2>
                <DropdownSelectField
                  id="demo-dropdown-dialog"
                  label={text.view}
                  description={text.dialogHelp}
                  options={manyOptions}
                  defaultValue="option-1"
                  autoFocus
                />
                <Button onClick={() => setDialogOpen(false)}>{text.close}</Button>
              </Stack>
            </Dialog>
          </Stack>
        </TitleCard>
        <TitleCard title={text.form}>
          <form
            id="demo-dropdown-form"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              setSubmitted(`project=${data.get('project')}; priority=${data.get('priority')}`);
            }}
            onReset={(event) => {
              if (preventReset) {
                event.preventDefault();
                return;
              }
              setProject('');
              setSubmitted('');
            }}
          >
            <Stack>
              <DropdownSelectField
                id="demo-dropdown-project"
                name="project"
                label={text.required}
                description={text.requiredHelp}
                placeholder={text.placeholder}
                options={[
                  { value: 'home', label: 'Home' },
                  { value: 'tools', label: 'Tools' },
                  { value: 'academy', label: 'Academy' },
                ]}
                value={project}
                onValueChange={setProject}
                required
              />
              <DropdownSelectField
                id="demo-dropdown-priority"
                name="priority"
                label={text.priority}
                options={[
                  { value: 'normal', label: text.normal },
                  { value: 'high', label: text.high },
                ]}
                defaultValue="normal"
              />
              <DropdownSelectField
                id="demo-dropdown-disabled"
                name="unavailable"
                label={text.disabledControl}
                options={views}
                defaultValue="details"
                disabled
              />
              <Checkbox
                id="demo-dropdown-prevent-reset"
                label={text.preventReset}
                checked={preventReset}
                onChange={(event) => setPreventReset(event.target.checked)}
              />
              <Cluster>
                <Button type="submit">{text.submit}</Button>
                <Button type="reset">{text.reset}</Button>
              </Cluster>
              <output aria-live="polite">
                {submitted ? `${text.submitted}: ${submitted}` : text.idle}
              </output>
            </Stack>
          </form>
        </TitleCard>
      </div>
    </section>
  );
}
