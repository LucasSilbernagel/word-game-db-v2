import { API_ROUTES } from '@/lib/constants'
import { useEffect, useState } from 'react'

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_ROUTES.CATEGORIES, {
          // Add cache headers for better performance
          headers: {
            'Cache-Control': 'max-age=3600', // Cache for 1 hour
          },
        })
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  return categories
}
