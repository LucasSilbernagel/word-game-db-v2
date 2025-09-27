import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    destructiveEndpointsEnabled:
      process.env.ENABLE_DESTRUCTIVE_ENDPOINTS === 'true',
  })
}
