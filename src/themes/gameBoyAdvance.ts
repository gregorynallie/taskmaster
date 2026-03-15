import { ThemeDefinition } from '../themeTypes';

export const gameBoyAdvance: ThemeDefinition = {
  id: 'game-boy-advance',
  name: 'Game Boy Advance',
  category: 'Retro & Pixelated',
  font: "'Poppins', sans-serif",
  soundPack: 'vibrant',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A burst of colorful stars explodes from the center of the card.",
    },
    enter: {
      className: 'animate-themed-enter',
      description: "Elements pop into view with a playful bounce.",
    },
    addTask: 'playful',
    suggestionAccept: 'playful',
    hover: 'playful',
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
    '--bkg': '#E8E8F0', // GBA Screen Light Gray
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.8)',
    '--primary': '#6A5ACD', // Indigo Purple Shell
    '--primary-focus': '#836FFF',
    '--secondary': '#5A5A5A', // D-Pad Gray
    '--text-primary': '#2F2F4F', // Dark Indigo
    '--text-secondary': '#7A7A9A',
    '--accent': '#FF5577', // A/B Button Red-Pink
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Poppins', sans-serif",
    '--font-family-body': "'Poppins', sans-serif",
    '--border-radius': '0.375rem', // Rounded hardware feel
    '--card-border-width': '2px',
    '--card-shadow': '0 4px 8px rgba(0,0,0,0.1)', // Soft shadow
    '--bkg-image': 'none',
    '--transition-duration': '200ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    @keyframes gba-pop-in {
      0% { transform: scale(0.9); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes gba-star-burst {
      0% {
        opacity: 1;
        transform: scale(0.5);
        box-shadow: 
          0 0 0 0px var(--primary), 0 0 0 0px var(--accent), 
          0 0 0 0px var(--secondary), 0 0 0 0px var(--primary-focus);
      }
      100% {
        opacity: 0;
        transform: scale(1.2);
        box-shadow: 
          -30px -10px 0 -5px var(--primary), 30px 20px 0 -5px var(--accent),
          -25px 25px 0 -5px var(--secondary), 10px -25px 0 -5px var(--primary-focus);
      }
    }

    .game-boy-advance .theme-hover:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.12);
      border-color: var(--primary);
    }

    .game-boy-advance .animate-themed-enter {
        animation: gba-pop-in 0.3s var(--animation-timing-enter) forwards;
    }

    .game-boy-advance .animate-complete-task {
      animation: gba-pop-in 0.4s reverse forwards; /* Fade and shrink out */
      position: relative;
    }

    .game-boy-advance .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      margin-left: -5px;
      margin-top: -5px;
      background: transparent;
      border-radius: 50%;
      animation: gba-star-burst 0.5s ease-out forwards;
    }

    .game-boy-advance .skeleton-loader .skeleton-line {
      background: linear-gradient(90deg, #d0d0d8, #f0f0f8, #d0d0d8);
      background-size: 200% 100%;
      animation: gba-pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes gba-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
};
