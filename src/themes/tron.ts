import { ThemeDefinition } from '../themeTypes';

export const tron: ThemeDefinition = {
  id: 'tron-legacy',
  name: 'The Grid',
  category: 'Sci-Fi & Cyberpunk',
  font: "'Orbitron', sans-serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The card de-rezzes into a burst of blue and orange digital particles.",
    },
    hover: {
        description: "A light cycle trail sweeps horizontally across the card.",
    },
    addTask: 'glitch',
    suggestionAccept: 'glitch',
    enter: 'glitch',
    viewTransition: 'glitch',
    dismissTask: 'glitch',
    levelUp: 'glitch',
    progressBar: 'glitch',
    inputField: 'glitch',
    modal: 'glitch',
    loadingState: 'glitch',
    button: 'glitch',
  },
  cssVariables: {
    '--bkg': '#000000',
    '--surface': '#0D0D0D',
    '--surface-modal-bkg': 'rgba(13, 13, 13, 0.9)',
    '--primary': '#00F9FF', // Neon Blue
    '--primary-focus': '#80FDFF',
    '--secondary': '#FF5E00', // Neon Orange
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#A0AEC0',
    '--accent': '#00F9FF',
    '--font-family-header': "'Orbitron', sans-serif",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0.125rem', // Sharp corners
    '--card-border-width': '1px',
    '--card-shadow': '0 0 12px hsla(180, 100%, 50%, 0.4), inset 0 0 8px hsla(180, 100%, 50%, 0.2)',
    '--bkg-image': `
      linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)),
      linear-gradient(hsla(180, 100%, 50%, 0.1) 1px, transparent 1px), 
      linear-gradient(to right, hsla(180, 100%, 50%, 0.1) 1px, transparent 1px)
    `,
    '--transition-duration': '250ms',
    '--header-text-shadow': '0 0 8px var(--primary)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    body.tron-legacy {
      background-size: 100%, 50px 50px, 50px 50px;
    }

    @keyframes light-cycle-streak {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
    
    @keyframes tron-de-rez {
      0% {
        opacity: 1;
        transform: scale(1);
        box-shadow: 0 0 0 0 transparent;
      }
      100% {
        opacity: 0;
        transform: scale(1.2);
        box-shadow: 
          -30px -15px 0 -5px var(--primary), 25px 15px 0 -5px var(--secondary),
          -25px 25px 0 -5px var(--primary), 15px -25px 0 -5px var(--secondary);
      }
    }

    @keyframes tron-task-fade {
      0% { opacity: 1; filter: none; }
      100% { opacity: 0; filter: blur(5px); }
    }

    .tron-legacy * {
      text-shadow: 0 0 3px var(--primary);
    }
    
    .tron-legacy .theme-hover {
        position: relative;
        overflow: hidden;
    }
    
    .tron-legacy .theme-hover::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 2px;
      margin-top: -1px;
      background: var(--primary);
      box-shadow: 0 0 8px var(--primary);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s cubic-bezier(0.8, 0, 0.2, 1);
      pointer-events: none;
    }
    
    .tron-legacy .theme-hover:hover:not(:disabled)::before {
        transform: scaleX(1);
    }
    
    .tron-legacy .animate-complete-task {
      animation: tron-task-fade 0.5s ease-out 0.2s forwards;
      position: relative;
    }

    .tron-legacy .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      margin-top: -2px;
      background: transparent;
      animation: tron-de-rez 0.5s ease-out forwards;
    }
  `
};
