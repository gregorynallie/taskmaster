// This file contains placeholder Base64 encoded audio data URIs.
// These are silent audio clips, but they allow the sound system to function.
// In a real application, these would be replaced with actual sound files.

// Use a valid, minimal WAV file for silence to ensure cross-browser compatibility and prevent loading errors.
const SILENT_AUDIO = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

export const SOUND_PACKS = {
  default: {
    complete: SILENT_AUDIO,
    add: SILENT_AUDIO,
    dismiss: SILENT_AUDIO,
    shuffle: SILENT_AUDIO,
  },
  digital: {
    complete: SILENT_AUDIO,
    add: SILENT_AUDIO,
    dismiss: SILENT_AUDIO,
    shuffle: SILENT_AUDIO,
  },
  organic: {
    complete: SILENT_AUDIO,
    add: SILENT_AUDIO,
    dismiss: SILENT_AUDIO,
    shuffle: SILENT_AUDIO,
  },
  playful: {
    complete: SILENT_AUDIO,
    add: SILENT_AUDIO,
    dismiss: SILENT_AUDIO,
    shuffle: SILENT_AUDIO,
  },
  minimal: {
    complete: SILENT_AUDIO,
    add: SILENT_AUDIO,
    dismiss: SILENT_AUDIO,
    shuffle: SILENT_AUDIO,
  },
  kawaii: {
    complete: SILENT_AUDIO,
    add: SILENT_AUDIO,
    dismiss: SILENT_AUDIO,
    shuffle: SILENT_AUDIO,
  },
  luxe: {
    complete: SILENT_AUDIO,
    add: SILENT_AUDIO,
    dismiss: SILENT_AUDIO,
    shuffle: SILENT_AUDIO,
  },
  analog: {
    complete: SILENT_AUDIO,
    add: SILENT_AUDIO,
    dismiss: SILENT_AUDIO,
    shuffle: SILENT_AUDIO,
  },
  vibrant: {
    complete: SILENT_AUDIO,
    add: SILENT_AUDIO,
    dismiss: SILENT_AUDIO,
    shuffle: SILENT_AUDIO,
  },
};

export type SoundName = keyof (typeof SOUND_PACKS)['default'];