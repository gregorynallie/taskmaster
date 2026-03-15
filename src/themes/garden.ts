import { ThemeDefinition } from '../themeTypes';

export const garden: ThemeDefinition = {
  id: 'garden',
  name: 'Garden',
  category: 'Light & Playful',
  font: "'Nunito', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    hover: {
      description: "The card lifts up gently with a soft shadow.",
    },
    addTask: 'organic',
    taskComplete: 'organic',
    suggestionAccept: 'organic',
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
    '--bkg': '#F0F4F0',
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': '#FFFFFF',
    '--primary': '#4CAF50',
    '--primary-focus': '#5CB85C',
    '--secondary': '#E8E8E8',
    '--text-primary': '#333333',
    '--text-secondary': '#757575',
    '--accent': '#FFC107',
    '--font-family-header': "'Nunito', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '0.75rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
    '--bkg-image': 'none',
    '--transition-duration': '350ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--animation-transform-enter': 'translateY(0) scale(0.9)',
  },
  customCss: `
    .garden .theme-hover:hover:not(:disabled) {
      transform: scale(1.02);
      box-shadow: 0 8px 12px -2px rgba(0,0,0,0.1);
    }
  `
};
