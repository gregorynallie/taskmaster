import { ThemeDefinition } from '../themeTypes';

export const henesys: ThemeDefinition = {
  id: 'henesys',
  name: 'Henesys',
  category: 'Light & Playful',
  font: "'Nunito', sans-serif",
  soundPack: 'organic',
  isLight: true,
  animations: {
    hover: {
      description: "The card sways gently, like the peaceful town of Henesys.",
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
    '--bkg': '#FDFBF4', // Sandy Yellow
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.8)',
    '--primary': '#7AC74F', // Soft Grass Green
    '--primary-focus': '#8CD465',
    '--secondary': '#A9745B', // Wood Brown
    '--text-primary': '#5D4037', // Darker Brown
    '--text-secondary': '#A1887F', // Lighter Brown
    '--accent': '#F6C453', // Golden Wheat
    '--font-family-header': "'Nunito', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1rem', // Cozy rounded
    '--card-border-width': '2px',
    '--card-shadow': '0 4px 8px -2px rgba(169, 116, 91, 0.2)', // Soft brown shadow
    '--bkg-image': 'linear-gradient(to bottom, #A2D2FF, #FDFBF4 30%)', // Sky blue fading to a wheat field color
    '--transition-duration': '300ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--animation-transform-enter': 'translateY(10px) scale(0.9)',
  },
  customCss: `
    .henesys .theme-hover:hover:not(:disabled) {
      animation: henesys-sway 3s infinite ease-in-out;
      border-color: var(--accent);
      box-shadow: 0 8px 15px -3px rgba(169, 116, 91, 0.15);
    }
    .henesys .skeleton-loader .skeleton-line {
      background: linear-gradient(90deg, #EAE1DA, #C8E6C9, #EAE1DA);
      background-size: 200% 100%;
      animation: henesys-pulse 2s ease-in-out infinite;
    }
    @keyframes henesys-sway {
      0%, 100% { transform: rotate(-0.5deg) translateY(-2px); }
      50% { transform: rotate(0.5deg) translateY(-2px); }
    }
    @keyframes henesys-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
};
