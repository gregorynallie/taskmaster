import { ThemeDefinition } from '../themeTypes';

export const theMatrix: ThemeDefinition = {
  id: 'the-matrix',
  name: 'The Matrix',
  category: 'Sci-Fi & Cyberpunk',
  font: "'Share Tech Mono', monospace",
  soundPack: 'digital',
  isLight: false,
  animations: {
    addTask: {
      description: "The new task card materializes into view from the bottom up, as if being rendered into the Matrix.",
      classes: {
        confirmEnter: 'animate-glitch-confirm-enter',
        confirmExit: 'animate-glitch-confirm-exit',
        formEnter: 'animate-glitch-form-enter',
        taskEnter: 'animate-matrix-materialize-in',
      }
    },
    suggestionAccept: {
        className: 'animate-matrix-suggestion-accept',
        description: "The suggestion dissolves downwards in a 'digital rain' effect.",
    },
    hover: {
      description: "The card flickers with green digital energy.",
    },
    viewTransition: {
      classes: {
        enter: 'animate-matrix-view-enter',
        exit: 'animate-matrix-view-exit',
      },
      description: "The view dissolves and materializes with a digital glitch effect.",
    },
    taskComplete: 'glitch',
    enter: 'glitch',
    dismissTask: 'glitch',
    levelUp: 'glitch',
    progressBar: 'glitch',
    inputField: 'theme-specific',
    modal: 'glitch',
    loadingState: 'glitch',
    button: 'glitch',
  },
  cssVariables: {
    '--bkg': '#020a02',
    '--surface': '#051405',
    '--surface-modal-bkg': 'rgba(5, 20, 5, 0.8)',
    '--primary': '#00FF41',
    '--primary-focus': '#66FF99',
    '--secondary': '#003B00',
    '--text-primary': '#00FF41',
    '--text-secondary': '#008F11',
    '--accent': '#C0C0C0',
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0px',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 5px hsla(136, 100%, 50%, 0.5)',
    '--bkg-image': `linear-gradient(rgba(2, 10, 2, 0.88), rgba(2, 10, 2, 0.88)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%2300FF41' fill-opacity='0.1'%3E%3Crect x='0' y='0' width='1' height='40'/%3E%3Crect x='5' y='-10' width='1' height='50'/%3E%3Crect x='10' y='-20' width='1' height='60'/%3E%3Crect x='15' y='-5' width='1' height='45'/%3E%3Crect x='20' y='-30' width='1' height='70'/%3E%3Crect x='25' y='-15' width='1' height='55'/%3E%3Crect x='30' y='-25' width='1' height='65'/%3E%3Crect x='35' y='-0' width='1' height='40'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '200ms',
    '--header-text-shadow': '0 0 5px var(--primary)',
    '--animation-timing-enter': 'linear',
    '--animation-transform-enter': 'translateY(0)',
  },
  customCss: `
    @keyframes matrix-digital-rain-bg {
      from { background-position: 0 0; }
      to { background-position: 0 100%; }
    }
    
    @keyframes matrix-input-rain {
      from { background-position: 0 0; }
      to { background-position: 0 200px; }
    }
    
    @keyframes matrix-flicker {
      0%, 100% {
        border-color: var(--primary);
        box-shadow: 0 0 5px var(--primary);
        text-shadow: 0 0 5px var(--primary);
      }
      50% {
        border-color: var(--primary-focus);
        box-shadow: 0 0 8px var(--primary-focus);
        text-shadow: 0 0 2px var(--primary-focus);
      }
    }
    
    @keyframes matrix-dissolve-out { 
      from { opacity: 1; clip-path: inset(0 0 0 0); } 
      to { opacity: 0; clip-path: inset(100% 0 0 0); filter: blur(5px) brightness(1.5); } 
    } 
    
    @keyframes matrix-materialize-in { 
      from { opacity: 0; clip-path: inset(0 0 100% 0); filter: blur(5px); } 
      to { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0); } 
    }

    .the-matrix .theme-hover:hover:not(:disabled) {
      animation: matrix-flicker 0.5s linear infinite;
    }
    
    .the-matrix .input-field-theme-specific:focus {
      box-shadow: 0 0 8px var(--primary-focus);
      caret-color: var(--primary);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100' height='200' viewBox='0 0 100 200'%3e%3cdefs%3e%3clinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3e%3cstop offset='0%25' style='stop-color:white;stop-opacity:1' /%3e%3cstop offset='100%25' style='stop-color:white;stop-opacity:0' /%3e%3c/linearGradient%3e%3c/defs%3e%3ctext fill='%2300FF41' font-family='monospace' font-size='20' mask='url(%23grad)'%3e%3ctspan x='10' y='20'%3eﾊ%3c/tspan%3e%3ctspan x='10' y='45'%3eﾐ%3c/tspan%3e%3ctspan x='10' y='70'%3eﾋ%3c/tspan%3e%3ctspan x='10' y='95'%3eｰ%3c/tspan%3e%3ctspan x='10' y='120'%3eｳ%3c/tspan%3e%3ctspan x='10' y='145'%3eｼ%3c/tspan%3e%3ctspan x='10' y='170'%3eｹ%3c/tspan%3e%3ctspan x='10' y='195'%3eﾅ%3c/tspan%3e%3c/text%3e%3c/svg%3e");
      background-repeat: repeat;
      background-size: 100px 200px;
      animation: matrix-input-rain 2s linear infinite;
      text-shadow: 0 0 8px var(--primary);
    }
    
    /* Suggestion Accept Animation */
    .the-matrix .animate-matrix-suggestion-accept {
      position: relative;
      animation: none;
    }
    .the-matrix .animate-matrix-suggestion-accept::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(2, 10, 2, 0.88), rgba(2, 10, 2, 0.88)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%2300FF41' fill-opacity='0.1'%3E%3Crect x='0' y='0' width='1' height='40'/%3E%3Crect x='5' y='-10' width='1' height='50'/%3E%3Crect x='10' y='-20' width='1' height='60'/%3E%3Crect x='15' y='-5' width='1' height='45'/%3E%3Crect x='20' y='-30' width='1' height='70'/%3E%3Crect x='25' y='-15' width='1' height='55'/%3E%3Crect x='30' y='-25' width='1' height='65'/%3E%3Crect x='35' y='-0' width='1' height='40'/%3E%3C/g%3E%3C/svg%3E");
      background-size: auto, 40px 40px;
      animation: matrix-digital-rain-bg 0.5s linear forwards;
      -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
      mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
    }

    /* View Transitions */
    .the-matrix .animate-matrix-view-exit { animation: matrix-dissolve-out 0.4s linear forwards; }
    .the-matrix .animate-matrix-view-enter { animation: matrix-materialize-in 0.5s linear forwards; }
  `
};