import { ThemeDefinition } from '../themeTypes';

export const modernMinimal: ThemeDefinition = {
  id: 'modern-minimal',
  name: 'Modern Minimal',
  category: 'Core Experiences',
  font: "'Poppins', sans-serif",
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
    viewTransition: 'standard',
    dismissTask: 'standard',
    levelUp: 'minimal',
    progressBar: 'minimal',
    inputField: 'minimal',
    modal: 'minimal',
    loadingState: 'minimal',
    button: 'minimal',
  },
  cssVariables: {
    '--bkg': '#f9fafb',
    '--surface': '#ffffff',
    '--surface-modal-bkg': '#ffffff',
    '--primary': '#f97316',
    '--primary-focus': '#fb923c',
    '--secondary': '#e5e7eb',
    '--text-primary': '#111827',
    '--text-secondary': '#6b7280',
    '--accent': '#3b82f6',
    '--font-family-header': "'Poppins', sans-serif",
    '--font-family-body': "'Poppins', sans-serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '1px',
    '--card-shadow': 'none',
    '--bkg-image': 'none',
    '--transition-duration': '150ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-in',
    '--animation-transform-enter': 'translateY(0)',
  },
  customCss: `
    .modern-minimal .theme-hover:hover:not(:disabled) {
      border-color: var(--primary);
      background-color: #fcfcfc;
    }
  `
};