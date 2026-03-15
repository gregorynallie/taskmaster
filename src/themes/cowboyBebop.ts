import { ThemeDefinition } from '../themeTypes';

export const cowboyBebop: ThemeDefinition = {
  id: 'cowboy-bebop',
  name: 'See You Space Cowboy...',
  category: 'Gaming & Pop Culture',
  font: "'Source Sans Pro', sans-serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A wisp of cigarette smoke rises from the card as it fades away.",
    },
    hover: {
        description: "A red panel slides over the card, reminiscent of the anime's title cards.",
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
    '--bkg': '#0A0E1A', // Noir Black
    '--surface': '#141824', // Darker surface
    '--surface-modal-bkg': 'rgba(20, 24, 36, 0.9)',
    '--primary': '#FFC107', // Mustard Yellow
    '--primary-focus': '#FFD54F',
    '--secondary': '#B71C1C', // Burnt Red
    '--text-primary': '#F0E6D2', // Off-white
    '--text-secondary': '#A0AEC0',
    '--accent': '#00BCD4', // Teal
    '--font-family-header': "'Lilita One', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.125rem',
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 0px rgba(0,0,0,0.4)',
    '--bkg-image': `linear-gradient(rgba(10, 14, 26, 0.9), rgba(10, 14, 26, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
    '--transition-duration': '250ms',
    '--header-text-shadow': '2px 2px 0px #000',
  },
  customCss: `
    @keyframes jazz-cut-in {
      from { transform: translateX(-101%); }
      to { transform: translateX(0); }
    }
    
    @keyframes cigarette-smoke-fade {
      0% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
      }
      100% {
        opacity: 0;
        transform: translate(-40%, -150%) scale(1.5) rotate(15deg);
      }
    }
    
    @keyframes bebop-task-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    .cowboy-bebop h1, .cowboy-bebop h2, .cowboy-bebop h3, .cowboy-bebop h4 {
      letter-spacing: 1px;
    }
    
    .cowboy-bebop .theme-hover {
      position: relative;
      overflow: hidden;
    }
    
    .cowboy-bebop .theme-hover > * {
      transition: color 0.3s ease-out;
      position: relative; /* Ensure content is on top of the pseudo-element */
      z-index: 1;
    }
    
    /* Red panel for hover effect */
    .cowboy-bebop .theme-hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--secondary);
      transform: translateX(-101%);
      transition: transform 0.3s cubic-bezier(0.77, 0, 0.175, 1);
      z-index: 0;
    }
    
    .cowboy-bebop .theme-hover:hover:not(:disabled)::before {
      transform: translateX(0);
    }
    
    /* Ensure text is visible on hover */
    .cowboy-bebop .theme-hover:hover:not(:disabled) p,
    .cowboy-bebop .theme-hover:hover:not(:disabled) span,
    .cowboy-bebop .theme-hover:hover:not(:disabled) div,
    .cowboy-bebop .theme-hover:hover:not(:disabled) button {
      color: #FFFFFF !important;
    }

    .cowboy-bebop .animate-complete-task {
      animation: bebop-task-fade 0.8s ease-out 0.2s forwards;
      position: relative;
    }

    /* Cigarette smoke wisp */
    .cowboy-bebop .animate-complete-task::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 50px;
      height: 100px;
      background-color: var(--text-secondary);
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 200'%3E%3Cpath d='M50 200 Q 80 150, 50 100 T 50 0' fill='none' stroke='white' stroke-width='15' stroke-linecap='round'/%3E%3C/svg%3E");
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 200'%3E%3Cpath d='M50 200 Q 80 150, 50 100 T 50 0' fill='none' stroke='white' stroke-width='15' stroke-linecap='round'/%3E%3C/svg%3E");
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      opacity: 0;
      animation: cigarette-smoke-fade 1s ease-out forwards;
    }
  `
};