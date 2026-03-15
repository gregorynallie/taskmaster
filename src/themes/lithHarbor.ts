import { ThemeDefinition } from '../themeTypes';

export const lithHarbor: ThemeDefinition = {
  id: 'lith-harbor',
  name: 'Lith Harbor',
  category: 'Light & Playful',
  font: "'Lora', serif",
  soundPack: 'organic',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A 'splash' ripple expands from the center of the card as it disappears.",
    },
    hover: {
      description: "A ripple expands from the center of the card, like a stone skipping on water.",
    },
    addTask: 'organic',
    suggestionAccept: 'organic',
    enter: 'organic',
    viewTransition: 'organic',
    dismissTask: 'organic',
    levelUp: 'organic',
    progressBar: 'organic',
    inputField: 'standard',
    modal: 'organic',
    loadingState: 'organic',
    button: 'organic',
  },
  cssVariables: {
    '--bkg': '#E0F2F1', // Pale seafoam blue
    '--surface': '#F8F9FA', // Sail White
    '--surface-modal-bkg': 'rgba(248, 249, 250, 0.85)',
    '--primary': '#1E6091', // Nautical Blue
    '--primary-focus': '#2A7AAF',
    '--secondary': '#B08968', // Rope Brown
    '--text-primary': '#495057', // Harbor Gray
    '--text-secondary': '#6C757D',
    '--accent': '#FF7F50', // Accent Coral
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.5rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 4px 10px rgba(73, 80, 87, 0.1)',
    '--bkg-image': `linear-gradient(to bottom, #E0F2F1, #FFFFFF 40%)`,
    '--transition-duration': '300ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    @keyframes ripple-hover {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    @keyframes splash-ripple {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }

    @keyframes task-fade-out {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }

    .lith-harbor .theme-hover {
      position: relative;
      overflow: hidden;
    }

    /* Ripple on hover */
    .lith-harbor .theme-hover::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      background-color: hsla(208, 65%, 34%, 0.1);
      border-radius: 50%;
      transform: scale(0);
      opacity: 1;
      pointer-events: none;
    }
    
    .lith-harbor .theme-hover:hover:not(:disabled)::before {
      animation: ripple-hover 0.7s ease-out;
    }

    /* Splash on complete */
    .lith-harbor .animate-complete-task {
      animation: task-fade-out 0.5s ease-out 0.2s forwards;
      position: relative;
      overflow: visible;
    }
    
    .lith-harbor .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
      border-radius: 50%;
      border: 3px solid var(--secondary);
      animation: splash-ripple 0.5s ease-out forwards;
    }
  `
};
