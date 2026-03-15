import { ThemeDefinition } from '../themeTypes';

export const warmEmber: ThemeDefinition = {
  id: 'warm-ember',
  name: 'Warm Ember',
  category: 'Atmospheric & Moody',
  font: "'Lora', serif",
  soundPack: 'organic',
  isLight: false,
  animations: {
    addTask: 'organic',
    taskComplete: 'organic',
    suggestionAccept: 'organic',
    hover: {
      description: "The card's border glows with the warmth of an ember.",
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
    '--bkg': '#1c1a1a',
    '--surface': '#2e2a2a',
    '--surface-modal-bkg': '#2e2a2a',
    '--primary': '#E57C23',
    '--primary-focus': '#F89A4B',
    '--secondary': '#4d4444',
    '--text-primary': '#FDF5E6',
    '--text-secondary': '#a39a8c',
    '--accent': '#FFD700',
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.375rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 10px 15px -3px rgba(229, 124, 35, 0.1), 0 4px 6px -4px rgba(229, 124, 35, 0.1)',
    '--bkg-image': `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.04'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '350ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(8px)',
  },
  customCss: `
    .warm-ember .theme-hover:hover:not(:disabled) {
      border-color: var(--accent);
      box-shadow: 0 0 10px var(--primary);
    }
  `
};