import { ThemeDefinition } from '../themeTypes';

export const witcher: ThemeDefinition = {
  id: 'witcher-3',
  name: 'Path of the Witcher',
  category: 'Gaming & Pop Culture',
  font: "'Oswald', sans-serif",
  soundPack: 'organic',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A fiery Igni sign explodes from the center of the card.",
    },
    hover: {
        description: "A silver gleam, like a Witcher's sword, flashes across the card.",
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
    '--bkg': '#1C1C1C', // Gritty Steel Black
    '--surface': '#2E2E2E', // Dark Steel Gray
    '--surface-modal-bkg': 'rgba(46, 46, 46, 0.9)',
    '--primary': '#9C1C1C', // Blood Red
    '--primary-focus': '#B82828',
    '--secondary': '#3A4F38', // Muted Forest Green
    '--text-primary': '#D1C7B7', // Ashen White / Parchment
    '--text-secondary': '#8A8174', // Muted Gray
    '--accent': '#C0C0C0', // Wolf Medallion Silver
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.125rem',
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 0px rgba(0,0,0,0.5)',
    '--bkg-image': `linear-gradient(rgba(28, 28, 28, 0.95), rgba(28, 28, 28, 0.95)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
    '--transition-duration': '200ms',
    '--header-text-shadow': '2px 2px 0px #000',
  },
  customCss: `
    @keyframes witcher-swipe {
      from { transform: translateX(-100%) skewX(-25deg); }
      to { transform: translateX(100%) skewX(-25deg); }
    }
    
    @keyframes igni-burst {
      0% { opacity: 1; box-shadow: 0 0 0 0 transparent; }
      100% {
        opacity: 0;
        transform: scale(2.5);
        box-shadow: 
          -30px -15px 0 -5px #FF4500, 25px 20px 0 -5px #FF6347, /* Oranges */
          -25px 25px 0 -5px #FFD700, 15px -25px 0 -5px #FF8C00; /* Yellows */
      }
    }

    @keyframes task-fade-to-embers {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    .witcher-3 h1, .witcher-3 h2, .witcher-3 h3, .witcher-3 h4 {
      text-transform: uppercase;
      font-weight: 700;
    }
    
    .witcher-3 .theme-hover {
        position: relative;
        overflow: hidden;
    }

    /* Sword Swipe */
    .witcher-3 .theme-hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 40%;
      height: 100%;
      background: linear-gradient(to right, transparent, rgba(192, 192, 192, 0.2), transparent);
      pointer-events: none;
    }
    
    .witcher-3 .theme-hover:hover:not(:disabled)::before {
        animation: witcher-swipe 0.5s ease-out;
    }
    
    .witcher-3 .animate-complete-task {
      animation: task-fade-to-embers 0.5s ease-out 0.2s forwards;
      position: relative;
    }

    /* Igni Burst */
    .witcher-3 .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      margin-top: -2px;
      background: transparent;
      animation: igni-burst 0.6s ease-out forwards;
    }
    
    .witcher-3 .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background-color: var(--secondary);
    }
  `
};
