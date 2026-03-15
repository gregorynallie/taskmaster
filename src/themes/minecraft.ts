import { ThemeDefinition } from '../themeTypes';

export const minecraft: ThemeDefinition = {
  id: 'minecraft',
  name: 'Minecraft',
  category: 'Gaming & Pop Culture',
  font: "'Share Tech Mono', monospace",
  soundPack: 'analog',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The card shatters into blocky particles, like a broken block.",
    },
    hover: {
      description: "The card's border highlights, as if selected in the hotbar.",
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
    '--bkg': '#3A3A3A', // Stone Gray
    '--surface': '#787878', // Lighter Stone (UI Panel)
    '--surface-modal-bkg': 'rgba(120, 120, 120, 0.85)',
    '--primary': '#3EBDC8', // Diamond Blue
    '--primary-focus': '#5EE8F5',
    '--secondary': '#3A3A3A', // Dark Stone for borders
    '--text-primary': '#FEFEFE',
    '--text-secondary': '#AAAAAA',
    '--accent': '#FF0000', // Redstone Red
    '--text-on-secondary-bkg': '#FEFEFE',
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0px',
    '--card-border-width': '4px',
    '--card-shadow': 'inset 2px 2px 0px rgba(255,255,255,0.3), inset -2px -2px 0px rgba(0,0,0,0.3)',
    '--bkg-image': `linear-gradient(rgba(58, 58, 58, 0.8), rgba(58, 58, 58, 0.8)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='16' height='16' fill='%232A2A2A'/%3E%3Cpath d='M0 0h8v8H0zM8 8h8v8H8z' fill='%234A4A4A'/%3E%3C/svg%3E")`,
    '--transition-duration': '100ms',
    '--header-text-shadow': '2px 2px 0px #2A2A2A',
    '--animation-timing-enter': 'linear',
    '--animation-transform-enter': 'scale(1)',
  },
  customCss: `
    @keyframes minecraft-block-break {
      0% {
        opacity: 1;
        box-shadow: 0 0 0 0 transparent;
      }
      100% {
        opacity: 0;
        transform: scale(1.2);
        box-shadow: 
          -20px -15px 0 -5px #787878, 15px 10px 0 -5px #5A5A5A,
          -15px 25px 0 -5px #787878, 10px -20px 0 -5px #5A5A5A,
          -25px 5px 0 -5px #787878, 5px 20px 0 -5px #5A5A5A;
      }
    }

    @keyframes minecraft-content-fade {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }

    .minecraft * {
      image-rendering: pixelated;
    }

    .minecraft .theme-hover:hover:not(:disabled) {
      border-color: #FEFEFE;
      box-shadow: inset 2px 2px 0px rgba(255,255,255,0.4), inset -2px -2px 0px rgba(0,0,0,0.2), 0 0 10px var(--primary-focus);
    }
    
    .minecraft .animate-complete-task {
      position: relative;
    }
    
    .minecraft .animate-complete-task > * {
      animation: minecraft-content-fade 0.3s steps(1, end) forwards;
    }

    .minecraft .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin: -2px 0 0 -2px;
      background: transparent;
      animation: minecraft-block-break 0.4s ease-out forwards;
    }

    .minecraft .skeleton-loader .skeleton-line {
      background: var(--secondary);
      opacity: 0.8;
    }
  `
};
