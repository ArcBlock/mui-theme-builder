export default function useSchemaKey(): string {
  const urlParams = new URLSearchParams(window.location.search);
  const schemaKey = urlParams.get('schemaKey');

  return schemaKey?.startsWith('http://') || schemaKey?.startsWith('https://') ? schemaKey : '';
}
