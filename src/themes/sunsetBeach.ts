import { ThemeDefinition } from '../themeTypes';

export const sunsetBeach: ThemeDefinition = {
  id: 'sunset-beach',
  name: 'Sunset Beach',
  category: 'Vibrant & Energetic',
  font: "'Lora', serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    addTask: 'standard',
    taskComplete: 'theme-specific',
    suggestionAccept: 'standard',
    hover: 'theme-specific',
    enter: 'standard',
  },
  cssVariables: {
    '--bkg': '#2B2D42', // Deep Blue
    '--surface': '#3A3D56', // Slightly lighter blue
    '--surface-modal-bkg': 'rgba(58, 61, 86, 0.85)',
    '--primary': '#FF3CAC', // Magenta
    '--primary-focus': '#FF69B4',
    '--secondary': '#2EC4B6', // Teal
    '--text-primary': '#EDF2F4', // Off-white
    '--text-secondary': '#A0AEC0',
    '--accent': '#FF6F3C', // Sunset Orange
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.5rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 0 15px hsla(327, 100%, 60%, 0.3)',
    '--bkg-image': `
      radial-gradient(ellipse at 50% 150%, hsla(27, 100%, 62%, 0.3), transparent 60%)
    `,
    '--transition-duration': '350ms',
    '--header-text-shadow': '0 0 6px var(--primary), 0 0 10px var(--accent)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    @keyframes gradient-pan {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes sunset-fade-out {
      0% { transform: scale(1); opacity: 1; filter: blur(0); }
      100% { transform: scale(0.8) translateY(20px); opacity: 0; filter: blur(10px); }
    }

    @keyframes sun-flare {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
        100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
    }

    /* --- GRADIENT BORDER LOGIC --- */

    /* Hide the base border on elements that will get the gradient effect */
    .sunset-beach .theme-hover {
        position: relative;
        border-color: transparent;
    }

    /* Create the gradient using a pseudo-element */
    .sunset-beach .theme-hover::before {
        content: '';
        position: absolute;
        inset: -2px; /* Cover the border area */
        border-radius: inherit; /* Match parent's border-radius */
        padding: 2px; /* The border width */
        background: linear-gradient(120deg, var(--accent), var(--primary), var(--secondary), var(--accent));
        -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        background-size: 300% 300%;
        opacity: 0; /* Start invisible */
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    /* Animate the gradient on hover */
    .sunset-beach .theme-hover:hover:not(:disabled)::before {
        animation: gradient-pan 8s linear infinite;
        opacity: 1;
    }

    /* --- OVERRIDE FOR NESTED ELEMENTS --- */

    /* Restore the solid border for any .theme-hover inside another .theme-hover */
    .sunset-beach .theme-hover .theme-hover {
        border: 2px solid var(--secondary);
        transition: border-color 0.2s ease-out;
    }

    /* Disable the complex gradient pseudo-element for nested elements */
    .sunset-beach .theme-hover .theme-hover::before {
        display: none;
    }

    /* Apply a simple border color change for nested elements on hover */
    .sunset-beach .theme-hover .theme-hover:hover:not(:disabled) {
        border-color: var(--primary);
    }
    
    /* --- COMPLETION ANIMATION --- */
    .sunset-beach .animate-complete-task {
      animation: sunset-fade-out 0.7s ease-in-out forwards;
      position: relative;
    }
    
    .sunset-beach .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
      animation: sun-flare 0.7s ease-out forwards;
    }
  `
};
