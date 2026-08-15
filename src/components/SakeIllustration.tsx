const commonProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
};

function NihonshuIcon() {
  return (
    <svg {...commonProps}>
      <path
        d="M24 10h10l2 8c3 4 4 9 4 14 0 9-4.5 15-10 15s-10-6-10-15c0-5 1-10 4-14l2-8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M22 10h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 40c2 3 6 5 11 5s9-2 11-5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="46" cy="46" rx="9" ry="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M37 46v3c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5v-3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ShochuIcon() {
  return (
    <svg {...commonProps}>
      <path
        d="M27 8h10v9l5 6c1.6 2 2.5 4.4 2.5 7v20a4 4 0 0 1-4 4H23.5a4 4 0 0 1-4-4V30c0-2.6.9-5 2.5-7l5-6V8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M25 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 34h22" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function AwamoriIcon() {
  return (
    <svg {...commonProps}>
      <path
        d="M24 12c-4 3-7 9-7 16 0 12 5.5 20 15 20s15-8 15-20c0-7-3-13-7-16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M22 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 12v-4h14v4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 30c3 2 7 3 13 3s10-1 13-3" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function WineIcon() {
  return (
    <svg {...commonProps}>
      <path
        d="M20 10h24c0 11-5 18-12 18S20 21 20 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M32 28v18" stroke="currentColor" strokeWidth="2" />
      <path d="M22 50h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 46c-6 0-10 1.5-10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 46c6 0 10 1.5 10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LiqueurIcon() {
  return (
    <svg {...commonProps}>
      <path d="M16 12h32l-14 20v14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 46c-6 0-10 1.5-10 4h20c0-2.5-4-4-10-4Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="18" r="2" fill="currentColor" />
      <circle cx="30" cy="14" r="2" fill="currentColor" />
    </svg>
  );
}

function BeerIcon() {
  return (
    <svg {...commonProps}>
      <path
        d="M16 18h24v28a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V18Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M40 24h4a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-4" stroke="currentColor" strokeWidth="2" />
      <path d="M16 24h24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <path d="M18 14c0-3 3-3 3-6M25 14c0-3 3-3 3-6M32 14c0-3 3-3 3-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WhiskyIcon() {
  return (
    <svg {...commonProps}>
      <path
        d="M20 14h24v10c3 3 4 7 4 12 0 9-6 15-16 15s-16-6-16-15c0-5 1-9 4-12V14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M20 14h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 34h4M14 40h4M46 34h4M46 40h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 34h24v8a12 12 0 0 1-24 0v-8Z" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

const ICONS: Record<string, () => React.JSX.Element> = {
  日本酒: NihonshuIcon,
  焼酎: ShochuIcon,
  泡盛: AwamoriIcon,
  ワイン: WineIcon,
  リキュール: LiqueurIcon,
  ビール: BeerIcon,
  ウイスキー: WhiskyIcon,
};

export function SakeIllustration({ category }: { category: string }) {
  const Icon = ICONS[category] ?? NihonshuIcon;
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
      <Icon />
    </div>
  );
}
