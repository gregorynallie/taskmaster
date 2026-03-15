import { ThemeDefinition } from '../themeTypes';

export const midnightLagoon: ThemeDefinition = {
  id: 'midnight-lagoon',
  name: 'Midnight Lagoon',
  category: 'Atmospheric & Moody',
  font: "'Montserrat', sans-serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    addTask: 'standard',
    taskComplete: 'standard',
    suggestionAccept: 'standard',
    hover: 'theme-specific',
    enter: 'standard',
  },
  cssVariables: {
    '--bkg': '#0A192F',
    '--surface': '#172A46',
    '--surface-modal-bkg': '#172A46',
    '--primary': '#00BFA5',
    '--primary-focus': '#1DE9B6',
    '--secondary': '#303C55',
    '--text-primary': '#E0F2F1',
    '--text-secondary': '#8892B0',
    '--accent': '#7E57C2',
    '--font-family-header': "'Montserrat', sans-serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.5rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 12px hsla(160, 100%, 37%, 0.2)',
    '--bkg-image': `linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), radial-gradient(circle at top left, hsla(245, 52%, 55%, 0.1), transparent 40%)`,
    '--transition-duration': '300ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.97)',
  },
  customCss: `
    .midnight-lagoon .theme-hover:hover:not(:disabled) {
      border-color: var(--primary);
      box-shadow: 0 0 12px var(--primary), inset 0 0 8px var(--accent);
    }
  `
};
