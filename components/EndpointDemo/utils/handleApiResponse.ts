export class ApiError extends Error {
  code?: string
  status?: number

  constructor(message: string, options?: { code?: string; status?: number }) {
    super(message)
    this.name = 'ApiError'
    this.code = options?.code
    this.status = options?.status
  }
}

export const handleApiResponse = async (
  response: globalThis.Response
): Promise<string> => {
  const contentType = response.headers.get('content-type')

  if (!contentType?.includes('application/json')) {
    // A 503 without JSON almost always means the backend/database is down.
    if (response.status === 503) {
      throw new ApiError(
        'The database is currently unavailable. Please try again once the connection is configured.',
        { code: 'DB_UNAVAILABLE', status: 503 }
      )
    }
    const textData = await response.text()
    throw new ApiError(
      `Server returned non-JSON response: ${textData.slice(0, 200)}${textData.length > 200 ? '...' : ''}`,
      { status: response.status }
    )
  }

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(
      data.message ||
        data.error ||
        `HTTP ${response.status}: ${response.statusText}`,
      { code: data.code, status: response.status }
    )
  }

  return JSON.stringify(data, null, 2)
}
