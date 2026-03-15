import { ThemeDefinition } from '../themeTypes';

export const streetFighter2: ThemeDefinition = {
  id: 'street-fighter-2',
  name: 'Street Fighter II',
  category: 'Gaming & Pop Culture',
  font: "'Lilita One', sans-serif",
  soundPack: 'analog',
  isLight: true,
  animations: {
    addTask: {
        classes: {
            confirmEnter: 'animate-pop-confirm-enter',
            confirmExit: 'animate-pop-confirm-exit',
            formEnter: 'animate-pop-form-enter',
            taskEnter: 'task-animating-in',
        },
        description: "The new task slides into view like a character selection screen.",
    },
    taskComplete: {
      className: 'animate-complete-task',
      description: "A 'K.O.' graphic splashes over the card as it's knocked out.",
    },
    suggestionAccept: 'pop',
    hover: {
      description: "The card shakes as if it's been hit by a combo.",
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
    '--bkg': '#E0E0E0', // Concrete Arena Gray
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.9)',
    '--primary': '#D32F2F', // Ryu Red
    '--primary-focus': '#F44336',
    '--secondary': '#1976D2', // Chun-Li Blue
    '--text-primary': '#212121', // Arcade Black
    '--text-secondary': '#616161',
    '--accent': '#FBC02D', // Ken Yellow
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Lilita One', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.125rem', // Slightly beveled
    '--card-border-width': '4px',
    '--card-shadow': '5px 5px 0px var(--secondary)', // Hard shadow
    '--bkg-image': `linear-gradient(rgba(224, 224, 224, 0.9), rgba(224, 224, 224, 0.9)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
    '--transition-duration': '100ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    @keyframes sf2-shake {
      0%, 100% { transform: translate(0, 0); }
      10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 2px); }
      20%, 40%, 60%, 80% { transform: translate(2px, -2px); }
    }
    
    @keyframes sf2-ko-splash {
      0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes sf2-task-ko {
      0% { opacity: 1; filter: none; }
      100% { opacity: 0; filter: brightness(3) blur(5px); }
    }
    
    @keyframes sf2-slide-in-right {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .street-fighter-2 h1, .street-fighter-2 h2, .street-fighter-2 h3, .street-fighter-2 h4 {
      text-transform: uppercase;
      letter-spacing: 2px;
      -webkit-text-stroke: 1px #000;
      color: var(--accent);
    }

    .street-fighter-2 .theme-hover:hover:not(:disabled) {
      animation: sf2-shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
      border-color: var(--accent);
    }
    
    .street-fighter-2 .animate-complete-task {
      animation: sf2-task-ko 0.5s ease-out 0.2s forwards;
      position: relative;
    }

    .street-fighter-2 .animate-complete-task::after {
      content: 'K.O.';
      position: absolute;
      top: 50%;
      left: 50%;
      font-family: var(--font-family-header);
      font-size: 4rem;
      font-weight: bold;
      color: var(--accent);
      text-shadow: 3px 3px 0px var(--primary), -3px -3px 0px var(--secondary);
      opacity: 0;
      animation: sf2-ko-splash 0.3s ease-out forwards;
      pointer-events: none;
      z-index: 10;
      white-space: nowrap;
    }
    
    .street-fighter-2 .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background-color: var(--secondary);
    }

    .street-fighter-2 .task-animating-in {
        animation: sf2-slide-in-right 0.4s ease-out 0.1s forwards;
    }
  `
};