import { ThemeDefinition } from '../themeTypes';

export const ocarinaOfTime: ThemeDefinition = {
  id: 'ocarina-of-time',
  name: 'Ocarina of Time',
  category: 'Gaming & Pop Culture',
  font: "'Lora', serif",
  soundPack: 'organic',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "Magical notes float up from the card as it disappears, as if a song was played.",
    },
    hover: {
      description: "The card's border glows with a golden Triforce energy.",
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
    '--bkg': '#FBF8F0', // Light parchment
    '--surface': '#FFFCF5', // Slightly whiter parchment for cards
    '--surface-modal-bkg': 'rgba(255, 252, 245, 0.85)',
    '--primary': '#006400', // Forest Green
    '--primary-focus': '#007A00',
    '--secondary': '#2E52B2', // Royal Blue
    '--text-primary': '#4A2C2A', // Dark, rich brown
    '--text-secondary': '#7B6D66', // Softer brown
    '--accent': '#FFD700', // Triforce Gold
    '--font-family-header': "'Playfair Display', serif",
    '--font-family-body': "'Lora', serif",
    '--border-radius': '0.375rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 4px 8px rgba(74, 44, 42, 0.1)',
    '--bkg-image': `linear-gradient(rgba(251, 248, 240, 0.8), rgba(251, 248, 240, 0.8)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%234A2C2A' fill-opacity='0.03'%3E%3Crect x='0' y='0' width='100' height='1'/%3E%3Crect x='0' y='0' width='1' height='100'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': '1px 1px 1px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    @keyframes triforce-glow {
      0%, 100% {
        box-shadow: 0 0 8px var(--accent), 0 4px 8px rgba(74, 44, 42, 0.1);
      }
      50% {
        box-shadow: 0 0 16px var(--accent), 0 4px 8px rgba(74, 44, 42, 0.1);
      }
    }

    @keyframes ocarina-notes-complete {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      20% {
        transform: scale(1.03);
        background-color: hsla(51, 100%, 50%, 0.1);
      }
      100% {
        transform: scale(0.95) translateY(10px);
        opacity: 0;
      }
    }

    @keyframes float-notes {
      0% {
        opacity: 1;
        transform: translateY(0) scale(1);
        box-shadow: -20px -30px 10px -5px hsla(221, 62%, 44%, 0.8), /* Blue */
                     0px -50px 10px -5px hsla(0, 75%, 60%, 0.8), /* Red */
                     20px -30px 10px -5px hsla(120, 60%, 50%, 0.8); /* Green */
      }
      100% {
        opacity: 0;
        transform: translateY(-100px) scale(0.5);
        box-shadow: -30px -80px 10px -5px hsla(221, 62%, 44%, 0),
                   -10px -120px 10px -5px hsla(0, 75%, 60%, 0),
                   30px -90px 10px -5px hsla(120, 60%, 50%, 0);
      }
    }

    .ocarina-of-time .theme-hover:hover:not(:disabled) {
      animation: triforce-glow 2s infinite ease-in-out;
      border-color: var(--accent);
    }

    .ocarina-of-time .animate-complete-task {
      animation: ocarina-notes-complete 0.8s ease-out forwards;
      position: relative;
      overflow: visible;
    }

    .ocarina-of-time .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 5px;
      margin-top: -2.5px;
      margin-left: -2.5px;
      background: transparent;
      animation: float-notes 0.8s ease-out forwards;
    }
  `
};
