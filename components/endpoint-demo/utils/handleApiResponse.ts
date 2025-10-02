export const handleApiResponse = async (response: globalThis.Response) => {
  // Check if response is JSON before parsing
  const contentType = response.headers.get('content-type')
  let data

  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    // If not JSON, get text response
    const textData = await response.text()
    throw new Error(
      `Server returned non-JSON response: ${textData.slice(0, 200)}...`
    )
  }

  if (!response.ok) {
    throw new Error(
      data.error || `HTTP ${response.status}: ${response.statusText}`
    )
  }

  return JSON.stringify(data, null, 2)
}
