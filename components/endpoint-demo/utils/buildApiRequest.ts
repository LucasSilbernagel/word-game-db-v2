import { DeleteFormState } from '../DeleteForm/DeleteForm'
import { UpdateFormState } from '../UpdateForm/UpdateForm'
import { WordFormState } from '../WordForm/WordForm'

export const buildApiRequest = (
  method: string,
  path: string,
  queryString: string,
  wordForm: WordFormState,
  updateForm: UpdateFormState,
  deleteForm: DeleteFormState,
  isDestructiveEnabled: boolean
) => {
  let url = path
  let options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // Handle different endpoint types
  if (method === 'GET') {
    switch (path) {
      case '/api/v1/words': {
        // Use filters to build query string
        url = `/api/v1/words${queryString ? `?${queryString}` : ''}`
        break
      }
      case '/api/v1/words/[id]': {
        // Use a specific word ID for demo
        url = '/api/v1/words/5ffa1774c0831cbe1460e29c'
        break
      }
    }
  } else if (method === 'POST' && path === '/api/v1/words') {
    // Handle word creation with form data
    const selectedCategory =
      wordForm.categoryMode === 'existing'
        ? wordForm.category
        : wordForm.newCategory

    if (
      !wordForm.word ||
      !selectedCategory ||
      !wordForm.numLetters ||
      !wordForm.numSyllables ||
      !wordForm.hint
    ) {
      throw new Error('Please fill in all required fields')
    }

    options.body = JSON.stringify({
      word: wordForm.word,
      category: selectedCategory,
      numLetters: Number.parseInt(wordForm.numLetters),
      numSyllables: Number.parseInt(wordForm.numSyllables),
      hint: wordForm.hint,
    })
  } else if (method === 'PUT' && path === '/api/v1/words/[id]') {
    // Handle word update with form data
    if (!updateForm.id) {
      throw new Error('Please enter a word ID to update')
    }

    const selectedCategory =
      updateForm.categoryMode === 'existing'
        ? updateForm.category
        : updateForm.newCategory

    // Build update data object with only provided fields
    const updateData: Record<string, unknown> = {}
    if (updateForm.word) updateData.word = updateForm.word
    if (selectedCategory) updateData.category = selectedCategory
    if (updateForm.numLetters)
      updateData.numLetters = Number.parseInt(updateForm.numLetters)
    if (updateForm.numSyllables)
      updateData.numSyllables = Number.parseInt(updateForm.numSyllables)
    if (updateForm.hint) updateData.hint = updateForm.hint

    if (Object.keys(updateData).length === 0) {
      throw new Error('Please fill in at least one field to update')
    }

    url = `/api/v1/words/${updateForm.id}`
    options.body = JSON.stringify(updateData)
  } else if (method === 'DELETE' && path === '/api/v1/words/[id]') {
    // Handle word deletion with ID
    if (!deleteForm.id) {
      throw new Error('Please enter a valid word ID to delete')
    }

    url = `/api/v1/words/${deleteForm.id}`
  } else if (
    ['POST', 'PUT', 'DELETE'].includes(method) &&
    !isDestructiveEnabled
  ) {
    // For destructive endpoints when not enabled, show a message instead of making the request
    throw new Error(
      'This endpoint is disabled. To test it, set ENABLE_DESTRUCTIVE_ENDPOINTS=true in your environment variables.'
    )
  }

  return { url, options }
}
