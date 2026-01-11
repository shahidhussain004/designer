// Lightweight storage tracer for debugging unexpected localStorage clears
// This file monkey-patches localStorage.setItem and removeItem to log calls
// and a stack trace so we can identify the caller.
if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
  try {
    const origSet = localStorage.setItem.bind(localStorage);
    const origRemove = localStorage.removeItem.bind(localStorage);

    localStorage.setItem = function (key: string, value: string) {
      try {
        console.debug('[STORAGE-TRACER] setItem', key, value?.toString?.().slice(0, 80));
        console.trace();
      } catch (e) {
        // ignore
      }
      return origSet(key, value);
    } as typeof localStorage.setItem;

    localStorage.removeItem = function (key: string) {
      try {
        console.warn('[STORAGE-TRACER] removeItem', key);
        console.trace();
      } catch (e) {
        // ignore
      }
      return origRemove(key);
    } as typeof localStorage.removeItem;
  } catch (e) {
    // If anything fails, don't crash the app
    // eslint-disable-next-line no-console
    console.error('[STORAGE-TRACER] failed to install tracer', e);
  }
}

export default {};
