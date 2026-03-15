import { ThemeDefinition } from '../themeTypes';

export const synthwave: ThemeDefinition = {
  id: 'synthwave',
  name: 'Synthwave',
  category: 'Retro & Pixelated',
  font: "'Orbitron', sans-serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    addTask: 'retro',
    taskComplete: 'retro',
    suggestionAccept: 'retro',
    hover: {
      description: "The card's shadow pulses between neon pink and cyan.",
    },
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
    '--bkg': '#1A1A3D',
    '--surface': '#22224b',
    '--surface-modal-bkg': 'rgba(34, 34, 75, 0.8)',
    '--primary': '#FF00FF',
    '--primary-focus': '#ff4dff',
    '--secondary': '#3d3d6b',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#d9d9ff',
    '--accent': '#00FFFF',
    '--font-family-header': "'Orbitron', sans-serif",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0.375rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 12px hsla(300, 100%, 50%, 0.4)',
    '--bkg-image': `linear-gradient(rgba(26, 26, 61, 0.9), rgba(26, 26, 61, 0.9)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23FF00FF' stop-opacity='0.1'/%3E%3Cstop offset='100%25' stop-color='%2300FFFF' stop-opacity='0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23g)'/%3E%3Cg fill-opacity='0.2'%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%2300FFFF' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': '0 0 6px var(--primary)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    .synthwave .theme-hover:hover:not(:disabled) {
      animation: synthwave-glow 2s infinite ease-in-out;
      border-color: var(--accent);
    }
    @keyframes synthwave-glow {
      0% { box-shadow: 0 0 8px var(--primary); }
      50% { box-shadow: 0 0 20px var(--accent); }
      100% { box-shadow: 0 0 8px var(--primary); }
    }
  `
};
