import { ThemeDefinition } from '../themeTypes';

export const tetris: ThemeDefinition = {
  id: 'tetris-89',
  name: "Tetris '89",
  category: 'Retro & Pixelated',
  font: "'Share Tech Mono', monospace",
  soundPack: 'analog',
  isLight: true,
  animations: {
    addTask: 'retro',
    taskComplete: {
      className: 'animate-complete-task',
      description: "A wipe effect clears the card from left to right, like clearing a line.",
    },
    suggestionAccept: 'retro',
    hover: {
        description: "The card 'locks in' with a quick downward bump, as if it's a Tetris block.",
    },
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
    '--bkg': '#C0C0B8', // Game Boy Gray
    '--surface': '#D8D8D0', // Game Boy Screen
    '--surface-modal-bkg': 'rgba(216, 216, 208, 0.9)',
    '--primary': '#800080', // T-Block Purple
    '--primary-focus': '#9932CC',
    '--secondary': '#303030', // Dark Pixel Color
    '--text-primary': '#303030',
    '--text-secondary': '#606060',
    '--accent': '#00FFFF', // I-Block Cyan
    '--text-on-secondary-bkg': '#D8D8D0',
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0px',
    '--card-border-width': '4px',
    '--card-shadow': '4px 4px 0px var(--secondary)', // Hard pixel shadow
    '--bkg-image': `linear-gradient(rgba(216, 216, 208, 0.95), rgba(216, 216, 208, 0.95)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23303030' fill-opacity='0.03'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3Cpath d='M20 20h20v20H20z'/%3E%3Cpath d='M40 40h20v20H40z'/%3E%3Cpath d='M60 60h20v20H60z'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '100ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    @keyframes tetris-lock-in {
      0% { transform: translateY(0); }
      50% { transform: translateY(2px); filter: brightness(1.5); }
      100% { transform: translateY(0); filter: brightness(1); }
    }

    @keyframes line-clear-wipe {
      0% { transform: scaleX(0); }
      100% { transform: scaleX(1); }
    }

    @keyframes line-clear-fade-content {
      0%, 40% { opacity: 1; }
      100% { opacity: 0; }
    }

    .tetris-89 * {
      image-rendering: pixelated;
    }

    .tetris-89 .theme-hover:hover:not(:disabled) {
      animation: tetris-lock-in 0.2s ease-out;
      border-color: var(--accent);
    }

    .tetris-89 .animate-complete-task {
      position: relative;
      overflow: hidden;
    }

    .tetris-89 .animate-complete-task > * {
        animation: line-clear-fade-content 0.5s forwards;
    }

    /* The wipe effect */
    .tetris-89 .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--bkg);
      transform-origin: left;
      animation: line-clear-wipe 0.4s ease-in 0.1s forwards;
      z-index: 10;
    }
  `
};
