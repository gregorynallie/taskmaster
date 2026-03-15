import { ThemeDefinition } from '../themeTypes';

export const crtGlow: ThemeDefinition = {
  id: 'crt-glow',
  name: 'CRT Glow',
  category: 'Retro & Pixelated',
  font: "'Share Tech Mono', monospace",
  soundPack: 'analog',
  isLight: false,
  animations: {
    addTask: 'glitch',
    taskComplete: 'glitch',
    suggestionAccept: 'glitch',
    hover: 'glitch',
    enter: 'glitch',
    viewTransition: 'glitch',
    dismissTask: 'glitch',
    levelUp: 'glitch',
    progressBar: 'glitch',
    inputField: 'glitch',
    modal: 'glitch',
    loadingState: 'glitch',
    button: 'glitch',
  },
  cssVariables: {
    '--bkg': '#000000',
    '--surface': '#0a0a0a',
    '--surface-modal-bkg': 'rgba(10, 10, 10, 0.8)',
    '--primary': '#FFA500',
    '--primary-focus': '#ffc966',
    '--secondary': '#282828',
    '--text-primary': '#39FF14',
    '--text-secondary': '#28b40e',
    '--accent': '#8A2BE2',
    '--font-family-header': "'Share Tech Mono', monospace",
    '--font-family-body': "'Share Tech Mono', monospace",
    '--border-radius': '0px',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 10px hsla(99, 100%, 53%, 0.3)',
    '--bkg-image': 'none',
    '--transition-duration': '100ms',
    '--header-text-shadow': '0 0 8px var(--text-primary)',
    '--animation-timing-enter': 'linear',
    '--animation-transform-enter': 'translateY(0)',
  },
  customCss: `
    .crt-glow .theme-hover:hover:not(:disabled) {
      animation: crt-flicker 0.3s linear infinite;
    }
    .crt-glow * {
      text-shadow: 0 0 5px var(--text-primary);
    }
    .crt-glow body::after {
      content: ' ';
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      z-index: 100;
      background-size: 100% 4px, 4px 100%;
      pointer-events: none;
      animation: crt-scanline 15s linear infinite;
    }
    @keyframes crt-flicker {
      0%, 100% { text-shadow: 0 0 5px var(--text-primary), 0 0 2px var(--text-primary); opacity: 1; }
      50% { text-shadow: 0 0 8px var(--text-primary), 0 0 3px var(--text-primary); opacity: 0.9; }
    }
    @keyframes crt-scanline {
      0% { transform: translateY(0); }
      100% { transform: translateY(20px); }
    }
  `
};