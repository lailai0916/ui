import {
  createContext,
  useContext,
  useMemo,
  type AnchorHTMLAttributes,
  type ComponentType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface LaikitMessages {
  quoteAttributionDash: string;
  githubError: string;
  githubRetry: string;
  githubRetrying: string;
  githubNoDescription: string;
  githubStars: string;
  githubForks: string;
  githubLicense: string;
  githubLanguage: string;
  other: string;
}

export const enMessages: LaikitMessages = {
  quoteAttributionDash: '— ',
  githubError: 'Failed to load GitHub data',
  githubRetry: 'Retry',
  githubRetrying: 'Retrying…',
  githubNoDescription: 'No description provided',
  githubStars: 'Stars',
  githubForks: 'Forks',
  githubLicense: 'License',
  githubLanguage: 'Primary language',
  other: 'Other',
};

export const zhHansMessages: LaikitMessages = {
  quoteAttributionDash: '——',
  githubError: '无法加载 GitHub 数据',
  githubRetry: '重试',
  githubRetrying: '正在重试…',
  githubNoDescription: '暂无描述',
  githubStars: '星标',
  githubForks: '复刻',
  githubLicense: '许可证',
  githubLanguage: '主要语言',
  other: '其他',
};

function NativeLink({ to, href, ...props }: LinkProps) {
  return <a {...props} href={to ?? href} />;
}

function NativeHeading({ as: Tag, ...props }: HeadingProps) {
  return <Tag {...props} />;
}

/** Single labels pass through; pipe-separated labels use the locale's plural categories. */
export function selectPluralMessage(count: number, label: string, locale = 'en'): string {
  const forms = label.split('|');
  if (forms.length === 1) return label;
  const rules = new Intl.PluralRules(locale);
  const categories = ['zero', 'one', 'two', 'few', 'many', 'other'].filter((category) =>
    rules.resolvedOptions().pluralCategories.includes(category as Intl.LDMLPluralRule)
  );
  return forms[categories.indexOf(rules.select(count))] ?? forms[forms.length - 1];
}

interface LaikitContextValue {
  locale: string;
  messages: LaikitMessages;
  linkComponent: ComponentType<LinkProps>;
  headingComponent: ComponentType<HeadingProps>;
  selectMessage: (count: number, label: string) => string;
}

const LaikitContext = createContext<LaikitContextValue>({
  locale: 'en',
  messages: enMessages,
  linkComponent: NativeLink,
  headingComponent: NativeHeading,
  selectMessage: selectPluralMessage,
});

export interface LaikitProviderProps {
  children: ReactNode;
  locale?: string;
  messages?: Partial<LaikitMessages>;
  linkComponent?: ComponentType<LinkProps>;
  headingComponent?: ComponentType<HeadingProps>;
  selectMessage?: (count: number, label: string) => string;
}

/** Connects host routing and localization without adding a layout wrapper. */
export function LaikitProvider({
  children,
  locale,
  messages,
  linkComponent,
  headingComponent,
  selectMessage,
}: LaikitProviderProps) {
  const parent = useContext(LaikitContext);
  const value = useMemo(() => {
    const resolvedLocale = locale ?? parent.locale;
    const defaults = resolvedLocale.startsWith('zh') ? zhHansMessages : enMessages;
    return {
      locale: resolvedLocale,
      messages: { ...(locale ? defaults : parent.messages), ...messages },
      linkComponent: linkComponent ?? parent.linkComponent,
      headingComponent: headingComponent ?? parent.headingComponent,
      selectMessage:
        selectMessage ??
        (locale
          ? (count: number, label: string) => selectPluralMessage(count, label, resolvedLocale)
          : parent.selectMessage),
    };
  }, [parent, locale, messages, linkComponent, headingComponent, selectMessage]);

  return <LaikitContext.Provider value={value}>{children}</LaikitContext.Provider>;
}

export function useLaikit() {
  return useContext(LaikitContext);
}

export function Link(props: LinkProps) {
  const { linkComponent: Component } = useLaikit();
  return <Component {...props} />;
}

export function Heading(props: HeadingProps) {
  const { headingComponent: Component } = useLaikit();
  return <Component {...props} />;
}
