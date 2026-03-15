import { ThemeDefinition } from '../themeTypes';

export const cyberMonk: ThemeDefinition = {
  id: 'cyber-monk',
  name: 'Cyber Monk',
  category: 'Sci-Fi & Cyberpunk',
  font: "'Share Tech Mono', monospace",
  soundPack: 'digital',
  isLight: false,
  animations: {
    hover: 'theme-specific',
    addTask: 'minimal',
    taskComplete: 'minimal',
    suggestionAccept: 'minimal',
    enter: 'minimal',
    viewTransition: 'minimal',
    dismissTask: 'minimal',
    levelUp: 'minimal',
    progressBar: 'minimal',
    inputField: 'standard',
    modal: 'minimal',
    loadingState: 'minimal',
    button: 'minimal',
  },
  cssVariables: {
    '--bkg': '#1A0000',
    '--surface': '#1C1C1C',
    '--surface-modal-bkg': '#1C1C1C',
    '--primary': '#B80000',
    '--primary-focus': '#D10000',
    '--secondary': '#333333',
    '--text-primary': '#E0D8D0',
    '--text-secondary': '#A98B4F',
    '--accent': '#FFD700',
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.125rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 8px hsla(45, 100%, 50%, 0.3)',
    '--bkg-image': `linear-gradient(rgba(26,0,0,0.5), rgba(26,0,0,0.5)), url("data:image/svg+xml,%3Csvg width='6' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1L5 6h1z'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '250ms',
    '--header-text-shadow': '0 0 5px var(--accent)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    .cyber-monk .theme-hover:hover:not(:disabled) {
      border-color: var(--accent);
      box-shadow: 0 0 10px var(--accent), inset 0 0 4px var(--accent);
    }
    .cyber-monk h1, .cyber-monk h2, .cyber-monk h3, .cyber-monk h4 {
      text-shadow: var(--header-text-shadow);
    }
  `
};