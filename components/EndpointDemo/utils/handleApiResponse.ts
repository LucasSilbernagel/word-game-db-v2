export const handleApiResponse = async (
  response: globalThis.Response
): Promise<string> => {
  const contentType = response.headers.get('content-type')

  if (!contentType?.includes('application/json')) {
    const textData = await response.text()
    throw new Error(
      `Server returned non-JSON response: ${textData.slice(0, 200)}${textData.length > 200 ? '...' : ''}`
    )
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return JSON.stringify(data, null, 2)
}
