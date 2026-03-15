import { ThemeDefinition } from '../themeTypes';

export const superMario: ThemeDefinition = {
  id: 'super-mario',
  name: 'Super Mario',
  category: 'Gaming & Pop Culture',
  font: "'Fredoka One', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: 'playful',
    taskComplete: 'playful',
    suggestionAccept: 'playful',
    hover: {
      description: "The card hops up, like Mario jumping.",
    },
    enter: 'playful',
    viewTransition: 'playful',
    dismissTask: 'playful',
    levelUp: 'playful',
    progressBar: 'playful',
    inputField: 'playful',
    modal: 'playful',
    loadingState: 'playful',
    button: 'playful',
  },
  cssVariables: {
    '--bkg': '#5c94fc',
    '--surface': '#ffffff',
    '--surface-modal-bkg': '#ffffff',
    '--primary': '#e52521',
    '--primary-focus': '#ff4d4a',
    '--secondary': '#a0a0a0',
    '--text-primary': '#212121',
    '--text-secondary': '#606060',
    '--accent': '#fbd000',
    '--font-family-header': "'Fredoka One', sans-serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '1rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 5px 10px rgba(0,0,0,0.25)',
    '--bkg-image': 'linear-gradient(to bottom, #5c94fc, #a2c3ff)',
    '--transition-duration': '200ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
  },
  customCss: `
    .super-mario .theme-hover:hover:not(:disabled) {
      transform: translateY(-4px);
    }
    .super-mario.text-text-primary { color: var(--text-primary); }
    .super-mario.text-text-secondary { color: var(--text-secondary); }
  `
};