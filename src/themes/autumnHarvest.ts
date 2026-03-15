import { ThemeDefinition } from '../themeTypes';

export const autumnHarvest: ThemeDefinition = {
  id: 'autumn-harvest',
  name: 'Autumn Harvest',
  category: 'Seasonal & Festive',
  font: "'Merriweather', serif",
  soundPack: 'organic',
  isLight: true,
  animations: {
    taskComplete: 'theme-specific',
    hover: 'theme-specific',
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
    '--bkg': '#FFF8E1', // Papaya Whip
    '--surface': '#FFFAF0', // Floral White
    '--surface-modal-bkg': 'rgba(255, 250, 240, 0.85)',
    '--primary': '#FF7518', // Pumpkin Orange
    '--primary-focus': '#FFA500', // Brighter Orange
    '--secondary': '#B22222', // Maple Red
    '--text-primary': '#4A2C2A', // Dark Brown
    '--text-secondary': '#8D6E63',
    '--accent': '#C68642', // Golden Brown
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.5rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 6px 12px hsla(25, 56%, 38%, 0.1)',
    '--bkg-image': `linear-gradient(rgba(255, 248, 225, 0.8), rgba(255, 248, 225, 0.8)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23C68642' fill-opacity='0.05'%3E%3Cpath d='M50 0 L61.8 38.2 L100 38.2 L69.1 61.8 L80.9 100 L50 76.4 L19.1 100 L30.9 61.8 L0 38.2 L38.2 38.2 Z' transform='rotate(15 50 50) scale(0.5)'/%3E%3Cpath d='M50 0 L61.8 38.2 L100 38.2 L69.1 61.8 L80.9 100 L50 76.4 L19.1 100 L30.9 61.8 L0 38.2 L38.2 38.2 Z' transform='translate(50 50) rotate(-30 50 50) scale(0.3)'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    @keyframes autumn-rustle {
      0%, 100% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-3px) rotate(0.5deg); }
    }

    @keyframes leaf-fall-1 {
      0% { transform: translate(0, -20px) rotate(0deg); opacity: 1; }
      100% { transform: translate(-30px, 120px) rotate(360deg); opacity: 0; }
    }
    
    @keyframes leaf-fall-2 {
      0% { transform: translate(0, -20px) rotate(0deg); opacity: 1; }
      100% { transform: translate(40px, 110px) rotate(270deg); opacity: 0; }
    }

    @keyframes autumn-task-fade {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }

    .autumn-harvest .theme-hover:hover:not(:disabled) {
      animation: autumn-rustle 3s infinite ease-in-out;
      border-color: var(--accent);
      box-shadow: 0 8px 15px hsla(25, 56%, 38%, 0.15);
    }

    .autumn-harvest .animate-complete-task {
      animation: autumn-task-fade 1s ease-out forwards;
      position: relative;
      overflow: visible;
    }

    /* Create two falling leaves */
    .autumn-harvest .animate-complete-task::before,
    .autumn-harvest .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 25px;
      height: 25px;
      opacity: 0;
      pointer-events: none;
    }

    .autumn-harvest .animate-complete-task::before {
      background-color: var(--secondary); /* Maple Red */
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M20.2 7.8c-1-1.3-2.6-2.2-4.2-2.2-1.7 0-3.3.9-4.3 2.4l-.3.4-.3-.4C10.2 6.5 8.6 5.6 7 5.6c-1.6 0-3.2.9-4.2 2.2C1.3 9.6.1 12.3 1 15.2c.8 2.7 3.4 4.8 6 4.8.7 0 1.3-.1 2-.4v-4.1c-.4.2-1 .3-1.5.3-1.4 0-2.6-1.1-2.9-2.5-.2-.8.1-1.6.8-2.2.6-.5 1.4-.7 2.1-.4l.9.3V7.9c.5-.4 1.2-.6 2.1-.6s1.6.2 2.1.6v3.1l.9-.3c.7-.3 1.5-.1 2.1.4.7.6 1 1.4.8 2.2-.3 1.4-1.5 2.5-2.9 2.5-.5 0-1.1-.1-1.5-.3v4.1c.7.3 1.3.4 2 .4 2.6 0 5.2-2.1 6-4.8.9-2.9-.3-5.6-1.8-7.4z'/%3E%3C/svg%3E");
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M20.2 7.8c-1-1.3-2.6-2.2-4.2-2.2-1.7 0-3.3.9-4.3 2.4l-.3.4-.3-.4C10.2 6.5 8.6 5.6 7 5.6c-1.6 0-3.2.9-4.2 2.2C1.3 9.6.1 12.3 1 15.2c.8 2.7 3.4 4.8 6 4.8.7 0 1.3-.1 2-.4v-4.1c-.4.2-1 .3-1.5.3-1.4 0-2.6-1.1-2.9-2.5-.2-.8.1-1.6.8-2.2.6-.5 1.4-.7 2.1-.4l.9.3V7.9c.5-.4 1.2-.6 2.1-.6s1.6.2 2.1.6v3.1l.9-.3c.7-.3 1.5-.1 2.1.4.7.6 1 1.4.8 2.2-.3 1.4-1.5 2.5-2.9 2.5-.5 0-1.1-.1-1.5-.3v4.1c.7.3 1.3.4 2 .4 2.6 0 5.2-2.1 6-4.8.9-2.9-.3-5.6-1.8-7.4z'/%3E%3C/svg%3E");
      animation: leaf-fall-1 1s ease-in forwards;
    }

    .autumn-harvest .animate-complete-task::after {
      background-color: var(--accent); /* Golden Brown */
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M12.1 2.1c-.1 0-.2.1-.3.2l-1.6 2.1c-1 .2-2 .5-2.9.9-1 .4-1.8 1-2.5 1.7-.1.1-.2.2-.2.3 0 .1.1.2.2.3.1.1.2.1.3.1.6-.3 1.2-.5 1.9-.6 1-.2 2-.2 2.9.1l-1.4 1.8c-1.4.2-2.8.6-4 1.3-.1.1-.2.2-.2.3 0 .1.1.2.2.3.1.1.2.1.3.1.6-.3 1.2-.5 1.9-.6 1-.2 2-.1 2.9.2l-1.5 2c-1.8.2-3.4.8-4.7 1.8-.1.1-.2.2-.2.3 0 .1.1.2.2.3.1.1.2.1.3.1.6-.2 1.3-.4 2-.5 1-.2 2-.2 2.9.1l-.8 1c-.8.1-1.5.2-2.2.5-.1 0-.2.1-.3.2s-.1.2-.1.3c0 .1.1.2.1.3.1.1.2.1.3.1.7-.2 1.4-.4 2.1-.5.9-.1 1.8-.1 2.7.2v3.1c0 .1.1.2.2.3.1.1.2.1.3.1s.2-.1.3-.1.1-.2.1-.3v-3.1c.9-.2 1.8-.3 2.7-.2.7.1 1.4.3 2.1.5.1 0 .2.1.3.1.1 0 .2-.1.2-.2 0-.1-.1-.2-.1-.3s-.1-.2-.2-.2c-.7-.3-1.4-.4-2.2-.5l-.8-1c1-.2 2-.3 2.9-.1.7.1 1.4.3 2 .5.1 0 .2.1.3-.1.1-.1.2-.2.2-.3 0-.1-.1-.2-.2-.3-1.3-1-2.9-1.6-4.7-1.8l-1.5-2c1-.2 2-.3 2.9-.2.7.1 1.3.3 1.9.6.1 0 .2.1.3-.1s.1-.2.1-.3c0-.1-.1-.2-.2-.3-1.7-1-3.6-1.5-5.6-1.3l-1.4-1.8c1-.2 2-.3 2.9-.1.7.1 1.3.3 1.9.6.1 0 .2.1.3-.1s.1-.2.1-.3c0-.1-.1-.2-.2-.3-.7-.7-1.5-1.3-2.5-1.7-.9-.4-1.9-.7-2.9-.9l-1.6-2.1c-.1-.1-.2-.2-.3-.2z'/%3E%3C/svg%3E");
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M12.1 2.1c-.1 0-.2.1-.3.2l-1.6 2.1c-1 .2-2 .5-2.9.9-1 .4-1.8 1-2.5 1.7-.1.1-.2.2-.2.3 0 .1.1.2.2.3.1.1.2.1.3.1.6-.3 1.2-.5 1.9-.6 1-.2 2-.2 2.9.1l-1.4 1.8c-1.4.2-2.8.6-4 1.3-.1.1-.2.2-.2.3 0 .1.1.2.2.3.1.1.2.1.3.1.6-.3 1.2-.5 1.9-.6 1-.2 2-.1 2.9.2l-1.5 2c-1.8.2-3.4.8-4.7 1.8-.1.1-.2.2-.2.3 0 .1.1.2.2.3.1.1.2.1.3.1.6-.2 1.3-.4 2-.5 1-.2 2-.2 2.9.1l-.8 1c-.8.1-1.5.2-2.2.5-.1 0-.2.1-.3.2s-.1.2-.1.3c0 .1.1.2.1.3.1.1.2.1.3.1.7-.2 1.4-.4 2.1-.5.9-.1 1.8-.1 2.7.2v3.1c0 .1.1.2.2.3.1.1.2.1.3.1s.2-.1.3-.1.1-.2.1-.3v-3.1c.9-.2 1.8-.3 2.7-.2.7.1 1.4.3 2.1.5.1 0 .2.1.3.1.1 0 .2-.1.2-.2 0-.1-.1-.2-.1-.3s-.1-.2-.2-.2c-.7-.3-1.4-.4-2.2-.5l-.8-1c1-.2 2-.3 2.9-.1.7.1 1.4.3 2 .5.1 0 .2.1.3-.1.1-.1.2-.2.2-.3 0-.1-.1-.2-.2-.3-1.3-1-2.9-1.6-4.7-1.8l-1.5-2c1-.2 2-.3 2.9-.2.7.1 1.3.3 1.9.6.1 0 .2.1.3-.1s.1-.2.1-.3c0-.1-.1-.2-.2-.3-1.7-1-3.6-1.5-5.6-1.3l-1.4-1.8c1-.2 2-.3 2.9-.1.7.1 1.3.3 1.9.6.1 0 .2.1.3-.1s.1-.2.1-.3c0-.1-.1-.2-.2-.3-.7-.7-1.5-1.3-2.5-1.7-.9-.4-1.9-.7-2.9-.9l-1.6-2.1c-.1-.1-.2-.2-.3-.2z'/%3E%3C/svg%3E");
      animation: leaf-fall-2 1s ease-in 0.2s forwards;
    }
  `
};