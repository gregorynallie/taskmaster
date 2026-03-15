import { ThemeDefinition } from '../themeTypes';

export const goku: ThemeDefinition = {
  id: 'goku-gi',
  name: "Goku's Gi",
  category: 'Gaming & Pop Culture',
  font: "'Bangers', cursive",
  soundPack: 'digital',
  isLight: true,
  animations: {
    taskComplete: {
        className: 'animate-complete-task', // This will now correctly point to customCss
        description: "A Kamehameha-style energy beam blasts through the card.",
    },
    hover: {
        description: "The card's border pulses with a Super Saiyan aura.",
    },
    addTask: 'pop',
    suggestionAccept: 'pop',
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
    '--bkg': '#FFF9E6', // Warm off-white
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.9)',
    '--primary': '#FF8C00', // Goku Orange
    '--primary-focus': '#FFA500',
    '--secondary': '#004080', // Goku Blue
    '--text-primary': '#1A1A3D', // Dark Blue/Black
    '--text-secondary': '#6A7A8A',
    '--accent': '#FFD700', // Super Saiyan Gold
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Bangers', cursive",
    '--font-family-body': "'Montserrat', sans-serif",
    '--border-radius': '0.5rem',
    '--card-border-width': '3px',
    '--card-shadow': '4px 4px 0px var(--secondary)',
    '--bkg-image': `linear-gradient(rgba(255, 249, 230, 0.85), rgba(255, 249, 230, 0.85)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
    '--transition-duration': '200ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    @keyframes power-up-aura {
      0%, 100% { box-shadow: 0 0 8px var(--accent), var(--card-shadow); border-color: var(--secondary); }
      50% { box-shadow: 0 0 20px 5px var(--accent), var(--card-shadow); border-color: var(--accent); }
    }

    @keyframes kamehameha-beam {
      0% { transform: scaleX(0) translateX(0); opacity: 0; }
      50% { transform: scaleX(1) translateX(50%); opacity: 1; }
      100% { transform: scaleX(0) translateX(100%); opacity: 0; }
    }

    @keyframes task-fade-for-beam {
      0%, 40% { opacity: 1; }
      80%, 100% { opacity: 0; }
    }

    .goku-gi h1, .goku-gi h2, .goku-gi h3 {
      letter-spacing: 1px;
    }

    .goku-gi .theme-hover:hover:not(:disabled) {
      animation: power-up-aura 1.5s infinite ease-in-out;
    }

    .goku-gi .animate-complete-task {
      position: relative;
      overflow: hidden;
    }
    
    .goku-gi .animate-complete-task > * {
      animation: task-fade-for-beam 0.8s ease-out forwards;
    }
    
    .goku-gi .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 100%;
      margin-top: -50%;
      background: radial-gradient(circle at center, white 20%, var(--secondary) 50%, transparent 70%);
      transform-origin: left;
      animation: kamehameha-beam 0.8s ease-in-out forwards;
    }
  `
};
