import { ThemeDefinition } from '../themeTypes';

export const portal: ThemeDefinition = {
  id: 'portal',
  name: 'Aperture Science',
  category: 'Gaming & Pop Culture',
  font: "'Poppins', sans-serif",
  soundPack: 'digital',
  isLight: true,
  animations: {
    hover: {
      description: "Blue and orange portals shimmer and expand from the sides of the card.",
    },
    taskComplete: {
      className: 'animate-portal-fall',
      description: "The task card falls through a blue portal that opens up beneath it.",
    },
    suggestionAccept: {
      className: 'animate-portal-fall',
      description: "The suggestion card is sucked into a blue portal.",
    },
    dismissTask: {
      className: 'animate-portal-fall',
      description: "The task card is dropped into an Aperture Science incinerator.",
    },
    addTask: 'standard',
    enter: 'minimal',
    viewTransition: 'minimal',
    levelUp: 'minimal',
    progressBar: 'minimal',
    inputField: 'standard',
    modal: 'minimal',
    loadingState: 'minimal',
    button: 'minimal',
  },
  cssVariables: {
    '--bkg': '#F8F9FA', // Sterile light gray
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': 'rgba(255, 255, 255, 0.9)',
    '--primary': '#FF6E00', // Portal Orange
    '--primary-focus': '#FF8A33',
    '--secondary': '#00ADEF', // Portal Blue
    '--text-primary': '#212529', // Lab Black
    '--text-secondary': '#6C757D', // Lab Gray
    '--accent': '#FF6E00',
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Poppins', sans-serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 4px 10px rgba(0, 0, 0, 0.05)',
    '--bkg-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M25 0v25H0v-5h20V0h5zm50 50v25H50v-5h20V50h5zM20 95V70h5V50H0v5h20v40h-5v5h25V95h-5z' fill='%236C757D' fill-opacity='0.05'/%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes portal-open {
      0% { transform: translate(-50%, -50%) scaleX(0.1) scaleY(0.1); opacity: 0.5; }
      50% { transform: translate(-50%, -50%) scaleX(1) scaleY(1); opacity: 1; }
      100% { transform: translate(-50%, -50%) scaleX(0.1) scaleY(0.1); opacity: 0; }
    }

    @keyframes portal-fall-content {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(0.5); opacity: 0; }
    }
    
    @keyframes portal-wrapper-fall {
        0%, 50% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0); opacity: 0; }
    }
    
    .portal .theme-hover {
        position: relative;
        overflow: hidden;
    }
    
    /* Ensure content divs are above the portal pseudo-elements */
    .portal .theme-hover > div {
        position: relative;
        z-index: 1;
    }

    /* Portal hover effect */
    .portal .theme-hover::before,
    .portal .theme-hover::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 100px;
        height: 150%;
        border-radius: 50%;
        opacity: 0.7;
        filter: blur(15px);
        transform: translateY(-50%) scale(0);
        transition: transform 0.4s ease-out;
        z-index: 0;
    }
    
    .portal .theme-hover::before {
        left: -50px;
        background: var(--secondary); /* Blue */
    }

    .portal .theme-hover::after {
        right: -50px;
        background: var(--primary); /* Orange */
    }

    .portal .theme-hover:hover:not(:disabled)::before,
    .portal .theme-hover:hover:not(:disabled)::after {
        transform: translateY(-50%) scale(1.5);
    }
    
    /* Generic fall animation */
    .portal .animate-portal-fall {
      animation: portal-wrapper-fall 0.8s ease-in forwards;
      position: relative;
    }
    
    .portal .animate-portal-fall > * {
      animation: portal-fall-content 0.4s ease-in forwards;
    }

    .portal .animate-portal-fall::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80%;
      height: 110%;
      border-radius: 50%;
      border: 4px solid var(--secondary); /* Blue portal */
      box-shadow: 0 0 15px var(--secondary);
      animation: portal-open 0.8s ease-in-out forwards;
    }
  `
};