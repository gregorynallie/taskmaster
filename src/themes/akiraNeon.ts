import { ThemeDefinition } from '../themeTypes';

export const akiraNeon: ThemeDefinition = {
  id: 'akira-neon',
  name: 'Akira Neon',
  category: 'Sci-Fi & Cyberpunk',
  font: "'Orbitron', sans-serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    hover: {
      description: "The card glows with a red neon energy and scales up slightly.",
    },
    addTask: 'cinematic',
    taskComplete: 'cinematic',
    suggestionAccept: 'cinematic',
    enter: 'cinematic',
    viewTransition: 'cinematic',
    dismissTask: 'cinematic',
    levelUp: 'cinematic',
    progressBar: 'cinematic',
    inputField: 'standard',
    modal: 'cinematic',
    loadingState: 'cinematic',
    button: 'cinematic',
  },
  cssVariables: {
    '--bkg': '#0C0C0C',
    '--surface': '#1A1A1A',
    '--surface-modal-bkg': '#1A1A1A',
    '--primary': '#FF0000',
    '--primary-focus': '#FF3333',
    '--secondary': '#333333',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#A0A0A0',
    '--accent': '#FFFFFF',
    '--font-family-header': "'Orbitron', sans-serif",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0px',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 10px hsla(0, 100%, 50%, 0.5)',
    '--bkg-image': `radial-gradient(ellipse at bottom, rgba(255,0,0,0.1), transparent 60%)`,
    '--transition-duration': '250ms',
    '--header-text-shadow': '0 0 8px var(--primary)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    .akira-neon .theme-hover:hover:not(:disabled) {
      transform: scale(1.02);
      box-shadow: 0 0 15px var(--primary);
      border-color: var(--primary-focus);
    }
  `
};