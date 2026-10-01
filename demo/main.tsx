import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Avatar,
  Brand,
  Cluster,
  EmptyState,
  IconButton,
  PageContainer,
  Panel,
  PanelHeader,
  PanelBody,
  PanelFooter,
  Progress,
  SelectField,
  Stack,
  TextField,
  TextAreaField,
  ThemeProvider,
  ThemeControl,
  Badge,
  Button,
  Card,
  Chart,
  DataCard,
  DataState,
  Donut,
  GitHub,
  Icon,
  IconBlock,
  LaikitProvider,
  LinkCard,
  MDTitle,
  PageContent,
  PageHeader,
  PageTitle,
  Paginator,
  Quote,
  Segmented,
  ShareCard,
  Skeleton,
  Slider,
  Switch,
  TitleCard,
  Tooltip,
  TrafficLights,
  WindowBar,
  WindowPanel,
} from '../src/index';
import '../src/theme.css';
import './styles.css';

const chinese = new URLSearchParams(window.location.search).get('lang') === 'zh-Hans';
const locale = chinese ? 'zh-Hans' : 'en';
document.documentElement.lang = locale;
const copy = chinese
  ? {
      description: '用于统一网站界面的 React 组件与主题变量。',
      controls: '交互控件',
      cards: '卡片与布局',
      charts: '数据图表',
      content: '内容与窗口',
      primary: '主要操作',
      secondary: '次要操作',
      disabled: '不可用',
      enabled: '启用通知',
      value: '数值',
      empty: '暂无数据',
      retry: '重试',
      error: '数据加载失败',
      reset: '重置',
      repositories: '仓库',
      tabOne: '概览',
      tabTwo: '详情',
      collapse: '收起',
      expand: '展开',
      quote: '统一 · 简约 · 现代',
      note: '跟随系统深浅主题，支持键盘操作。',
      previous: '上一页',
      next: '下一页',
      navigation: '组件导航',
      source: '查看源代码',
      clicks: '点击次数',
      language: '语言',
      view: '视图',
      active: '已选中',
      other: '其他',
      forms: '表单与应用组件',
      name: '姓名',
      descriptionLabel: '描述',
      system: '跟随系统',
      light: '浅色',
      dark: '深色',
      delete: '删除',
    }
  : {
      description: 'React components and design tokens for consistent websites.',
      controls: 'Controls',
      cards: 'Cards and Layout',
      charts: 'Data Charts',
      content: 'Content and Windows',
      primary: 'Primary Action',
      secondary: 'Secondary Action',
      disabled: 'Disabled',
      enabled: 'Enable notifications',
      value: 'Value',
      empty: 'No data yet',
      retry: 'Retry',
      error: 'Data could not be loaded',
      reset: 'Reset',
      repositories: 'Repository|Repositories',
      tabOne: 'Overview',
      tabTwo: 'Details',
      collapse: 'Collapse',
      expand: 'Expand',
      quote: 'Unity · Simplicity · Modernity',
      note: 'Follows the system theme and supports keyboard navigation.',
      previous: 'Previous',
      next: 'Next',
      navigation: 'Component navigation',
      source: 'View Source',
      clicks: 'Clicks',
      language: 'Language',
      view: 'View',
      active: 'Active',
      other: 'Other',
      forms: 'Forms and Application Components',
      name: 'Name',
      descriptionLabel: 'Description',
      system: 'System',
      light: 'Light',
      dark: 'Dark',
      delete: 'Delete',
    };

function App() {
  const [selected, setSelected] = useState('overview');
  const [enabled, setEnabled] = useState(true);
  const [value, setValue] = useState(40);
  const [clicks, setClicks] = useState(0);
  const months = chinese
    ? ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = months.map((month, index) => ({
    key: month,
    value: [12, 28, 18, 42, 35, 56][index],
    tooltipLabel: month,
    axisLabel: month,
  }));
  return (
    <LaikitProvider locale={locale}>
      <div className="demo">
        <nav className="navigation" aria-label={copy.language}>
          <a href="?lang=en" aria-current={!chinese ? 'page' : undefined}>
            English
          </a>
          <a href="?lang=zh-Hans" aria-current={chinese ? 'page' : undefined}>
            简体中文
          </a>
          <a href="https://github.com/lailai0916/ui">{copy.source}</a>
        </nav>
        <PageHeader aside={<Badge active>@lailai0916/ui</Badge>}>
          <PageTitle title="laikit UI" description={copy.description} />
        </PageHeader>
        <PageContent>
          <section aria-labelledby="forms">
            <h2 id="forms">{copy.forms}</h2>
            <PageContainer width={1100}>
              <div className="grid">
                <Panel>
                  <PanelHeader>
                    <Cluster>
                      <Avatar name="lailai" alt="lailai" />
                      <Brand
                        logoSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%231d9bf0'/%3E%3Cpath d='M10 8v16h14' stroke='white' stroke-width='3' fill='none'/%3E%3C/svg%3E"
                        name="laikit UI"
                      />
                    </Cluster>
                  </PanelHeader>
                  <PanelBody>
                    <Stack>
                      <TextField label={copy.name} description={copy.note} />
                      <TextAreaField label={copy.descriptionLabel} />
                      <SelectField label={copy.view} defaultValue="overview">
                        <option value="overview">{copy.tabOne}</option>
                        <option value="details">{copy.tabTwo}</option>
                      </SelectField>
                      <Progress label={copy.value} value={value} />
                    </Stack>
                  </PanelBody>
                  <PanelFooter>
                    <Cluster>
                      <Button variant="danger" size="lg">
                        {copy.delete}
                      </Button>
                      <IconButton label={copy.reset} onClick={() => setValue(0)}>
                        ↺
                      </IconButton>
                    </Cluster>
                  </PanelFooter>
                </Panel>
                <Stack>
                  <Panel tone="muted" feature>
                    <EmptyState
                      title={copy.empty}
                      description={copy.description}
                      action={<Button>{copy.retry}</Button>}
                    />
                  </Panel>
                  <ThemeControl
                    labels={{ system: copy.system, light: copy.light, dark: copy.dark }}
                  />
                  <Cluster>
                    <span>{copy.system}</span>
                    <ThemeControl
                      variant="compact"
                      labels={{ system: copy.system, light: copy.light, dark: copy.dark }}
                    />
                  </Cluster>
                </Stack>
              </div>
            </PageContainer>
          </section>
          <section aria-labelledby="controls">
            <h2 id="controls">{copy.controls}</h2>
            <div className="grid">
              <TitleCard title="Button" description={copy.note}>
                <div className="row">
                  <Button variant="primary" onClick={() => setClicks(clicks + 1)}>
                    {copy.primary}
                  </Button>
                  <Button onClick={() => setClicks(clicks + 1)}>{copy.secondary}</Button>
                  <Button disabled>{copy.disabled}</Button>
                </div>
                <output aria-live="polite">
                  {copy.clicks}: {clicks}
                </output>
              </TitleCard>
              <TitleCard title="Segmented">
                <Segmented
                  orientation="horizontal"
                  value={selected}
                  onChange={setSelected}
                  ariaLabel={copy.view}
                  items={[
                    { value: 'overview', label: copy.tabOne },
                    { value: 'details', label: copy.tabTwo },
                  ]}
                />
                <output>{selected === 'overview' ? copy.tabOne : copy.tabTwo}</output>
              </TitleCard>
              <TitleCard title="Slider / Switch">
                <Slider
                  label={copy.value}
                  value={value}
                  min={0}
                  max={100}
                  step={1}
                  onChange={setValue}
                />
                <label className="row">
                  {copy.enabled}
                  <Switch checked={enabled} onChange={setEnabled} aria-label={copy.enabled} />
                </label>
              </TitleCard>
            </div>
          </section>
          <section aria-labelledby="cards">
            <h2 id="cards">{copy.cards}</h2>
            <div className="grid">
              <DataCard value={24} label={copy.repositories} icon="lucide:layers" />
              <LinkCard
                title="laikit UI"
                description={copy.description}
                href="https://github.com/lailai0916/ui"
                fallbackIcon="lucide:component"
              />
              <Card>
                <div className="row">
                  <IconBlock icon="lucide:check" />
                  <Icon icon="lucide:check" width={20} />
                  <Badge icon="lucide:flag">Badge</Badge>
                  <Badge active>{copy.active}</Badge>
                </div>
                <p>{copy.note}</p>
              </Card>
              <ShareCard
                url="https://github.com/lailai0916/ui"
                title="laikit UI"
                description={copy.description}
              />
              <TitleCard title="Skeleton">
                <Skeleton height={18} />
                <Skeleton width="70%" height={18} />
              </TitleCard>
              <TitleCard title="DataState">
                <DataState
                  message={copy.empty}
                  action={<Button onClick={() => setClicks(0)}>{copy.reset}</Button>}
                />
              </TitleCard>
            </div>
          </section>
          <section aria-labelledby="charts">
            <h2 id="charts">{copy.charts}</h2>
            <div className="grid charts">
              <Chart title="Chart / Bar" type="bar" data={data} emptyText={copy.empty} />
              <Chart title="Chart / Line" type="line" data={data} emptyText={copy.empty} />
              <Donut
                title="Donut"
                icon="lucide:chart-pie"
                items={[
                  { x: 'React', y: 60 },
                  { x: 'CSS', y: 30 },
                  { x: 'HTML', y: 8 },
                  { x: copy.other, y: 2 },
                ]}
                maxSlices={3}
                emptyText={copy.empty}
              />
              <Chart
                title="Chart / Error"
                type="line"
                data={[]}
                emptyText={copy.empty}
                error={copy.error}
                errorAction={<Button>{copy.retry}</Button>}
              />
            </div>
          </section>
          <section aria-labelledby="content">
            <h2 id="content">{copy.content}</h2>
            <div className="grid">
              <Card>
                <MDTitle title="MDTitle" description={copy.note} />
                <Quote author="lailai">{copy.quote}</Quote>
              </Card>
              <GitHub repo="lailai0916/ui" />
              <Card>
                <div className="tooltipPreview">
                  <Tooltip>
                    <Tooltip.Label>Tooltip</Tooltip.Label>
                    <Tooltip.Value>42</Tooltip.Value>
                  </Tooltip>
                </div>
                <TrafficLights />
                <WindowBar>WindowBar</WindowBar>
              </Card>
            </div>
            <WindowPanel
              tabs={[
                { label: copy.tabOne, content: <p>{copy.description}</p> },
                { label: copy.tabTwo, content: <p>{copy.note}</p> },
              ]}
              collapseLabel={copy.collapse}
              expandLabel={copy.expand}
            />
            <Paginator
              ariaLabel={copy.navigation}
              prevItem={{ title: copy.controls, permalink: '#controls', label: copy.previous }}
              nextItem={{ title: copy.cards, permalink: '#cards', label: copy.next }}
            />
          </section>
        </PageContent>
      </div>
    </LaikitProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
