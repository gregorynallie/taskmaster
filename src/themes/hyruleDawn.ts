import { ThemeDefinition } from '../themeTypes';

export const hyruleDawn: ThemeDefinition = {
  id: 'hyrule-dawn',
  name: 'Hyrule Dawn',
  category: 'Gaming & Pop Culture',
  font: "'Lora', serif",
  soundPack: 'organic',
  isLight: false,
  animations: {
    hover: {
      description: "The card's border glows with a golden Triforce energy.",
    },
    addTask: 'organic',
    taskComplete: 'organic',
    suggestionAccept: 'organic',
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
    '--bkg': '#1a2e24',
    '--surface': '#2f483b',
    '--surface-modal-bkg': 'rgba(47, 72, 59, 0.8)',
    '--primary': '#2e8b57',
    '--primary-focus': '#3cb371',
    '--secondary': '#4a3b2a',
    '--text-primary': '#f0e6d2',
    '--text-secondary': '#a09d99',
    '--accent': '#ffd700',
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.375rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 8px hsla(51, 100%, 50%, 0.2)',
    '--bkg-image': `linear-gradient(rgba(26, 46, 36, 0.85), rgba(26, 46, 36, 0.85)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffd700' fill-opacity='0.05'%3E%3Cpath d='M0 40L20 0l20 40H0zm20-10L10 40h20L20 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': '1px 1px 2px rgba(0,0,0,0.4)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'translateY(5px)',
  },
  customCss: `
    .hyrule-dawn .theme-hover:hover:not(:disabled) {
      transform: translateY(-2px);
      border-color: var(--accent);
      box-shadow: 0 0 10px var(--accent);
    }
  `
};
