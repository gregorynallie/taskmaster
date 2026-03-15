import { ThemeDefinition } from '../themeTypes';

export const kirby: ThemeDefinition = {
  id: 'kirby',
  name: "Kirby's Dream Land",
  category: 'Light & Playful',
  font: "'Fredoka One', sans-serif",
  soundPack: 'kawaii',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The task card is 'inhaled' and disappears with a star particle effect.",
    },
    hover: {
        description: "The card puffs up and wobbles, like Kirby.",
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
    '--bkg': '#ADD8E6', // Baby Blue Sky
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.8)',
    '--primary': '#F781A4', // Kirby Pink
    '--primary-focus': '#F99CB8',
    '--secondary': '#98FB98', // Mint Green
    '--text-primary': '#4A4A6A', // Dark Purple-Gray
    '--text-secondary': '#8C8CA1',
    '--accent': '#FFD54F', // Star Yellow
    '--font-family-header': "'Fredoka One', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1.5rem', // Bubbly UI
    '--card-border-width': '3px',
    '--card-shadow': '0 8px 15px -3px hsla(344, 89%, 74%, 0.2)',
    '--bkg-image': `linear-gradient(to bottom, #ADD8E6, #C1E5F2), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='30' r='5'/%3E%3Ccircle cx='80' cy='20' r='8'/%3E%3Ccircle cx='50' cy='70' r='10'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--animation-transform-enter': 'scale(0.9)',
  },
  customCss: `
    @keyframes kirby-inhale {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(0); opacity: 0; }
    }

    @keyframes kirby-star-burst {
      0% { opacity: 1; transform: scale(0.5); }
      100% {
        opacity: 0;
        transform: scale(2);
        box-shadow: 
          -30px -15px 0 -5px var(--accent), 30px 20px 0 -5px var(--accent),
          -25px 25px 0 -5px var(--accent), 15px -25px 0 -5px var(--accent);
      }
    }

    @keyframes kirby-wobble {
      0%, 100% { transform: scale(1, 1); }
      50% { transform: scale(1.05, 0.95); }
    }

    .kirby .theme-hover:hover:not(:disabled) {
      animation: kirby-wobble 0.5s ease-in-out;
    }

    .kirby .animate-complete-task {
      animation: kirby-inhale 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
      position: relative;
    }
    
    .kirby .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      margin-top: -2px;
      background: transparent;
      animation: kirby-star-burst 0.5s ease-out forwards;
    }
  `
};