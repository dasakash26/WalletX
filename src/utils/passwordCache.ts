const CACHE_KEY = "wallet_password_cache";
const CACHE_DURATION = 10 * 60 * 1000;

interface PasswordCache {
  password: string;
  timestamp: number;
}

export const setCachedPassword = (password: string) => {
  const cache: PasswordCache = {
    password,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const getCachedPassword = (): string | null => {
  const cacheStr = localStorage.getItem(CACHE_KEY);
  if (!cacheStr) return null;

  const cache: PasswordCache = JSON.parse(cacheStr);
  const now = Date.now();

  if (now - cache.timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return cache.password;
};

export const clearCachedPassword = () => {
  localStorage.removeItem(CACHE_KEY);
};
