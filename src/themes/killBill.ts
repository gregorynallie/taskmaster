import { ThemeDefinition } from '../themeTypes';

export const killBill: ThemeDefinition = {
  id: 'kill-bill',
  name: "The Bride's Revenge",
  category: 'Gaming & Pop Culture',
  font: "'Source Sans Pro', sans-serif",
  soundPack: 'analog',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A red blood splatter appears over the card, which is then struck through.",
    },
    hover: {
        description: "The card jolts, as if struck.",
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
    '--bkg': '#FFFDE7', // Off-white, slightly yellow
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.85)',
    '--primary': '#FFC82E', // The Bride's Yellow
    '--primary-focus': '#FFD700',
    '--secondary': '#000000', // Black
    '--text-primary': '#000000',
    '--text-secondary': '#4A4A4A',
    '--accent': '#B90000', // Blood Red
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Bangers', cursive",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0px', // Sharp angles
    '--card-border-width': '3px',
    '--card-shadow': '4px 4px 0px var(--secondary)',
    '--bkg-image': 'none',
    '--transition-duration': '150ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    @keyframes killbill-jolt {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(-2px, -2px); }
      75% { transform: translate(2px, 2px); }
    }

    @keyframes blood-splatter {
      0% { transform: translate(-50%, -50%) scale(0) rotate(-45deg); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.2) rotate(10deg); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes strikethrough {
      0% { transform: scaleX(0); }
      100% { transform: scaleX(1); }
    }

    @keyframes task-fade-behind {
      0% { opacity: 1; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }

    .kill-bill .theme-hover:hover:not(:disabled) {
      animation: killbill-jolt 0.2s ease-in-out;
      border-color: var(--accent);
      box-shadow: 6px 6px 0px var(--secondary);
    }
    
    .kill-bill .animate-complete-task {
      animation: task-fade-behind 0.8s ease-out forwards;
      position: relative;
    }
    
    /* Blood Splatter */
    .kill-bill .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 120%;
      height: 120%;
      background-color: var(--accent);
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23000' d='M256 0c-36.5 73-128 32-128 128 0 53 108.5 64 128 128 19.5-64 128-75 128-128C384 32 292.5 73 256 0zM128 256c-73 36.5-32 128-128 128 53 0 64-108.5 128-128 64-19.5 75-128 128-128C160 128 201 219.5 128 256zM384 256c73-36.5 32-128 128-128-53 0-64 108.5-128 128-64 19.5-75 128-128 128C352 384 311 292.5 384 256z'/%3E%3C/svg%3E");
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23000' d='M256 0c-36.5 73-128 32-128 128 0 53 108.5 64 128 128 19.5-64 128-75 128-128C384 32 292.5 73 256 0zM128 256c-73 36.5-32 128-128 128 53 0 64-108.5 128-128 64-19.5 75-128 128-128C160 128 201 219.5 128 256zM384 256c73-36.5 32-128 128-128-53 0-64 108.5-128 128-64 19.5-75 128-128 128C352 384 311 292.5 384 256z'/%3E%3C/svg%3E");
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      animation: blood-splatter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      z-index: 10;
    }
    
    /* Strikethrough */
    .kill-bill .animate-complete-task::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 4px; /* Thickness of the line */
      margin-top: -1.5px;
      background-color: var(--accent);
      transform-origin: left;
      animation: strikethrough 0.3s ease-out 0.2s forwards;
      z-index: 11;
    }
  `
};
