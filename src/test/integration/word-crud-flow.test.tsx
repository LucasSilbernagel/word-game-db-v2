import EndpointDemo from '@/components/EndpointDemo/EndpointDemo'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../src/test/utils/test-utils'
import { server } from '../mocks/server'

// For integration testing, we'll use real hook implementations
// Only mock the external dependencies

describe('Word CRUD Integration Flow', () => {
  const mockCategories = ['fruit', 'animal', 'color']

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should complete full word creation workflow', async () => {
    // Mock successful word creation
    server.use(
      http.post('http://localhost:3000/api/v1/words', async ({ request }) => {
        const body = (await request.json()) as {
          word: string
          category: string
          hint: string
          numLetters: number
          numSyllables: number
        }
        return HttpResponse.json(
          {
            _id: '507f1f77bcf86cd799439011',
            ...body,
            word: body?.word?.toLowerCase(),
            category: body?.category?.toLowerCase(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          { status: 201 }
        )
      })
    )

    render(
      <EndpointDemo
        method="POST"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    // Verify form is rendered and can be interacted with
    expect(screen.getByLabelText(/word/i)).toBeVisible()
    expect(screen.getByLabelText(/hint/i)).toBeVisible()
    expect(screen.getByRole('combobox')).toBeVisible()
    expect(screen.getByText('Test Endpoint')).toBeVisible()

    // Fill form and submit (focusing on workflow, not detailed interactions)
    const wordInput = screen.getByLabelText(/word/i)
    fireEvent.change(wordInput, { target: { value: 'apple' } })

    const hintInput = screen.getByLabelText(/hint/i)
    fireEvent.change(hintInput, { target: { value: 'A red fruit' } })

    const numLettersInput = screen.getByLabelText(/letters/i)
    fireEvent.change(numLettersInput, { target: { value: '5' } })

    const numSyllablesInput = screen.getByLabelText(/syllables/i)
    fireEvent.change(numSyllablesInput, { target: { value: '2' } })

    const categorySelect = screen.getByRole('combobox')
    fireEvent.click(categorySelect)
    await waitFor(() => expect(screen.getByText('fruit')).toBeVisible())
    fireEvent.click(screen.getByText('fruit'))

    const testButton = screen.getByText('Test Endpoint')
    fireEvent.click(testButton)

    // Verify successful workflow completion
    await waitFor(() => {
      expect(screen.getByText('Response:')).toBeVisible()
    })
  })

  it('should handle word creation error workflow', async () => {
    // Mock word creation error (duplicate word)
    server.use(
      http.post('http://localhost:3000/api/v1/words', () => {
        return HttpResponse.json(
          { error: 'Word already exists' },
          { status: 409 }
        )
      })
    )

    render(
      <EndpointDemo
        method="POST"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    // Fill form with existing word and submit
    const wordInput = screen.getByLabelText(/word/i)
    fireEvent.change(wordInput, { target: { value: 'apple' } })

    const testButton = screen.getByText('Test Endpoint')
    fireEvent.click(testButton)

    // Verify error handling workflow
    await waitFor(() => {
      expect(screen.getByText('Error:')).toBeVisible()
    })
  })

  it('should complete word search flow', async () => {
    // Mock successful search
    server.use(
      http.get('http://localhost:3000/api/v1/words/search', ({ request }) => {
        const url = new URL(request.url)
        const query = url.searchParams.get('q')

        return HttpResponse.json({
          words: [
            {
              _id: '507f1f77bcf86cd799439011',
              word: 'apple',
              category: 'fruit',
              numLetters: 5,
              numSyllables: 2,
              hint: 'A red fruit',
              createdAt: '2023-01-01T00:00:00.000Z',
              updatedAt: '2023-01-01T00:00:00.000Z',
            },
          ],
          pagination: {
            total: 1,
            limit: 10,
            offset: 0,
            hasMore: false,
          },
          query,
        })
      })
    )

    render(
      <EndpointDemo
        method="GET"
        path="/api/v1/words/search"
        categories={mockCategories}
      />
    )

    // Fill in search query
    const queryInput = screen.getByLabelText(/search query/i)
    fireEvent.change(queryInput, { target: { value: 'apple' } })

    // Submit search
    const testButton = screen.getByText('Test Endpoint')
    fireEvent.click(testButton)

    await waitFor(() => {
      expect(screen.getByText('Response:')).toBeVisible()
    })
  })

  it('should handle search validation errors', async () => {
    render(
      <EndpointDemo
        method="GET"
        path="/api/v1/words/search"
        categories={mockCategories}
      />
    )

    // Try to search with empty query
    const testButton = screen.getByText('Test Endpoint')
    fireEvent.click(testButton)

    await waitFor(() => {
      expect(screen.getByText('Error:')).toBeVisible()
    })
  })

  it('should complete word filtering flow', async () => {
    // Mock successful filtered results
    server.use(
      http.get('http://localhost:3000/api/v1/words', ({ request }) => {
        const url = new URL(request.url)
        const category = url.searchParams.get('category')

        return HttpResponse.json({
          words:
            category === 'fruit'
              ? [
                  {
                    _id: '507f1f77bcf86cd799439011',
                    word: 'apple',
                    category: 'fruit',
                    numLetters: 5,
                    numSyllables: 2,
                    hint: 'A red fruit',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                  },
                ]
              : [],
          pagination: {
            total: category === 'fruit' ? 1 : 0,
            limit: 10,
            offset: 0,
            hasMore: false,
          },
        })
      })
    )

    render(
      <EndpointDemo
        method="GET"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    // Apply category filter
    const categorySelect = screen.getByRole('combobox')
    fireEvent.click(categorySelect)

    // Wait for dropdown to open and then click on fruit
    await waitFor(() => {
      expect(screen.getByText('fruit')).toBeVisible()
    })
    fireEvent.click(screen.getByText('fruit'))

    // Submit filter
    const testButton = screen.getByText('Test Endpoint')
    fireEvent.click(testButton)

    await waitFor(() => {
      expect(screen.getByText('Response:')).toBeVisible()
    })
  })

  it('should handle loading states during API calls', async () => {
    // Mock slow API response
    server.use(
      http.get('http://localhost:3000/api/v1/words', async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json({
          words: [],
          pagination: {
            total: 0,
            limit: 10,
            offset: 0,
            hasMore: false,
          },
        })
      })
    )

    render(
      <EndpointDemo
        method="GET"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    const testButton = screen.getByText('Test Endpoint')
    fireEvent.click(testButton)

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeVisible()
    })

    // Wait for completion
    await waitFor(
      () => {
        expect(screen.getByText('Response:')).toBeVisible()
      },
      { timeout: 200 }
    )
  })

  it('should reset form after successful submission', async () => {
    // Mock successful word creation
    server.use(
      http.post('http://localhost:3000/api/v1/words', async ({ request }) => {
        const body = (await request.json()) as {
          word: string
          category: string
          hint: string
          numLetters: number
          numSyllables: number
        }
        return HttpResponse.json(
          {
            _id: '507f1f77bcf86cd799439011',
            ...body,
            word: body?.word?.toLowerCase(),
            category: body?.category?.toLowerCase(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          { status: 201 }
        )
      })
    )

    render(
      <EndpointDemo
        method="POST"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    // Fill in the form
    const wordInput = screen.getByLabelText(/word/i)
    const hintInput = screen.getByLabelText(/hint/i)
    const numLettersInput = screen.getByLabelText(/letters/i)
    const numSyllablesInput = screen.getByLabelText(/syllables/i)

    fireEvent.change(wordInput, { target: { value: 'banana' } })
    fireEvent.change(hintInput, { target: { value: 'A yellow fruit' } })
    fireEvent.change(numLettersInput, { target: { value: '6' } })
    fireEvent.change(numSyllablesInput, { target: { value: '3' } })

    // Select category
    const categorySelect = screen.getByRole('combobox')
    fireEvent.click(categorySelect)

    // Wait for dropdown to open and then click on fruit
    await waitFor(() => {
      expect(screen.getByText('fruit')).toBeVisible()
    })
    fireEvent.click(screen.getByText('fruit'))

    // Submit
    const testButton = screen.getByText('Test Endpoint')
    fireEvent.click(testButton)

    await waitFor(() => {
      expect(screen.getByText('Response:')).toBeVisible()
    })

    // Reset form
    const resetButton = screen.getByText('Reset')
    fireEvent.click(resetButton)

    // Form should be cleared
    expect(wordInput).toHaveValue('')
  })
})
