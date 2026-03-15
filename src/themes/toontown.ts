import { ThemeDefinition } from '../themeTypes';

export const toontown: ThemeDefinition = {
  id: 'toontown-online',
  name: 'Toontown Online',
  category: 'Light & Playful',
  font: "'Lilita One', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: 'playful',
    taskComplete: {
      className: 'animate-complete-task',
      description: "A cream pie splatters over the card as it disappears.",
    },
    suggestionAccept: 'playful',
    hover: {
      description: "The card does a playful 'boing' animation.",
    },
    enter: 'playful',
    viewTransition: 'playful',
    dismissTask: 'playful',
    levelUp: 'playful',
    progressBar: 'playful',
    inputField: 'playful',
    modal: 'playful',
    loadingState: 'playful',
    button: 'playful',
  },
  cssVariables: {
    '--bkg': '#D6F0FF', // Toon Sky Blue
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.85)',
    '--primary': '#FF3B3B', // Laff Meter Red
    '--primary-focus': '#FF6363',
    '--secondary': '#8E9A9B', // Cog Gray
    '--text-primary': '#2A2A2A', // Cartoon Black
    '--text-secondary': '#7A7A7A',
    '--accent': '#FFD82F', // Jellybean Yellow
    '--font-family-header': "'Lilita One', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1.5rem', // Bubbly
    '--card-border-width': '4px',
    '--card-shadow': '5px 5px 0px var(--secondary)', // Cel-shaded
    '--bkg-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='30' r='15'/%3E%3Ccircle cx='80' cy='20' r='20'/%3E%3Ccircle cx='50' cy='70' r='25'/%3E%3C/g%3E%3C/svg%3E")`, // Clouds
    '--transition-duration': '200ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--animation-transform-enter': 'scale(0.9)',
  },
  customCss: `
    @keyframes toontown-boing {
      0% { transform: scale(1); }
      50% { transform: scale(0.95, 1.05); }
      100% { transform: scale(1); }
    }

    @keyframes pie-splat {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      70% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }

    @keyframes task-fade-behind-splat {
      0% { opacity: 1; }
      60% { opacity: 1; }
      100% { opacity: 0; }
    }

    .toontown-online h1, .toontown-online h2, .toontown-online h3, .toontown-online h4 {
        letter-spacing: 1px;
    }

    .toontown-online .theme-hover:hover:not(:disabled) {
      animation: toontown-boing 0.3s ease-in-out;
    }

    .toontown-online .animate-complete-task {
      animation: task-fade-behind-splat 0.7s ease-out forwards;
      position: relative;
    }

    .toontown-online .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 120%;
      height: 120%;
      background-color: #FFF5E1; /* Cream color */
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,0 C22.4,0 0,22.4 0,50 C0,77.6 22.4,100 50,100 C77.6,100 100,77.6 100,50 C100,22.4 77.6,0 50,0 Z M50,5 C74.8,5 95,25.2 95,50 C95,74.8 74.8,95 50,95 C25.2,95 5,74.8 5,50 C5,25.2 25.2,5 50,5 Z M25.8,20.8 C24,22.4 22.5,25.1 23,28 C23.8,32.3 28,34.1 31,31.4 C33.9,28.8 32.8,24.8 29.4,23.3 C27.5,22.5 26.5,21.5 25.8,20.8 Z M74.2,20.8 C73.5,21.5 72.5,22.5 70.6,23.3 C67.2,24.8 66.1,28.8 69,31.4 C72,34.1 76.2,32.3 77,28 C77.5,25.1 76,22.4 74.2,20.8 Z M20,50 C20,45 25,40 30,40 C35,40 40,45 40,50 C40,55 35,60 30,60 C25,60 20,55 20,50 Z M80,50 C80,55 75,60 70,60 C65,60 60,55 60,50 C60,45 65,40 70,40 C75,40 80,45 80,50 Z M50,75 C40,75 35,80 35,85 C35,90 40,95 50,95 C60,95 65,90 65,85 C65,80 60,75 50,75 Z'/%3E%3C/svg%3E");
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,0 C22.4,0 0,22.4 0,50 C0,77.6 22.4,100 50,100 C77.6,100 100,77.6 100,50 C100,22.4 77.6,0 50,0 Z M50,5 C74.8,5 95,25.2 95,50 C95,74.8 74.8,95 50,95 C25.2,95 5,74.8 5,50 C5,25.2 25.2,5 50,5 Z M25.8,20.8 C24,22.4 22.5,25.1 23,28 C23.8,32.3 28,34.1 31,31.4 C33.9,28.8 32.8,24.8 29.4,23.3 C27.5,22.5 26.5,21.5 25.8,20.8 Z M74.2,20.8 C73.5,21.5 72.5,22.5 70.6,23.3 C67.2,24.8 66.1,28.8 69,31.4 C72,34.1 76.2,32.3 77,28 C77.5,25.1 76,22.4 74.2,20.8 Z M20,50 C20,45 25,40 30,40 C35,40 40,45 40,50 C40,55 35,60 30,60 C25,60 20,55 20,50 Z M80,50 C80,55 75,60 70,60 C65,60 60,55 60,50 C60,45 65,40 70,40 C75,40 80,45 80,50 Z M50,75 C40,75 35,80 35,85 C35,90 40,95 50,95 C60,95 65,90 65,85 C65,80 60,75 50,75 Z'/%3E%3C/svg%3E");
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      animation: pie-splat 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      z-index: 10;
    }

    .toontown-online .skeleton-loader.skeleton-theme-specific .skeleton-line {
        border-radius: 999px; /* Pill shape */
        background: linear-gradient(90deg, #e0e0e0, #f0f0f0, #e0e0e0);
        background-size: 200% 100%;
        animation: toontown-pulse 1.5s linear infinite;
    }

    @keyframes toontown-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
};