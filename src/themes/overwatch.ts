import { ThemeDefinition } from '../themeTypes';

export const overwatch: ThemeDefinition = {
  id: 'overwatch',
  name: 'Heroes Never Die',
  category: 'Gaming & Pop Culture',
  font: "'Poppins', sans-serif",
  soundPack: 'vibrant',
  isLight: true,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A circular wipe effect, like an ability cooldown, clears the task card.",
    },
    hover: {
        description: "The card's border pulses with a teal energy, like a hero's ability is ready.",
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
    '--bkg': '#F5F7FA', // Light, cool gray
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.9)',
    '--primary': '#FA9C1D', // Overwatch Orange
    '--primary-focus': '#FFB84D',
    '--secondary': '#007ACC', // Overwatch Blue
    '--text-primary': '#2D3748', // Dark Slate
    '--text-secondary': '#718096',
    '--accent': '#42D4D8', // Accent Teal
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Poppins', sans-serif",
    '--font-family-body': "'Poppins', sans-serif",
    '--border-radius': '0.5rem', // Sleek, rounded UI
    '--card-border-width': '2px',
    '--card-shadow': '0 4px 10px rgba(0, 0, 0, 0.05)',
    '--bkg-image': `linear-gradient(rgba(245, 247, 250, 0.9), rgba(245, 247, 250, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23007ACC' fill-opacity='0.05' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.99-7.5L26 15v18.5L13.01 41 0 33.5V15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '250ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    @keyframes overwatch-pulse {
      0%, 100% { box-shadow: 0 0 8px var(--accent), 0 4px 10px rgba(0, 0, 0, 0.05); }
      50% { box-shadow: 0 0 16px var(--accent), 0 4px 10px rgba(0, 0, 0, 0.05); }
    }

    @keyframes ability-cooldown-wipe {
      from {
        clip-path: circle(0% at 50% 50%);
        opacity: 1;
      }
      to {
        clip-path: circle(75% at 50% 50%);
        opacity: 0;
      }
    }

    @keyframes overwatch-task-fade {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }

    .overwatch h1, .overwatch h2, .overwatch h3, .overwatch h4 {
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.05em;
    }

    .overwatch .theme-hover:hover:not(:disabled) {
      border-color: var(--accent);
      animation: overwatch-pulse 1.5s infinite ease-in-out;
    }
    
    .overwatch .animate-complete-task {
      animation: overwatch-task-fade 0.5s ease-out forwards;
      position: relative;
    }
    
    .overwatch .animate-complete-task::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--accent);
      animation: ability-cooldown-wipe 0.5s ease-in forwards;
    }
  `
};
