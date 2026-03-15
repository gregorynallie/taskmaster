import { ThemeDefinition } from '../themeTypes';

export const monsterHunter: ThemeDefinition = {
  id: 'monster-hunter',
  name: "Hunter's Guild",
  category: 'Gaming & Pop Culture',
  font: "'Merriweather', serif",
  soundPack: 'organic',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A red monster claw mark appears as the task is completed.",
    },
    hover: {
        description: "A silver gleam, like a greatsword swipe, flashes across the card.",
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
    '--bkg': '#4A3B2A', // Earthy Brown
    '--surface': '#6D5F4E', // Lighter Parchment/Leather
    '--surface-modal-bkg': 'rgba(109, 95, 78, 0.9)',
    '--primary': '#556B2F', // Scale Green
    '--primary-focus': '#6B8E23',
    '--secondary': '#B22222', // Crimson Blood
    '--text-primary': '#F5F5DC', // Bone White
    '--text-secondary': '#B0A494',
    '--accent': '#B22222', // Use Crimson as the main accent
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 6px rgba(0,0,0,0.5)',
    '--bkg-image': `linear-gradient(rgba(74, 59, 42, 0.9), rgba(74, 59, 42, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
    '--transition-duration': '200ms',
    '--header-text-shadow': '2px 2px 2px rgba(0,0,0,0.5)',
  },
  customCss: `
    @keyframes mh-slash {
      from { transform: translateX(-110%) skewX(-25deg); }
      to { transform: translateX(110%) skewX(-25deg); }
    }
    
    @keyframes mh-roar {
      0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.2) rotate(-5deg); opacity: 1; }
      70% { transform: translate(-50%, -50%) scale(1.1) rotate(5deg); }
      100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
    }

    @keyframes mh-task-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    .monster-hunter h1, .monster-hunter h2, .monster-hunter h3, .monster-hunter h4 {
      text-transform: uppercase;
      font-weight: 700;
    }
    
    .monster-hunter .theme-hover {
        position: relative;
        overflow: hidden;
    }

    /* Sword Swipe */
    .monster-hunter .theme-hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 40%;
      height: 100%;
      background: linear-gradient(to right, transparent, rgba(192, 192, 192, 0.2), transparent);
      pointer-events: none;
    }
    
    .monster-hunter .theme-hover:hover:not(:disabled)::before {
        animation: mh-slash 0.5s ease-out;
    }
    
    .monster-hunter .animate-complete-task {
      animation: mh-task-fade 0.6s ease-out 0.2s forwards;
      position: relative;
    }

    .monster-hunter .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 60px;
      height: 60px;
      background-color: var(--accent);
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20,0 C30,30 35,70 25,100' stroke='white' stroke-width='10' fill='none' transform='rotate(-15 50 50)'/%3E%3Cpath d='M50,0 C60,30 65,70 55,100' stroke='white' stroke-width='10' fill='none' /%3E%3Cpath d='M80,0 C90,30 95,70 85,100' stroke='white' stroke-width='10' fill='none' transform='rotate(15 50 50)'/%3E%3C/svg%3E");
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20,0 C30,30 35,70 25,100' stroke='white' stroke-width='10' fill='none' transform='rotate(-15 50 50)'/%3E%3Cpath d='M50,0 C60,30 65,70 55,100' stroke='white' stroke-width='10' fill='none' /%3E%3Cpath d='M80,0 C90,30 95,70 85,100' stroke='white' stroke-width='10' fill='none' transform='rotate(15 50 50)'/%3E%3C/svg%3E");
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      animation: mh-roar 0.5s ease-out forwards;
    }
  `
};
