import { ThemeDefinition } from '../themeTypes';

export const comicPanel: ThemeDefinition = {
  id: 'comic-panel',
  name: 'Comic Panel',
  category: 'Light & Playful',
  font: "'Lilita One', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: 'pop',
    taskComplete: 'pop',
    suggestionAccept: 'pop',
    hover: 'pop',
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
    '--bkg': '#FEF9E7',
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': '#FFFFFF',
    '--primary': '#00AEEF',
    '--primary-focus': '#33C1F3',
    '--secondary': '#000000',
    '--text-primary': '#000000',
    '--text-secondary': '#4A4A4A',
    '--accent': '#EC008C',
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Lilita One', sans-serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '3px',
    '--card-shadow': '5px 5px 0px var(--secondary)',
    '--bkg-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '100ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    .comic-panel .theme-hover:hover:not(:disabled) {
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0px var(--secondary);
    }
    .comic-panel [class*="border-"] {
      border-style: solid !important;
    }
  `
};