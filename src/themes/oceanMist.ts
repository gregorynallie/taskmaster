import { ThemeDefinition } from '../themeTypes';

export const oceanMist: ThemeDefinition = {
  id: 'ocean-mist',
  name: 'Ocean Mist',
  category: 'Atmospheric & Moody',
  font: "'Inter', sans-serif",
  soundPack: 'default',
  isLight: false,
  animations: {
    addTask: 'organic',
    taskComplete: 'organic',
    suggestionAccept: 'organic',
    hover: {
      description: "The card grows slightly and its border highlights.",
    },
    enter: 'organic',
    viewTransition: 'organic',
    dismissTask: 'organic',
    levelUp: 'organic',
    progressBar: 'organic',
    inputField: 'standard',
    modal: 'organic',
    loadingState: 'organic',
    button: 'organic',
  },
  cssVariables: {
    '--bkg': '#0A192F',
    '--surface': '#172A46',
    '--surface-modal-bkg': 'rgba(23, 42, 70, 0.6)',
    '--primary': '#22d3ee',
    '--primary-focus': '#67e8f9',
    '--secondary': '#303C55',
    '--text-primary': '#CCD6F6',
    '--text-secondary': '#8892B0',
    '--accent': '#14b8a6',
    '--font-family-header': "'Inter', sans-serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.5rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
    '--bkg-image': 'linear-gradient(30deg, #0A192F 0%, #172A46 100%)',
    '--transition-duration': '300ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-in-out',
    '--animation-transform-enter': 'translateY(0) scale(0.97)',
  },
  customCss: `
    .ocean-mist .theme-hover:hover:not(:disabled) {
      border-color: var(--primary);
      transform: scale(1.01);
    }
  `
};
