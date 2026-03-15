import { ThemeDefinition } from '../themeTypes';

export const piccolo: ThemeDefinition = {
  id: 'piccolo',
  name: 'Piccolo',
  category: 'Gaming & Pop Culture',
  font: "'Montserrat', sans-serif",
  soundPack: 'minimal',
  isLight: false,
  animations: {
    addTask: 'cinematic',
    taskComplete: 'cinematic',
    suggestionAccept: 'cinematic',
    hover: {
      description: "The card lifts up slightly with a green accent border.",
    },
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
    '--bkg': '#1c1a24',
    '--surface': '#2a2738',
    '--surface-modal-bkg': 'rgba(42, 39, 56, 0.8)',
    '--primary': '#7b4a9b',
    '--primary-focus': '#905cb8',
    '--secondary': '#9b4a7b',
    '--text-primary': '#e8e6f0',
    '--text-secondary': '#a59dc0',
    '--accent': '#44b363',
    '--font-family-header': "'Montserrat', sans-serif",
    '--font-family-body': "'Montserrat', sans-serif",
    '--border-radius': '0.375rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 5px 10px rgba(0,0,0,0.3)',
    '--bkg-image': `linear-gradient(rgba(28, 26, 36, 0.85), rgba(28, 26, 36, 0.85)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e8e6f0' fill-opacity='0.05'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '250ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    .piccolo .theme-hover:hover:not(:disabled) {
      transform: translateY(-2px);
      border-color: var(--accent);
    }
  `
};
