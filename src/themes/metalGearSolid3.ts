import { ThemeDefinition } from '../themeTypes';

export const metalGearSolid3: ThemeDefinition = {
  id: 'metal-gear-solid-3',
  name: 'Metal Gear: Snake Eater',
  category: 'Gaming & Pop Culture',
  font: "'Source Sans Pro', sans-serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A red 'MISSION COMPLETE' stamp appears over the card as it fades.",
    },
    hover: {
        description: "A stealth camouflage pattern appears over the card.",
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
    '--bkg': '#111111', // Black
    '--surface': '#212D22', // Dark Jungle Green
    '--surface-modal-bkg': 'rgba(33, 45, 34, 0.9)',
    '--primary': '#4CAF50', // Brighter Jungle Green for UI
    '--primary-focus': '#66BB6A',
    '--secondary': '#6D4C41', // Camo Brown
    '--text-primary': '#D4E0D5', // Dossier Off-White
    '--text-secondary': '#8A9A8D', // Muted Green-Gray
    '--accent': '#C62828', // Soviet Red
    '--font-family-header': "'Special Elite', monospace",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0px', // Sharp, military feel
    '--card-border-width': '1px',
    '--card-shadow': 'inset 0 0 10px rgba(0,0,0,0.5)',
    '--bkg-image': `linear-gradient(rgba(17, 17, 17, 0.95), rgba(17, 17, 17, 0.95)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
    '--transition-duration': '200ms',
    '--header-text-shadow': '0 0 5px var(--primary)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes mgs3-stamp-in {
      0% { transform: scale(3) rotate(-30deg); opacity: 0; }
      60% { transform: scale(0.9) rotate(5deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }

    @keyframes mgs3-task-fade {
      0% { opacity: 1; }
      100% { opacity: 0.3; }
    }
    
    .metal-gear-solid-3 .theme-hover {
        position: relative; /* Stacking context */
        overflow: hidden;
    }

    /* Stealth Camo Overlay */
    .metal-gear-solid-3 .theme-hover::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%232E7D32' fill-opacity='0.4'%3E%3Cpath d='M0 0h20v20H0z' transform='skewX(-20)'/%3E%3Cpath d='M40 20h20v20H40z' transform='skewX(-20) translate(10, 10)'/%3E%3Cpath d='M20 40h20v20H20z' transform='skewX(-20) translate(-10, -10)'/%3E%3Cpath d='M60 60h20v20H60z' transform='skewX(-20) translate(0, -20)'/%3E%3C/g%3E%3C/svg%3E");
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      pointer-events: none;
    }

    .metal-gear-solid-3 .theme-hover:hover:not(:disabled)::before {
      opacity: 1;
    }
    
    /* Mission Complete Stamp */
    .metal-gear-solid-3 .animate-complete-task {
      animation: mgs3-task-fade 1.5s ease-out forwards;
      position: relative;
    }

    .metal-gear-solid-3 .animate-complete-task::after {
      content: 'MISSION COMPLETE';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: var(--font-family-header);
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--accent);
      text-align: center;
      padding: 0.5rem 1rem;
      border: 3px solid var(--accent);
      opacity: 0;
      animation: mgs3-stamp-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s forwards;
      pointer-events: none;
    }
    
    .metal-gear-solid-3 .skeleton-loader .skeleton-line {
      background-color: var(--secondary);
    }
  `
};
