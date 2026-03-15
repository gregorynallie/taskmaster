import { ThemeDefinition } from '../themeTypes';

export const dragonballZ: ThemeDefinition = {
  id: 'dragonball-z',
  name: 'Dragon Ball Z',
  category: 'Gaming & Pop Culture',
  font: "'Lilita One', sans-serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    addTask: 'playful',
    taskComplete: 'standard',
    suggestionAccept: 'standard',
    hover: 'theme-specific',
    enter: 'standard',
    viewTransition: 'pop',
    dismissTask: 'pop',
    levelUp: 'pop',
    progressBar: 'pop',
    inputField: 'pop',
    modal: 'pop',
    loadingState: 'theme-specific',
    button: 'pop',
  },
  cssVariables: {
    '--bkg': '#1A1A3D',
    '--surface': '#2A2A4D',
    '--surface-modal-bkg': 'rgba(42, 42, 77, 0.8)',
    '--primary': '#FF8C00',
    '--primary-focus': '#FFA500',
    '--secondary': '#004080',
    '--text-primary': '#F0E68C',
    '--text-secondary': '#ADD8E6',
    '--accent': '#FFD700',
    '--font-family-header': "'Lilita One', sans-serif",
    '--font-family-body': "'Montserrat', sans-serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 0 8px var(--primary)',
    '--bkg-image': `linear-gradient(rgba(26, 26, 61, 0.8), rgba(26, 26, 61, 0.8)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%231A1A3D' width='200' height='200'/%3E%3Cg fill-opacity='1'%3E%3Cpolygon fill='%232A2A4D' points='100 0 0 100 100 100 100 0'/%3E%3Cpolygon fill='%232A2A4D' points='100 0 100 100 200 100 100 0'/%3E%3Cpolygon fill='%231f1f42' points='100 100 0 200 200 200 100 100'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '150ms',
    '--header-text-shadow': '2px 2px 0px var(--secondary)',
    '--animation-timing-enter': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '--animation-transform-enter': 'scale(0.9)',
  },
  customCss: `
    .dragonball-z .theme-hover:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.02);
      animation: pulse-border 2s infinite ease-in-out;
    }
    .dragonball-z h1, .dragonball-z h2, .dragonball-z h3 {
      letter-spacing: 2px;
    }
    .dragonball-z .bg-primary {
       text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
    }
    .dragonball-z .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background-color: var(--secondary);
      animation: dbz-pulse 2s infinite ease-in-out;
    }
    @keyframes dbz-pulse {
      0% { background-color: var(--secondary); box-shadow: 0 0 5px var(--secondary); }
      50% { background-color: var(--accent); box-shadow: 0 0 15px var(--accent); }
      100% { background-color: var(--secondary); box-shadow: 0 0 5px var(--secondary); }
    }
    @keyframes pulse-border {
      0% { border-color: var(--primary); box-shadow: 0 0 5px var(--primary); }
      50% { border-color: var(--accent); box-shadow: 0 0 15px var(--accent); }
      100% { border-color: var(--primary); box-shadow: 0 0 5px var(--primary); }
    }
  `
};