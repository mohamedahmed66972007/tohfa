import { Trophy } from "lucide-react";

interface HeaderProps {
  title?: string;
  onLogoClick?: () => void;
}

export default function Header({ title = "مسابقات تحفة", onLogoClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm border-b border-primary/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform group"
            onClick={onLogoClick}
          >
            <Trophy className="h-8 w-8 md:h-10 md:w-10 text-primary drop-shadow-[0_0_15px_currentColor] group-hover:rotate-12 transition-transform" />
            <h1 
              className="text-3xl md:text-4xl font-bold text-primary drop-shadow-[0_0_15px_currentColor]"
              style={{ fontFamily: "'Changa', 'Cairo', sans-serif" }}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}