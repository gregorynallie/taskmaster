import { ThemeDefinition } from '../themeTypes';

export const vaporwave: ThemeDefinition = {
  id: 'vaporwave',
  name: 'Vaporwave Sunset',
  category: 'Retro & Pixelated',
  font: "'Lora', serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    addTask: 'retro',
    taskComplete: {
      className: 'animate-complete-task',
      description: "The task card fades out with a VHS tracking line effect.",
    },
    suggestionAccept: 'retro',
    hover: 'retro',
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
    '--bkg': '#12122B', // Dark purple-blue
    '--surface': '#1A1A38',
    '--surface-modal-bkg': 'rgba(26, 26, 56, 0.85)',
    '--primary': '#C084FC', // Lavender
    '--primary-focus': '#D9A9FF',
    '--secondary': '#7FDBDA', // Pastel Teal
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#A0AEC0',
    '--accent': '#FFB6C1', // Soft Pink
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 10px hsla(274, 96%, 76%, 0.3)',
    '--bkg-image': `linear-gradient(rgba(18, 18, 43, 0.9), rgba(18, 18, 43, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='none' stroke='%23C084FC' stroke-opacity='0.1' stroke-width='1'/%3E%3Crect x='50' y='50' width='50' height='50' fill='none' stroke='%237FDBDA' stroke-opacity='0.1' stroke-width='1'/%3E%3C/svg%3E")`,
    '--transition-duration': '400ms',
    '--header-text-shadow': '2px 2px 0px var(--secondary), -2px -2px 0px var(--accent)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes vhs-glitch-text {
      0%, 100% { text-shadow: 2px 2px 0px var(--secondary), -2px -2px 0px var(--accent); }
      50% { text-shadow: -2px 2px 0px var(--secondary), 2px -2px 0px var(--accent); }
    }

    @keyframes vhs-tracking-line {
      from { transform: translateY(-50%); }
      to { transform: translateY(50%); }
    }

    .vaporwave .theme-hover:hover:not(:disabled) h1,
    .vaporwave .theme-hover:hover:not(:disabled) h2,
    .vaporwave .theme-hover:hover:not(:disabled) h3,
    .vaporwave .theme-hover:hover:not(:disabled) .font-header {
      animation: vhs-glitch-text 0.2s infinite;
    }
    
    .vaporwave .animate-complete-task {
      animation: complete-task-animation 0.5s ease-out forwards;
      position: relative;
      overflow: hidden;
    }

    .vaporwave .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: #fff;
      box-shadow: 0 0 10px #fff;
      opacity: 0.7;
      animation: vhs-tracking-line 0.5s ease-in-out forwards;
    }
  `
};
