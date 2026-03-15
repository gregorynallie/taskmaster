import { ThemeDefinition } from '../themeTypes';

export const solarFlare: ThemeDefinition = {
  id: 'solar-flare',
  name: 'Solar Flare',
  category: 'Vibrant & Energetic',
  font: "'Oswald', sans-serif",
  soundPack: 'vibrant',
  isLight: false,
  animations: {
    addTask: 'cinematic',
    taskComplete: 'cinematic',
    suggestionAccept: 'cinematic',
    hover: {
      description: "The card's shadow pulses with yellow and orange energy.",
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
    '--bkg': '#0C0C0C',
    '--surface': '#1A1A1A',
    '--surface-modal-bkg': '#1A1A1A',
    '--primary': '#FFD600',
    '--primary-focus': '#FFEA00',
    '--secondary': '#333333',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#A0A0A0',
    '--accent': '#FF4500',
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.125rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 0 10px hsla(51, 100%, 50%, 0.4)',
    '--bkg-image': 'radial-gradient(ellipse at center, rgba(255, 69, 0, 0.15), transparent 70%)',
    '--transition-duration': '200ms',
    '--header-text-shadow': '0 0 8px var(--accent)',
    '--animation-timing-enter': 'ease-in-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    .solar-flare .theme-hover:hover:not(:disabled) {
      animation: solar-flare-pulse 1.5s infinite ease-in-out;
      border-color: var(--accent);
    }
    @keyframes solar-flare-pulse {
      0% { box-shadow: 0 0 8px var(--primary); }
      50% { box-shadow: 0 0 18px var(--accent); }
      100% { box-shadow: 0 0 8px var(--primary); }
    }
  `
};
