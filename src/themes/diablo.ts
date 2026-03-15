import { ThemeDefinition } from '../themeTypes';

export const diablo: ThemeDefinition = {
  id: 'diablo',
  name: 'Diablo 2',
  category: 'Gaming & Pop Culture',
  font: "'Lora', serif",
  soundPack: 'organic',
  isLight: false,
  animations: {
    hover: {
      description: "The card's border and shadow glow with golden light, reminiscent of a unique item drop.",
    },
    taskComplete: {
      className: 'animate-diablo-rage',
      description: "The task card erupts in a fiery 'Rage' effect, shaking and glowing red before vanishing.",
    },
    addTask: {
      description: "The new task appears with a dark, fiery summoning effect.",
      classes: {
        confirmEnter: 'animate-diablo-confirm-enter',
        confirmExit: 'animate-diablo-confirm-exit',
        formEnter: 'animate-diablo-form-enter',
        taskEnter: 'animate-diablo-task-enter',
      }
    },
    suggestionAccept: 'cinematic',
    enter: 'cinematic',
    viewTransition: 'cinematic',
    dismissTask: 'cinematic',
    levelUp: 'cinematic',
    progressBar: 'cinematic',
    inputField: 'standard',
    modal: 'cinematic',
    loadingState: 'theme-specific',
    button: 'cinematic',
  },
  cssVariables: {
    '--bkg': '#1a1816', // Cracked Stone Dark
    '--surface': '#2a2725', // Cracked Stone Light
    '--surface-modal-bkg': 'rgba(42, 39, 37, 0.8)',
    '--primary': '#8B0000', // Blood Red
    '--primary-focus': '#B22222',
    '--secondary': '#3a332a',
    '--text-primary': '#EAE0D5', // Bone White
    '--text-secondary': '#B0A494',
    '--accent': '#FFC800', // Diablo 2 Gold
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.125rem', // Sharper edges
    '--card-border-width': '2px', // Chunky stone border
    '--card-shadow': '3px 3px 5px rgba(0,0,0,0.7)',
    '--bkg-image': `linear-gradient(rgba(26, 24, 22, 0.9), rgba(26, 24, 22, 0.9)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M0 0l40 40H0V0zm40 40l40-40v40H40zM0 80h40L0 40v40zm40 0h40V40L40 80z'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '150ms',
    '--header-text-shadow': '2px 2px 2px rgba(0,0,0,0.7)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    .diablo .theme-hover:hover:not(:disabled) {
      border-color: var(--accent);
      box-shadow: 0 0 5px var(--accent), 3px 3px 5px rgba(0,0,0,0.7);
    }

    .diablo h1, .diablo h2, .diablo h3, .diablo h4 {
      color: var(--accent);
      font-weight: 700;
    }
    
    .diablo .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background: var(--secondary);
      animation: diablo-pulse 2s infinite ease-in-out;
    }
    @keyframes diablo-pulse {
      0% { background-color: var(--secondary); box-shadow: 0 0 5px var(--secondary); }
      50% { background-color: var(--primary); box-shadow: 0 0 15px var(--primary); }
      100% { background-color: var(--secondary); box-shadow: 0 0 5px var(--secondary); }
    }
    
    /* --- CUSTOM ANIMATIONS --- */
    @keyframes diablo-ember-burn { from { opacity: 1; filter: brightness(1); } to { opacity: 0; filter: brightness(5) blur(5px); } }
    @keyframes diablo-smoke-materialize { from { opacity: 0; filter: blur(10px) saturate(0); transform: scale(1.2); } to { opacity: 1; filter: blur(0) saturate(1); transform: scale(1); } }
    @keyframes diablo-rune-appear { 0% { opacity: 0; text-shadow: 0 0 20px var(--primary); } 100% { opacity: 1; text-shadow: none; } }
    @keyframes diablo-rage {
      0% { transform: scale(1); box-shadow: 3px 3px 5px rgba(0,0,0,0.7); }
      30% {
        transform: scale(1.05);
        border-color: var(--primary);
        box-shadow: 0 0 15px var(--primary), 3px 3px 5px rgba(0,0,0,0.7);
      }
      40%, 60% { transform: scale(1.05) translate(-2px, 2px) rotate(-1deg); }
      50%, 70% { transform: scale(1.05) translate(2px, -2px) rotate(1deg); }
      80% {
        transform: scale(1.05) translate(0,0) rotate(0);
        background-color: hsla(0, 100%, 27%, 0.3);
      }
      100% {
        transform: scale(0.9) translateY(10px);
        opacity: 0;
      }
    }
    
    .diablo .animate-diablo-confirm-enter { animation: diablo-smoke-materialize 0.4s ease-out forwards; }
    .diablo .animate-diablo-confirm-exit { animation: diablo-ember-burn 0.4s ease-in forwards; }
    .diablo .animate-diablo-form-enter { animation: diablo-smoke-materialize 0.5s ease-out forwards; }
    .diablo .animate-diablo-task-enter { animation: diablo-rune-appear 0.5s ease-out forwards; }
    .diablo .animate-diablo-rage { animation: diablo-rage 0.7s ease-in-out forwards; }
  `
};