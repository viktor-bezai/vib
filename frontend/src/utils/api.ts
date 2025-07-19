/**
 * Get the direct API URL for file downloads and external access
 * This bypasses the Next.js proxy which doesn't work for file downloads
 */
export function getDirectApiUrl(path: string): string {
  // In development, use localhost:8000 directly
  // In production, use the production domain
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000'
    : process.env.NEXT_PUBLIC_API_BASE_URL || 'https://viktorbezai.online';
  
  return `${baseUrl}${path}`;
}