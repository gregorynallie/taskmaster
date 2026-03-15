import { ThemeDefinition } from '../themeTypes';

export const wario: ThemeDefinition = {
  id: 'wario',
  name: "Wario's Greed",
  category: 'Gaming & Pop Culture',
  font: "'Nunito', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: 'pop',
    taskComplete: 'pop',
    suggestionAccept: 'pop',
    hover: {
      description: "The card shakes greedily and its border glows with gold.",
    },
    enter: 'pop',
    viewTransition: 'pop',
    dismissTask: 'pop',
    levelUp: 'pop',
    progressBar: 'pop',
    inputField: 'pop',
    modal: 'pop',
    loadingState: 'pop',
    button: 'pop',
  },
  cssVariables: {
    '--bkg': '#FFF9E6',
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': '#FFFFFF',
    '--primary': '#8034AD',
    '--primary-focus': '#9E49D4',
    '--secondary': '#000000',
    '--text-primary': '#212121',
    '--text-secondary': '#5C4E5D',
    '--accent': '#FFD300',
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Lilita One', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '0.5rem',
    '--card-border-width': '3px',
    '--card-shadow': '5px 5px 0px var(--secondary)',
    '--bkg-image': `url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%3E%3Cg%20fill='%23FFD300'%20fill-opacity='0.1'%3E%3Ccircle%20cx='10'%20cy='10'%20r='5'/%3E%3Ccircle%20cx='30'%20cy='30'%20r='5'/%3E%3Ccircle%20cx='10'%20cy='30'%20r='3'/%3E%3Ccircle%20cx='30'%20cy='10'%20r='3'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '150ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    '--animation-transform-enter': 'scale(0.9)',
  },
  customCss: `
    .wario .theme-hover:hover:not(:disabled) {
      animation: wario-shake 0.3s ease-in-out;
      border-color: var(--accent);
      box-shadow: 7px 7px 0px var(--secondary), 0 0 10px var(--accent);
    }
    .wario h1, .wario h2, .wario h3, .wario h4 {
      color: var(--accent);
      -webkit-text-stroke: 2px var(--primary);
      paint-order: stroke fill;
      text-shadow: 2px 2px 0px var(--secondary);
      letter-spacing: 1px;
    }
    .wario .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background: linear-gradient(90deg, var(--accent), var(--primary), var(--accent));
      background-size: 200% 100%;
      animation: wario-pulse 1.5s linear infinite;
    }
    @keyframes wario-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes wario-shake {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-3deg); }
      75% { transform: rotate(3deg); }
    }
  `
};