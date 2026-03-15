import { ThemeDefinition } from '../themeTypes';

export const animalCrossing: ThemeDefinition = {
  id: 'animal-crossing',
  name: 'Animal Crossing',
  category: 'Light & Playful',
  font: "'Fredoka One', cursive",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: 'playful',
    taskComplete: 'theme-specific',
    suggestionAccept: 'playful',
    hover: 'theme-specific',
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
    '--bkg': '#FDF5E6', // Sandy beach
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.85)',
    '--primary': '#7AC74F', // Nook Leaf Green
    '--primary-focus': '#8CD465',
    '--secondary': '#B08968', // Wood Brown
    '--text-primary': '#5D4037', // Dark, friendly brown
    '--text-secondary': '#A1887F',
    '--accent': '#FFD700', // Bell Coin Yellow
    '--font-family-header': "'Fredoka One', cursive",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1.5rem', // Bubbly UI
    '--card-border-width': '2px',
    '--card-shadow': '0 6px 12px hsla(25, 25%, 50%, 0.1)',
    '--bkg-image': `linear-gradient(rgba(253, 245, 230, 0.8), rgba(253, 245, 230, 0.8)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%237AC74F' fill-opacity='0.08'%3E%3Cpath d='M50 0C27.9 0 10 17.9 10 40c0 13.9 4.4 26.3 11.5 35.8C29.3 84.6 39.1 90 50 90c10.9 0 20.7-5.4 28.5-14.2C85.6 66.3 90 53.9 90 40 90 17.9 72.1 0 50 0zm0 80c-8.8 0-16.8-4.3-22.8-11.4-1.4-1.7-2.1-3.8-2.1-6 0-4.9 3.5-9 8.2-9.9.5-.1.9-.2 1.4-.2 2.1 0 4.1.8 5.6 2.3l4.5 4.5c.3.3.7.5 1.1.5s.8-.2 1.1-.5l4.5-4.5c1.5-1.5 3.5-2.3 5.6-2.3.5 0 1 .1 1.4.2 4.7.9 8.2 5 8.2 9.9 0 2.2-.7 4.3-2.1 6C66.8 75.7 58.8 80 50 80z'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    @keyframes ac-boing {
      0%, 100% { transform: scale(1) rotate(0); }
      50% { transform: scale(1.05) rotate(1deg); }
    }

    @keyframes ac-fossil-appear {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }

    @keyframes ac-task-fade-out {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }

    .animal-crossing .theme-hover:hover:not(:disabled) {
      animation: ac-boing 0.4s ease-in-out;
      border-color: var(--primary);
    }

    .animal-crossing .animate-complete-task {
      position: relative;
    }
    
    .animal-crossing .animate-complete-task > * {
        animation: ac-task-fade-out 0.5s ease-out forwards;
    }

    .animal-crossing .animate-complete-task::after {
      content: '✨';
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 3rem;
      color: var(--accent);
      text-shadow: 0 0 10px var(--accent);
      opacity: 0;
      animation: ac-fossil-appear 0.4s ease-out forwards, ac-task-fade-out 0.4s ease-in 0.6s forwards;
    }
  `
};