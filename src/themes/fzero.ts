import { ThemeDefinition } from '../themeTypes';

export const fzero: ThemeDefinition = {
  id: 'f-zero',
  name: 'Mute City',
  category: 'Gaming & Pop Culture',
  font: "'Orbitron', sans-serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The card stretches and blurs into the distance at high speed.",
    },
    hover: {
        description: "An orange booster trail sweeps across the card.",
    },
    addTask: 'glitch',
    suggestionAccept: 'glitch',
    enter: 'glitch',
    viewTransition: 'glitch',
    dismissTask: 'glitch',
    levelUp: 'glitch',
    progressBar: 'glitch',
    inputField: 'glitch',
    modal: 'glitch',
    loadingState: 'glitch',
    button: 'glitch',
  },
  cssVariables: {
    '--bkg': '#0A0A14', // Deep space blue/black
    '--surface': '#1A1A2E', // Dark machine metal
    '--surface-modal-bkg': 'rgba(26, 26, 46, 0.9)',
    '--primary': '#00D4FF', // Electric Blue
    '--primary-focus': '#80E9FF',
    '--secondary': '#FF5E00', // Booster Orange
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#A0AEC0',
    '--accent': '#FF00FF', // Neon Pink
    '--font-family-header': "'Orbitron', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0px', // Sharp angles
    '--card-border-width': '2px',
    '--card-shadow': '0 0 15px hsla(190, 100%, 50%, 0.4)',
    '--bkg-image': `
      linear-gradient(rgba(10, 10, 20, 0.9), rgba(10, 10, 20, 0.9)),
      linear-gradient(0deg, transparent 0%, var(--primary) 50%, transparent 100%)
    `,
    '--transition-duration': '200ms',
    '--header-text-shadow': '0 0 8px var(--primary)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    @keyframes boost-trail {
      from { transform: translateX(-105%); }
      to { transform: translateX(105%); }
    }
    
    @keyframes hyperspeed-boost {
      0% { transform: scaleX(1); opacity: 1; filter: blur(0); }
      50% { transform: scaleX(2.5); opacity: 0.5; filter: blur(5px); }
      100% { transform: scaleX(3); opacity: 0; filter: blur(10px); }
    }

    body.f-zero {
        background-attachment: fixed;
        background-size: 100%, 100% 10px;
        animation: track-scroll 5s linear infinite;
    }

    @keyframes track-scroll {
      from { background-position: 0 0, 0 0; }
      to { background-position: 0 0, 0 50px; }
    }

    .f-zero h1, .f-zero h2, .f-zero h3, .f-zero h4 {
      text-transform: uppercase;
      font-style: italic;
    }
    
    .f-zero .theme-hover {
      position: relative;
      overflow: hidden;
    }
    
    .f-zero .theme-hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, transparent, var(--secondary), transparent);
      transform: translateX(-105%);
      pointer-events: none;
    }

    .f-zero .theme-hover:hover:not(:disabled)::before {
      animation: boost-trail 0.4s ease-out;
    }
    
    .f-zero .animate-complete-task {
      transform-origin: left;
      animation: hyperspeed-boost 0.4s ease-in forwards;
    }
    
    .f-zero .skeleton-loader .skeleton-line {
      background: var(--secondary);
    }
  `
};
