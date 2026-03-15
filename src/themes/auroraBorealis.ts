import { ThemeDefinition } from '../themeTypes';

export const auroraBorealis: ThemeDefinition = {
  id: 'aurora-borealis',
  name: 'Aurora Borealis',
  category: 'Atmospheric & Moody',
  font: "'Lora', serif",
  soundPack: 'digital',
  isLight: false,
  animations: {
    hover: {
      description: "The card's border cycles through the colors of the northern lights.",
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
    '--bkg': '#010818',
    '--surface': '#0B142B',
    '--surface-modal-bkg': '#0B142B',
    '--primary': '#4C0070',
    '--primary-focus': '#7E30E1',
    '--secondary': '#111C3A',
    '--text-primary': '#E2E8F0',
    '--text-secondary': '#94A3B8',
    '--accent': '#00FF7F',
    '--font-family-header': "'Lora', serif",
    '--font-family-body': "'Inter', sans-serif",
    '--border-radius': '0.75rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 10px 20px -5px rgba(0,0,0,0.5)',
    '--bkg-image': 'linear-gradient(180deg, rgba(1, 8, 24, 0) 0%, rgba(76, 0, 112, 0.2) 100%)',
    '--transition-duration': '400ms',
    '--header-text-shadow': '0 0 5px var(--accent)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    .aurora-borealis .theme-hover:hover:not(:disabled) {
      border-color: var(--accent);
      animation: aurora-glow 4s linear infinite;
    }
    @keyframes aurora-glow {
      0% { box-shadow: 0 0 10px var(--accent); }
      33% { box-shadow: 0 0 10px var(--primary-focus); }
      66% { box-shadow: 0 0 10px #00BFFF; }
      100% { box-shadow: 0 0 10px var(--accent); }
    }
  `
};