import { API_ROUTES, DEMO_DATA, TEXT_CONTENT } from '@/lib/constants/app'
import { DeleteFormState } from '../DeleteForm'
import { SearchFormState } from '../hooks/useSearchForm'
import { UpdateFormState } from '../UpdateForm'
import { WordFormState } from '../WordForm'

export const buildApiRequest = (
  method: string,
  path: string,
  queryString: string,
  wordForm: WordFormState,
  updateForm: UpdateFormState,
  deleteForm: DeleteFormState,
  searchForm: SearchFormState,
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
      case API_ROUTES.WORDS: {
        // Use filters to build query string
        url = `${API_ROUTES.WORDS}${queryString ? `?${queryString}` : ''}`
        break
      }
      case API_ROUTES.WORDS_WITH_ID: {
        // Use a specific word ID for demo
        url = `${API_ROUTES.WORDS}/${DEMO_DATA.WORD_ID}`
        break
      }
      case API_ROUTES.WORDS_SEARCH: {
        // Use search form to build query string
        const trimmedQuery = searchForm.query.trim()
        if (!trimmedQuery) {
          throw new Error(TEXT_CONTENT.ERRORS.ENTER_SEARCH_QUERY)
        }
        const searchParams = new URLSearchParams()
        searchParams.set('q', trimmedQuery)
        if (searchForm.limit) searchParams.set('limit', searchForm.limit)
        if (searchForm.offset) searchParams.set('offset', searchForm.offset)
        url = `${API_ROUTES.WORDS_SEARCH}?${searchParams.toString()}`
        break
      }
    }
  } else if (method === 'POST' && path === API_ROUTES.WORDS) {
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
      throw new Error(TEXT_CONTENT.ERRORS.FILL_REQUIRED_FIELDS)
    }

    options.body = JSON.stringify({
      word: wordForm.word,
      category: selectedCategory,
      numLetters: Number.parseInt(wordForm.numLetters),
      numSyllables: Number.parseInt(wordForm.numSyllables),
      hint: wordForm.hint,
    })
  } else if (method === 'PUT' && path === API_ROUTES.WORDS_WITH_ID) {
    // Handle word update with form data
    if (!updateForm.id) {
      throw new Error(TEXT_CONTENT.ERRORS.ENTER_WORD_ID_UPDATE)
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
      throw new Error(TEXT_CONTENT.ERRORS.FILL_ONE_FIELD_UPDATE)
    }

    url = `${API_ROUTES.WORDS}/${updateForm.id}`
    options.body = JSON.stringify(updateData)
  } else if (method === 'DELETE' && path === API_ROUTES.WORDS_WITH_ID) {
    // Handle word deletion with ID
    if (!deleteForm.id) {
      throw new Error(TEXT_CONTENT.ERRORS.ENTER_WORD_ID_DELETE)
    }

    url = `${API_ROUTES.WORDS}/${deleteForm.id}`
  } else if (
    ['POST', 'PUT', 'DELETE'].includes(method) &&
    !isDestructiveEnabled
  ) {
    // For destructive endpoints when not enabled, show a message instead of making the request
    throw new Error(TEXT_CONTENT.ERRORS.DESTRUCTIVE_DISABLED)
  }

  return { url, options }
}
