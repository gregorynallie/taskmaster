import { ThemeDefinition } from '../themeTypes';

export const dune: ThemeDefinition = {
  id: 'dune',
  name: 'Arrakis',
  category: 'Sci-Fi & Cyberpunk',
  font: "'Oswald', sans-serif",
  soundPack: 'organic',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "The task card dissolves into particles of sand and drifts away.",
    },
    hover: {
        description: "A ripple expands from the center, as if disturbing the sand.",
    },
  },
  cssVariables: {
    '--bkg': '#1A140F', // Deep Sand
    '--surface': '#3D2B1F', // Lighter Ochre
    '--surface-modal-bkg': 'rgba(61, 43, 31, 0.9)',
    '--primary': '#C19A6B', // Desert Ochre
    '--primary-focus': '#D8B88B',
    '--secondary': '#0A0A0A', // Black
    '--text-primary': '#F5EFE6', // Sand White
    '--text-secondary': '#A1887F', // Muted Sand
    '--accent': '#00A3CC', // Spice Blue
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.125rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 15px hsla(208, 100%, 40%, 0.2)',
    '--bkg-image': 'none', // Managed by custom CSS
    '--transition-duration': '300ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.5)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    @keyframes dune-dust-drift {
      0% { background-position: 0 0, 0 0, 0 0; }
      100% { background-position: -1000px 0, -1500px 0, -2000px 0; }
    }
    
    @keyframes dune-ripple-hover {
      to {
        transform: scale(3);
        opacity: 0;
      }
    }

    @keyframes dune-sand-drift {
      0% { opacity: 1; box-shadow: 0 0 0 0 transparent; }
      100% {
        opacity: 0;
        transform: translateY(-80px) rotate(15deg);
        box-shadow: 
          -30px 20px 0 -5px var(--bkg), 25px -10px 0 -5px var(--accent),
          -20px -30px 0 -5px var(--bkg), 15px 40px 0 -5px var(--accent);
      }
    }

    @keyframes dune-task-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    body.dune {
        animation: dune-dust-drift 120s linear infinite;
        background-image: 
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01 0.4' numOctaves='1' result='warp'%3E%3C/feTurbulence%3E%3CfeDisplacementMap xChannelSelector='R' yChannelSelector='G' scale='30' in='SourceGraphic' in2='warp'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%23C19A6B' opacity='0.05'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.5' numOctaves='1' result='warp'%3E%3C/feTurbulence%3E%3CfeDisplacementMap xChannelSelector='R' yChannelSelector='G' scale='30' in='SourceGraphic' in2='warp'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%23C19A6B' opacity='0.03'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03 0.6' numOctaves='1' result='warp'%3E%3C/feTurbulence%3E%3CfeDisplacementMap xChannelSelector='R' yChannelSelector='G' scale='30' in='SourceGraphic' in2='warp'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%23C19A6B' opacity='0.02'/%3E%3C/svg%3E");
    }
    
    .dune h1, .dune h2, .dune h3, .dune h4 {
      text-transform: uppercase;
      font-weight: 700;
    }
    
    .dune .theme-hover {
      position: relative;
      overflow: hidden;
    }

    .dune .theme-hover::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      margin-left: -50%;
      margin-top: -50%;
      border-radius: 50%;
      background: radial-gradient(circle, hsla(198, 100%, 40%, 0.2), transparent 60%);
      transform: scale(0);
      pointer-events: none;
    }
    
    .dune .theme-hover:hover:not(:disabled)::before {
        animation: dune-ripple-hover 0.7s ease-out;
    }

    .dune .animate-complete-task {
      animation: dune-task-fade 0.8s ease-out forwards;
      position: relative;
    }

    .dune .animate-complete-task::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      margin-top: -2px;
      background: transparent;
      animation: dune-sand-drift 0.8s ease-in forwards;
    }
  `
};
