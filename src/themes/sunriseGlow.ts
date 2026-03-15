import { ThemeDefinition } from '../themeTypes';

export const sunriseGlow: ThemeDefinition = {
  id: 'sunrise-glow',
  name: 'Sunrise Glow',
  category: 'Light & Playful',
  font: "'Nunito', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: 'organic',
    taskComplete: 'organic',
    suggestionAccept: 'organic',
    hover: {
      description: "The card lifts up with a soft blue shadow, like the morning sky.",
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
    '--bkg': '#FFF5F0',
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': '#FFFFFF',
    '--primary': '#FF8A65',
    '--primary-focus': '#FFAB91',
    '--secondary': '#FFE0B2',
    '--text-primary': '#4E443F',
    '--text-secondary': '#8D7B73',
    '--accent': '#81D4FA',
    '--font-family-header': "'Nunito', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 8px 15px -3px rgba(255, 138, 101, 0.1), 0 4px 6px -4px rgba(255, 138, 101, 0.1)',
    '--bkg-image': 'linear-gradient(to top, #FFF5F0, #E1F5FE)',
    '--transition-duration': '300ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    .sunrise-glow .theme-hover:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px -3px rgba(129, 212, 250, 0.2), 0 4px 6px -4px rgba(129, 212, 250, 0.2);
      border-color: var(--accent);
    }
  `
};
