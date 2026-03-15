import { ThemeDefinition } from '../themeTypes';

export const teamFortress2: ThemeDefinition = {
  id: 'team-fortress-2',
  name: 'Team Fortress 2',
  category: 'Gaming & Pop Culture',
  font: "'Oswald', sans-serif",
  soundPack: 'analog',
  isLight: true,
  animations: {
    addTask: 'pop',
    taskComplete: 'pop',
    suggestionAccept: 'pop',
    hover: {
      description: "The card pops out from the page with an increased hard shadow.",
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
    '--bkg': '#f0e6d2',
    '--surface': '#e8dcc5',
    '--surface-modal-bkg': '#e8dcc5',
    '--primary': '#b8383b',
    '--primary-focus': '#c8484b',
    '--secondary': '#4d4030',
    '--text-primary': '#3a332a',
    '--text-secondary': '#7a6a53',
    '--accent': '#5885a2',
    '--text-on-secondary-bkg': '#FFFFFF',
    '--font-family-header': "'Oswald', sans-serif",
    '--font-family-body': "'Source Sans Pro', sans-serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '3px',
    '--card-shadow': '4px 4px 0px var(--secondary)',
    '--bkg-image': `linear-gradient(rgba(240, 230, 210, 0.8), rgba(240, 230, 210, 0.8)), url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='tf2grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 0v20' stroke='%235885a2' stroke-width='0.5'/%3E%3Cpath d='M0 0h20' stroke='%235885a2' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23tf2grid)'/%3E%3C/svg%3E")`,
    '--transition-duration': '100ms',
    '--header-text-shadow': '2px 2px 0px rgba(0,0,0,0.1)',
    '--animation-timing-enter': 'ease-out',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    .team-fortress-2 .theme-hover:hover:not(:disabled) {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px var(--secondary);
    }
  `
};
