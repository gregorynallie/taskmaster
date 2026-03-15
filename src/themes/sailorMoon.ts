import { ThemeDefinition } from '../themeTypes';

export const sailorMoon: ThemeDefinition = {
  id: 'sailor-moon',
  name: 'Moon Prism Power',
  category: 'Gaming & Pop Culture',
  font: "'Lora', serif",
  soundPack: 'kawaii',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A 'Moon Tiara Action' effect flashes across the card.",
    },
    hover: {
        description: "The card shimmers with a magical girl transformation effect.",
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
    '--bkg': '#F0F4FF', // Dreamy Lavender-Blue
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.85)',
    '--primary': '#F781A4', // Pastel Pink
    '--primary-focus': '#F99CB8',
    '--secondary': '#2A2A4D', // Navy Blue
    '--text-primary': '#4A4A6A', // Dark Purple-Gray
    '--text-secondary': '#8C8CA1',
    '--accent': '#FFD700', // Star Yellow/Gold
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1rem', // Soft and rounded
    '--card-border-width': '2px',
    '--card-shadow': '0 6px 12px hsla(344, 89%, 74%, 0.15)',
    '--bkg-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23FFD700' fill-opacity='0.1'%3E%3Cpath d='M10 0L12.245 6.18H18.51L13.635 10L15.88 16.18L10 12.36L4.12 16.18L6.365 10L1.49 6.18H7.755L10 0Z' transform='translate(10,10) scale(0.5)'/%3E%3Cpath d='M10 0L12.245 6.18H18.51L13.635 10L15.88 16.18L10 12.36L4.12 16.18L6.365 10L1.49 6.18H7.755L10 0Z' transform='translate(80,80) scale(0.8)'/%3E%3Cpath d='M10 0L12.245 6.18H18.51L13.635 10L15.88 16.18L10 12.36L4.12 16.18L6.365 10L1.49 6.18H7.755L10 0Z' transform='translate(50,50) rotate(-30 50 50) scale(0.3)'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--animation-transform-enter': 'scale(0.9)',
  },
  customCss: `
    @keyframes moon-prism-shimmer {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }
    
    @keyframes moon-tiara-throw {
      0% { transform: translate(-50%, -50%) scale(0.5) rotate(0deg); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.2) rotate(180deg); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(0.5) rotate(360deg); opacity: 0; }
    }

    @keyframes moon-task-fade {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }

    .sailor-moon .theme-hover {
      position: relative;
      overflow: hidden;
    }
    
    .sailor-moon .theme-hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 150%;
      height: 100%;
      background: linear-gradient(100deg, transparent, rgba(255, 182, 193, 0.5), rgba(255, 215, 0, 0.5), transparent);
      transform: translateX(-100%);
      pointer-events: none;
    }

    .sailor-moon .theme-hover:hover:not(:disabled)::before {
      animation: moon-prism-shimmer 1s ease-in-out;
    }
    
    .sailor-moon .animate-complete-task {
      animation: moon-task-fade 0.6s ease-out 0.2s forwards;
      position: relative;
    }

    .sailor-moon .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4rem;
      height: 4rem;
      margin-left: -2rem;
      margin-top: -2rem;
      border: 4px solid var(--accent);
      border-radius: 50%;
      box-shadow: 0 0 15px var(--accent);
      opacity: 0;
      animation: moon-tiara-throw 0.5s ease-out forwards;
    }
  `
};
