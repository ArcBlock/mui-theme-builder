export default function useBlockletAppUrl(): string {
  const urlParams = new URLSearchParams(window.location.search);
  const appUrl = urlParams.get('appUrl');

  return appUrl?.startsWith('http://') || appUrl?.startsWith('https://') ? appUrl : '';
}
