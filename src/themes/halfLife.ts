import { ThemeDefinition } from '../themeTypes';

export const halfLife: ThemeDefinition = {
  id: 'half-life',
  name: 'Black Mesa',
  category: 'Gaming & Pop Culture',
  font: "'Source Sans Pro', sans-serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A 'λ' (lambda) symbol flashes as the card glitches out.",
    },
    hover: {
        description: "The card jolts, as if struck.",
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
    '--bkg': '#111111', // Black
    '--surface': '#222222', // Dark Gunmetal
    '--surface-modal-bkg': 'rgba(34, 34, 34, 0.9)',
    '--primary': '#E25822', // Hazard Orange
    '--primary-focus': '#F07542',
    '--secondary': '#607D8B', // Gunmetal Gray
    '--text-primary': '#E0E0E0',
    '--text-secondary': '#9E9E9E',
    '--accent': '#00BCD4', // HEV Suit Cyan
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0px',
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 0px rgba(0,0,0,0.5)',
    '--bkg-image': `linear-gradient(rgba(17, 17, 17, 0.95), rgba(17, 17, 17, 0.95)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
    '--transition-duration': '150ms',
    '--header-text-shadow': '1px 1px 0px #000',
  },
  customCss: `
    @keyframes half-life-jolt {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(1px, 1px); }
    }
    
    @keyframes half-life-glitch-out {
      0% { opacity: 1; filter: none; }
      100% { opacity: 0; filter: blur(4px) brightness(2); }
    }
    
    @keyframes lambda-flash {
      0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
    }

    .half-life h1, .half-life h2, .half-life h3, .half-life h4 {
      text-transform: uppercase;
      font-weight: 700;
    }

    .half-life .theme-hover:hover:not(:disabled) {
      animation: half-life-jolt 0.1s linear;
      border-color: var(--primary);
    }
    
    .half-life .animate-complete-task {
      animation: half-life-glitch-out 0.5s ease-out 0.2s forwards;
      position: relative;
    }

    .half-life .animate-complete-task::after {
      content: 'λ';
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 3rem;
      font-weight: bold;
      color: var(--primary);
      text-shadow: 0 0 10px var(--primary);
      opacity: 0;
      animation: lambda-flash 0.4s ease-in-out forwards;
    }
    
    .half-life .skeleton-loader .skeleton-line {
      background-color: var(--secondary);
    }
  `
};
