import { ThemeDefinition } from '../themeTypes';

export const majorasMask: ThemeDefinition = {
  id: 'majoras-mask',
  name: "Majora's Mask",
  category: 'Gaming & Pop Culture',
  font: "'Playfair Display', serif",
  soundPack: 'organic',
  isLight: false,
  animations: {
    taskComplete: {
      className: 'animate-complete-task',
      description: "A flash of golden light appears before the task disappears, as if a song was played.",
    },
    hover: {
        description: "The card spins and skews menacingly, glowing with a golden light.",
    },
    addTask: 'cinematic',
    suggestionAccept: 'cinematic',
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
    '--bkg': '#110D1A', // Deep purple night sky
    '--surface': '#211A30', // Darker surface
    '--surface-modal-bkg': 'rgba(33, 26, 48, 0.85)',
    '--primary': '#5E2E91', // Majora's Mask Purple
    '--primary-focus': '#7438B5',
    '--secondary': '#43A047', // Nightmare Green
    '--text-primary': '#E8E0D1', // Aged parchment
    '--text-secondary': '#9386A8', // Muted purple-gray
    '--accent': '#FFD54F', // Clock Town Gold
    '--font-family-header': "'Playfair Display', serif",
    '--font-family-body': "'Merriweather', serif",
    '--border-radius': '0.25rem',
    '--card-border-width': '2px',
    '--card-shadow': '0 0 15px hsla(271, 51%, 37%, 0.5)',
    '--bkg-image': `radial-gradient(ellipse 30% 20% at 50% 0%, hsla(50, 100%, 65%, 0.1), transparent), 
                    linear-gradient(rgba(17, 13, 26, 0.9), rgba(17, 13, 26, 0.9)), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%235E2E91' fill-opacity='0.05'%3E%3Cpath d='M0 40L20 0l20 40H0zm20-10L10 40h20L20 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, // Looming moon glow + texture
    '--transition-duration': '350ms',
    '--header-text-shadow': '0 0 5px var(--accent)',
    '--animation-timing-enter': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    '--animation-transform-enter': 'scale(0.95)',
  },
  customCss: `
    @keyframes majora-spin-hover {
      0%, 100% { transform: scale(1) rotate(0) skew(0); }
      50% { transform: scale(1.05) rotate(2deg) skew(-5deg); }
    }

    @keyframes majora-song-of-time {
      0% { transform: scale(1); opacity: 1; }
      20% {
        transform: scale(1.05);
        background-color: hsla(50, 100%, 65%, 0.2);
        box-shadow: 0 0 20px var(--accent);
        border-color: var(--accent);
      }
      100% {
        transform: scale(0.8);
        opacity: 0;
      }
    }
    
    @keyframes bonfire-flicker {
      0%, 100% { box-shadow: 0 0 10px var(--primary), 3px 3px 6px rgba(0,0,0,0.6); transform: translate(0, 0); }
      20%, 60% { box-shadow: 0 0 15px var(--primary-focus), 3px 3px 6px rgba(0,0,0,0.6); }
      40% { transform: translate(-1px, 0); }
      80% { transform: translate(0, -1px); }
    }

    .majoras-mask .theme-hover:hover:not(:disabled) {
      animation: majora-spin-hover 0.5s ease-in-out, bonfire-flicker 2s infinite ease-in-out;
      border-color: var(--accent);
    }

    .majoras-mask .animate-complete-task {
      animation: majora-song-of-time 0.6s ease-out forwards;
    }
    
    .majoras-mask .skeleton-loader .skeleton-line {
      background-color: var(--secondary);
    }
  `
};
