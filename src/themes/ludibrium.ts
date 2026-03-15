import { ThemeDefinition } from '../themeTypes';

export const ludibrium: ThemeDefinition = {
  id: 'ludibrium',
  name: 'Ludibrium',
  category: 'Gaming & Pop Culture',
  font: "'Fredoka One', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The card shatters into a burst of colorful blocks.",
    },
    hover: {
      description: "The card bounces playfully.",
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
    '--bkg': '#F0F4F8', // Light, playful background
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.85)',
    '--primary': '#2196F3', // Brick Blue
    '--primary-focus': '#4CAF50', // A different color for focus, like a green block
    '--secondary': '#F44336', // Primary Toy Red
    '--text-primary': '#212121',
    '--text-secondary': '#757575',
    '--accent': '#FFEB3B', // Lego Yellow
    '--font-family-header': "'Fredoka One', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '0.25rem', // Blocky feel
    '--card-border-width': '3px',
    '--card-shadow': '4px 4px 0px #c4c4c4', // Gray shadow for a block effect
    '--bkg-image': `linear-gradient(rgba(240, 244, 248, 0.9), rgba(240, 244, 248, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%232196F3' fill-opacity='0.05'%3E%3Cpath d='M50 0a50 50 0 100 100A50 50 0 0050 0zm0 8a42 42 0 110 84 42 42 0 010-84z'/%3E%3Cpath d='M50 25a25 25 0 100 50 25 25 0 000-50zm0 8a17 17 0 110 34 17 17 0 010-34z'/%3E%3C/g%3E%3C/svg%3E")`, // Gear pattern
    '--transition-duration': '200ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--animation-transform-enter': 'scale(0.9)',
  },
  customCss: `
    @keyframes ludi-bounce {
      0%, 100% { transform: translateY(0) rotate(0); }
      25% { transform: translateY(-4px) rotate(-1deg); }
      75% { transform: translateY(0) rotate(1deg); }
    }

    @keyframes ludi-block-shatter {
      0% {
        opacity: 1;
        box-shadow: 0 0 0 0 transparent;
      }
      100% {
        opacity: 0;
        transform: scale(1.5) rotate(10deg);
        box-shadow: 
          -25px -15px 0 0px #F44336, /* Red */
          20px -10px 0 0px #2196F3, /* Blue */
          -20px 25px 0 0px #FFEB3B, /* Yellow */
          25px 20px 0 0px #FF80AB; /* Pink */
      }
    }

    @keyframes ludi-task-shake-and-fade {
      0% { transform: translate(0, 0); opacity: 1; }
      10% { transform: translate(-2px, -2px) rotate(-1deg); }
      20% { transform: translate(2px, 2px) rotate(1deg); }
      30% { transform: translate(-2px, 2px) rotate(1deg); }
      40% { transform: translate(2px, -2px) rotate(-1deg); }
      50%, 100% { transform: translate(0, 0); opacity: 0; }
    }

    .ludibrium .theme-hover:hover:not(:disabled) {
      animation: ludi-bounce 0.5s ease-in-out;
      border-color: var(--primary);
    }

    .ludibrium .animate-complete-task {
      animation: ludi-task-shake-and-fade 0.6s ease-out forwards;
      position: relative;
    }

    .ludibrium .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin: -2px 0 0 -2px;
      background: transparent;
      animation: ludi-block-shatter 0.6s ease-out forwards;
    }
  `
};