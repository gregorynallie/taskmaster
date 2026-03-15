import { ThemeDefinition } from '../themeTypes';

export const runescapeClassic: ThemeDefinition = {
  id: 'runescape-classic',
  name: 'RuneScape Classic',
  category: 'Gaming & Pop Culture',
  font: "'Merriweather', serif",
  soundPack: 'analog',
  isLight: false,
  animations: {
    addTask: 'retro',
    taskComplete: 'retro',
    suggestionAccept: 'retro',
    hover: {
      description: "The card's border glows with a bronze accent.",
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
    '--bkg': '#3d3d3d',
    '--surface': '#4d4d4d',
    '--surface-modal-bkg': '#434d55',
    '--primary': '#008000',
    '--primary-focus': '#00a000',
    '--secondary': '#5d4037',
    '--text-primary': '#EAE0D5',
    '--text-secondary': '#B0A494',
    '--accent': '#CD7F32',
    '--font-family-header': "'Special Elite', monospace",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.125rem',
    '--card-border-width': '2px',
    '--card-shadow': '2px 2px 5px rgba(0,0,0,0.4)',
    '--bkg-image': `linear-gradient(rgba(61, 61, 61, 0.85), rgba(61, 61, 61, 0.85)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.1' d='M0 2h2V0h2v4H0V2zm0 2h2V2h2v2H0V4z'/%3E%3C/svg%3E")`,
    '--transition-duration': '150ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.7)',
    '--animation-timing-enter': 'ease-in',
    '--animation-transform-enter': 'translateY(1px)',
  },
  customCss: `
    .runescape-classic .theme-hover:hover:not(:disabled) {
      border-color: var(--accent);
      box-shadow: 0 0 5px var(--accent);
      background-color: var(--surface-modal-bkg);
    }
  `
};
