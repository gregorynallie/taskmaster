import { ThemeDefinition } from '../themeTypes';

export const bladeRunner: ThemeDefinition = {
  id: 'blade-runner-2049',
  name: 'Blade Runner 2049',
  category: 'Sci-Fi & Cyberpunk',
  font: "'Oswald', sans-serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The task card de-rezzes with a digital glitch effect.",
    },
    hover: {
        description: "The card's border pulses with neon light.",
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
    '--bkg': '#0A0E1A',
    '--surface': '#141824',
    '--surface-modal-bkg': 'rgba(20, 24, 36, 0.85)',
    '--primary': '#00FFD1', // Teal
    '--primary-focus': '#80FFF5',
    '--secondary': '#FF4FD8', // Pink
    '--text-primary': '#E0F2F1',
    '--text-secondary': '#8892B0',
    '--accent': '#FF6B00', // Orange
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.125rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 10px hsla(172, 100%, 50%, 0.3)',
    '--bkg-image': 'none', // Managed by custom CSS
    '--transition-duration': '300ms',
    '--header-text-shadow': '0 0 6px var(--primary)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes rain-fall {
      0% { background-position: 0 0, 0 0, 0 0; }
      100% { background-position: 500px 1000px, 400px 400px, 300px 300px; }
    }
    
    @keyframes neon-pulse {
      0%, 100% { box-shadow: 0 0 10px var(--primary); border-color: var(--primary); }
      50% { box-shadow: 0 0 20px var(--primary), inset 0 0 5px var(--primary); border-color: var(--primary-focus); }
    }

    @keyframes de-rez-glitch {
      0% { clip-path: inset(0 0 0 0); opacity: 1; transform: none; }
      20% { clip-path: inset(80% 0 5% 0); transform: translate(-10px, 5px); }
      40% { clip-path: inset(10% 0 75% 0); transform: translate(10px, -3px); }
      60% { clip-path: inset(50% 0 30% 0); transform: translate(5px, 10px); filter: brightness(3); }
      80% { clip-path: inset(25% 0 40% 0); transform: translate(-5px, -5px); }
      100% { clip-path: inset(0 0 0 0); opacity: 0; transform: scale(0.8); filter: blur(10px); }
    }

    body.blade-runner-2049::before,
    body.blade-runner-2049::after {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: -1;
    }

    body.blade-runner-2049::before {
      background-image: linear-gradient(
        transparent,
        rgba(0, 255, 209, 0.1) 1px,
        transparent 1px,
        transparent 20px
      );
      background-size: 100% 20px;
      animation: rain-fall 0.8s linear infinite;
    }

    body.blade-runner-2049::after {
      background-image: linear-gradient(
        transparent,
        rgba(255, 79, 216, 0.05) 1px,
        transparent 1px,
        transparent 30px
      );
      background-size: 100% 30px;
      animation: rain-fall 1.2s linear infinite 0.2s;
    }
    
    .blade-runner-2049 h1, .blade-runner-2049 h2, .blade-runner-2049 h3, .blade-runner-2049 h4 {
        text-transform: uppercase;
    }

    .blade-runner-2049 .theme-hover:hover:not(:disabled) {
      animation: neon-pulse 2s infinite ease-in-out;
    }
    
    .blade-runner-2049 .animate-complete-task {
      animation: de-rez-glitch 0.5s cubic-bezier(.25, .46, .45, .94) forwards;
    }
  `
};