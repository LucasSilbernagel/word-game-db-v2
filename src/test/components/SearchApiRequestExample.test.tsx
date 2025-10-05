import { SearchApiRequestExample } from '@/components/EndpointDemo/SearchApiRequestExample/SearchApiRequestExample'
import { describe, expect, it } from 'vitest'
import { render, screen } from '../utils/test-utils'

describe('SearchApiRequestExample', () => {
  const defaultSearchForm = {
    query: '',
    limit: '10',
    offset: '0',
  }

  it('should render with default form values', () => {
    render(<SearchApiRequestExample searchForm={defaultSearchForm} />)

    expect(screen.getByText('API Request Example:')).toBeVisible()
    expect(screen.getByText('GET /api/v1/words/search?q=cat')).toBeVisible()
    expect(screen.getByText('Content-Type: application/json')).toBeVisible()
    expect(
      screen.getByText('Returns words matching "cat" with pagination')
    ).toBeVisible()
  })

  it('should render with custom query', () => {
    const searchFormWithQuery = {
      query: 'elephant',
      limit: '10',
      offset: '0',
    }

    render(<SearchApiRequestExample searchForm={searchFormWithQuery} />)

    expect(
      screen.getByText('GET /api/v1/words/search?q=elephant')
    ).toBeVisible()
    expect(
      screen.getByText('Returns words matching "elephant" with pagination')
    ).toBeVisible()
  })

  it('should render with custom limit', () => {
    const searchFormWithLimit = {
      query: 'cat',
      limit: '5',
      offset: '0',
    }

    render(<SearchApiRequestExample searchForm={searchFormWithLimit} />)

    expect(
      screen.getByText('GET /api/v1/words/search?q=cat&limit=5')
    ).toBeVisible()
  })

  it('should render with custom offset', () => {
    const searchFormWithOffset = {
      query: 'cat',
      limit: '10',
      offset: '20',
    }

    render(<SearchApiRequestExample searchForm={searchFormWithOffset} />)

    expect(
      screen.getByText('GET /api/v1/words/search?q=cat&offset=20')
    ).toBeVisible()
  })

  it('should render with all custom parameters', () => {
    const searchFormWithAllParams = {
      query: 'dog',
      limit: '15',
      offset: '30',
    }

    render(<SearchApiRequestExample searchForm={searchFormWithAllParams} />)

    expect(
      screen.getByText('GET /api/v1/words/search?q=dog&limit=15&offset=30')
    ).toBeVisible()
    expect(
      screen.getByText('Returns words matching "dog" with pagination')
    ).toBeVisible()
  })

  it('should handle empty query gracefully', () => {
    const searchFormWithEmptyQuery = {
      query: '',
      limit: '10',
      offset: '0',
    }

    render(<SearchApiRequestExample searchForm={searchFormWithEmptyQuery} />)

    expect(screen.getByText('GET /api/v1/words/search?q=cat')).toBeVisible()
    expect(
      screen.getByText('Returns words matching "cat" with pagination')
    ).toBeVisible()
  })

  it('should have proper styling classes', () => {
    render(<SearchApiRequestExample searchForm={defaultSearchForm} />)

    // Check that the API Request Example text has proper styling
    const titleText = screen.getByText('API Request Example:')
    expect(titleText).toHaveClass('text-muted-foreground', 'mb-2', 'text-sm')

    // Find the container div that has the styling classes
    const exampleBox = screen.getByText(
      'API Request Example:'
    ).nextElementSibling
    expect(exampleBox).toHaveClass(
      'rounded',
      'border',
      'bg-gray-50',
      'p-3',
      'dark:bg-gray-800'
    )

    const methodText = screen.getByText('GET /api/v1/words/search?q=cat')
    expect(methodText).toHaveClass(
      'font-semibold',
      'text-green-600',
      'dark:text-green-400'
    )

    const contentTypeText = screen.getByText('Content-Type: application/json')
    expect(contentTypeText).toHaveClass(
      'mt-2',
      'text-gray-600',
      'dark:text-gray-300'
    )

    const descriptionText = screen.getByText(
      'Returns words matching "cat" with pagination'
    )
    expect(descriptionText).toHaveClass(
      'mt-2',
      'text-xs',
      'text-gray-500',
      'dark:text-gray-400'
    )
  })

  it('should not include limit parameter when it equals default', () => {
    const searchFormWithDefaultLimit = {
      query: 'test',
      limit: '10',
      offset: '0',
    }

    render(<SearchApiRequestExample searchForm={searchFormWithDefaultLimit} />)

    expect(screen.getByText('GET /api/v1/words/search?q=test')).toBeVisible()
    expect(screen.queryByText(/limit=10/)).not.toBeInTheDocument()
  })

  it('should not include offset parameter when it equals default', () => {
    const searchFormWithDefaultOffset = {
      query: 'test',
      limit: '10',
      offset: '0',
    }

    render(<SearchApiRequestExample searchForm={searchFormWithDefaultOffset} />)

    expect(screen.getByText('GET /api/v1/words/search?q=test')).toBeVisible()
    expect(screen.queryByText(/offset=0/)).not.toBeInTheDocument()
  })

  it('should handle special characters in query', () => {
    const searchFormWithSpecialChars = {
      query: 'test & query',
      limit: '10',
      offset: '0',
    }

    render(<SearchApiRequestExample searchForm={searchFormWithSpecialChars} />)

    expect(
      screen.getByText('GET /api/v1/words/search?q=test+%26+query')
    ).toBeVisible()
    expect(
      screen.getByText('Returns words matching "test & query" with pagination')
    ).toBeVisible()
  })

  it('should have proper structure', () => {
    render(<SearchApiRequestExample searchForm={defaultSearchForm} />)

    const exampleBox = screen.getByText(
      'API Request Example:'
    ).nextElementSibling!
    const methodText = screen.getByText('GET /api/v1/words/search?q=cat')
    const contentTypeText = screen.getByText('Content-Type: application/json')
    const descriptionText = screen.getByText(
      'Returns words matching "cat" with pagination'
    )

    expect(exampleBox).toBeInTheDocument()
    expect(methodText).toBeInTheDocument()
    expect(contentTypeText).toBeInTheDocument()
    expect(exampleBox).toContainElement(descriptionText)
  })

  it('should handle numeric string parameters correctly', () => {
    const searchFormWithNumericStrings = {
      query: 'test',
      limit: '25',
      offset: '50',
    }

    render(
      <SearchApiRequestExample searchForm={searchFormWithNumericStrings} />
    )

    expect(
      screen.getByText('GET /api/v1/words/search?q=test&limit=25&offset=50')
    ).toBeVisible()
  })
})
