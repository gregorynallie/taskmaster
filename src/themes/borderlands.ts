import { ThemeDefinition } from '../themeTypes';

export const borderlands: ThemeDefinition = {
  id: 'borderlands',
  name: 'Welcome to Pandora',
  category: 'Gaming & Pop Culture',
  font: "'Bangers', cursive",
  soundPack: 'analog',
  isLight: true,
  animations: {
    addTask: 'pop',
    taskComplete: {
      className: 'animate-complete-task',
      description: "A burst of multi-colored loot explodes from the card as it disappears.",
    },
    suggestionAccept: 'pop',
    hover: {
        description: "The card jolts erratically, like a comic book panel.",
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
    '--bkg': '#EADDC4', // Sandy desert
    '--surface': '#FDF6E3', // Lighter parchment
    '--surface-modal-bkg': 'rgba(253, 246, 227, 0.9)',
    '--primary': '#FFCB05', // Claptrap Yellow
    '--primary-focus': '#FFD740',
    '--secondary': '#000000', // Black outlines
    '--text-primary': '#000000',
    '--text-secondary': '#4D4D4D',
    '--accent': '#00FFFF', // Hyperion Cyan
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Bangers', cursive",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.125rem', // Sharp, comic-book edges
    '--card-border-width': '3px',
    '--card-shadow': '5px 5px 0px var(--secondary)',
    '--bkg-image': `linear-gradient(rgba(234, 221, 196, 0.85), rgba(234, 221, 196, 0.85)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
    '--transition-duration': '150ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    @keyframes borderlands-jolt {
      0%, 100% { transform: translate(0, 0) rotate(0); }
      25% { transform: translate(-2px, -1px) rotate(-0.5deg); }
      75% { transform: translate(1px, 2px) rotate(0.5deg); }
    }

    @keyframes loot-burst {
      0% {
        opacity: 1;
        transform: scale(0.5);
        box-shadow: 0 0 0 0 transparent;
      }
      100% {
        opacity: 0;
        transform: scale(1.5);
        box-shadow: 
          /* Common (White) */
          -40px -20px 0 0px #FFFFFF, 35px 40px 0 0px #FFFFFF,
          /* Uncommon (Green) */
          35px -15px 0 0px #1EFF00, -25px 35px 0 0px #1EFF00,
          /* Rare (Blue) */
          -30px 25px 0 0px #0070DD, 20px -30px 0 0px #0070DD,
          /* Epic (Purple) */
          -45px 5px 0 0px #A335EE,
          /* Legendary (Orange) */
          15px 15px 0 0px #FF8000;
      }
    }

    @keyframes task-fade-out {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    .borderlands * {
      /* Gives text a slightly thicker, comic-book feel */
      -webkit-text-stroke: 0.5px var(--text-primary);
      paint-order: stroke fill;
    }

    .borderlands h1, .borderlands h2, .borderlands h3, .borderlands h4 {
      letter-spacing: 1px;
    }

    .borderlands .theme-hover:hover:not(:disabled) {
      animation: borderlands-jolt 0.3s cubic-bezier(.36,.07,.19,.97) both;
      border-color: var(--primary);
    }
    
    .borderlands .animate-complete-task {
      animation: task-fade-out 0.5s ease-out 0.2s forwards;
      position: relative;
    }

    .borderlands .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin: -2px 0 0 -2px;
      background: transparent;
      animation: loot-burst 0.6s ease-out forwards;
    }
  `
};