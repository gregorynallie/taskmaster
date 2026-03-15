import { ThemeDefinition } from '../themeTypes';

export const forestGlow: ThemeDefinition = {
  id: 'forest-glow',
  name: 'Forest Glow',
  category: 'Atmospheric & Moody',
  font: "'Lora', serif",
  soundPack: 'organic',
  isLight: false,
  animations: {
    addTask: 'standard',
    taskComplete: 'standard',
    suggestionAccept: 'standard',
    hover: 'theme-specific',
    enter: 'standard',
  },
  cssVariables: {
    '--bkg': '#1a2e24',
    '--surface': '#243b31',
    '--surface-modal-bkg': '#243b31',
    '--primary': '#4CAF50',
    '--primary-focus': '#66BB6A',
    '--secondary': '#3b5249',
    '--text-primary': '#E8F5E9',
    '--text-secondary': '#a5d6a7',
    '--accent': '#FFC107',
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.5rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2)',
    '--bkg-image': 'none',
    '--transition-duration': '350ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(5px) scale(0.99)',
  },
  customCss: `
    .forest-glow .theme-hover:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 25px 30px -10px rgba(0,0,0,0.4);
    }
  `
};
