import { ThemeDefinition } from '../themeTypes';

export const crystalCore: ThemeDefinition = {
  id: 'crystal-core',
  name: 'Crystal Core',
  category: 'Vibrant & Energetic',
  font: "'Oswald', sans-serif",
  soundPack: 'vibrant',
  isLight: false,
  animations: {
    hover: 'theme-specific',
    addTask: 'pop',
    taskComplete: 'pop',
    suggestionAccept: 'pop',
    enter: 'pop',
    viewTransition: 'pop',
    dismissTask: 'pop',
    levelUp: 'pop',
    progressBar: 'pop',
    inputField: 'pop',
    modal: 'pop',
    loadingState: 'pop',
    button: 'pop',
  },
  cssVariables: {
    '--bkg': '#0C0A1E',
    '--surface': '#1A173A',
    '--surface-modal-bkg': 'rgba(26, 23, 58, 0.7)',
    '--primary': '#9F70FD',
    '--primary-focus': '#B38FFD',
    '--secondary': '#8D99AE',
    '--text-primary': '#EDF2F4',
    '--text-secondary': '#A0AEC0',
    '--accent': '#00FFFF',
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Poppins', sans-serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 12px hsla(255, 96%, 72%, 0.3)',
    '--bkg-image': `linear-gradient(rgba(12,10,30,0.8), rgba(12,10,30,0.8)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239F70FD' fill-opacity='0.05'%3E%3Cpath d='M0 40L20 0l20 40H0zm20-10L10 40h20L20 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '350ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    .crystal-core .theme-hover:hover:not(:disabled) {
      border-color: var(--accent);
      animation: crystal-glow 3s infinite ease-in-out;
    }
    @keyframes crystal-glow {
      0% { box-shadow: 0 0 12px var(--primary); }
      50% { box-shadow: 0 0 12px var(--accent); }
      100% { box-shadow: 0 0 12px var(--primary); }
    }
  `
};