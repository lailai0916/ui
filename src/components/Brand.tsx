type BrandProps = {
  logoAlt?: string;
  logoSrc: string;
  name: string;
};

export function Brand({ logoAlt = '', logoSrc, name }: BrandProps) {
  return (
    <span className="lui-brand">
      <img className="lui-brand__logo" src={logoSrc} alt={logoAlt} />
      <span>{name}</span>
    </span>
  );
}
