import { ThemeDefinition } from '../themeTypes';

export const falloutVault: ThemeDefinition = {
  id: 'fallout-vault',
  name: 'Fallout Vault',
  category: 'Gaming & Pop Culture',
  font: "'Oswald', sans-serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    addTask: 'standard',
    taskComplete: {
      className: 'animate-complete-task',
      description: "The task card is sealed behind a heavy vault door.",
    },
    suggestionAccept: 'standard',
    hover: {
      description: "The card 'clunks' into place, as if a heavy piece of machinery.",
    },
    enter: 'standard',
  },
  cssVariables: {
    '--bkg': '#0d3c61', // Deep Vault Blue
    '--surface': '#004a7f', // Vault Suit Blue
    '--surface-modal-bkg': 'rgba(0, 74, 127, 0.85)',
    '--primary': '#f7b500', // Vault Yellow
    '--primary-focus': '#ffd04a',
    '--secondary': '#4d4030', // Rusted metal
    '--text-primary': '#f0e6d2', // Off-white
    '--text-secondary': '#a0b8d0', // Muted blue-gray
    '--accent': '#d95a2b', // Rusty Orange
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.125rem',
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 0px rgba(0,0,0,0.5)',
    '--bkg-image': `linear-gradient(rgba(13, 60, 97, 0.9), rgba(13, 60, 97, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50 0a50 50 0 100 100A50 50 0 0050 0zm0 8a42 42 0 110 84 42 42 0 010-84zm-2 29h4v14h-4zm-11 0h4v14h-4zm22 0h4v14h-4zm-15-15a3 3 0 11-6 0 3 3 0 016 0zm14 0a3 3 0 11-6 0 3 3 0 016 0z' fill='%23f7b500' fill-opacity='0.05'/%3E%3C/svg%3E")`,
    '--transition-duration': '150ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.4)',
  },
  customCss: `
    @keyframes vault-clunk {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(-2px, -2px); }
    }
    
    @keyframes vault-door-close {
        0% { transform: scaleY(0); }
        100% { transform: scaleY(1); }
    }
    
    @keyframes vault-task-fade-out {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    .fallout-vault h1, .fallout-vault h2, .fallout-vault h3, .fallout-vault h4 {
      text-transform: uppercase;
      font-weight: 700;
      color: var(--primary);
    }
    
    .fallout-vault .theme-hover:hover:not(:disabled) {
      animation: vault-clunk 0.2s ease-in-out;
      border-color: var(--primary-focus);
      box-shadow: 5px 5px 0px rgba(0,0,0,0.5);
    }
    
    .fallout-vault .animate-complete-task {
      animation: vault-task-fade-out 0.8s ease-out 0.4s forwards;
      position: relative;
      overflow: hidden;
    }
    
    /* The two halves of the closing door */
    .fallout-vault .animate-complete-task::before,
    .fallout-vault .animate-complete-task::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 50%;
      background-color: var(--secondary);
      background-image: radial-gradient(circle, #706b64 10%, #4d4030 90%);
      border: 2px solid #2e2a2a;
      z-index: 10;
    }
    
    .fallout-vault .animate-complete-task::before {
      top: 0;
      transform-origin: top;
      animation: vault-door-close 0.5s ease-in forwards;
    }
    
    .fallout-vault .animate-complete-task::after {
      bottom: 0;
      transform-origin: bottom;
      animation: vault-door-close 0.5s ease-in forwards;
    }

    .fallout-vault .skeleton-loader .skeleton-line {
        background-color: var(--secondary);
        animation: fallout-flicker 1.5s linear infinite;
    }
    
    @keyframes fallout-flicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
  `
};