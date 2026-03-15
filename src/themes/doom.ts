import { ThemeDefinition } from '../themeTypes';

export const doom: ThemeDefinition = {
  id: 'doom',
  name: 'Rip & Tear',
  category: 'Gaming & Pop Culture',
  font: "'Oswald', sans-serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    hover: {
        description: "The card shakes violently, as if a chainsaw is revving.",
    },
    taskComplete: {
        className: 'animate-doom-glory-kill',
        description: "The task erupts in a fiery 'Glory Kill' effect, shaking and glowing before vanishing.",
    },
    addTask: {
        description: "The new task slams into place with aggressive force.",
        classes: {
            confirmEnter: 'animate-doom-confirm-enter',
            confirmExit: 'animate-doom-confirm-exit',
            formEnter: 'animate-doom-form-enter',
            taskEnter: 'animate-doom-task-enter',
        },
    },
    dismissTask: {
        className: 'animate-doom-dismiss',
        description: "The task violently explodes into bloody chunks.",
    },
    suggestionAccept: 'cinematic',
    enter: 'cinematic',
    viewTransition: 'cinematic',
    levelUp: 'cinematic',
    progressBar: 'cinematic',
    inputField: 'standard',
    modal: 'cinematic',
    loadingState: 'cinematic',
    button: 'cinematic',
  },
  cssVariables: {
    '--bkg': '#1A0000', // Deep blood black
    '--surface': '#333333', // Worn metal
    '--surface-modal-bkg': 'rgba(51, 51, 51, 0.9)',
    '--primary': '#FF4500', // Hellfire orange
    '--primary-focus': '#FF6347',
    '--secondary': '#5D4037', // Rusted metal
    '--text-primary': '#E0D8D0', // Gritty off-white
    '--text-secondary': '#888888', // Dim gray
    '--accent': '#00FF00', // Argent Energy Green
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0px', // Sharp angles only
    '--card-border-width': '2px',
    '--card-shadow': '3px 3px 0px rgba(0,0,0,0.7)',
    '--bkg-image': `linear-gradient(rgba(26, 0, 0, 0.9), rgba(26, 0, 0, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
    '--transition-duration': '100ms',
    '--header-text-shadow': '2px 2px 0px #000',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    @keyframes doom-chainsaw-rev {
      0%, 100% { transform: translate(0, 0); }
      10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 2px); }
      20%, 40%, 60%, 80% { transform: translate(2px, -2px); }
    }
    
    @keyframes doom-glory-kill {
      0% { transform: scale(1); opacity: 1; }
      20% {
        transform: scale(1.1) rotate(-3deg);
        background-color: hsla(0, 100%, 50%, 0.4);
        border-color: var(--accent);
        box-shadow: 0 0 30px var(--accent), 0 0 10px var(--primary);
      }
      40% { transform: scale(1.05) rotate(3deg); }
      100% {
        transform: scale(1.5);
        opacity: 0;
        filter: blur(8px);
      }
    }
    
    @keyframes doom-slam-down { from { opacity: 0; transform: translateY(-50px) scale(1.2); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes doom-explode-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(2); filter: blur(10px); } }
    @keyframes doom-slam-up { from { opacity: 0; transform: translateY(50px) scale(1.2); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes doom-task-slam { from { opacity: 0; transform: translateY(-20px); } 70% { transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    .doom h1, .doom h2, .doom h3, .doom h4 {
      text-transform: uppercase;
      font-weight: 700;
    }

    .doom .theme-hover:hover:not(:disabled) {
      animation: doom-chainsaw-rev 0.2s linear infinite;
      border-color: var(--primary);
    }
    
    .doom .animate-doom-glory-kill { animation: doom-glory-kill 0.5s ease-out forwards; }
    .doom .animate-doom-confirm-enter { animation: doom-slam-down 0.3s ease-out forwards; }
    .doom .animate-doom-confirm-exit { animation: doom-explode-out 0.3s ease-in forwards; }
    .doom .animate-doom-form-enter { animation: doom-slam-up 0.3s ease-out forwards; }
    .doom .animate-doom-task-enter { animation: doom-task-slam 0.4s cubic-bezier(.36,.07,.19,.97) forwards; }
    .doom .animate-doom-dismiss { animation: doom-explode-out 0.3s ease-in forwards; }
  `
};