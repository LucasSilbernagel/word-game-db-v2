import { NextResponse } from 'next/server'

export const GET = async () => {
  return NextResponse.json({
    destructiveEndpointsEnabled:
      process.env.ENABLE_DESTRUCTIVE_ENDPOINTS === 'true',
  })
}
