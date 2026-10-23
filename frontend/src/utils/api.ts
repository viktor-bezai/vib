/**
 * Get the direct API URL for file downloads and external access
 * This bypasses the Next.js proxy which doesn't work for file downloads
 */
export function getDirectApiUrl(path: string): string {
  // In development, the dev backend's host port (docker/docker-compose.yml); in production, the domain.
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8200'
      : process.env.NEXT_PUBLIC_API_BASE_URL || 'https://viktorbezai.com';

  return `${baseUrl}${path}`;
}
