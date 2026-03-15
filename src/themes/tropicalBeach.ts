import { ThemeDefinition } from '../themeTypes';

export const tropicalBeach: ThemeDefinition = {
  id: 'tropical-beach',
  name: 'Tropical Beach',
  category: 'Light & Playful',
  font: "'Poppins', sans-serif",
  soundPack: 'playful',
  isLight: true,
  animations: {
    addTask: 'organic',
    taskComplete: 'organic',
    suggestionAccept: 'organic',
    hover: {
      description: "The card lifts up with a warm coral-colored shadow.",
    },
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
    '--bkg': '#F0EAD6',
    '--surface': '#FFFFFF',
    '--surface-modal-bkg': '#FFFFFF',
    '--primary': '#40E0D0',
    '--primary-focus': '#48D1CC',
    '--secondary': '#FAD2B4',
    '--text-primary': '#5D4037',
    '--text-secondary': '#A1887F',
    '--accent': '#FF7F50',
    '--font-family-header': "'Poppins', sans-serif",
    '--font-family-body': "'Poppins', sans-serif",
    '--border-radius': '0.75rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 5px 10px rgba(93, 64, 55, 0.1)',
    '--bkg-image': `radial-gradient(ellipse at bottom, #FAD2B4, transparent 60%)`,
    '--transition-duration': '250ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(4px)',
  },
  customCss: `
    .tropical-beach .theme-hover:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.01);
      box-shadow: 0 10px 15px -5px rgba(255, 127, 80, 0.2);
      border-color: var(--accent);
    }
  `
};
