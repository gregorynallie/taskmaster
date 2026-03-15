import { ThemeDefinition } from '../themeTypes';

export const darkSouls: ThemeDefinition = {
  id: 'dark-souls-bonfire',
  name: 'Dark Souls Bonfire',
  category: 'Gaming & Pop Culture',
  font: "'Playfair Display', serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The task card turns to ash and drifts away.",
    },
    hover: {
      description: "The card's border flickers like a bonfire.",
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
    '--bkg': '#1A1A1A', // Deep Black/Gray
    '--surface': '#424242', // Ash Gray
    '--surface-modal-bkg': 'rgba(66, 66, 66, 0.9)',
    '--primary': '#D95F30', // Ember Orange
    '--primary-focus': '#F28C38',
    '--secondary': '#7B2D26', // Rust Red
    '--text-primary': '#D1C7B7', // Ashen White
    '--text-secondary': '#8A8174', // Muted Gray
    '--accent': '#D95F30', // Ember Orange
    '--font-family-header': "'Playfair Display', serif",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.125rem',
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 6px rgba(0,0,0,0.6)',
    '--bkg-image': `linear-gradient(rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 0.95)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.5)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes bonfire-flicker {
      0%, 100% { box-shadow: 0 0 10px var(--primary), 3px 3px 6px rgba(0,0,0,0.6); transform: translate(0, 0); }
      20%, 60% { box-shadow: 0 0 15px var(--primary-focus), 3px 3px 6px rgba(0,0,0,0.6); }
      40% { transform: translate(-1px, 0); }
      80% { transform: translate(0, -1px); }
    }

    @keyframes turn-to-ash-content {
      to { opacity: 0; }
    }
    
    @keyframes ash-drift-away {
      0% {
        opacity: 0.8;
        transform: translateY(0);
        box-shadow: 
          0 0 0 0 #424242, 0 0 0 0 #5A5A5A,
          0 0 0 0 #424242, 0 0 0 0 #5A5A5A;
      }
      100% {
        opacity: 0;
        transform: translateY(-80px);
        box-shadow: 
          -30px 20px 0 -5px #424242, 25px -10px 0 -5px #5A5A5A,
          -20px 50px 0 -5px #424242, 15px 40px 0 -5px #5A5A5A;
      }
    }

    @keyframes souls-wrapper-fade-out-late {
        0%, 75% { opacity: 1; }
        100% { opacity: 0; }
    }

    .dark-souls-bonfire .theme-hover:hover:not(:disabled) {
      animation: bonfire-flicker 2s infinite ease-in-out;
      border-color: var(--primary);
    }
    
    .dark-souls-bonfire .animate-complete-task {
      animation: souls-wrapper-fade-out-late 0.8s ease-out forwards;
      position: relative;
    }

    .dark-souls-bonfire .animate-complete-task > * {
      animation: turn-to-ash-content 0.4s ease-out forwards;
    }

    .dark-souls-bonfire .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      margin-top: -2px;
      background: transparent;
      animation: ash-drift-away 0.8s ease-in forwards;
    }
  `
};