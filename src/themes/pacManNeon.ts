import { ThemeDefinition } from '../themeTypes';

export const pacManNeon: ThemeDefinition = {
  id: 'pac-man-neon',
  name: 'Pac-Man Neon',
  category: 'Retro & Pixelated',
  font: "'Share Tech Mono', monospace",
  soundPack: 'digital',
  isLight: false,
  animations: {
    addTask: 'retro',
    taskComplete: {
      className: 'animate-complete-task',
      description: "A chomp-animated Pac-Man runs across the screen, 'eating' the task.",
    },
    suggestionAccept: 'retro',
    hover: {
      description: "The card's border cycles through the neon colors of the ghosts.",
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
    '--bkg': '#000000',
    '--surface': '#000022', // Dark blue maze wall
    '--surface-modal-bkg': 'rgba(0, 0, 34, 0.9)',
    '--primary': '#FFFF00', // Pac-Man Yellow
    '--primary-focus': '#FFFF88',
    '--secondary': '#00FFFF', // Inky Blue
    '--text-primary': '#FFFF00',
    '--text-secondary': '#CCCCCC', // Pellet White
    '--accent': '#FF00FF', // Pinky Pink
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0px',
    '--card-border-width': '3px',
    '--card-shadow': '0 0 10px var(--primary)',
    '--bkg-image': 'none',
    '--transition-duration': '100ms',
    '--header-text-shadow': '0 0 6px var(--primary)',
    '--animation-timing-enter': 'linear',
    '--animation-transform-enter': 'scale(1)',
  },
  customCss: `
    @keyframes ghost-border-cycle {
      0%   { border-color: #FF00FF; box-shadow: 0 0 10px #FF00FF; } /* Pinky */
      25%  { border-color: #00FFFF; box-shadow: 0 0 10px #00FFFF; } /* Inky */
      50%  { border-color: #FF0000; box-shadow: 0 0 10px #FF0000; } /* Blinky */
      75%  { border-color: #FFB852; box-shadow: 0 0 10px #FFB852; } /* Clyde */
      100% { border-color: #FF00FF; box-shadow: 0 0 10px #FF00FF; }
    }
    
    @keyframes pac-man-chomp {
      0%, 100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 60%, 50% 50%, 0 40%); }
      50% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%, 50% 50%, 0 50%); }
    }

    @keyframes pac-man-run {
      0% { left: -32px; transform: rotate(0deg); }
      49.9% { transform: rotate(0deg); }
      50% { left: 110%; transform: rotateY(180deg); } /* Turn around */
      99.9% { transform: rotateY(180deg); }
      100% { left: -32px; transform: rotate(0deg); }
    }

    @keyframes pac-man-fade-content {
      0% { opacity: 1; }
      10%, 90% { opacity: 0; }
      100% { opacity: 1; }
    }

    .pac-man-neon .theme-hover:hover:not(:disabled) {
      animation: ghost-border-cycle 2s linear infinite;
    }

    /* Completion Animation */
    .pac-man-neon .animate-complete-task {
      position: relative;
    }
    
    .pac-man-neon .animate-complete-task > * {
      animation: pac-man-fade-content 0.8s steps(1, start) forwards;
    }
    
    .pac-man-neon .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      margin-top: -16px; /* half of height */
      width: 32px;
      height: 32px;
      background-color: var(--primary);
      border-radius: 50%;
      animation: pac-man-chomp 0.3s steps(2, end) infinite, pac-man-run 0.8s linear forwards;
    }

    .pac-man-neon .skeleton-loader.skeleton-theme-specific .skeleton-line {
        background-color: var(--secondary);
    }
  `
};
