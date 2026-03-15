import { ThemeDefinition } from '../themeTypes';

export const fable: ThemeDefinition = {
  id: 'fable',
  name: "Fable's Albion",
  category: 'Gaming & Pop Culture',
  font: "'Lora', serif",
  soundPack: 'organic',
  isLight: true,
  animations: {
    taskComplete: {
        className: 'animate-complete-task',
        description: "A golden seal is stamped onto the card, signifying completion.",
    },
    hover: {
        description: "The card glows with a good (gold) or evil (red) aura.",
    },
  },
  cssVariables: {
    '--bkg': '#FDF6E3', // Parchment
    '--surface': '#FFFBF0', // Lighter Parchment
    '--surface-modal-bkg': 'rgba(255, 251, 240, 0.85)',
    '--primary': '#6F4E37', // Oak Brown
    '--primary-focus': '#8A6E59',
    '--secondary': '#4682B4', // Soft Blue
    '--text-primary': '#3D2B1F', // Dark Brown
    '--text-secondary': '#7A6A53',
    '--accent': '#D4AF37', // Rustic Gold
    '--font-family-header': "'Playfair Display', serif",
    '--font-family-body': "'Lora', serif",
    '--border-radius': '0.375rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 4px 10px rgba(61, 43, 31, 0.1)',
    '--bkg-image': `linear-gradient(rgba(253, 246, 227, 0.8), rgba(253, 246, 227, 0.8)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%236F4E37' fill-opacity='0.04'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%236F4E37' stroke-width='1'/%3E%3Cpath d='M15 15v70h70V15z' fill='none' stroke='%236F4E37' stroke-width='1' stroke-dasharray='5,5'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '350ms',
    '--header-text-shadow': '1px 1px 1px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    @keyframes fable-aura-glow {
      0%, 100% {
        box-shadow: 0 0 10px hsla(43, 61%, 52%, 0.5), 0 4px 10px rgba(61, 43, 31, 0.1); /* Gold */
        border-color: var(--accent);
      }
      50% {
        box-shadow: 0 0 15px hsla(4, 55%, 49%, 0.6), 0 4px 10px rgba(61, 43, 31, 0.1); /* Red */
        border-color: #C0392B;
      }
    }

    @keyframes fable-seal-stamp {
      0% { transform: scale(0.5) rotate(-30deg); opacity: 0; }
      50% { transform: scale(1.1) rotate(5deg); opacity: 1; }
      80% { transform: scale(0.95) rotate(-2deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }

    @keyframes fable-task-complete {
      0% { transform: scale(1); opacity: 1; }
      20% { 
        transform: scale(1.02);
        background-color: hsla(43, 61%, 52%, 0.1);
      }
      100% { 
        transform: scale(0.95);
        opacity: 0;
      }
    }

    .fable .theme-hover:hover:not(:disabled) {
      animation: fable-aura-glow 3s infinite ease-in-out;
    }
    
    .fable .animate-complete-task {
      animation: fable-task-complete 1s ease-in-out 0.3s forwards;
      position: relative;
      overflow: visible;
    }

    .fable .animate-complete-task::after {
      content: '✔';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 50px;
      height: 50px;
      margin-left: -25px;
      margin-top: -25px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      color: #FFFBF0;
      background-color: #C0392B; /* Hero Red */
      border-radius: 50%;
      box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
      animation: fable-seal-stamp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      z-index: 10;
    }
  `
};
