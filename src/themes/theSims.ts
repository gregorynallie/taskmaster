import { ThemeDefinition } from '../themeTypes';

export const theSims: ThemeDefinition = {
  id: 'the-sims',
  name: 'The Sims',
  category: 'Gaming & Pop Culture',
  font: "'Nunito', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: {
        classes: {
            confirmEnter: 'animate-playful-confirm-enter',
            confirmExit: 'animate-playful-confirm-exit',
            formEnter: 'animate-playful-form-enter',
            taskEnter: 'task-animating-in',
        },
        description: "A green Plumbob appears above the new task as it animates into the list.",
    },
    taskComplete: {
      className: 'animate-complete-task',
      description: "A '+😊' emote floats up from the task card as it disappears, indicating a mood boost.",
    },
    suggestionAccept: 'playful',
    hover: {
      description: "A green Plumbob (diamond) appears and spins above the card.",
    },
    enter: 'playful',
    viewTransition: 'playful',
    dismissTask: 'playful',
    levelUp: 'playful',
    progressBar: 'playful',
    inputField: 'playful',
    modal: 'playful',
    loadingState: 'playful',
    button: 'playful',
  },
  cssVariables: {
    '--bkg': '#F0F8FF', // AliceBlue, a very soft blue-white
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.8)',
    '--primary': '#00FF7F', // Plumbob Green
    '--primary-focus': '#33FF99',
    '--secondary': '#00BFFF', // Soft Blue
    '--text-primary': '#333333',
    '--text-secondary': '#777777',
    '--accent': '#00BFFF',
    '--font-family-header': "'Nunito', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1.5rem', // Bubbly UI
    '--card-border-width': '2px',
    '--card-shadow': '0 4px 10px -2px rgba(0, 0, 0, 0.08)',
    '--bkg-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%2300FF7F' fill-opacity='0.1'%3E%3Cpath d='M20 0L25 15L40 20L25 25L20 40L15 25L0 20L15 15z'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--animation-transform-enter': 'scale(0.9)',
  },
  customCss: `
    @keyframes plumbob-hover-effect {
      0% {
        transform: translateY(0) rotateY(0deg);
        filter: drop-shadow(0 0 6px var(--primary));
      }
      50% {
        transform: translateY(-6px) rotateY(180deg);
        filter: drop-shadow(0 0 12px var(--primary));
      }
      100% {
        transform: translateY(0) rotateY(360deg);
        filter: drop-shadow(0 0 6px var(--primary));
      }
    }
    
    @keyframes float-up-emote {
      0% { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(0.5); }
      100% { opacity: 0; transform: translate(-50%, -50%) translateY(-60px) scale(1); }
    }

    .the-sims .theme-hover {
      position: relative; /* Stacking context for the plumbob */
    }

    .the-sims .task-animating-in::before,
    .the-sims .theme-hover:hover:not(:disabled)::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      width: 28px;
      height: 40px;
      margin-left: -14px;
      margin-bottom: 8px;
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      background: radial-gradient(ellipse at center, hsl(150, 100%, 80%), var(--primary) 80%);
      opacity: 0;
      transform: translateY(5px);
      transition: all 0.2s var(--animation-timing-enter);
      pointer-events: none;
      z-index: 10;
    }

    .the-sims .task-animating-in::before,
    .the-sims .theme-hover:hover:not(:disabled)::before {
      opacity: 1;
      transform: translateY(0);
      animation: plumbob-hover-effect 2.5s linear infinite 0.2s;
    }
    
    .the-sims .animate-complete-task {
      animation: accept-suggestion-animation 0.5s var(--animation-timing-enter) forwards;
      position: relative;
    }

    .the-sims .animate-complete-task::after {
      content: '+😊';
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--primary);
      text-shadow: 0 0 5px white;
      opacity: 0;
      animation: float-up-emote 0.8s ease-out forwards;
      pointer-events: none;
    }

    .the-sims .skeleton-loader.skeleton-theme-specific .skeleton-line {
      border-radius: 999px; /* Pill shape */
      background: linear-gradient(90deg, #e0e0e0, #f0f0f0, #e0e0e0);
      background-size: 200% 100%;
      animation: sims-pulse 1.5s linear infinite;
    }

    @keyframes sims-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
};
