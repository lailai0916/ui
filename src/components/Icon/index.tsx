import { forwardRef } from 'react';
import { Icon as IconifyIcon, type IconProps as IconifyProps } from '@iconify/react';

export type IconProps = Omit<IconifyProps, 'children' | 'fallback' | 'mode'>;

const EMPTY_ICON = { body: '', width: 24, height: 24 };

const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ width, height, ...props }, ref) {
  const dimensions = {
    width: width ?? height ?? '1em',
    height: height ?? width ?? '1em',
  };

  // Keep the same SVG dimensions and CSS positioning before icon data arrives.
  return (
    <IconifyIcon
      {...props}
      {...dimensions}
      ref={ref}
      mode="svg"
      fallback={
        <IconifyIcon
          {...props}
          {...dimensions}
          ref={ref}
          mode="svg"
          ssr
          icon={EMPTY_ICON}
          onLoad={undefined}
        />
      }
    />
  );
});

export default Icon;
