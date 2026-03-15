import { ThemeDefinition } from '../themeTypes';

export const yoshisIsland: ThemeDefinition = {
  id: 'yoshis-island',
  name: "Yoshi's Island",
  category: 'Light & Playful',
  font: "'Fredoka One', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: {
        classes: {
            confirmEnter: 'animate-playful-confirm-enter',
            confirmExit: 'animate-playful-confirm-exit',
            formEnter: 'animate-playful-form-enter',
            taskEnter: 'task-animating-in',
        },
        description: "The new task appears as if being quickly drawn with crayons.",
    },
    taskComplete: {
      className: 'animate-complete-task',
      description: "A Yoshi egg is thrown at the card, which 'pops' and disappears.",
    },
    suggestionAccept: 'playful',
    hover: {
        description: "The card does a playful 'flutter jump' animation.",
    },
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
    '--bkg': '#E0F8E0', // Light green crayon
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255,255, 0.85)',
    '--primary': '#4CAF50', // Yoshi Green
    '--primary-focus': '#66BB6A',
    '--secondary': '#FF8A65', // Orange Boots
    '--text-primary': '#3E2723', // Dark Brown
    '--text-secondary': '#795548',
    '--accent': '#FFEB3B', // Yellow Flower
    '--font-family-header': "'Fredoka One', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1.5rem', // Bubbly
    '--card-border-width': '3px',
    '--card-shadow': '4px 4px 0px rgba(0,0,0,0.15)',
    '--bkg-image': `linear-gradient(rgba(224, 248, 224, 0.8), rgba(224, 248, 224, 0.8)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.5'%3E%3Ccircle cx='20' cy='30' r='15'/%3E%3Ccircle cx='80' cy='20' r='20'/%3E%3Ccircle cx='50' cy='70' r='25'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '250ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    @keyframes yoshi-flutter-jump {
      0%, 100% { transform: translateY(0) rotate(0); }
      25% { transform: translateY(-3px) rotate(-1deg); }
      75% { transform: translateY(-3px) rotate(1deg); }
    }

    @keyframes yoshi-egg-throw {
      0% { transform: translate(-100px, 50px) rotate(-180deg) scale(0.5); opacity: 0; }
      70% { transform: translate(0, 0) rotate(0deg) scale(1.2); opacity: 1; }
      100% { transform: translate(0, 0) scale(1); opacity: 1; }
    }
    
    @keyframes yoshi-egg-pop {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1.5); }
    }
    
    @keyframes yoshi-crayon-appear {
        from {
            opacity: 0;
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%);
            mask-image: linear-gradient(to right, transparent 0%, black 10%);
        }
        to {
            opacity: 1;
            -webkit-mask-image: linear-gradient(to right, black 100%, black 100%);
            mask-image: linear-gradient(to right, black 100%, black 100%);
        }
    }

    .yoshis-island .theme-hover:hover:not(:disabled) {
      animation: yoshi-flutter-jump 0.5s ease-in-out infinite;
    }
    
    .yoshis-island .animate-complete-task {
      animation: yoshi-egg-pop 0.3s ease-out 0.2s forwards;
      position: relative;
    }

    .yoshis-island .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40px;
      height: 50px;
      margin: -25px 0 0 -20px;
      background-color: #FFFFFF;
      border: 3px solid #4CAF50;
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; /* Egg shape */
      box-shadow: 0 0 10px #4CAF50, inset 0 0 10px #98FB98;
      animation: yoshi-egg-throw 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      z-index: 10;
    }

    .yoshis-island .task-animating-in {
        animation: yoshi-crayon-appear 0.5s ease-out 0.1s forwards;
    }
  `
};