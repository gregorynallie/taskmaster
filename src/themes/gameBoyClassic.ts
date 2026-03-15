import { ThemeDefinition } from '../themeTypes';

export const gameBoyClassic: ThemeDefinition = {
  id: 'game-boy-classic',
  name: 'Game Boy Classic',
  category: 'Retro & Pixelated',
  font: "'Share Tech Mono', monospace",
  soundPack: 'analog',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The card shrinks and vanishes in a pixelated 'blip'.",
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
    '--bkg': '#c0d684', // Screen background
    '--surface': '#c0d684', // Screen background for cards
    '--surface-modal-bkg': '#a2b978', // A darker shade for modals
    '--primary': '#34402a', // Dark pixel color
    '--primary-focus': '#22291b',
    '--secondary': '#a2b978', // D-pad grey/green shade
    '--text-primary': '#34402a',
    '--text-secondary': '#606c50',
    '--accent': '#991f24', // Red A/B buttons
    '--text-on-secondary-bkg': '#34402a',
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0px',
    '--card-border-width': '3px',
    '--card-shadow': '4px 4px 0px var(--secondary)',
    '--bkg-image': 'none',
    '--transition-duration': '100ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'linear',
    '--animation-transform-enter': 'translateY(0)',
  },
  customCss: `
    @keyframes gb-complete {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(0); opacity: 0; }
    }
    
    @keyframes gb-blink {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 0.2; }
    }

    body.game-boy-classic::after {
      content: ' ';
      display: block;
      position: fixed;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(0,0,0,0.08) 50%, transparent 50%), linear-gradient(90deg, rgba(0,0,0,0.08) 50%, transparent 50%);
      background-size: 3px 3px;
      pointer-events: none;
      z-index: 1000;
    }
    
    .game-boy-classic .theme-hover:hover:not(:disabled) {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px var(--secondary);
    }

    .game-boy-classic .animate-complete-task {
      animation: gb-complete 0.2s linear forwards;
    }

    .game-boy-classic .skeleton-loader .skeleton-line {
      background-color: var(--text-primary);
      animation: gb-blink 1s linear infinite;
    }
    
    .game-boy-classic button, .game-boy-classic input, .game-boy-classic p, .game-boy-classic span {
      image-rendering: pixelated; /* Sharp edges on text */
    }
  `
};
