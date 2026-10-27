import type { PublicConfig } from '@/types/publicConfig';

// Holds the runtime config fetched from the server. Kept separate from config.ts so the page can load it before
// importing the app; config.ts (and everything that imports it) must only be evaluated after loadPublicConfig().

let loadedConfig: PublicConfig | null = null;

export const loadPublicConfig = async (): Promise<void> => {
  const res = await fetch('/public/config.json');
  if (!res.ok) throw new Error(`Failed to load /public/config.json: ${res.status} ${res.statusText}`);
  loadedConfig = await res.json();
};

export const getLoadedPublicConfig = (): PublicConfig => {
  if (!loadedConfig) throw new Error('Public config was read before loadPublicConfig() finished');
  return loadedConfig;
};
