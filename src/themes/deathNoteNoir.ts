import { ThemeDefinition } from '../themeTypes';

export const deathNoteNoir: ThemeDefinition = {
  id: 'death-note-noir',
  name: 'Death Note Noir',
  category: 'Gaming & Pop Culture',
  font: "'Playfair Display', serif",
  soundPack: 'luxe',
  isLight: false,
  animations: {
    addTask: 'cinematic',
    taskComplete: 'cinematic',
    suggestionAccept: 'cinematic',
    hover: 'standard',
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
    '--bkg': '#121212',
    '--surface': '#1E1E1E',
    '--surface-modal-bkg': '#2a2a2a',
    '--primary': '#8B0000',
    '--primary-focus': '#B22222',
    '--secondary': '#333333',
    '--text-primary': '#F5F5DC',
    '--text-secondary': '#C5C5AC',
    '--accent': '#8B0000',
    '--font-family-header': "'Special Elite', monospace",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '1px',
    '--card-shadow': '0 4px 12px rgba(0, 0, 0, 0.5)',
    '--bkg-image': `linear-gradient(rgba(18, 18, 18, 0.9), rgba(18, 18, 18, 0.9)), url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAXRJREFUaAXt1rFKA0EUxvF3P4gIeithY6toYeUPDLYWgo2thZWgpY2NjaWFb3AJ2ikWNoqNkFhYCESwEEPwE8vN/CTDybx5m9mZu0HhG/u5P/vPZubNMAzDED/E/lI//d+y3901S/IuLwU5yylLsnwZ5N0i8T/zE9b2/Kq8m2f8EkoS/Nme0H2wB7SffMflz4fH328wz/K6xSAdc9oEF8EWcAxu8cES0O64zV2d6wF3Xg2cO4E0sL0y0wFmZ2Z/Yk/gGWCJLIGb+M2/gH9R/xUXcBTcQh+Bf+D/A6e+D18wL14xVwG2E2XgJb/XQ/w2yGfA/8t/s/w7/N/hs/k/2v+H62J/nU7/T6uN/p/l/5J/u/1a3K/rS/3c6P8J/s90Wn+f1iS/Z6qN/h9Lk/yfqzb6fS1J/s/Vi30+lCT/Z7bB/n3+r/B9/n/R/5V+z/2f+C/sT3x/zJ9f/p/k7fX/bf4D/o/6O/Gf+L/g6/z/7H/L/Av9V/R/5n/i/4ev8/+x/yP9V/Bf5g/z/wdf5/9j/kf4r+C/yB/n/g6/z/7H/I/1X8F/kD/P/B1/n/2P+R/iv4L/IH+f+Dr/P/sf8j/VfwX+QP8v8HX+f/Y/9H+q/gv8gf5P8Ov8/+x/6P9F/Bf5A/yP8dfJ/9j/0f6b+C/CB/k/g6/z/7H/o/0X8V/kC/K/B18A232/xv/V/q/o/8n/1f7v5O0D/wW+73d5m/v/f3d2fHxmP4f/b2/Fz+APuIUbIAb2gP/w/gNnZb4B3Xn4kH1w1b0b4wDe4gzfBFnAM/iT/AX8A/3d+Bv6D80d2Y0gQ/gAAAABJRU5ErkJggg==")`,
    '--transition-duration': '300ms',
    '--header-text-shadow': '1px 1px 3px rgba(0,0,0,0.5)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.98)',
  },
  customCss: `
    .death-note-noir .theme-hover:hover:not(:disabled) {
      background-color: #2a2a2a;
      border-color: var(--primary);
      box-shadow: 0 0 8px var(--primary);
    }
  `
};