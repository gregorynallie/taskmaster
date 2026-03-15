import { ThemeDefinition } from '../themeTypes';

export const winterWonderland: ThemeDefinition = {
  id: 'winter-wonderland',
  name: 'Winter Wonderland',
  category: 'Seasonal & Festive',
  font: "'Lora', serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: 'playful',
    taskComplete: 'theme-specific',
    suggestionAccept: 'playful',
    hover: 'theme-specific',
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
    '--bkg': '#F5FAFA', // Snowy White
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.85)',
    '--primary': '#C62828', // Festive Red
    '--primary-focus': '#E53935',
    '--secondary': '#2E7D32', // Forest Green
    '--text-primary': '#333333', // Charcoal
    '--text-secondary': '#6C757D',
    '--accent': '#FFD700', // Sparkling Gold
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '0.75rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 6px 12px hsla(0, 0%, 0%, 0.08)',
    '--bkg-image': 'none', // Managed by custom CSS
    '--transition-duration': '300ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    @keyframes snow-fall {
      0% { background-position: 0 0, 0 0, 0 0; }
      100% { background-position: 500px 1000px, 400px 400px, 300px 300px; }
    }

    @keyframes christmas-sparkle {
      0%, 100% { box-shadow: 0 0 8px var(--accent), var(--card-shadow); border-color: var(--accent); }
      50% { box-shadow: 0 0 16px var(--accent), var(--card-shadow); border-color: var(--accent); }
    }

    @keyframes snowflake-burst {
      0% { transform: translate(-50%, -50%) scale(0.5) rotate(0deg); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1.5) rotate(180deg); opacity: 0; }
    }

    @keyframes winter-task-fade {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }

    body.winter-wonderland {
      animation: snow-fall 30s linear infinite;
      background-image:
        url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="20" cy="20" r="1.5" fill="white"/%3E%3C/svg%3E'),
        url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="2" fill="white"/%3E%3C/svg%3E'),
        url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="80" cy="80" r="1" fill="white"/%3E%3C/svg%3E');
      background-repeat: repeat;
      background-size: 500px 500px, 400px 400px, 300px 300px;
    }

    .winter-wonderland .theme-hover:hover:not(:disabled) {
      animation: christmas-sparkle 2s infinite ease-in-out;
    }

    .winter-wonderland .animate-complete-task {
      animation: winter-task-fade 0.6s ease-out 0.2s forwards;
      position: relative;
    }

    .winter-wonderland .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 50px;
      height: 50px;
      margin-left: -25px;
      margin-top: -25px;
      background-color: var(--accent);
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M22.2 14.2L19 12l3.2-2.2c.4-.3.5-.9.2-1.3s-.9-.5-1.3-.2L18 10.5V6.8c0-.5-.4-.9-.9-.9s-.9.4-.9.9v3.7l-3.2-2.2c-.4-.3-1-.2-1.3.2s-.2 1 .2 1.3L15 12l-3.2 2.2c-.4.3-.5.9-.2 1.3.2.3.5.4.8.4.2 0 .3-.1.5-.2L15 13.5v3.7c0 .5.4.9.9.9s.9-.4.9-.9v-3.7l3.2 2.2c.2.1.4.2.5.2.3 0 .6-.2.8-.5.3-.4.2-1-.2-1.3zM9 12l-3.2-2.2c-.4-.3-1-.2-1.3.2s-.2 1 .2 1.3L8 10.5V6.8c0-.5-.4-.9-.9-.9S6.2 6.3 6.2 6.8v3.7L3 8.3c-.4-.3-.9-.2-1.3.2s-.2 1 .2 1.3L5 12l-3.2 2.2c-.4.3-.5.9-.2 1.3.2.3.5.4.8.4.2 0 .3-.1.5-.2L6.2 13.5v3.7c0 .5.4.9.9.9s.9-.4.9-.9v-3.7l3.2 2.2c.2.1.4.2.5.2.3 0 .6-.2.8-.5.3-.4.2-1-.2-1.3L9 12z'/%3E%3C/svg%3E");
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M22.2 14.2L19 12l3.2-2.2c.4-.3.5-.9.2-1.3s-.9-.5-1.3-.2L18 10.5V6.8c0-.5-.4-.9-.9-.9s-.9.4-.9.9v3.7l-3.2-2.2c-.4-.3-1-.2-1.3.2s-.2 1 .2 1.3L15 12l-3.2 2.2c-.4.3-.5.9-.2 1.3.2.3.5.4.8.4.2 0 .3-.1.5-.2L15 13.5v3.7c0 .5.4.9.9.9s.9-.4.9-.9v-3.7l3.2 2.2c.2.1.4.2.5.2.3 0 .6-.2.8-.5.3-.4.2-1-.2-1.3zM9 12l-3.2-2.2c-.4-.3-1-.2-1.3.2s-.2 1 .2 1.3L8 10.5V6.8c0-.5-.4-.9-.9-.9S6.2 6.3 6.2 6.8v3.7L3 8.3c-.4-.3-.9-.2-1.3.2s-.2 1 .2 1.3L5 12l-3.2 2.2c-.4.3-.5.9-.2 1.3.2.3.5.4.8.4.2 0 .3-.1.5-.2L6.2 13.5v3.7c0 .5.4.9.9.9s.9-.4.9-.9v-3.7l3.2 2.2c.2.1.4.2.5.2.3 0 .6-.2.8-.5.3-.4.2-1-.2-1.3L9 12z'/%3E%3C/svg%3E");
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      animation: snowflake-burst 0.6s ease-out forwards;
    }
  `
};
