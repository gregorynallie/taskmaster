import { ThemeDefinition } from '../themeTypes';

export const cuphead: ThemeDefinition = {
  id: 'cuphead',
  name: 'Inkwell Isle',
  category: 'Gaming & Pop Culture',
  font: "'Bangers', cursive",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: {
      classes: {
          confirmEnter: 'animate-pop-confirm-enter',
          confirmExit: 'animate-pop-confirm-exit',
          formEnter: 'animate-pop-form-enter',
          taskEnter: 'animate-cuphead-paint-in',
      },
      description: "The new task gets 'painted' into view, like a classic animation cel.",
    },
    taskComplete: {
      className: 'animate-complete-task',
      description: "A 'KNOCKOUT!' graphic splashes over the card as it disappears.",
    },
    suggestionAccept: 'pop',
    hover: {
        description: "The card does a playful squash-and-stretch animation.",
    },
    enter: {
        className: 'animate-themed-enter',
        description: "The entire screen has a subtle, film-grain jitter.",
    },
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
    '--bkg': '#FDF5E6', // Old Paper Cream
    '--surface': '#FFFAF0', // Whiter Paper
    '--surface-modal-bkg': 'rgba(255, 250, 240, 0.9)',
    '--primary': '#D92A2A', // 1930s Cartoon Red
    '--primary-focus': '#F03A3A',
    '--secondary': '#3C78D8', // 1930s Cartoon Blue
    '--text-primary': '#4A2C2A', // Dark Sepia Brown
    '--text-secondary': '#8D6E63',
    '--accent': '#FBC02D', // Gold accent
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Bangers', cursive",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1.5rem', // Rounded characters
    '--card-border-width': '3px',
    '--card-shadow': '5px 5px 0px var(--text-primary)',
    '--bkg-image': `linear-gradient(rgba(253, 245, 230, 0.85), rgba(253, 245, 230, 0.85)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
    '--transition-duration': '150ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    @keyframes cuphead-jitter {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(0.5px, -0.5px); }
      50% { transform: translate(-0.5px, 0.5px); }
      75% { transform: translate(0.5px, 0.5px); }
    }

    @keyframes cuphead-squash-stretch {
      0%, 100% { transform: scale(1, 1); }
      40% { transform: scale(1.1, 0.9) translateY(2px); }
    }

    @keyframes cuphead-knockout-splash {
      0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes cuphead-task-ko {
      0% { opacity: 1; filter: none; }
      100% { opacity: 0; filter: brightness(1.5) blur(3px); }
    }
    
    @keyframes cuphead-paint-in {
        from {
            opacity: 0;
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%);
            mask-image: linear-gradient(to right, transparent 0%, black 5%);
        }
        to {
            opacity: 1;
            -webkit-mask-image: linear-gradient(to right, black 100%, black 100%);
            mask-image: linear-gradient(to right, black 100%, black 100%);
        }
    }
    
    body.cuphead {
        animation: cuphead-jitter 0.2s infinite;
    }
    
    .cuphead h1, .cuphead h2, .cuphead h3, .cuphead h4 {
        letter-spacing: 1px;
    }

    .cuphead .theme-hover:hover:not(:disabled) {
      animation: cuphead-squash-stretch 0.3s ease-in-out;
      border-color: var(--primary);
    }
    
    .cuphead .animate-complete-task {
      animation: cuphead-task-ko 0.5s ease-out 0.3s forwards;
      position: relative;
    }

    .cuphead .animate-complete-task::after {
      content: 'A KNOCKOUT!';
      position: absolute;
      top: 50%;
      left: 50%;
      font-family: var(--font-family-header);
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--accent);
      text-shadow: 3px 3px 0px var(--text-primary);
      opacity: 0;
      animation: cuphead-knockout-splash 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      pointer-events: none;
      z-index: 10;
      white-space: nowrap;
    }

    .cuphead .animate-cuphead-paint-in {
      animation: cuphead-paint-in 0.5s ease-out 0.1s forwards;
    }
  `
};