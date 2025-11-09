interface HeaderProps {
  title?: string;
}

export default function Header({ title = "مسابقات تحفة" }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm border-b border-primary/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          {title}
        </h1>
      </div>
    </header>
  );
}
