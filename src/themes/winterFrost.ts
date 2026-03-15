import { ThemeDefinition } from '../themeTypes';

export const winterFrost: ThemeDefinition = {
  id: 'winter-frost',
  name: 'Winter Frost',
  category: 'Seasonal & Festive',
  font: "'Poppins', sans-serif",
  soundPack: 'organic',
  isLight: true,
  animations: {
    addTask: 'organic',
    taskComplete: 'theme-specific',
    suggestionAccept: 'organic',
    hover: 'theme-specific',
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
    '--bkg': '#E1F5FE', // Very light Icy Blue
    '--surface': 'rgba(255, 255, 255, 0.6)',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.7)',
    '--primary': '#0277BD', // Deep Icy Blue
    '--primary-focus': '#039BE5',
    '--secondary': '#90A4AE', // Steel Gray
    '--text-primary': '#263238', // Dark Slate
    '--text-secondary': '#607D8B', // Lighter Slate
    '--accent': '#B3E5FC', // Light Icy Blue
    '--font-family-header': "'Poppins', sans-serif",
    '--font-family-body': "'Poppins', sans-serif",
    '--border-radius': '0.75rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 4px 10px rgba(0, 0, 0, 0.05)',
    '--bkg-image': 'none', // Managed by custom CSS
    '--transition-duration': '300ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    @keyframes frost-snow-fall {
      0% { background-position: 0 0, 0 0, 0 0; }
      100% { background-position: 250px 500px, 200px 200px, 150px 150px; }
    }

    @keyframes icy-shimmer {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }

    @keyframes ice-shatter {
      0% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 transparent; }
      100% {
        opacity: 0;
        transform: scale(1.3) rotate(10deg);
        box-shadow: 
          -20px -10px 0 -5px #B3E5FC, 15px 10px 0 -5px #FFFFFF,
          -15px 15px 0 -5px #90A4AE, 10px -15px 0 -5px #E1F5FE;
      }
    }

    @keyframes frost-task-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    body.winter-frost {
      animation: frost-snow-fall 40s linear infinite;
      background-image:
        /* Smallest, slowest particles */
        url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="0.5" fill="rgba(255,255,255,0.7)"/%3E%3C/svg%3E'),
        /* Medium particles */
        url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="25" cy="75" r="1" fill="rgba(255,255,255,0.8)"/%3E%3C/svg%3E'),
        /* Largest, fastest particles */
        url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="75" cy="25" r="1.5" fill="rgba(255,255,255,0.9)"/%3E%3C/svg%3E');
      background-repeat: repeat;
      background-size: 250px 250px, 200px 200px, 150px 150px;
    }

    .winter-frost .bg-surface, .winter-frost .bg-surface-modal-bkg {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .winter-frost .theme-hover {
      position: relative;
      overflow: hidden;
    }
    
    .winter-frost .theme-hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s ease-out;
    }

    .winter-frost .theme-hover:hover:not(:disabled)::before {
      animation: icy-shimmer 1.5s infinite linear;
    }

    .winter-frost .animate-complete-task {
      animation: frost-task-fade 0.5s ease-out 0.2s forwards;
      position: relative;
    }
    
    .winter-frost .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      margin-top: -2px;
      background: transparent;
      border-radius: 50%;
      animation: ice-shatter 0.5s ease-out forwards;
    }
  `
};
