import { ThemeDefinition } from '../themeTypes';

export const journey: ThemeDefinition = {
  id: 'journey',
  name: 'Journey',
  category: 'Atmospheric & Moody',
  font: "'Lora', serif",
  soundPack: 'organic',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The task card dissolves into particles of sand and drifts away.",
    },
    hover: {
        description: "A shimmering ribbon of light flows across the card.",
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
    '--bkg': '#F5EFE6', // Sand Beige
    '--surface': '#FCFAF5', // Lighter Sand
    '--surface-modal-bkg': 'rgba(252, 250, 245, 0.9)',
    '--primary': '#C82828', // Cloth Red
    '--primary-focus': '#E03838',
    '--secondary': '#E17F45', // Desert Orange
    '--text-primary': '#5D4037', // Dark Sandy Brown
    '--text-secondary': '#A1887F',
    '--accent': '#FFD700', // Sunlight Yellow
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.75rem', // Soft, wind-swept
    '--card-border-width': '1px',
    '--card-shadow': '0 4px 10px hsla(30, 20%, 30%, 0.08)',
    '--bkg-image': `linear-gradient(rgba(245, 239, 230, 0.8), rgba(245, 239, 230, 0.8)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cpath d='M0 60 C 30 20, 60 20, 90 60 S 120 100, 150 60' fill='none' stroke='%23A1887F' stroke-width='1' stroke-opacity='0.05'/%3E%3C/svg%3E")`,
    '--transition-duration': '350ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    @keyframes journey-ribbon-flow {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }
    
    @keyframes journey-sand-drift {
      0% {
        opacity: 1;
        box-shadow: 0 0 0 0 transparent;
      }
      100% {
        opacity: 0;
        transform: translateY(-80px) rotate(15deg);
        box-shadow: 
          -30px 20px 0 -5px var(--bkg), 25px -10px 0 -5px var(--accent),
          -20px -30px 0 -5px var(--bkg), 15px 40px 0 -5px var(--accent);
      }
    }

    @keyframes journey-task-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    .journey .theme-hover {
      position: relative;
      overflow: hidden;
    }

    .journey .theme-hover:hover:not(:disabled)::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 150%;
      height: 100%;
      background: linear-gradient(to right, transparent, hsla(0, 68%, 47%, 0.15), hsla(51, 100%, 50%, 0.15), transparent);
      animation: journey-ribbon-flow 3s ease-in-out infinite;
    }
    
    .journey .animate-complete-task {
      animation: journey-task-fade 0.8s ease-out forwards;
      position: relative;
    }

    .journey .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      margin-top: -2px;
      background: transparent;
      animation: journey-sand-drift 0.8s ease-in forwards;
    }

    .journey .skeleton-loader .skeleton-line {
      background: linear-gradient(90deg, #EAE1DA, #FFF, #EAE1DA);
      background-size: 200% 100%;
      animation: journey-pulse 2s ease-in-out infinite;
    }
    
    @keyframes journey-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
};
