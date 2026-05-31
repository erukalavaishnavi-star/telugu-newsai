import type { AuthTokens } from '@/types';

export function storeAuth(tokens: AuthTokens) {
  localStorage.setItem('auth_token', tokens.token);
  localStorage.setItem('refresh_token', tokens.refreshToken);
  localStorage.setItem('auth_user', JSON.stringify(tokens.user));
}

export function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_user');
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('auth_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}
