import { ThemeDefinition } from '../themeTypes';

export const lego: ThemeDefinition = {
  id: 'lego',
  name: 'Brick Builder',
  category: 'Light & Playful',
  font: "'Fredoka One', cursive",
  soundPack: 'playful',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The card shatters into a burst of colorful bricks.",
    },
    hover: {
      description: "The card pops out from the page with an increased shadow.",
    },
    addTask: 'pop',
    suggestionAccept: 'pop',
    enter: 'pop',
    viewTransition: 'pop',
    dismissTask: 'pop',
    levelUp: 'pop',
    progressBar: 'pop',
    inputField: 'pop',
    modal: 'pop',
    loadingState: 'pop',
    button: 'pop',
  },
  cssVariables: {
    '--bkg': '#F0F0F0', // Baseplate Gray
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.9)',
    '--primary': '#D90011', // LEGO Red
    '--primary-focus': '#FF1A2C',
    '--secondary': '#0057A8', // LEGO Blue
    '--text-primary': '#1A1A1A',
    '--text-secondary': '#5A5A5A',
    '--accent': '#FFD600', // LEGO Yellow
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Fredoka One', cursive",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '0px', // Handled by box-shadow
    '--card-shadow': 'none', // Handled by custom css
    '--bkg-image': 'none',
    '--transition-duration': '100ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    @keyframes lego-pop {
      to {
        transform: translate(-3px, -3px);
        box-shadow: 5px 5px 0px #ababab;
      }
    }
    
    @keyframes lego-brick-shatter {
      0% { opacity: 1; box-shadow: 0 0 0 0 transparent; }
      100% {
        opacity: 0;
        transform: scale(3);
        box-shadow: 
          -30px -15px 0 -5px #D90011, 30px 40px 0 -5px #D90011, /* Red */
          25px -20px 0 -5px #0057A8, -20px 30px 0 -5px #0057A8, /* Blue */
          -40px 10px 0 -5px #FFD600, 10px -30px 0 -5px #FFD600, /* Yellow */
          -10px 40px 0 -5px #00A84D, 40px 5px 0 -5px #00A84D; /* Green */
      }
    }

    @keyframes lego-task-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    .lego button, .lego [data-task-id], .lego input[type="text"] {
      border: 2px solid #333;
      box-shadow: 3px 3px 0px #ababab;
      transition: all 0.1s ease-in-out;
    }

    .lego .theme-hover:hover:not(:disabled) {
      animation: lego-pop 0.15s forwards;
    }

    .lego .theme-hover:active:not(:disabled) {
      transform: translate(2px, 2px);
      box-shadow: 1px 1px 0px #ababab;
    }

    .lego .animate-complete-task {
      position: relative;
    }
    
    .lego .animate-complete-task > * {
      animation: lego-task-fade 0.3s ease-out forwards;
    }

    .lego .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      margin-left: -5px;
      margin-top: -5px;
      background: transparent;
      animation: lego-brick-shatter 0.6s ease-out forwards;
    }
  `
};
