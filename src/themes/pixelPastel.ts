import { ThemeDefinition } from '../themeTypes';

export const pixelPastel: ThemeDefinition = {
  id: 'pixel-pastel',
  name: 'Pixel Pastel',
  category: 'Retro & Pixelated',
  font: "'Nunito', sans-serif",
  soundPack: 'kawaii',
  isLight: true,
  animations: {
    addTask: 'retro',
    taskComplete: 'retro',
    suggestionAccept: 'retro',
    hover: {
      description: "The card pops out from the page with an increased pixelated shadow.",
    },
    enter: 'retro',
    viewTransition: 'retro',
    dismissTask: 'retro',
    levelUp: 'retro',
    progressBar: 'retro',
    inputField: 'retro',
    modal: 'retro',
    loadingState: 'retro',
    button: 'retro',
  },
  cssVariables: {
    '--bkg': '#FDF6FF',
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': '#FFFFFF',
    '--primary': '#FFC0CB',
    '--primary-focus': '#FFB6C1',
    '--secondary': '#E6E6FA',
    '--text-primary': '#5C5470',
    '--text-secondary': '#9B8FB0',
    '--accent': '#B0E0E6',
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '2px',
    '--card-shadow': '4px 4px 0px var(--secondary)',
    '--bkg-image': 'none',
    '--transition-duration': '150ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    .pixel-pastel .theme-hover:hover:not(:disabled) {
      transform: translateY(-3px) translateX(-3px);
      box-shadow: 7px 7px 0px var(--secondary);
    }
  `
};
