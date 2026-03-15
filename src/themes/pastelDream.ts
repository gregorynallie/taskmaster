import { ThemeDefinition } from '../themeTypes';

export const pastelDream: ThemeDefinition = {
  id: 'pastel-dream',
  name: 'Pastel Dream',
  category: 'Light & Playful',
  font: "'Nunito', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: 'playful',
    taskComplete: 'playful',
    suggestionAccept: 'playful',
    hover: {
      description: "The card lifts up gently with a soft shadow.",
    },
    enter: 'playful',
    viewTransition: 'playful',
    dismissTask: 'playful',
    levelUp: 'playful',
    progressBar: 'playful',
    inputField: 'playful',
    modal: 'playful',
    loadingState: 'playful',
    button: 'playful',
  },
  cssVariables: {
    '--bkg': '#f1f2f6',
    '--surface': '#ffffff',
    '--surface-modal-bkg': '#ffffff',
    '--primary': '#a78bfa',
    '--primary-focus': '#c4b5fd',
    '--secondary': '#e5e7eb',
    '--text-primary': '#4b5563',
    '--text-secondary': '#6b7280',
    '--accent': '#f472b6',
    '--font-family-header': "'Nunito', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '--bkg-image': 'none',
    '--transition-duration': '400ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
    '--animation-transform-enter': 'translateY(0) scale(0.8)',
  },
  customCss: `
    .pastel-dream .theme-hover:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.1);
    }
  `
};
