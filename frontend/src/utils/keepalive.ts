/**
 * keepAlive.ts
 *
 * Pings the backend health endpoint every 14 minutes to prevent Render's
 * free tier from putting the service to sleep (it sleeps after 15 min idle).
 *
 * Called once from main.tsx on app load.
 */
const BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

export const startKeepAlive = () => {
  if (import.meta.env.DEV) return; // only run in production

  const ping = () => {
    fetch(`${BACKEND}/health`, { method: 'GET' })
      .then(() => console.debug('[keepAlive] backend pinged'))
      .catch(() => {}); // silent — don't surface errors to the user
  };

  // Ping immediately on load, then every 14 min
  ping();
  setInterval(ping, INTERVAL_MS);
};