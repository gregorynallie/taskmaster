import { ThemeDefinition } from '../themeTypes';

export const pulpFiction: ThemeDefinition = {
  id: 'pulp-fiction',
  name: 'Royale with Cheese',
  category: 'Gaming & Pop Culture',
  font: "'Source Sans Pro', sans-serif",
  soundPack: 'analog',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A red line strikes through the task, then the card glows gold and fades, like opening the briefcase.",
    },
    hover: {
      description: "The card pops out from the page with an increased hard shadow.",
    },
    addTask: 'cinematic',
    suggestionAccept: 'cinematic',
    enter: 'cinematic',
    viewTransition: 'cinematic',
    dismissTask: 'cinematic',
    levelUp: 'cinematic',
    progressBar: 'cinematic',
    inputField: 'cinematic',
    modal: 'cinematic',
    loadingState: 'cinematic',
    button: 'cinematic',
  },
  cssVariables: {
    '--bkg': '#F5F5F5', // Off-white
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.9)',
    '--primary': '#000000', // Black Suit
    '--primary-focus': '#333333',
    '--secondary': '#B90000', // Deep Red
    '--text-primary': '#000000',
    '--text-secondary': '#4A4A4A',
    '--accent': '#FFD700', // Briefcase Gold
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Lilita One', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0px', // Sharp
    '--card-border-width': '3px',
    '--card-shadow': '5px 5px 0px var(--primary)', // Hard shadow
    '--bkg-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
    '--transition-duration': '100ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    @keyframes pulp-fiction-pop {
      to {
        transform: translate(-3px, -3px);
        box-shadow: 8px 8px 0px var(--primary);
        border-color: var(--accent);
      }
    }

    @keyframes briefcase-glow-and-fade {
      0% {
        opacity: 1;
        box-shadow: 5px 5px 0px var(--primary);
      }
      20%, 40% {
        opacity: 1;
        box-shadow: 0 0 25px 5px var(--accent);
      }
      100% {
        opacity: 0;
        box-shadow: 0 0 25px 5px var(--accent);
      }
    }

    @keyframes red-strikethrough {
      0%, 40% {
        transform: scaleX(0);
      }
      80%, 100% {
        transform: scaleX(1);
      }
    }
    
    .pulp-fiction h1, .pulp-fiction h2, .pulp-fiction h3, .pulp-fiction h4 {
        letter-spacing: 1px;
    }

    .pulp-fiction .theme-hover:hover:not(:disabled) {
      animation: pulp-fiction-pop 0.1s forwards;
    }
    
    .pulp-fiction .animate-complete-task {
      animation: briefcase-glow-and-fade 0.8s ease-out forwards;
      position: relative;
    }
    
    .pulp-fiction .animate-complete-task::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 3px;
      margin-top: -1.5px;
      background-color: var(--secondary);
      transform-origin: left;
      animation: red-strikethrough 0.8s ease-out forwards;
      z-index: 10;
    }
  `
};