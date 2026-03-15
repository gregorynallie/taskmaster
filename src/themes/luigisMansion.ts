import { ThemeDefinition } from '../themeTypes';

export const luigisMansion: ThemeDefinition = {
  id: 'luigis-mansion',
  name: "Luigi's Mansion",
  category: 'Gaming & Pop Culture',
  font: "'Playfair Display', serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    hover: {
      description: "The card shivers with fear, as if seeing a ghost.",
    },
    addTask: 'playful',
    taskComplete: 'playful',
    suggestionAccept: 'playful',
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
    '--bkg': '#1a1a2e',
    '--surface': '#2a2a4d',
    '--surface-modal-bkg': 'rgba(42, 42, 77, 0.8)',
    '--primary': '#4dffaf',
    '--primary-focus': '#7affc7',
    '--secondary': '#3f3f46',
    '--text-primary': '#e0e6f0',
    '--text-secondary': '#8a8a9e',
    '--accent': '#00ffff',
    '--font-family-header': "'Playfair Display', serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.375rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 10px var(--primary)',
    '--bkg-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%234dffaf' fill-opacity='0.04'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': '0 1px 3px rgba(0,0,0,0.4)',
  },
  customCss: `
    .luigis-mansion .theme-hover:hover:not(:disabled) {
      animation: shiver 0.3s linear infinite;
    }
    @keyframes shiver {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-1px); }
      20%, 40%, 60%, 80% { transform: translateX(1px); }
    }
  `
};
