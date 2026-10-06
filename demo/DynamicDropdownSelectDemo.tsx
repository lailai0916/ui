import { useRef, useState } from 'react';
import {
  Button,
  Cluster,
  DropdownSelectField,
  Stack,
  TextArea,
  TitleCard,
  type DropdownSelectOption,
} from '../src/index';

const presets = [
  { category: 'length', unit: 'inch' },
  { category: 'temperature', unit: 'kelvin' },
  { category: 'data', unit: 'PiB' },
  { category: 'duration', unit: 'week' },
  { category: 'angle', unit: 'turn' },
  { category: 'length', unit: 'meter' },
] as const;
const units: Record<string, readonly DropdownSelectOption[]> = {
  length: [
    { value: 'meter', label: 'Meter' },
    { value: 'inch', label: 'Inch' },
    { value: 'foot', label: 'Foot' },
  ],
  temperature: [
    { value: 'celsius', label: 'Celsius' },
    { value: 'kelvin', label: 'Kelvin' },
    { value: 'fahrenheit', label: 'Fahrenheit' },
  ],
  data: [
    { value: 'byte', label: 'Byte' },
    { value: 'GiB', label: 'GiB' },
    { value: 'PiB', label: 'PiB' },
  ],
  duration: [
    { value: 'second', label: 'Second' },
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
  ],
  angle: [
    { value: 'degree', label: 'Degree' },
    { value: 'radian', label: 'Radian' },
    { value: 'turn', label: 'Turn' },
  ],
};

type Selection = { category: string; unit: string };
type Trace = Selection & {
  action: 'preset' | 'unit-change';
  previous?: string;
  valid?: boolean;
  event: string;
};

export default function DynamicDropdownSelectDemo({ chinese }: { chinese: boolean }) {
  const [presetIndex, setPresetIndex] = useState(0);
  const [selection, setSelection] = useState<Selection>(presets[0]);
  const [trace, setTrace] = useState<Trace[]>([]);
  const lastEvent = useRef('initial');
  const labels: Record<string, string> = chinese
    ? {
        Meter: '米',
        Inch: '英寸',
        Foot: '英尺',
        Celsius: '摄氏度',
        Kelvin: '开尔文',
        Fahrenheit: '华氏度',
        Byte: '字节',
        Second: '秒',
        Day: '天',
        Week: '周',
        Degree: '度',
        Radian: '弧度',
        Turn: '圈',
      }
    : {};
  const options = units[selection.category].map((option) => ({
    ...option,
    label: labels[option.label] ?? option.label,
  }));
  return (
    <section
      aria-labelledby="dynamic-dropdown-select"
      onKeyDownCapture={(event) => {
        lastEvent.current = `keydown:${event.key}`;
      }}
      onClickCapture={(event) => {
        const target = event.target as HTMLElement;
        lastEvent.current = `click:${target.closest('[data-lk], button')?.getAttribute('data-lk') ?? target.id}`;
      }}
    >
      <h2 id="dynamic-dropdown-select">
        {chinese ? '动态选项与受控值' : 'Dynamic options and controlled values'}
      </h2>
      <TitleCard title={chinese ? '联动选择器' : 'Linked selections'}>
        <Stack>
          <p>
            {chinese
              ? '同时切换选项和值。打开或取消菜单应保留当前值，选择新选项时才触发变更回调。'
              : 'Update options and value together. Opening or dismissing the menu preserves the current value; choosing an option emits a change.'}
          </p>
          <Cluster>
            <Button
              id="demo-dynamic-next"
              onClick={() => {
                const nextIndex = (presetIndex + 1) % presets.length;
                const next = presets[nextIndex];
                setPresetIndex(nextIndex);
                setSelection(next);
                setTrace((current) => [
                  ...current,
                  { ...next, action: 'preset', event: lastEvent.current },
                ]);
              }}
            >
              {chinese ? '切换到下一组' : 'Next preset'}
            </Button>
            <Button
              id="demo-dynamic-restart"
              onClick={() => {
                setPresetIndex(0);
                setSelection(presets[0]);
                setTrace([]);
              }}
            >
              {chinese ? '重新开始' : 'Restart'}
            </Button>
          </Cluster>
          <DropdownSelectField
            id="demo-dynamic-unit"
            label={chinese ? '单位' : 'Unit'}
            options={options}
            value={selection.unit}
            onValueChange={(unit) => {
              setTrace((current) => [
                ...current,
                {
                  category: selection.category,
                  previous: selection.unit,
                  unit,
                  action: 'unit-change',
                  valid: options.some((option) => option.value === unit),
                  event: lastEvent.current,
                },
              ]);
              setSelection((current) => ({ ...current, unit }));
            }}
          />
          <output id="demo-dynamic-state">{JSON.stringify(selection)}</output>
          <TextArea
            id="demo-dynamic-trace"
            aria-label={chinese ? '事件与回调记录' : 'Event and callback trace'}
            value={JSON.stringify(trace, null, 2)}
            readOnly
            monospace
            rows={8}
          />
        </Stack>
      </TitleCard>
    </section>
  );
}
