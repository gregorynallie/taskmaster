import { ThemeDefinition } from '../themeTypes';

export const castlevania: ThemeDefinition = {
  id: 'castlevania',
  name: 'Castlevania',
  category: 'Gaming & Pop Culture',
  font: "'Playfair Display', serif",
  soundPack: 'luxe',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The task card flashes crimson and disappears as if slain."
    },
    hover: {
      description: "The card's border flickers like candlelight."
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
    '--bkg': '#0D0D0D', // Midnight Black
    '--surface': '#212121', // Dark Stone
    '--surface-modal-bkg': 'rgba(33, 33, 33, 0.85)',
    '--primary': '#B71C1C', // Crimson
    '--primary-focus': '#D32F2F',
    '--secondary': '#424242', // Stone Gray
    '--text-primary': '#E0E0E0', // Off-white
    '--text-secondary': '#9E9E9E', // Lighter Gray
    '--accent': '#FFC107', // Candlelight Gold
    '--font-family-header': "'Playfair Display', serif",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.25rem', // Sharp, gothic edges
    '--card-border-width': '1px',
    '--card-shadow': '0 0 10px hsla(0, 75%, 42%, 0.4)',
    '--bkg-image': `linear-gradient(rgba(13, 13, 13, 0.9), rgba(13, 13, 13, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.02'%3E%3Crect x='0' y='50' width='50' height='50'/%3E%3Crect x='50' y='0' width='50' height='50'/%3E%3C/g%3E%3C/svg%3E")`, // Subtle stone block texture
    '--transition-duration': '300ms',
    '--header-text-shadow': '0 0 5px var(--accent)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes candle-flicker {
      0%, 100% { border-color: var(--accent); box-shadow: 0 0 10px var(--accent), 0 0 5px rgba(0,0,0,0.5); }
      20%, 60% { border-color: var(--accent); box-shadow: 0 0 15px var(--accent), 0 0 5px rgba(0,0,0,0.5); }
      40%, 80% { border-color: #ffb300; box-shadow: 0 0 8px #ffb300, 0 0 5px rgba(0,0,0,0.5); }
    }

    @keyframes castlevania-complete-task {
      0% { transform: scale(1); opacity: 1; }
      30% {
        transform: scale(1.05);
        background-color: hsla(0, 75%, 42%, 0.2); /* Crimson Flash */
        border-color: var(--primary);
        box-shadow: 0 0 20px var(--primary);
      }
      100% {
        transform: scale(0.9) translateY(20px) rotate(-5deg);
        opacity: 0;
      }
    }

    .castlevania h1, .castlevania h2, .castlevania h3, .castlevania h4 {
      font-weight: 700;
    }

    .castlevania .theme-hover:hover:not(:disabled) {
      animation: candle-flicker 1.5s infinite linear;
    }
    
    .castlevania .animate-complete-task {
      animation: castlevania-complete-task 0.6s ease-in-out forwards;
    }
  `
};