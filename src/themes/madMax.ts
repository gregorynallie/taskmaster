import { ThemeDefinition } from '../themeTypes';

export const madMax: ThemeDefinition = {
  id: 'mad-max',
  name: 'Witness Me',
  category: 'Gaming & Pop Culture',
  font: "'Source Sans Pro', sans-serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A fiery explosion obliterates the task card.",
    },
    hover: {
        description: "A grainy sandstorm effect wipes across the card.",
    },
    addTask: 'cinematic',
    suggestionAccept: 'cinematic',
    enter: 'cinematic',
    viewTransition: 'cinematic',
    dismissTask: 'cinematic',
    levelUp: 'cinematic',
    progressBar: 'cinematic',
    inputField: 'standard',
    modal: 'cinematic',
    loadingState: 'cinematic',
    button: 'cinematic',
  },
  cssVariables: {
    '--bkg': '#111111', // Oil Black
    '--surface': '#2E2E2E', // Ash Gray
    '--surface-modal-bkg': 'rgba(46, 46, 46, 0.9)',
    '--primary': '#E17F45', // Desert Orange
    '--primary-focus': '#F08C55',
    '--secondary': '#8D6E63', // Rusty Brown
    '--text-primary': '#D1C7B7', // Sandy White
    '--text-secondary': '#8A8174', // Dusty Gray
    '--accent': '#C0C0C0', // Chrome Silver
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0px',
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 0px rgba(0,0,0,0.7)',
    '--bkg-image': `linear-gradient(rgba(17, 17, 17, 0.9), rgba(17, 17, 17, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
    '--transition-duration': '150ms',
    '--header-text-shadow': '2px 2px 0px #000',
  },
  customCss: `
    @keyframes sandstorm-wipe {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }
    
    @keyframes flame-explosion {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.2) rotate(5deg); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
    }

    @keyframes madmax-task-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    .mad-max .theme-hover {
      position: relative;
      overflow: hidden;
    }
    
    .mad-max .theme-hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 150%;
      height: 100%;
      background: linear-gradient(to right, transparent, rgba(225, 127, 69, 0.1), transparent);
      animation: sandstorm-wipe 0.5s ease-in-out;
      pointer-events: none;
    }
    
    .mad-max .animate-complete-task {
      animation: madmax-task-fade 0.5s ease-out 0.2s forwards;
      position: relative;
    }
    
    .mad-max .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, #FFD700, #FF4500);
      border-radius: 50%;
      opacity: 0;
      animation: flame-explosion 0.5s ease-out forwards;
    }

    .mad-max .skeleton-loader .skeleton-line {
      background-color: var(--secondary);
    }
  `
};
