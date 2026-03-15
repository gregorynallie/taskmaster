import { ThemeDefinition } from '../themeTypes';

export const halo: ThemeDefinition = {
  id: 'halo',
  name: 'Halo: Combat Evolved',
  category: 'Gaming & Pop Culture',
  font: "'Oswald', sans-serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    addTask: {
        classes: {
            confirmEnter: 'animate-standard-confirm-enter',
            confirmExit: 'animate-standard-confirm-exit',
            formEnter: 'animate-standard-form-enter',
            taskEnter: 'task-animating-in',
        },
        description: "The new task materializes as a sleek UNSC-style hologram.",
    },
    taskComplete: {
      className: 'animate-complete-task',
      description: "A targeting reticle locks onto the card before it's neutralized and fades.",
    },
    hover: {
      description: "The card's border flickers like an energy shield taking damage.",
    },
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
    '--bkg': '#2C3E50', // Steel Gray
    '--surface': '#34495E', // Lighter Steel
    '--surface-modal-bkg': 'rgba(52, 73, 94, 0.85)',
    '--primary': '#16A085', // Spartan Green (slightly brighter than original for better contrast)
    '--primary-focus': '#1ABC9C',
    '--secondary': '#2980B9', // Plasma Blue (slightly brighter)
    '--text-primary': '#ECF0F1', // HUD White
    '--text-secondary': '#BDC3C7', // Muted Gray
    '--accent': '#F1C40F', // Gold Visor (less saturated)
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.125rem', // Sharp angles
    '--card-border-width': '2px',
    '--card-shadow': '0 0 10px hsla(166, 76%, 33%, 0.3)', // Green glow
    '--bkg-image': `linear-gradient(rgba(44, 62, 80, 0.95), rgba(44, 62, 80, 0.95)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ECF0F1' fill-opacity='0.03' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.99-7.5L26 15v18.5L13.01 41 0 33.5V15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '200ms',
    '--header-text-shadow': '0 0 4px var(--text-primary)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes shield-flicker {
      0% { box-shadow: 0 0 10px var(--accent); border-color: var(--accent); }
      20% { box-shadow: 0 0 15px var(--secondary); border-color: var(--secondary); }
      40% { box-shadow: 0 0 8px var(--accent); border-color: var(--accent); }
      60% { box-shadow: 0 0 18px var(--secondary); border-color: var(--secondary); }
      100% { box-shadow: 0 0 10px var(--accent); border-color: var(--accent); }
    }

    @keyframes target-acquired {
      0% { opacity: 0; transform: scale(0.8); }
      50% { opacity: 1; }
      100% { opacity: 0; transform: scale(1.5); }
    }
    
    @keyframes task-neutralized {
      0% { opacity: 1; }
      100% { opacity: 0; filter: blur(5px); }
    }
    
    @keyframes halo-scanline-reveal {
        from {
            opacity: 0;
            -webkit-mask-image: linear-gradient(to top, transparent 0%, black 5%);
            mask-image: linear-gradient(to top, transparent 0%, black 5%);
        }
        to {
            opacity: 1;
            -webkit-mask-image: linear-gradient(to top, transparent -100%, black 0%);
            mask-image: linear-gradient(to top, transparent -100%, black 0%);
        }
    }

    .halo .theme-hover:hover:not(:disabled) {
      animation: shield-flicker 1.2s infinite ease-in-out;
    }
    
    .halo .animate-complete-task {
      animation: task-neutralized 0.5s ease-out 0.3s forwards;
      position: relative;
    }

    .halo .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 3px solid var(--primary);
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,5 L55,5 L55,0 L45,0 L45,5 L50,5 M50,95 L55,95 L55,100 L45,100 L45,95 L50,95 M5,50 L5,55 L0,55 L0,45 L5,45 L5,50 M95,50 L95,55 L100,55 L100,45 L95,45 L95,50' fill='%23000000'/%3E%3C/svg%3E");
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,5 L55,5 L55,0 L45,0 L45,5 L50,5 M50,95 L55,95 L55,100 L45,100 L45,95 L50,95 M5,50 L5,55 L0,55 L0,45 L5,45 L5,50 M95,50 L95,55 L100,55 L100,45 L95,45 L95,50' fill='%23000000'/%3E%3C/svg%3E");
      animation: target-acquired 0.4s ease-out forwards;
    }

    .halo h1, .halo h2, .halo h3, .halo h4 {
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .halo .task-animating-in {
      animation: halo-scanline-reveal 0.5s ease-out forwards;
    }
  `
};
