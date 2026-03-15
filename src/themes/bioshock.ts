import { ThemeDefinition } from '../themeTypes';

export const bioshock: ThemeDefinition = {
  id: 'bioshock',
  name: 'Welcome to Rapture',
  category: 'Gaming & Pop Culture',
  font: "'Playfair Display', serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A burst of electrical sparks, like the 'Electro Bolt' plasmid, shorts out the card.",
    },
    hover: {
        description: "The card's border flickers like a failing Art Deco neon sign.",
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
    '--bkg': '#0A141E', // Deep Sea Black
    '--surface': '#1A2E3A', // Dark Teal
    '--surface-modal-bkg': 'rgba(26, 46, 58, 0.9)',
    '--primary': '#D4AF37', // Brass Gold
    '--primary-focus': '#E7C873',
    '--secondary': '#2C6E91', // Main Teal
    '--text-primary': '#F5EEDA', // Aged Off-White
    '--text-secondary': '#8AA3B8', // Muted Teal-Gray
    '--accent': '#FF4500', // Neon Red/Orange
    '--font-family-header': "'Playfair Display', serif",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.125rem', // Sharp Art Deco lines
    '--card-border-width': '2px',
    '--card-shadow': '0 0 10px hsla(43, 61%, 52%, 0.3)',
    '--bkg-image': 'none', // Managed by custom CSS
    '--transition-duration': '300ms',
    '--header-text-shadow': '0 0 5px var(--primary)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes bioshock-bubbles {
      0% { transform: translateY(0); opacity: 0; }
      10% { opacity: 0.7; }
      90% { opacity: 0.7; }
      100% { transform: translateY(-100vh); opacity: 0; }
    }
    
    @keyframes bioshock-neon-flicker {
      0%, 18%, 22%, 25%, 53%, 57%, 100% {
        border-color: var(--accent);
        box-shadow: 0 0 5px var(--accent), 0 0 10px var(--accent);
        opacity: 1;
      }
      20%, 24%, 55% {
        border-color: var(--secondary);
        box-shadow: var(--card-shadow);
        opacity: 0.8;
      }
    }
    
    @keyframes bioshock-spark-burst {
      0% { opacity: 1; box-shadow: 0 0 0 0 transparent; }
      100% {
        opacity: 0;
        transform: scale(2);
        box-shadow: 
          -30px -15px 0 -5px #00FFFF, 25px 20px 0 -5px #FFFFFF,
          -25px 25px 0 -5px #00FFFF, 15px -25px 0 -5px #FFFFFF;
      }
    }

    @keyframes bioshock-task-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    /* Rising Bubbles Effect */
    body.bioshock::after {
      content: '';
      position: fixed;
      top: 100%;
      left: 0;
      width: 100%;
      height: 100vh;
      pointer-events: none;
      box-shadow: 
        5vw 10vh 2px #8AA3B8, 15vw 30vh 3px #8AA3B8, 25vw 5vh 2px #8AA3B8,
        35vw 50vh 4px #8AA3B8, 45vw 80vh 2px #8AA3B8, 55vw 25vh 3px #8AA3B8,
        65vw 60vh 4px #8AA3B8, 75vw 15vh 2px #8AA3B8, 85vw 45vh 3px #8AA3B8,
        95vw 90vh 4px #8AA3B8;
      animation: bioshock-bubbles 25s linear infinite;
    }
    
    .bioshock .theme-hover:hover:not(:disabled) {
      animation: bioshock-neon-flicker 2s linear infinite;
    }

    .bioshock .animate-complete-task {
      animation: bioshock-task-fade 0.5s ease-out 0.2s forwards;
      position: relative;
    }

    .bioshock .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      margin-top: -2px;
      background: transparent;
      animation: bioshock-spark-burst 0.5s ease-out forwards;
    }
  `
};