import { ThemeDefinition } from '../themeTypes';

export const attackOnTitan: ThemeDefinition = {
  id: 'attack-on-titan',
  name: 'Dedicate Your Heart',
  category: 'Gaming & Pop Culture',
  font: "'Oswald', sans-serif",
  soundPack: 'analog',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "Two sword slashes cut through the card as it completes.",
    },
    hover: {
        description: "3D maneuver gear 'zip lines' cross the card.",
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
    '--bkg': '#CED4DA', // Cloud Gray
    '--surface': '#F8F9FA', // Off-white
    '--surface-modal-bkg': 'rgba(248, 249, 250, 0.9)',
    '--primary': '#3B5342', // Scout Regiment Green
    '--primary-focus': '#4C6B55',
    '--secondary': '#8D6E63', // Leather Brown
    '--text-primary': '#212529', // Dark, serious text
    '--text-secondary': '#495057',
    '--accent': '#B71C1C', // Brick/Blood Red
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.125rem', // Sharp, military
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 0px rgba(0,0,0,0.2)',
    '--bkg-image': `linear-gradient(rgba(206, 212, 218, 0.85), rgba(206, 212, 218, 0.85)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
    '--transition-duration': '200ms',
    '--header-text-shadow': '1px 1px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    @keyframes aot-zip-1 {
      from { transform: translate(-110%, 20px) skewX(-45deg); }
      to { transform: translate(110%, -20px) skewX(-45deg); }
    }
    
    @keyframes aot-zip-2 {
      from { transform: translate(110%, -20px) skewX(-45deg); }
      to { transform: translate(-110%, 20px) skewX(-45deg); }
    }
    
    @keyframes aot-slash-1 {
      from { transform: translate(-50%, -50%) scaleX(0) rotate(25deg); }
      to { transform: translate(-50%, -50%) scaleX(1.5) rotate(25deg); }
    }
    
    @keyframes aot-slash-2 {
      from { transform: translate(-50%, -50%) scaleX(0) rotate(-25deg); }
      to { transform: translate(-50%, -50%) scaleX(1.5) rotate(-25deg); }
    }

    @keyframes aot-task-fade {
        0%, 50% { opacity: 1; }
        100% { opacity: 0; }
    }

    .attack-on-titan h1, .attack-on-titan h2, .attack-on-titan h3, .attack-on-titan h4 {
      text-transform: uppercase;
      font-weight: 700;
    }
    
    .attack-on-titan .theme-hover {
        position: relative;
        overflow: hidden;
    }
    
    .attack-on-titan .theme-hover::before,
    .attack-on-titan .theme-hover::after {
        content: '';
        position: absolute;
        width: 150%;
        height: 2px;
        background: var(--text-secondary);
        opacity: 0;
        pointer-events: none;
    }

    .attack-on-titan .theme-hover:hover:not(:disabled)::before {
        opacity: 0.5;
        top: 30%;
        animation: aot-zip-1 0.3s ease-out;
    }
    
    .attack-on-titan .theme-hover:hover:not(:disabled)::after {
        opacity: 0.5;
        bottom: 30%;
        animation: aot-zip-2 0.3s ease-out 0.1s;
    }
    
    .attack-on-titan .animate-complete-task {
      animation: aot-task-fade 0.6s ease-out forwards;
      position: relative;
    }

    /* Double sword slash */
    .attack-on-titan .animate-complete-task::before,
    .attack-on-titan .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 4px;
      background: linear-gradient(to right, transparent, var(--accent), transparent);
      z-index: 10;
    }
    
    .attack-on-titan .animate-complete-task::before {
      animation: aot-slash-1 0.3s ease-out forwards;
    }
    
    .attack-on-titan .animate-complete-task::after {
      animation: aot-slash-2 0.3s ease-out 0.1s forwards;
    }
  `
};