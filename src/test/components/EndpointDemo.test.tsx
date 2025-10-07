import EndpointDemo from '@/components/EndpointDemo/EndpointDemo'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '../../../src/test/utils/test-utils'

// Mock the hooks

vi.mock('@/components/EndpointDemo/hooks/useFilters', () => ({
  useFilters: () => ({
    filters: {
      category: '',
      _id: '',
      minLetters: '',
      maxLetters: '',
      minSyllables: '',
      maxSyllables: '',
      limit: '10',
      offset: '0',
    },
    updateFilter: vi.fn(),
    resetFilters: vi.fn(),
    buildQueryString: vi.fn(() => ''),
  }),
}))

vi.mock('@/components/EndpointDemo/hooks/useWordForm', () => ({
  useWordForm: () => ({
    wordForm: {
      word: '',
      category: '',
      newCategory: '',
      numLetters: '',
      numSyllables: '',
      hint: '',
      categoryMode: 'existing' as const,
    },
    updateWordForm: vi.fn(),
    resetWordForm: vi.fn(),
  }),
}))

vi.mock('@/components/EndpointDemo/hooks/useUpdateForm', () => ({
  useUpdateForm: () => ({
    updateForm: {
      word: '',
      hint: '',
    },
    updateUpdateForm: vi.fn(),
    resetUpdateForm: vi.fn(),
  }),
}))

vi.mock('@/components/EndpointDemo/hooks/useDeleteForm', () => ({
  useDeleteForm: () => ({
    deleteForm: {
      id: '',
    },
    updateDeleteForm: vi.fn(),
    resetDeleteForm: vi.fn(),
  }),
}))

vi.mock('@/components/EndpointDemo/hooks/useSearchForm', () => ({
  useSearchForm: () => ({
    searchForm: {
      query: '',
      limit: '10',
      offset: '0',
    },
    updateSearchForm: vi.fn(),
    resetSearchForm: vi.fn(),
  }),
}))

vi.mock('@/components/EndpointDemo/hooks/useApiState', () => ({
  useApiState: vi.fn(() => ({
    isLoading: false,
    setIsLoading: vi.fn(),
    response: null,
    setResponse: vi.fn(),
    error: null,
    setError: vi.fn(),
    isDebouncing: false,
    setIsDebouncing: vi.fn(),
    clearResponse: vi.fn(),
  })),
}))

// Mock the utility functions
vi.mock('@/components/EndpointDemo/utils/buildApiRequest', () => ({
  buildApiRequest: vi.fn(() => ({
    url: 'http://localhost:3000/api/v1/words',
    options: { method: 'GET' },
  })),
}))

vi.mock('@/components/EndpointDemo/utils/handleApiResponse', () => ({
  handleApiResponse: vi.fn(() => Promise.resolve('{"data": "test"}')),
}))

describe('EndpointDemo', () => {
  const mockCategories = ['fruit', 'animal', 'color']

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with GET method for words endpoint', () => {
    render(
      <EndpointDemo
        method="GET"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    expect(screen.getByText('Live Demo')).toBeVisible()
    expect(screen.getByText('Test Endpoint')).toBeVisible()
    expect(screen.getByText('Reset')).toBeVisible()
  })

  it('should render with POST method for words endpoint', () => {
    render(
      <EndpointDemo
        method="POST"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    expect(screen.getByText('Live Demo')).toBeVisible()
    expect(screen.getByText('Test Endpoint')).toBeVisible()
  })

  it('should show destructive endpoint warning when disabled', () => {
    render(
      <EndpointDemo
        method="POST"
        path="/api/v1/words"
        isDestructiveEnabled={false}
        categories={mockCategories}
      />
    )

    expect(screen.getByText(/This endpoint is disabled/)).toBeVisible()
    expect(screen.getByText(/ENABLE_DESTRUCTIVE_ENDPOINTS=true/)).toBeVisible()
  })

  it('should render test button with correct text', () => {
    render(
      <EndpointDemo
        method="GET"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    const testButton = screen.getByText('Test Endpoint')
    expect(testButton).toBeVisible()
    expect(testButton).toBeInTheDocument()
  })

  it('should display loading state UI correctly', async () => {
    const { useApiState } = await import(
      '@/components/EndpointDemo/hooks/useApiState'
    )
    vi.mocked(useApiState).mockReturnValue({
      isLoading: true,
      setIsLoading: vi.fn(),
      response: null,
      setResponse: vi.fn(),
      error: null,
      setError: vi.fn(),
      isDebouncing: false,
      setIsDebouncing: vi.fn(),
      clearResponse: vi.fn(),
    })

    render(
      <EndpointDemo
        method="GET"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    expect(screen.getByText('Loading...')).toBeVisible()
  })

  it('should display response UI correctly', async () => {
    const mockResponse = '{"words": [], "pagination": {"total": 0}}'

    const { useApiState } = await import(
      '@/components/EndpointDemo/hooks/useApiState'
    )
    vi.mocked(useApiState).mockReturnValue({
      isLoading: false,
      setIsLoading: vi.fn(),
      response: mockResponse,
      setResponse: vi.fn(),
      error: null,
      setError: vi.fn(),
      isDebouncing: false,
      setIsDebouncing: vi.fn(),
      clearResponse: vi.fn(),
    })

    render(
      <EndpointDemo
        method="GET"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    expect(screen.getByText('Response:')).toBeVisible()
    expect(screen.getByText(mockResponse)).toBeVisible()
  })

  it('should display error UI correctly', async () => {
    const mockError = 'Network error occurred'

    const { useApiState } = await import(
      '@/components/EndpointDemo/hooks/useApiState'
    )
    vi.mocked(useApiState).mockReturnValue({
      isLoading: false,
      setIsLoading: vi.fn(),
      response: null,
      setResponse: vi.fn(),
      error: mockError,
      setError: vi.fn(),
      isDebouncing: false,
      setIsDebouncing: vi.fn(),
      clearResponse: vi.fn(),
    })

    render(
      <EndpointDemo
        method="GET"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    expect(screen.getByText('Error:')).toBeVisible()
    expect(screen.getByText(mockError)).toBeVisible()
  })

  it('should render search form for search endpoint', () => {
    render(
      <EndpointDemo
        method="GET"
        path="/api/v1/words/search"
        categories={mockCategories}
      />
    )

    // The search form should be rendered
    expect(screen.getByText('Reset')).toBeVisible()
  })

  it('should render word form for POST endpoint', () => {
    render(
      <EndpointDemo
        method="POST"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    // The word form should be rendered (we can check for the form elements)
    expect(screen.getByText('Reset')).toBeVisible()
  })

  it('should render filter form for GET words endpoint', () => {
    render(
      <EndpointDemo
        method="GET"
        path="/api/v1/words"
        categories={mockCategories}
      />
    )

    // The filter form should be rendered
    expect(screen.getByText('Reset')).toBeVisible()
  })
})
