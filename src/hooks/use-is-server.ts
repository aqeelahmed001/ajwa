// Simple hook to check if we're on the server side
export function useIsServer() {
  return typeof window === 'undefined';
}
