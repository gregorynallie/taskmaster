import { ThemeDefinition } from '../themeTypes';

export const starWars: ThemeDefinition = {
  id: 'star-wars',
  name: 'Star Wars',
  category: 'Gaming & Pop Culture',
  font: "'Oswald', sans-serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    taskComplete: {
        className: 'animate-complete-task',
        description: "The task card glows with a green light before fading, like a completed objective.",
    },
    hover: {
        description: "A lightsaber ignites and sweeps across the card.",
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
    '--bkg': '#000000',
    '--surface': '#0D0D0D',
    '--surface-modal-bkg': 'rgba(13, 13, 13, 0.8)',
    '--primary': '#FFE81F', // Gold
    '--primary-focus': '#FFF5A5',
    '--secondary': '#333333',
    '--text-primary': '#E0E0E0',
    '--text-secondary': '#9E9E9E',
    '--accent': '#4A90E2', // Lightsaber Blue
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 10px hsla(54, 100%, 56%, 0.2)',
    '--bkg-image': 'none',
    '--transition-duration': '300ms',
    '--header-text-shadow': '0 0 5px var(--primary)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes starfield-slow {
      from { background-position: 0 0; }
      to { background-position: 0 -10000px; }
    }
    @keyframes starfield-fast {
      from { background-position: 0 0; }
      to { background-position: 0 -20000px; }
    }

    body.star-wars {
      background-color: #000;
      background-image: 
        /* Slow, distant stars */
        radial-gradient(1px 1px at 20% 30%, #eee, transparent),
        radial-gradient(1px 1px at 80% 40%, #fff, transparent),
        radial-gradient(1.5px 1.5px at 50% 90%, #ddd, transparent),
        /* Fast, close stars */
        radial-gradient(2px 2px at 90% 20%, #fff, transparent),
        radial-gradient(2.5px 2.5px at 30% 70%, #fff, transparent),
        radial-gradient(3px 3px at 60% 10%, #ddd, transparent);
      background-repeat: repeat;
      background-size: 600px 600px, 800px 800px, 1000px 1000px, 400px 400px, 500px 500px, 700px 700px;
      animation: starfield-slow 240s linear infinite, starfield-slow 200s linear infinite, starfield-slow 180s linear infinite, starfield-fast 80s linear infinite, starfield-fast 70s linear infinite, starfield-fast 60s linear infinite;
    }
    
    .star-wars h1, .star-wars h2, .star-wars h3, .star-wars h4 {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 700;
    }
    
    .star-wars .theme-hover {
        position: relative;
        overflow: hidden;
        z-index: 1; /* Stacking context */
    }

    .star-wars .theme-hover::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to right, var(--accent) 20%, white 50%, var(--accent) 80%);
        box-shadow: 0 0 15px 5px var(--accent);
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 0.3s cubic-bezier(0.8, 0, 0.2, 1);
        z-index: -1;
    }
    
    .star-wars .theme-hover:hover:not(:disabled) {
        color: #000 !important; /* Force override for readability */
        border-color: var(--accent);
    }
    
    .star-wars .theme-hover:hover:not(:disabled)::before {
        transform: scaleX(1);
    }

    .star-wars .skeleton-loader.skeleton-theme-specific .skeleton-line {
        background: linear-gradient(90deg, var(--secondary), var(--primary), var(--secondary));
        background-size: 200% 100%;
        animation: star-wars-pulse 1.5s linear infinite;
    }
    
    @keyframes star-wars-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* Override task completion animation */
    .star-wars .animate-complete-task {
        animation: complete-task-animation 0.5s ease-in-out forwards;
    }
    @keyframes complete-task-animation {
      0% { transform: scale(1); opacity: 1; }
      30% { 
        transform: scale(1.05); 
        background-color: hsla(145, 63%, 49%, 0.1); /* Jedi Green */
        border-color: #2ECC71;
        box-shadow: 0 0 10px #2ECC71;
      }
      100% { transform: scale(0.9) translateY(20px); opacity: 0; }
    }
  `
};
