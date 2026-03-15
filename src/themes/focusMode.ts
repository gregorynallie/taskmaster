import { ThemeDefinition } from '../themeTypes';

export const focusMode: ThemeDefinition = {
  id: 'focus-mode',
  name: 'Focus Mode',
  category: 'Elegant & Focused',
  font: "'Inter', sans-serif",
  soundPack: 'minimal',
  isLight: true,
  animations: {
    addTask: 'standard',
    taskComplete: 'standard',
    suggestionAccept: 'standard',
    hover: {
      description: "The card's border highlights with the primary color.",
    },
    enter: 'standard',
  },
  cssVariables: {
    '--bkg': '#f8f9fa',
    '--surface': '#ffffff',
    '--surface-modal-bkg': '#ffffff',
    '--primary': '#007BFF',
    '--primary-focus': '#3395ff',
    '--secondary': '#dee2e6',
    '--text-primary': '#212529',
    '--text-secondary': '#6c757d',
    '--accent': '#007BFF',
    '--font-family-header': "'Inter', sans-serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.375rem',
    '--card-border-width': '1px',
    '--card-shadow': 'none',
    '--bkg-image': 'none',
    '--transition-duration': '150ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-in',
    '--animation-transform-enter': 'translateY(0)',
  },
  customCss: `
    .focus-mode .theme-hover:hover:not(:disabled) {
      border-color: var(--primary);
      background-color: var(--surface);
    }
    .focus-mode [class*="border-"] {
      border-color: var(--secondary) !important;
    }
    .focus-mode .bg-primary {
      color: white;
    }
  `
};
