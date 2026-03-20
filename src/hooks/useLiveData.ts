// src/hooks/useLiveData.ts
import { useState, useEffect, useCallback } from 'react';
import type { LiveSessionData, SessionState } from '../types/live-session';
import fallbackData from '../data/live-session.json';

const LOCAL_URL = 'http://127.0.0.1:3847/live-session.json';
const GITHUB_URL = 'https://raw.githubusercontent.com/socraticstatic/Wow_Balance/main/src/data/live-session.json';
const LOCAL_POLL_MS = 3000;
const REMOTE_POLL_MS = 60000;

export function useLiveData() {
  const [data, setData] = useState<LiveSessionData>(fallbackData as unknown as LiveSessionData);
  const [isLocal, setIsLocal] = useState(false);
  const [lastCheck, setLastCheck] = useState(Date.now());
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:3847/health', { mode: 'cors' })
      .then(r => r.ok && setIsLocal(true))
      .catch(() => setIsLocal(false));
  }, []);

  const fetchLive = useCallback(async () => {
    const url = isLocal
      ? LOCAL_URL
      : `${GITHUB_URL}?t=${Date.now()}`;

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.lastUpdate && (!data?.lastUpdate || json.lastUpdate > data.lastUpdate)) {
          setData(json);
        }
      }
    } catch {
      if (isLocal) {
        try {
          const res = await fetch(`${GITHUB_URL}?t=${Date.now()}`, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (json.lastUpdate > (data?.lastUpdate || '')) setData(json);
          }
        } catch { /* silent */ }
      }
    }
    setLastCheck(Date.now());
  }, [data?.lastUpdate, isLocal]);

  useEffect(() => {
    if (!polling) return;
    fetchLive();
    const interval = isLocal ? LOCAL_POLL_MS : REMOTE_POLL_MS;
    const id = setInterval(fetchLive, interval);
    return () => clearInterval(id);
  }, [fetchLive, polling, isLocal]);

  const sessionState: SessionState = (() => {
    if (!data?.lastUpdate) return 'pre';
    const age = Date.now() - new Date(data.lastUpdate).getTime();
    const fiveMin = 5 * 60 * 1000;
    const thirtyMin = 30 * 60 * 1000;
    if (age < fiveMin) return 'mid';
    if (age < thirtyMin) return 'post';
    return 'pre';
  })();

  return { data, isLocal, lastCheck, polling, setPolling, sessionState };
}
