import { ThemeDefinition } from '../themeTypes';

export const left4Dead: ThemeDefinition = {
  id: 'left-4-dead',
  name: 'Left 4 Dead',
  category: 'Gaming & Pop Culture',
  font: "'Source Sans Pro', sans-serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The card is violently struck, glows red, and then fades as if destroyed.",
    },
    hover: {
      description: "The card glitches erratically, like a failing piece of equipment.",
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
    '--bkg': '#2E332A', // Grimy olive/gray
    '--surface': '#3A4035', // Darker, grimy surface
    '--surface-modal-bkg': 'rgba(58, 64, 53, 0.85)',
    '--primary': '#B71C1C', // Blood Red
    '--primary-focus': '#D32F2F',
    '--secondary': '#555555', // Dark concrete gray
    '--text-primary': '#D2D6C5', // Dirty off-white
    '--text-secondary': '#8A917D', // Muted green-gray
    '--accent': '#A4B839', // Biohazard Green-Yellow
    '--font-family-header': "'Special Elite', monospace",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0px', // Sharp, functional
    '--card-border-width': '1px',
    '--card-shadow': 'inset 0 0 15px rgba(0,0,0,0.6)',
    '--bkg-image': `linear-gradient(rgba(46, 51, 42, 0.9), rgba(46, 51, 42, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
    '--transition-duration': '100ms',
    '--header-text-shadow': '0 0 5px var(--text-primary)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes l4d-glitch {
      0%, 100% { transform: translate(0, 0); border-color: var(--secondary); }
      20% { transform: translate(-2px, 1px); border-color: var(--accent); }
      40% { transform: translate(1px, -2px); }
      60% { transform: translate(2px, 2px); border-color: var(--accent); }
      80% { transform: translate(-1px, -1px); }
    }

    @keyframes l4d-complete-task {
      0% { transform: scale(1); opacity: 1; }
      10% {
        transform: scale(1.05) translate(-5px, 5px) rotate(-2deg);
        background-color: hsla(0, 75%, 42%, 0.3);
        border-color: var(--primary);
        box-shadow: 0 0 20px var(--primary);
      }
      20% { transform: scale(1.05) translate(5px, -5px) rotate(2deg); }
      30% { transform: scale(1.05) translate(0,0) rotate(0); }
      100% {
        transform: scale(0.8);
        opacity: 0;
        filter: blur(5px);
      }
    }

    .left-4-dead * {
      text-shadow: 0 0 2px rgba(210, 214, 197, 0.2); /* Subtle screen glow */
    }

    .left-4-dead .theme-hover:hover:not(:disabled) {
      animation: l4d-glitch 0.3s cubic-bezier(.36,.07,.19,.97) both infinite;
    }
    
    .left-4-dead .animate-complete-task {
      animation: l4d-complete-task 0.6s ease-out forwards;
    }

    .left-4-dead .skeleton-loader .skeleton-line {
      background-color: var(--secondary);
      opacity: 0.5;
      animation: l4d-glitch 2s linear infinite;
    }
  `
};
