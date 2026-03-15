import { ThemeDefinition } from '../themeTypes';

export const imacG3: ThemeDefinition = {
  id: 'imac-g3',
  name: 'iMac G3',
  category: 'Retro & Pixelated',
  font: "'Poppins', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The card collapses into a burst of colorful particles, like the classic Mac shutdown.",
    },
    hover: {
      description: "The card does a playful, bouncy animation, reminiscent of the Aqua UI.",
    },
    addTask: 'playful',
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
    '--bkg': '#EAEAEA', // Off-white computer plastic
    '--surface': 'rgba(255, 255, 255, 0.7)', // Translucent white
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.8)',
    '--primary': '#1E90FF', // Bondi Blue
    '--primary-focus': '#4AA4FF',
    '--secondary': '#B0B0B0', // Gray accent
    '--text-primary': '#333333',
    '--text-secondary': '#666666',
    '--accent': '#FF8C00', // Tangerine
    '--font-family-header': "'Poppins', sans-serif",
    '--font-family-body': "'Poppins', sans-serif",
    '--border-radius': '1.5rem', // Very rounded
    '--card-border-width': '2px',
    '--card-shadow': '0 8px 16px rgba(0, 0, 0, 0.1)',
    '--bkg-image': 'none',
    '--transition-duration': '300ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--animation-transform-enter': 'scale(0.9)',
  },
  customCss: `
    @keyframes imac-bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes imac-power-down {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0); }
    }

    @keyframes imac-color-burst {
      0% {
        opacity: 1;
        box-shadow: 0 0 0 0 transparent;
      }
      100% {
        opacity: 0;
        transform: scale(1.5);
        box-shadow: 
          -20px -10px 0 -5px #FF456A, /* Strawberry */
          20px -10px 0 -5px #32CD32, /* Lime */
          -15px 15px 0 -5px #9400D3, /* Grape */
          10px 15px 0 -5px #FF8C00; /* Tangerine */
      }
    }

    .imac-g3 .bg-surface, .imac-g3 .bg-surface-modal-bkg {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .imac-g3 .theme-hover:hover:not(:disabled) {
      animation: imac-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .imac-g3 .animate-complete-task {
      animation: imac-power-down 0.4s ease-in-out forwards;
      position: relative;
    }

    .imac-g3 .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      margin-top: -2px;
      background: transparent;
      animation: imac-color-burst 0.5s ease-out forwards;
    }

    .imac-g3 .skeleton-loader .skeleton-line {
      border-radius: 999px;
      background: linear-gradient(90deg, #d0d0d8, #f0f0f8, #d0d0d8);
      background-size: 200% 100%;
      animation: imac-pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes imac-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
};
