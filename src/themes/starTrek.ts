import { ThemeDefinition } from '../themeTypes';

export const starTrek: ThemeDefinition = {
  id: 'star-trek',
  name: 'Make It So',
  category: 'Sci-Fi & Cyberpunk',
  font: "'Poppins', sans-serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    addTask: 'theme-specific',
    taskComplete: 'standard',
    suggestionAccept: 'standard',
    hover: 'theme-specific',
    enter: 'standard',
  },
  cssVariables: {
    '--bkg': '#000000',
    '--surface': '#111827', // Dark Blue-Gray
    '--surface-modal-bkg': 'rgba(17, 24, 39, 0.9)',
    '--primary': '#FFD12D', // Command Gold
    '--primary-focus': '#FFE37A',
    '--secondary': '#2D6AFF', // Federation Blue
    '--text-primary': '#F0F4F8',
    '--text-secondary': '#A0AEC0',
    '--accent': '#3DB5E6', // Science Teal
    '--font-family-header': "'Poppins', sans-serif",
    '--font-family-body': "'Poppins', sans-serif",
    '--border-radius': '0.75rem', // For the LCARS curve
    '--card-border-width': '0px',
    '--card-shadow': 'none',
    '--bkg-image': `radial-gradient(circle at 10% 20%, rgba(45, 106, 255, 0.1), transparent 30%), radial-gradient(circle at 90% 80%, rgba(61, 181, 230, 0.1), transparent 30%)`,
    '--transition-duration': '250ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.99)',
  },
  customCss: `
    @keyframes lcars-blip {
      0% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 0; transform: scale(1); }
    }
    
    @keyframes transporter-materialize {
        0% {
            -webkit-mask-image: linear-gradient(to top, transparent 0%, black 5%);
            mask-image: linear-gradient(to top, transparent 0%, black 5%);
            filter: brightness(3);
        }
        100% {
            -webkit-mask-image: linear-gradient(to top, transparent -100%, black 0%);
            mask-image: linear-gradient(to top, transparent -100%, black 0%);
            filter: brightness(1);
        }
    }

    @keyframes transporter-shimmer {
        0% { box-shadow: 0 0 10px 0px #fff; }
        50% { box-shadow: 0 0 20px 5px #fff; }
        100% { box-shadow: 0 0 10px 0px #fff; }
    }


    /* Apply LCARS shape to cards and buttons */
    .star-trek [data-task-id], .star-trek .theme-hover {
      border-radius: var(--border-radius) 4px 4px var(--border-radius);
    }
    
    /* LCARS side-panel 'elbow' for task cards only */
    .star-trek [data-task-id] {
      position: relative;
      margin-left: calc(1rem + 12px); /* Make space for the elbow */
    }
    .star-trek [data-task-id]::before {
      content: '';
      position: absolute;
      left: calc(-1rem - 12px); /* Position it outside the card */
      top: 0;
      width: 1rem;
      height: 100%;
      background: var(--secondary);
      border-radius: var(--border-radius) 0 0 var(--border-radius);
    }
    
    /* Control Panel Blip on hover for interactive elements */
    .star-trek .theme-hover::after {
      content: '';
      position: absolute;
      top: 6px;
      right: 6px;
      width: 6px;
      height: 6px;
      background: var(--accent);
      border-radius: 50%;
      opacity: 0;
      box-shadow: 0 0 8px var(--accent);
    }

    .star-trek .theme-hover:hover:not(:disabled)::after {
      animation: lcars-blip 0.4s ease-out;
    }

    /* Override new task animation */
    .star-trek .task-animating-in {
      animation: transporter-materialize 0.5s ease-out;
      position: relative;
    }
    
    .star-trek .task-animating-in::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      animation: transporter-shimmer 0.5s ease-out;
      pointer-events: none;
    }
  `
};