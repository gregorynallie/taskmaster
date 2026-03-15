import { ThemeDefinition } from '../themeTypes';

export const waluigi: ThemeDefinition = {
  id: 'waluigi',
  name: "Waluigi's Scheme",
  category: 'Gaming & Pop Culture',
  font: "'Share Tech Mono', monospace",
  soundPack: 'playful',
  isLight: false,
  animations: {
    addTask: 'playful',
    taskComplete: 'playful',
    suggestionAccept: 'playful',
    hover: {
      description: "The card skews and rotates mischievously, wahahaha!",
    },
    enter: 'playful',
    viewTransition: 'playful',
    dismissTask: 'playful',
    levelUp: 'playful',
    progressBar: 'playful',
    inputField: 'playful',
    modal: 'playful',
    loadingState: 'playful',
    button: 'playful',
  },
  cssVariables: {
    '--bkg': '#1E1E2E',
    '--surface': '#2E2E3E',
    '--surface-modal-bkg': 'rgba(46, 46, 62, 0.8)',
    '--primary': '#6B1FB6',
    '--primary-focus': '#8A2BE2',
    '--secondary': '#1E1E2E',
    '--text-primary': '#F0E6FF',
    '--text-secondary': '#A0A0B0',
    '--accent': '#FFD82F',
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0.125rem',
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 0px var(--accent)',
    '--bkg-image': `linear-gradient(rgba(30, 30, 46, 0.9), rgba(30, 30, 46, 0.9)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23FF57A6' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0z' transform='skewX(-45)'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '200ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-in-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    .waluigi .theme-hover:hover:not(:disabled) {
      animation: waluigi-scheme 0.4s ease-in-out;
    }
    .waluigi h1, .waluigi h2, .waluigi h3, .waluigi h4 {
      color: var(--primary);
      -webkit-text-stroke: 1px var(--accent);
      paint-order: stroke fill;
      text-shadow: 2px 2px 0px var(--secondary);
      transform: skewX(-5deg);
    }
    .waluigi .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background: linear-gradient(90deg, var(--accent), var(--primary), var(--accent));
      background-size: 200% 100%;
      animation: waluigi-pulse 1.5s linear infinite;
    }
    @keyframes waluigi-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes waluigi-scheme {
      0%, 100% { transform: skewX(0) rotate(0); }
      25% { transform: skewX(-4deg) rotate(-1deg); }
      75% { transform: skewX(4deg) rotate(1deg); }
    }
  `
};
