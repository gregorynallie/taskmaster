import { ThemeDefinition } from '../themeTypes';

export const vhsHorror: ThemeDefinition = {
  id: 'vhs-horror',
  name: 'Static Dread',
  category: 'Retro & Pixelated',
  font: "'Share Tech Mono', monospace",
  soundPack: 'analog',
  isLight: false,
  animations: {
    addTask: 'glitch',
    taskComplete: {
      className: 'animate-complete-task',
      description: "A burst of white noise static covers the card as it disappears.",
    },
    suggestionAccept: 'glitch',
    hover: {
        description: "The card glitches erratically with a chromatic aberration effect.",
    },
    enter: {
        className: 'animate-themed-enter',
        description: "The entire screen is overlaid with a constant, subtle static effect.",
    },
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
    '--bkg': '#1a1a24',
    '--surface': '#2d2d38',
    '--surface-modal-bkg': 'rgba(45, 45, 56, 0.85)',
    '--primary': '#00aaff', // Glitch blue
    '--primary-focus': '#4dc4ff',
    '--secondary': '#4a4a58',
    '--text-primary': '#e0e0e0',
    '--text-secondary': '#8a8a9a',
    '--accent': '#ff0000', // Blood red
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0px',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 5px hsla(205, 100%, 50%, 0.3)',
    '--bkg-image': 'none', // Managed by custom CSS
    '--transition-duration': '150ms',
    '--header-text-shadow': '2px 2px 0px var(--accent), -2px -2px 0px var(--primary)',
    '--animation-timing-enter': 'linear',
    '--animation-transform-enter': 'scale(1)',
  },
  customCss: `
    @keyframes vhs-glitch-hover {
      0% { transform: translate(0, 0); }
      20% { transform: translate(-3px, 1px); }
      40% { transform: translate(2px, -2px); }
      60% { transform: translate(-1px, 2px); }
      80% { transform: translate(2px, -1px); }
      100% { transform: translate(0, 0); }
    }
    
    @keyframes vhs-static-burst {
      0% { opacity: 0; }
      20% { opacity: 1; }
      100% { opacity: 0; }
    }

    @keyframes vhs-task-fade {
      0% { opacity: 1; filter: none; }
      100% { opacity: 0; filter: blur(5px); }
    }

    /* Constant static overlay */
    body.vhs-horror::after {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 1000;
      animation: vhs-glitch-hover 1s steps(1, end) infinite;
    }

    /* Chromatic aberration text effect */
    .vhs-horror * {
      text-shadow: 1px 1px 0px var(--accent), -1px -1px 0px var(--primary);
    }
    
    .vhs-horror .theme-hover:hover:not(:disabled) {
      animation: vhs-glitch-hover 0.3s linear infinite;
    }
    
    /* Task completion animation */
    .vhs-horror .animate-complete-task {
      animation: vhs-task-fade 0.5s ease-out 0.2s forwards;
      position: relative;
    }

    /* Static burst overlay on completion */
    .vhs-horror .animate-complete-task::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.7'/%3E%3C/svg%3E");
      opacity: 0;
      animation: vhs-static-burst 0.5s linear forwards;
      z-index: 10;
    }

    .vhs-horror .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background-color: var(--secondary);
    }
  `
};
