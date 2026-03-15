import { ThemeDefinition } from '../themeTypes';

export const tibia: ThemeDefinition = {
  id: 'tibia',
  name: 'Tibia Classic',
  category: 'Gaming & Pop Culture',
  font: "'Lora', serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A burst of multi-colored spell particles explodes from the card.",
    },
    hover: {
        description: "The card's border and shadow glow with a golden aura, like a rare item.",
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
    '--bkg': '#1E1E2E', // Dark Dungeon Blue
    '--surface': '#424242', // Dungeon Gray
    '--surface-modal-bkg': 'rgba(66, 66, 66, 0.9)',
    '--primary': '#C62828', // Blood Red
    '--primary-focus': '#E53935',
    '--secondary': '#1A237E', // Dark Blue
    '--text-primary': '#FFD700', // Gold
    '--text-secondary': '#BDBDBD', // Light Gray
    '--accent': '#FFD700', // Gold
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.125rem', // Sharp, old-school UI
    '--card-border-width': '2px',
    '--card-shadow': '4px 4px 8px rgba(0,0,0,0.6)',
    '--bkg-image': 'none',
    '--transition-duration': '250ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.5)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes tibia-item-glow {
      0%, 100% { box-shadow: 0 0 8px var(--accent), 4px 4px 8px rgba(0,0,0,0.6); }
      50% { box-shadow: 0 0 16px var(--accent), 4px 4px 8px rgba(0,0,0,0.6); }
    }
    
    @keyframes tibia-spell-burst {
      0% {
        opacity: 1;
        box-shadow: 0 0 0 0 transparent;
      }
      100% {
        opacity: 0;
        transform: scale(2.5);
        box-shadow: 
          -40px -20px 0 0px #FF5C5C, /* Red */
          35px -15px 0 0px #4682B4, /* Blue */
          -30px 25px 0 0px #78D800, /* Green */
          20px 20px 0 0px #FFD700; /* Yellow */
      }
    }

    @keyframes tibia-task-fade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.95); }
    }

    /* Apply parchment texture to surfaces */
    .tibia .bg-surface {
        background-image: linear-gradient(rgba(66, 66, 66, 0.9), rgba(66, 66, 66, 0.9)), 
                          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
    }

    .tibia .theme-hover:hover:not(:disabled) {
      animation: tibia-item-glow 1.5s infinite ease-in-out;
      border-color: var(--accent);
    }
    
    .tibia .animate-complete-task {
      animation: tibia-task-fade 0.5s ease-out 0.2s forwards;
      position: relative;
    }

    /* The source of the spell burst */
    .tibia .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin: -2px 0 0 -2px;
      background: transparent;
      animation: tibia-spell-burst 0.5s ease-out forwards;
    }

    .tibia .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background-color: var(--secondary);
    }
  `
};
