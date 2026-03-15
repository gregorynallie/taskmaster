import { ThemeDefinition } from '../themeTypes';

export const scholarsDesk: ThemeDefinition = {
  id: 'scholars-desk',
  name: "Scholar's Desk",
  category: 'Elegant & Focused',
  font: "'Special Elite', monospace",
  soundPack: 'analog',
  isLight: true,
  animations: {
    addTask: 'minimal',
    taskComplete: 'minimal',
    suggestionAccept: 'minimal',
    hover: {
      description: "The card's shadow increases and the border highlights, as if being examined.",
    },
    enter: 'minimal',
    viewTransition: 'minimal',
    dismissTask: 'minimal',
    levelUp: 'minimal',
    progressBar: 'minimal',
    inputField: 'standard',
    modal: 'minimal',
    loadingState: 'minimal',
    button: 'minimal',
  },
  cssVariables: {
    '--bkg': '#F5F5DC',
    '--surface': '#ffffff',
    '--surface-modal-bkg': '#ffffff',
    '--primary': '#8B0000',
    '--primary-focus': '#a52a2a',
    '--secondary': '#dcdcdc',
    '--text-primary': '#3d3b38',
    '--text-secondary': '#706b64',
    '--accent': '#004e92',
    '--font-family-header': "'Special Elite', monospace",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.125rem',
    '--card-border-width': '1px',
    '--card-shadow': '2px 2px 5px rgba(0,0,0,0.2)',
    '--bkg-image': `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAXRJREFUaAXt1rFKA0EUxvF3P4gIeithY6toYeUPDLYWgo2thZWgpY2NjaWFb3AJ2ikWNoqNkFhYCESwEEPwE8vN/CTDybx5m9mZu0HhG/u5P/vPZubNMAzDED/E/lI//d+y3901S/IuLwU5yylLsnwZ5N0i8T/zE9b2/Kq8m2f8EkoS/Nme0H2wB7SffMflz4fH328wz/K6xSAdc9oEF8EWcAxu8cES0O64zV2d6wF3Xg2cO4E0sL0y0wFmZ2Z/Yk/gGWCJLIGb+M2/gH9R/xUXcBTcQh+Bf+D/A6e+D18wL14xVwG2E2XgJb/XQ/w2yGfA/8t/s/w7/N/hs/k/2v+H62J/nU7/T6uN/p/l/5J/u/1a3K/rS/3c6P8J/s90Wn+f1iS/Z6qN/h9Lk/yfqzb6fS1J/s/Vi30+lCT/Z7bB/n3+r/B9/n/R/5V+z/2f+C/sT3x/zJ9f/p/k7fX/bf4D/o/6O/Gf+L/g6/z/7H/L/Av9V/R/5n/i/4ev8/+x/yP9V/Bf5g/z/wdf5/9j/kf4r+C/yB/n/g6/z/7H/I/1X8F/kD/P/B1/n/2P+R/iv4L/IH+f+Dr/P/sf8j/VfwX+QP8v8HX+f/Y/9H+q/gv8gf5P8Ov8/+x/6P9F/Bf5A/yP8dfJ/9j/0f6b+C/CB/k/g6/z/7H/o/0X8V/kC/K/B18A232/xv/V/q/o/8n/1f7v5O0D/wW+73d5m/v/f3d2fHxmP4f/b2/Fz+APuIUbIAb2gP/w/gNnZb4B3Xn4kH1w1b0b4wDe4gzfBFnAM/iT/AX8A/3d+Bv6D80d2Y0gQ/gAAAABJRU5ErkJggg==")`,
    '--transition-duration': '200ms',
    '--header-text-shadow': '1px 1px 1px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'ease-in',
    '--animation-transform-enter': 'translateY(2px)',
  },
  customCss: `
    .scholars-desk .theme-hover:hover:not(:disabled) {
      box-shadow: 3px 3px 8px rgba(0,0,0,0.25);
      border-color: var(--accent);
    }
  `
};
