import { ThemeDefinition } from '../themeTypes';

export const zenGarden: ThemeDefinition = {
  id: 'zen-garden',
  name: 'Zen Garden',
  category: 'Atmospheric & Moody',
  font: "'Nunito', sans-serif",
  soundPack: 'organic',
  isLight: true,
  animations: {
    addTask: 'organic',
    taskComplete: 'organic',
    suggestionAccept: 'organic',
    hover: {
      description: "The card lifts up gently, with a calm blue accent border.",
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
    '--bkg': '#F5F1E9',
    '--surface': '#FCFBF8',
    '--surface-modal-bkg': '#FCFBF8',
    '--primary': '#8A9A5B',
    '--primary-focus': '#9baf69',
    '--secondary': '#D3D3D3',
    '--text-primary': '#4B4B4B',
    '--text-secondary': '#8D8D8D',
    '--accent': '#6096BA',
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Nunito', sans-serif",
    '--border-radius': '0.75rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 4px 10px -2px rgba(0,0,0,0.05)',
    '--bkg-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23D3D3D3' fill-opacity='0.1'%3E%3Cpath d='M-100 50C-100 22.386 0 22.386 0 50s-100 27.614-100 0S0 22.386 0 50zm100 0C100 22.386 200 22.386 200 50s100 27.614 100 0-100-27.614-100 0z'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '400ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    .zen-garden .theme-hover:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px -3px rgba(0,0,0,0.07);
      border-color: var(--accent);
    }
  `
};
