import { ThemeDefinition } from '../themeTypes';

export const cell: ThemeDefinition = {
  id: 'cell',
  name: 'The Cell Games',
  category: 'Gaming & Pop Culture',
  font: "'Lora', serif",
  soundPack: 'organic',
  isLight: false,
  animations: {
    hover: {
      description: "The card pulses with a subtle, organic energy.",
    },
    addTask: 'organic',
    taskComplete: 'organic',
    suggestionAccept: 'organic',
    enter: 'organic',
    viewTransition: 'organic',
    dismissTask: 'organic',
    levelUp: 'organic',
    progressBar: 'organic',
    inputField: 'standard',
    modal: 'organic',
    loadingState: 'organic',
    button: 'organic',
  },
  cssVariables: {
    '--bkg': '#192c19',
    '--surface': '#284228',
    '--surface-modal-bkg': 'rgba(40, 66, 40, 0.8)',
    '--primary': '#8A2BE2',
    '--primary-focus': '#9932CC',
    '--secondary': '#111111',
    '--text-primary': '#d1e0d1',
    '--text-secondary': '#8aa38a',
    '--accent': '#f97316',
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0.75rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 8px 15px rgba(0,0,0,0.4)',
    '--bkg-image': `linear-gradient(rgba(25, 44, 25, 0.85), rgba(25, 44, 25, 0.85)), url("data:image/svg+xml,%3Csvg width='84' height='96' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='h' width='84' height='96' patternUnits='userSpaceOnUse'%3E%3Cg fill='%238A2BE2' fill-opacity='0.1'%3E%3Cpath d='M21 0v12L0 30v36l21 18v12h42v-12l21-18V30L63 12V0z'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23h)'/%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    .cell .theme-hover:hover:not(:disabled) {
      animation: cell-pulse 3s infinite ease-in-out;
      border-color: var(--accent);
    }
    @keyframes cell-pulse {
      0% { transform: scale(1); box-shadow: 0 8px 15px rgba(0,0,0,0.4); }
      50% { transform: scale(1.01); box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
      100% { transform: scale(1); box-shadow: 0 8px 15px rgba(0,0,0,0.4); }
    }
  `
};