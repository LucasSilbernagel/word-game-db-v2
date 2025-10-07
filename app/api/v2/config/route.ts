import { addCorsHeaders } from '@/lib/middleware'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const response = NextResponse.json({
    destructiveEndpointsEnabled:
      process.env.ENABLE_DESTRUCTIVE_ENDPOINTS === 'true',
  })

  return addCorsHeaders(response)
}
