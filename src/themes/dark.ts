import { ThemeDefinition } from '../themeTypes';

export const dark: ThemeDefinition = {
  id: 'dark',
  name: 'Default Dark',
  category: 'Core Experiences',
  font: "'Inter', sans-serif",
  soundPack: 'default',
  isLight: false,
  animations: {
    addTask: 'standard',
    taskComplete: 'standard',
    suggestionAccept: 'standard',
    hover: {
      description: "The card's border highlights and the background shifts slightly.",
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
    '--bkg': '#111827',
    '--surface': '#1f2937',
    '--surface-modal-bkg': '#1f2937',
    '--primary': '#3b82f6',
    '--primary-focus': '#60a5fa',
    '--secondary': '#374151',
    '--text-primary': '#E0E0E0',
    '--text-secondary': '#9ca3af',
    '--accent': '#9ca3af',
    '--font-family-header': "'Inter', sans-serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.5rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    '--bkg-image': 'none',
    '--transition-duration': '300ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(0) scale(0.98)',
  },
  customCss: `
    .dark .theme-hover:hover:not(:disabled) {
      border-color: var(--primary);
      background-color: var(--surface-modal-bkg);
    }
  `
};