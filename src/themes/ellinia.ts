import { ThemeDefinition } from '../themeTypes';

export const ellinia: ThemeDefinition = {
  id: 'ellinia',
  name: 'Ellinia',
  category: 'Light & Playful',
  font: "'Lora', serif",
  soundPack: 'organic',
  isLight: true,
  animations: {
    addTask: 'playful',
    taskComplete: 'theme-specific',
    suggestionAccept: 'playful',
    hover: 'theme-specific',
    enter: 'playful',
  },
  cssVariables: {
    '--bkg': '#AEDFF7', // Soft Sky Blue
    '--surface': '#F7FFFA', // Off-white with a hint of mint
    '--surface-modal-bkg': 'rgba(247, 255, 250, 0.85)',
    '--primary': '#4CAF50', // Leafy Emerald
    '--primary-focus': '#66BB6A',
    '--secondary': '#6D4C41', // Bark Brown
    '--text-primary': '#2E4032', // Dark Forest Green/Brown
    '--text-secondary': '#7A8B7D',
    '--accent': '#9C27B0', // Mystic Purple
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '1rem', // Organic, rounded feel
    '--card-border-width': '2px',
    '--card-shadow': '0 6px 12px -3px hsla(120, 39%, 52%, 0.15)',
    '--bkg-image': 'linear-gradient(to bottom, #AEDFF7, #E1F5FE 50%)',
    '--transition-duration': '350ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--animation-transform-enter': 'scale(0.9)',
  },
  customCss: `
    @keyframes ellinia-sway {
      0%, 100% { transform: rotate(-0.5deg) translateY(0); }
      50% { transform: rotate(0.5deg) translateY(-3px); }
    }

    @keyframes ellinia-leaves-fall {
      0% {
        opacity: 1;
        transform: translateY(0) scale(1);
        box-shadow: 
          -15px -20px 0 -5px hsla(120, 61%, 34%, 0.8), /* Forest Green */
          10px -30px 0 -5px hsla(140, 50%, 55%, 0.9), /* Leafy Emerald */
          25px -10px 0 -5px hsla(281, 62%, 42%, 0.7); /* Mystic Purple */
      }
      100% {
        opacity: 0;
        transform: translateY(80px) scale(0.7) rotate(90deg);
        box-shadow: 
          -30px 40px 0 -5px hsla(120, 61%, 34%, 0),
          0px 20px 0 -5px hsla(140, 50%, 55%, 0),
          40px 50px 0 -5px hsla(281, 62%, 42%, 0);
      }
    }

    @keyframes ellinia-task-fade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0.5; transform: scale(0.95); }
    }

    .ellinia .theme-hover:hover:not(:disabled) {
      animation: ellinia-sway 4s infinite ease-in-out;
      border-color: var(--primary);
    }

    .ellinia .animate-complete-task {
      animation: ellinia-task-fade 0.8s ease-out forwards;
      position: relative;
    }

    /* Use a pseudo-element for the leaf particles */
    .ellinia .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 10px;
      margin-left: -2.5px;
      margin-top: -5px;
      background: transparent;
      border-radius: 50% 0; /* Leaf shape */
      animation: ellinia-leaves-fall 0.8s ease-out forwards;
    }

    .ellinia .skeleton-loader .skeleton-line {
      background: linear-gradient(90deg, #EAE1DA, #C8E6C9, #EAE1DA);
      background-size: 200% 100%;
      animation: ellinia-pulse 2s ease-in-out infinite;
    }
    
    @keyframes ellinia-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
};