export const isDev = process.env.NODE_ENV === 'development';

export function getAuthHeaders() {
  const headers: Record<string, any> = {};
  const urlParams = new URLSearchParams(window.location.search);
  const authKey = urlParams.get('authKey');
  if (authKey) {
    const authToken = window.localStorage.getItem(authKey);
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
  }

  return headers;
}
