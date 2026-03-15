import { ThemeDefinition } from '../themeTypes';

export const pastelPop: ThemeDefinition = {
  id: 'pastel-pop',
  name: 'Pastel Pop',
  category: 'Light & Playful',
  font: "'Fredoka One', sans-serif",
  soundPack: 'kawaii',
  isLight: true,
  animations: {
    addTask: 'pop',
    taskComplete: 'pop',
    suggestionAccept: 'pop',
    hover: {
      description: "The card wobbles playfully.",
    },
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
    '--bkg': '#fdf4f8',
    '--surface': '#ffffff',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.8)',
    '--primary': '#ff85a2',
    '--primary-focus': '#ffacc7',
    '--secondary': '#fce4ec',
    '--text-primary': '#5c5470',
    '--text-secondary': '#9b8fb0',
    '--accent': '#61dafb',
    '--font-family-header': "'Fredoka One', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1.5rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 4px 10px -2px rgba(255, 133, 162, 0.2)',
    '--bkg-image': `linear-gradient(45deg, rgba(252, 228, 236, 0.5), rgba(232, 234, 246, 0.5)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='%23ff85a2' fill-opacity='0.1' d='M10 0L12.245 6.18H18.51L13.635 10L15.88 16.18L10 12.36L4.12 16.18L6.365 10L1.49 6.18H7.755L10 0Z'/%3E%3C/svg%3E")`,
    '--transition-duration': '400ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
    '--animation-transform-enter': 'translateY(0) scale(0.8)',
  },
  customCss: `
    .pastel-pop .theme-hover:hover:not(:disabled) {
      animation: wobble 0.5s ease-in-out;
    }
    .pastel-pop [class*="border-"] {
      border-style: dashed;
    }
    .pastel-pop .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background: linear-gradient(90deg, var(--secondary), var(--primary), var(--secondary));
      background-size: 200% 100%;
      animation: pastel-pulse 1.5s linear infinite;
    }
    @keyframes pastel-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
};