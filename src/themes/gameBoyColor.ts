import { ThemeDefinition } from '../themeTypes';

export const gameBoyColor: ThemeDefinition = {
  id: 'game-boy-color',
  name: 'Game Boy Color',
  category: 'Retro & Pixelated',
  font: "'Share Tech Mono', monospace",
  soundPack: 'analog',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The card shatters into colored pixels and disappears.",
    },
    hover: {
      description: "The card pops out with a larger pixelated shadow.",
    },
    addTask: 'retro',
    suggestionAccept: 'retro',
    enter: 'retro',
    viewTransition: 'retro',
    dismissTask: 'retro',
    levelUp: 'retro',
    progressBar: 'retro',
    inputField: 'retro',
    modal: 'retro',
    loadingState: 'retro',
    button: 'retro',
  },
  cssVariables: {
    '--bkg': '#E0E8D8', // GBC Screen Off-White
    '--surface': '#E0E8D8',
    '--surface-modal-bkg': '#C8D0B8',
    '--primary': '#703890', // GBC Purple
    '--primary-focus': '#8844AA',
    '--secondary': '#008888', // GBC Teal
    '--text-primary': '#301848', // Dark Purple
    '--text-secondary': '#604878',
    '--accent': '#D82800', // A/B Button Red
    '--text-on-secondary-bkg': '#E0E8D8',
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0.125rem',
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 0px #A8B098', // Solid drop shadow
    '--bkg-image': 'none',
    '--transition-duration': '100ms',
    '--header-text-shadow': '1px 1px 0px #A8B098',
    '--animation-timing-enter': 'linear',
    '--animation-transform-enter': 'translateY(0)',
  },
  customCss: `
    @keyframes gbc-pixel-shatter {
      0% {
        opacity: 1;
        transform: scale(1);
        box-shadow: 0 0 0 0 transparent;
      }
      100% {
        opacity: 0;
        transform: scale(1.5);
        box-shadow: 
          -20px -10px 0 -5px var(--primary), 15px 10px 0 -5px var(--accent),
          -15px 15px 0 -5px var(--secondary), 10px -15px 0 -5px var(--primary);
      }
    }
    
    body.game-boy-color::before {
      content: '';
      position: fixed;
      top: 20px;
      left: 20px;
      width: 8px;
      height: 8px;
      background: var(--accent);
      border-radius: 50%;
      box-shadow: 0 0 5px var(--accent);
      animation: gb-blink 2s linear infinite;
      z-index: 1001;
    }
    
    @keyframes gb-blink {
      0%, 48%, 52%, 100% { opacity: 0.8; }
      50% { opacity: 0.2; }
    }

    .game-boy-color .theme-hover:hover:not(:disabled) {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0px #A8B098;
    }

    .game-boy-color .animate-complete-task {
      animation: gbc-pixel-shatter 0.3s linear forwards;
    }

    .game-boy-color .skeleton-loader .skeleton-line {
      background-color: var(--text-secondary);
      animation: gb-blink 1s linear infinite;
    }
    
    .game-boy-color button, .game-boy-color input, .game-boy-color p, .game-boy-color span {
      image-rendering: pixelated;
    }
  `
};
