import { ThemeDefinition } from '../themeTypes';

export const noirGold: ThemeDefinition = {
  id: 'noir-gold',
  name: 'Noir & Gold',
  category: 'Atmospheric & Moody',
  font: "'Playfair Display', serif",
  soundPack: 'luxe',
  isLight: false,
  animations: {
    addTask: 'cinematic',
    taskComplete: 'cinematic',
    suggestionAccept: 'cinematic',
    hover: {
      description: "The card's border and shadow glow with a rich golden light.",
    },
    enter: 'cinematic',
    viewTransition: 'cinematic',
    dismissTask: 'cinematic',
    levelUp: 'cinematic',
    progressBar: 'cinematic',
    inputField: 'standard',
    modal: 'cinematic',
    loadingState: 'cinematic',
    button: 'cinematic',
  },
  cssVariables: {
    '--bkg': '#101010',
    '--surface': '#181818',
    '--surface-modal-bkg': '#181818',
    '--primary': '#D4AF37',
    '--primary-focus': '#e7c873',
    '--secondary': '#282828',
    '--text-primary': '#e8e6e3',
    '--text-secondary': '#a09d99',
    '--accent': '#f0f0f0',
    '--font-family-header': "'Playfair Display', serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.375rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 2px 10px rgba(0,0,0,0.6)',
    '--bkg-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.05'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '400ms',
    '--header-text-shadow': '0 1px 2px rgba(0,0,0,0.5)',
    '--animation-timing-enter': 'ease-in-out',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    .noir-gold .theme-hover:hover:not(:disabled) {
      border-color: var(--primary);
      box-shadow: 0 0 10px var(--primary);
    }
  `
};
