import { ThemeDefinition } from '../themeTypes';

export const superDodgeballAdvance: ThemeDefinition = {
  id: 'super-dodgeball-advance',
  name: 'Super Dodgeball',
  category: 'Retro & Pixelated',
  font: "'Share Tech Mono', monospace",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: 'pop',
    taskComplete: {
      className: 'animate-complete-task',
      description: "A dodgeball flies in and smashes the task card, which shatters into pixels.",
    },
    suggestionAccept: 'pop',
    hover: {
        description: "The card bounces, as if ready for a match.",
    },
    enter: 'pop',
    viewTransition: 'pop',
    dismissTask: 'pop',
    levelUp: 'pop',
    progressBar: 'pop',
    inputField: 'pop',
    modal: 'pop',
    loadingState: 'retro',
    button: 'pop',
  },
  cssVariables: {
    '--bkg': '#F0F4F8', // Light blue-gray gym floor
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.85)',
    '--primary': '#E53935', // Bold Red
    '--primary-focus': '#F44336',
    '--secondary': '#42A5F5', // Sky Blue
    '--text-primary': '#212121', // Arcade Black
    '--text-secondary': '#757575',
    '--accent': '#FFEB3B', // Yellow
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0px',
    '--card-border-width': '4px',
    '--card-shadow': '5px 5px 0px var(--secondary)', // Hard pixel shadow
    '--bkg-image': `linear-gradient(rgba(240, 244, 248, 0.9), rgba(240, 244, 248, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%2342A5F5' fill-opacity='0.1'%3E%3Crect x='0' y='0' width='50' height='50'/%3E%3Crect x='50' y='50' width='50' height='50'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '150ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    @keyframes sda-bounce {
      0%, 100% { transform: translateY(0) scale(1) rotate(0); }
      50% { transform: translateY(-5px) scale(1.03) rotate(1deg); }
    }

    @keyframes sda-ball-fly-in {
      0% { transform: translate(-150px, -150px) scale(0.5) rotate(-180deg); opacity: 0; }
      70% { transform: translate(0, 0) rotate(0deg) scale(1.2); opacity: 1; }
      100% { transform: translate(0, 0) scale(1); opacity: 1; }
    }

    @keyframes sda-pixel-shatter {
      0% { transform: scale(1); opacity: 1; filter: blur(0); }
      100% {
        transform: scale(1.5) rotate(5deg);
        opacity: 0;
        filter: blur(5px);
        box-shadow: 
          -20px -10px 0 -5px var(--primary), 15px 10px 0 -5px var(--accent),
          -15px 15px 0 -5px var(--secondary), 10px -20px 0 -5px var(--primary);
      }
    }

    .super-dodgeball-advance .theme-hover:hover:not(:disabled) {
      animation: sda-bounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border-color: var(--primary);
    }

    .super-dodgeball-advance .animate-complete-task {
      animation: sda-pixel-shatter 0.3s ease-in 0.2s forwards;
      position: relative;
      overflow: hidden;
    }

    .super-dodgeball-advance .animate-complete-task::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 32px;
      height: 32px;
      margin: -16px 0 0 -16px;
      background-color: var(--primary);
      border: 3px solid #fff;
      box-shadow: 2px 2px 0px #000, inset -4px -4px 0px 0px rgba(0,0,0,0.3);
      border-radius: 50%;
      animation: sda-ball-fly-in 0.25s ease-out forwards;
      z-index: 10;
    }

    .super-dodgeball-advance .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background: var(--secondary);
      animation: sda-blink 1s linear infinite;
    }
    
    @keyframes sda-blink {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 0.2; }
    }
  `
};
