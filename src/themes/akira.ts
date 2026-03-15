import { ThemeDefinition } from '../themeTypes';

export const akira: ThemeDefinition = {
  id: 'akira',
  name: 'Neo-Tokyo 2019',
  category: 'Sci-Fi & Cyberpunk',
  font: "'Oswald', sans-serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    addTask: 'standard',
    taskComplete: 'theme-specific',
    suggestionAccept: 'standard',
    hover: 'theme-specific',
    enter: 'standard',
  },
  cssVariables: {
    '--bkg': '#000000',
    '--surface': '#111111',
    '--surface-modal-bkg': 'rgba(17, 17, 17, 0.9)',
    '--primary': '#C8102E', // Akira Red
    '--primary-focus': '#E0203E',
    '--secondary': '#333333', // Dark concrete
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#A0A0A0',
    '--accent': '#FFFFFF',
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0px',
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 0px rgba(0,0,0,0.7)',
    '--bkg-image': `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
    '--transition-duration': '200ms',
    '--header-text-shadow': '2px 2px 0px #000',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    @keyframes light-trail-sweep {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }
    
    @keyframes psychic-explosion {
      0% { transform: scale(1); opacity: 1; filter: none; }
      20% {
        transform: scale(1.1) rotate(2deg);
        filter: brightness(3);
        box-shadow: 0 0 30px var(--accent);
        border-color: var(--accent);
      }
      100% {
        transform: scale(2);
        opacity: 0;
        filter: blur(10px) brightness(2);
      }
    }

    .akira h1, .akira h2, .akira h3, .akira h4 {
      text-transform: uppercase;
      font-weight: 700;
    }
    
    .akira .theme-hover {
      position: relative;
      overflow: hidden;
    }

    .akira .theme-hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, transparent, rgba(200, 16, 46, 0.4), transparent);
      transform: translateX(-100%);
      pointer-events: none;
    }

    .akira .theme-hover:hover:not(:disabled)::before {
      animation: light-trail-sweep 0.5s ease-in-out;
    }
    
    .akira .animate-complete-task {
      animation: psychic-explosion 0.5s ease-out forwards;
    }
    
    .akira .skeleton-loader .skeleton-line {
      background-color: var(--secondary);
    }
  `
};