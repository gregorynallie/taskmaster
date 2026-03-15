import { ThemeDefinition } from '../themeTypes';

export const windows95: ThemeDefinition = {
  id: 'windows-95',
  name: 'Windows 95',
  category: 'Retro & Pixelated',
  font: "'Share Tech Mono', monospace",
  soundPack: 'analog',
  isLight: true,
  animations: {
    addTask: 'retro',
    taskComplete: 'theme-specific',
    suggestionAccept: 'retro',
    hover: 'theme-specific',
    enter: 'retro',
    viewTransition: 'retro',
    dismissTask: 'retro',
    levelUp: 'retro',
    progressBar: 'retro',
    inputField: 'retro',
    modal: 'retro',
    loadingState: 'retro',
    button: 'retro',
  },
  cssVariables: {
    '--bkg': '#008080', // Classic Teal Desktop
    '--surface': '#C0C0C0', // Windows Gray
    '--surface-modal-bkg': '#C0C0C0',
    '--primary': '#000080', // Title Bar Blue
    '--primary-focus': '#0000A0',
    '--secondary': '#808080', // Darker Gray Shadow
    '--text-primary': '#000000',
    '--text-secondary': '#404040',
    '--accent': '#00FF00', // Neon Green (for fun)
    '--text-on-secondary-bkg': '#000000',
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0px',
    '--card-border-width': '0px', // Borders handled by box-shadow/border properties
    '--card-shadow': 'none', // Shadow handled by borders
    '--bkg-image': 'none',
    '--transition-duration': '100ms',
    '--header-text-shadow': 'none',
  },
  customCss: `
    @keyframes win95-shutdown-content {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.8); }
    }
    
    @keyframes win95-shutdown-card {
      0% { transform: scaleY(1); }
      80% { transform: scaleY(0.02); }
      100% { transform: scaleY(0.02); opacity: 0; }
    }

    @keyframes win95-shutdown-line {
      0% { opacity: 1; width: 80%; box-shadow: 0 0 10px #fff, 0 0 20px #fff; }
      100% { opacity: 1; width: 0%; box-shadow: 0 0 10px #fff, 0 0 20px #fff; }
    }
    
    .windows-95 button, .windows-95 [data-task-id], .windows-95 .bg-surface, .windows-95 .bg-surface-modal-bkg {
      border: 2px solid;
      border-color: #DFDFDF #808080 #808080 #DFDFDF;
      box-shadow: 1px 1px 0 1px #000;
    }

    .windows-95 .theme-hover:hover:not(:disabled) {
      background-color: #dcdcdc;
    }
    
    .windows-95 .theme-hover:active:not(:disabled) {
      border-color: #808080 #DFDFDF #DFDFDF #808080;
      box-shadow: none;
      transform: translate(2px, 2px);
    }

    /* Target the container for the task card's title and actions */
    .windows-95 [data-task-id] .flex-1.min-w-0 {
      border: 2px solid;
      border-color: #808080 #DFDFDF #DFDFDF #808080;
      padding: 0.5rem;
    }
    
    /* Create the classic title bar */
    .windows-95 [data-task-id] p.font-bold:not(.line-through) {
      background-color: var(--primary);
      color: white;
      padding: 2px 6px;
      margin: -0.5rem -0.5rem 0.5rem -0.5rem;
      display: block;
    }

    .windows-95 .animate-complete-task {
      animation: win95-shutdown-card 0.5s ease-in forwards;
      position: relative;
    }
    
    .windows-95 .animate-complete-task > * {
        animation: win95-shutdown-content 0.2s linear forwards;
    }

    .windows-95 .animate-complete-task::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 0%;
        height: 3px;
        background: #fff;
        animation: win95-shutdown-line 0.3s ease-out 0.2s forwards;
    }

    .windows-95 * {
        image-rendering: pixelated; /* Sharp, retro text */
    }

    /* Force rounded elements to be square */
    .windows-95 .rounded-full, .windows-95 .rounded-lg, .windows-95 .rounded-md {
        border-radius: 0 !important;
    }
  `
};