import { APP_METADATA } from '@/lib/constants/app'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${APP_METADATA.BASE_URL}/sitemap.xml`,
  }
}
