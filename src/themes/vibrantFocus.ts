import { ThemeDefinition } from '../themeTypes';

export const vibrantFocus: ThemeDefinition = {
  id: 'vibrant-focus',
  name: 'Vibrant Focus',
  category: 'Vibrant & Energetic',
  font: "'Montserrat', sans-serif",
  soundPack: 'vibrant',
  isLight: false,
  animations: {
    addTask: 'pop',
    taskComplete: 'pop',
    suggestionAccept: 'pop',
    hover: {
      description: "The card lifts up slightly, enhancing focus.",
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
    '--bkg': '#18181B',
    '--surface': '#27272A',
    '--surface-modal-bkg': '#27272A',
    '--primary': '#8B5CF6',
    '--primary-focus': '#a78bfa',
    '--secondary': '#3f3f46',
    '--text-primary': '#f4f4f5',
    '--text-secondary': '#a1a1aa',
    '--accent': '#f97316',
    '--font-family-header': "'Montserrat', sans-serif",
    '--font-family-body': "'Montserrat', sans-serif",
    '--border-radius': '0.5rem',
    '--card-border-width': '0px',
    '--card-shadow': '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
    '--bkg-image': 'none',
    '--transition-duration': '200ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(0) scale(0.97)',
  },
  customCss: `
    .vibrant-focus .theme-hover:hover:not(:disabled) {
       transform: translateY(-2px);
    }
    .vibrant-focus input[type=text]:focus, .vibrant-focus textarea:focus {
      position: relative;
    }
    .vibrant-focus input[type=text]:focus::after, .vibrant-focus textarea:focus::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--primary);
      animation: underline-focus 0.3s ease-out forwards;
    }
    @keyframes underline-focus {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
  `
};
