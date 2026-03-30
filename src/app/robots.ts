import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/marketplace'],
      disallow: ['/dashboard', '/dashboard/*', '/admin', '/admin/*', '/api/*'],
    },
    sitemap: 'https://follio.app/sitemap.xml',
  }
}
