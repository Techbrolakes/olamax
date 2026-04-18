type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: Props) {
  return (
    <header className="flex flex-col gap-4 pb-10 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        {eyebrow ? <p className="meta-label">{eyebrow}</p> : null}
        <h1 className="font-serif text-5xl tracking-[-0.02em] md:text-6xl">
          <span className="italic">{title}</span>
        </h1>
        {description ? (
          <p className="max-w-2xl text-lg text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
