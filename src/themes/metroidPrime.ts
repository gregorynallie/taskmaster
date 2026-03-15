import { ThemeDefinition } from '../themeTypes';

export const metroidPrime: ThemeDefinition = {
  id: 'metroid-prime',
  name: "Samus's Visor",
  category: 'Sci-Fi & Cyberpunk',
  font: "'Share Tech Mono', monospace",
  soundPack: 'digital',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A targeting reticle locks onto the card before it's neutralized and fades.",
    },
    hover: {
      description: "A cyan scanline sweeps vertically across the card.",
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
    '--bkg': '#0C0C0C', // Deep Space Black
    '--surface': '#1A1A1A', // HUD Panel Black
    '--surface-modal-bkg': 'rgba(26, 26, 26, 0.85)',
    '--primary': '#FF6F00', // Plasma Orange
    '--primary-focus': '#FF8A33',
    '--secondary': '#00D4FF', // Cool Cyan
    '--text-primary': '#ECF0F1', // HUD White
    '--text-secondary': '#A0AEC0', // Dim HUD Text
    '--accent': '#00D4FF', // Cool Cyan for glows
    '--font-family-header': "'Orbitron', sans-serif",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0.25rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 12px hsla(27, 100%, 50%, 0.3)',
    '--bkg-image': 'none', // Managed by custom CSS
    '--transition-duration': '250ms',
    '--header-text-shadow': '0 0 6px var(--primary)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes scan-sweep {
      from { transform: translateY(-100%); }
      to { transform: translateY(100%); }
    }

    @keyframes scan-complete-reticle {
      0% { opacity: 0; transform: scale(0.5) rotate(0deg); }
      50% { opacity: 1; transform: scale(1.2) rotate(45deg); }
      100% { opacity: 0; transform: scale(1) rotate(90deg); }
    }

    @keyframes metroid-content-fade {
      0% { opacity: 1; filter: none; }
      100% { opacity: 0; filter: blur(4px); }
    }

    @keyframes metroid-wrapper-disappear {
      0%, 99% { opacity: 1; }
      100% { opacity: 0; }
    }

    /* Visor Scanline Overlay */
    body.metroid-prime::after {
      content: ' ';
      display: block;
      position: fixed;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%);
      background-size: 100% 4px;
      pointer-events: none;
      z-index: 1000;
    }

    .metroid-prime .theme-hover {
      position: relative;
      overflow: hidden;
    }
    
    /* Visor Scan Line on Hover */
    .metroid-prime .theme-hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 200%;
      background: linear-gradient(transparent 40%, var(--accent) 50%, transparent 60%);
      box-shadow: 0 0 10px var(--accent);
      opacity: 0;
      transition: opacity 0.3s ease-out;
      pointer-events: none;
    }

    .metroid-prime .theme-hover:hover:not(:disabled)::before {
      opacity: 1;
      animation: scan-sweep 1.2s ease-in-out infinite;
    }

    /* Task Completion Animation */
    .metroid-prime .animate-complete-task {
      animation: metroid-wrapper-disappear 0.6s forwards;
      position: relative;
    }

    /* Target the direct children (content) to fade them out */
    .metroid-prime .animate-complete-task > * {
      animation: metroid-content-fade 0.5s ease-out 0.1s forwards;
    }

    .metroid-prime .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80%;
      height: 80%;
      margin: -40% 0 0 -40%;
      border: 3px solid var(--accent);
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,10 L60,10 L60,0 L40,0 L40,10 L50,10 M50,90 L60,90 L60,100 L40,100 L40,90 L50,90 M10,50 L10,60 L0,60 L0,40 L10,40 L10,50 M90,50 L90,60 L100,60 L100,40 L90,40 L90,50 M50,50m-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0' fill='none' stroke='%23000' stroke-width='4'/%3E%3C/svg%3E");
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,10 L60,10 L60,0 L40,0 L40,10 L50,10 M50,90 L60,90 L60,100 L40,100 L40,90 L50,90 M10,50 L10,60 L0,60 L0,40 L10,40 L10,50 M90,50 L90,60 L100,60 L100,40 L90,40 L90,50 M50,50m-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0' fill='none' stroke='%23000' stroke-width='4'/%3E%3C/svg%3E");
      animation: scan-complete-reticle 0.4s ease-out forwards;
    }
  `
};
