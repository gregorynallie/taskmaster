import { ThemeDefinition } from '../themeTypes';

export const perion: ThemeDefinition = {
  id: 'perion',
  name: 'Perion Warrior',
  category: 'Gaming & Pop Culture',
  font: "'Oswald', sans-serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    addTask: 'cinematic',
    taskComplete: {
      className: 'animate-complete-task',
      description: "The card crumbles into rocky particles and drifts away.",
    },
    suggestionAccept: 'cinematic',
    hover: {
      description: "The card shakes as if struck by a warrior's blow.",
    },
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
    '--bkg': '#2E2E2E', // Smoke Black
    '--surface': '#4A4A4A', // Stone Gray
    '--surface-modal-bkg': 'rgba(74, 74, 74, 0.85)',
    '--primary': '#B23A48', // Rust Red
    '--primary-focus': '#C94B5A',
    '--secondary': '#8D6E63', // Ash Brown
    '--text-primary': '#C2B280', // Faded Sand
    '--text-secondary': '#8D8D8D',
    '--accent': '#B23A48', // Use Rust Red as accent
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.125rem', // Chiseled edges
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 6px rgba(0,0,0,0.5)',
    '--bkg-image': `linear-gradient(rgba(46, 46, 46, 0.9), rgba(46, 46, 46, 0.9)), 
                    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C2B280' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, // Cracked earth
    '--transition-duration': '200ms',
    '--header-text-shadow': '2px 2px 2px rgba(0,0,0,0.5)',
  },
  customCss: `
    @keyframes perion-quake {
      0%, 100% { transform: translate(0, 0) rotate(0); }
      20%, 60% { transform: translate(1px, -1px) rotate(-0.2deg); }
      40%, 80% { transform: translate(-1px, 1px) rotate(0.2deg); }
    }
    
    @keyframes perion-rock-crumble {
      0% {
        opacity: 1;
        box-shadow: 
          -10px -15px 0 -5px var(--secondary), 10px 5px 0 -5px var(--bkg),
          -5px 15px 0 -5px var(--secondary), 5px -10px 0 -5px var(--bkg);
      }
      100% {
        opacity: 0;
        transform: scale(0.8) translateY(30px);
        box-shadow: 
          -30px -40px 0 -5px var(--secondary), 30px 20px 0 -5px var(--bkg),
          -25px 45px 0 -5px var(--secondary), 20px -30px 0 -5px var(--bkg);
      }
    }

    @keyframes perion-task-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    .perion h1, .perion h2, .perion h3, .perion h4 {
      text-transform: uppercase;
      font-weight: 700;
    }

    .perion .theme-hover:hover:not(:disabled) {
      animation: perion-quake 0.4s cubic-bezier(.36,.07,.19,.97) both;
      border-color: var(--primary);
    }
    
    .perion .animate-complete-task {
      animation: perion-task-fade 0.5s ease-out 0.2s forwards;
      position: relative;
    }

    .perion .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      margin-top: -2px;
      background: transparent;
      animation: perion-rock-crumble 0.6s ease-out forwards;
    }

    .perion .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background: var(--secondary);
    }
  `
};
