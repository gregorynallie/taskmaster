import { ThemeDefinition } from '../themeTypes';

export const sonic: ThemeDefinition = {
  id: 'sonic',
  name: 'Sonic Speed',
  category: 'Gaming & Pop Culture',
  font: "'Montserrat', sans-serif",
  soundPack: 'vibrant',
  isLight: true,
  animations: {
    addTask: 'pop',
    taskComplete: 'pop',
    suggestionAccept: 'pop',
    hover: {
      description: "The card 'dashes' forward with a quick, blurry animation.",
    },
    enter: 'pop',
    viewTransition: 'pop',
    dismissTask: 'pop',
    levelUp: 'pop',
    progressBar: 'pop',
    inputField: 'pop',
    modal: 'pop',
    loadingState: 'pop',
    button: 'pop',
  },
  cssVariables: {
    '--bkg': '#FFFFFF',
    '--surface': '#F0F4FF',
    '--surface-modal-bkg': '#FFFFFF',
    '--primary': '#005BEA',
    '--primary-focus': '#3385FF',
    '--secondary': '#E0E0E0',
    '--text-primary': '#001F3D',
    '--text-secondary': '#6A7A8A',
    '--accent': '#FF2B2B',
    '--font-family-header': "'Montserrat', sans-serif",
    '--font-family-body': "'Montserrat', sans-serif",
    '--border-radius': '0.75rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 4px 10px rgba(0, 91, 234, 0.1)',
    '--bkg-image': `linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.1'%3E%3Cpath d='M-100 50L0 150L100 50L0 -50z' fill='%23005BEA'/%3E%3C/g%3E%3C/svg%3E")`,
    '--transition-duration': '100ms',
    '--header-text-shadow': 'none',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.9)',
  },
  customCss: `
    .sonic .theme-hover:hover:not(:disabled) {
      animation: sonic-dash 0.2s ease-out forwards;
    }
    .sonic h1, .sonic h2, .sonic h3, .sonic h4 {
      font-style: italic;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--primary);
    }
    .sonic .border-t {
      border-top-width: 2px;
      border-image: linear-gradient(to right, transparent, var(--accent), transparent) 1;
    }
    .sonic .skeleton-loader.skeleton-theme-specific .skeleton-line {
      background: linear-gradient(90deg, var(--accent), var(--primary), var(--accent));
      background-size: 200% 100%;
      animation: sonic-pulse 0.5s linear infinite;
    }
    @keyframes sonic-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes sonic-dash {
      0% { transform: scale(1); filter: blur(0); }
      50% { transform: scale(1.08); filter: blur(1px); }
      100% { transform: scale(1.03); filter: blur(0); }
    }
  `
};
