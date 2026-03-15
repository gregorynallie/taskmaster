import { ThemeDefinition } from '../themeTypes';

export const fallout: ThemeDefinition = {
  id: 'fallout',
  name: 'Fallout Pip-Boy',
  category: 'Gaming & Pop Culture',
  font: "'Share Tech Mono', monospace",
  soundPack: 'analog',
  isLight: false,
  animations: {
    addTask: 'standard',
    taskComplete: {
      className: 'animate-complete-task',
      description: "A Vault Boy thumbs-up appears as the task is completed.",
    },
    suggestionAccept: 'standard',
    hover: {
      description: "The card flickers and glitches, like an old CRT screen.",
    },
    enter: 'standard',
  },
  cssVariables: {
    '--bkg': '#0A120A',
    '--surface': '#0F1A0F',
    '--surface-modal-bkg': 'rgba(15, 26, 15, 0.85)',
    '--primary': '#39FF14', // Pip-Boy Green
    '--primary-focus': '#8EFF70',
    '--secondary': '#1A331A', // Darker green
    '--text-primary': '#39FF14',
    '--text-secondary': '#28b40e', // Dimmer green
    '--accent': '#FFC800', // Vault-Tec Yellow
    '--font-family-header': "'Special Elite', monospace",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0px',
    '--card-border-width': '2px',
    '--card-shadow': '0 0 10px hsla(99, 100%, 53%, 0.4)',
    '--bkg-image': 'none',
    '--transition-duration': '150ms',
    '--header-text-shadow': '0 0 8px var(--primary)',
    '--animation-timing-enter': 'linear',
    '--animation-transform-enter': 'translateY(0)',
  },
  customCss: `
    @keyframes fallout-flicker {
      0%, 100% { opacity: 1; text-shadow: 0 0 5px var(--primary); }
      50% { opacity: 0.8; text-shadow: 0 0 8px var(--primary); }
    }

    @keyframes fallout-glitch {
      0%, 100% { transform: translate(0, 0); }
      20% { transform: translate(-1px, 1px); }
      40% { transform: translate(1px, -1px); }
      60% { transform: translate(1px, 1px); }
      80% { transform: translate(-1px, -1px); }
    }

    @keyframes vault-boy-popup {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
    }

    .fallout * {
      text-shadow: 0 0 5px var(--primary);
      font-weight: 500;
    }

    body.fallout::after {
      content: ' ';
      display: block;
      position: fixed;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.03));
      z-index: 1000;
      background-size: 100% 3px, 4px 100%;
      pointer-events: none;
      animation: fallout-flicker 10s linear infinite;
    }
    
    .fallout .theme-hover:hover:not(:disabled) {
      animation: fallout-glitch 0.2s linear infinite;
      background-color: var(--secondary);
    }
    
    .fallout .animate-complete-task {
      animation: accept-suggestion-animation 0.5s linear forwards;
      position: relative;
    }
    
    .fallout .animate-complete-task::before {
      content: 'QUEST UPDATED';
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-family: var(--font-family-header);
      font-size: 1rem;
      color: var(--accent);
      text-shadow: 0 0 5px var(--accent);
      animation: fallout-glitch 0.5s linear forwards;
    }
    
    .fallout .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4rem;
      height: 4rem;
      background-color: var(--primary);
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z'/%3E%3C/svg%3E");
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      animation: vault-boy-popup 0.5s ease-out forwards;
    }

    .fallout .skeleton-loader .skeleton-line {
      background-color: var(--primary);
      animation: fallout-flicker 1.5s linear infinite;
    }
  `
};