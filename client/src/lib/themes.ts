export type ThemeId = 'default';

export interface Theme {
  id: ThemeId;
  name: string;
  nameAr: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
  };
  buttonStyle: {
    borderRadius: string;
  };
}

export const themes: Record<ThemeId, Theme> = {
  default: {
    id: 'default',
    name: 'Default',
    nameAr: 'افتراضي',
    colors: {
      background: '230 45% 8%',
      foreground: '210 100% 95%',
      primary: '210 100% 50%',
      primaryForeground: '230 45% 8%',
      secondary: '230 50% 20%',
      secondaryForeground: '210 100% 95%',
      accent: '265 100% 55%',
      accentForeground: '210 100% 95%',
      card: '230 40% 12%',
      cardForeground: '210 100% 95%',
      muted: '230 40% 25%',
      mutedForeground: '210 50% 70%',
    },
    buttonStyle: {
      borderRadius: '0.5rem',
    },
  },
};

export function getTheme(id: ThemeId): Theme {
  return themes.default;
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.foreground);
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--primary-foreground', theme.colors.primaryForeground);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--secondary-foreground', theme.colors.secondaryForeground);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--accent-foreground', theme.colors.accentForeground);
  root.style.setProperty('--card', theme.colors.card);
  root.style.setProperty('--card-foreground', theme.colors.cardForeground);
  root.style.setProperty('--muted', theme.colors.muted);
  root.style.setProperty('--muted-foreground', theme.colors.mutedForeground);

  root.style.setProperty('--radius', theme.buttonStyle.borderRadius);
}