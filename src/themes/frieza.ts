import { ThemeDefinition } from '../themeTypes';

export const frieza: ThemeDefinition = {
  id: 'frieza',
  name: "Frieza's Reign",
  category: 'Gaming & Pop Culture',
  font: "'Montserrat', sans-serif",
  soundPack: 'vibrant',
  isLight: false,
  animations: {
    hover: {
      description: "The card glows with a malevolent pink energy.",
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
    '--bkg': '#100c14',
    '--surface': '#20182b',
    '--surface-modal-bkg': 'rgba(32, 24, 43, 0.8)',
    '--primary': '#D9027D',
    '--primary-focus': '#ff1a99',
    '--secondary': '#4d3d66',
    '--text-primary': '#f0e6f0',
    '--text-secondary': '#b3a5d1',
    '--accent': '#FFD700',
    '--font-family-header': "'Montserrat', sans-serif",
    '--font-family-body': "'Montserrat', sans-serif",
    '--border-radius': '0.375rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 10px hsla(321, 98%, 42%, 0.4)',
    '--bkg-image': `linear-gradient(rgba(16, 12, 20, 0.85), rgba(16, 12, 20, 0.85)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M-10 10l20-20m-10 30l40-40m-10 50l60-60m-10 70l80-80m-10 90l100-100m-110 110l120-120' stroke-width='2' stroke='%23D9027D' stroke-opacity='0.1'/%3E%3C/svg%3E")`,
    '--transition-duration': '250ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    .frieza .theme-hover:hover:not(:disabled) {
      transform: scale(1.02);
      border-color: var(--primary);
      box-shadow: 0 0 15px var(--primary);
    }
  `
};
