import { WordsApiRequestExample } from '@/components/EndpointDemo/WordsApiRequestExample/WordsApiRequestExample'
import { describe, expect, it } from 'vitest'
import { render, screen } from '../utils/test-utils'

describe('WordsApiRequestExample', () => {
  const defaultFilters = {
    category: '',
    _id: '',
    minLetters: '',
    maxLetters: '',
    minSyllables: '',
    maxSyllables: '',
    limit: '10',
    offset: '0',
  }

  it('should render with default form values', () => {
    render(<WordsApiRequestExample filters={defaultFilters} />)

    expect(screen.getByText('API Request Example:')).toBeVisible()
    expect(screen.getByText('GET /api/v1/words?category=animal')).toBeVisible()
    expect(screen.getByText('Content-Type: application/json')).toBeVisible()
    expect(
      screen.getByText('Returns all words (no filters applied)')
    ).toBeVisible()
  })

  it('should render with _id filter', () => {
    const filtersWithId = {
      ...defaultFilters,
      _id: '5ffa1774c0831cbe1460e29c',
    }

    render(<WordsApiRequestExample filters={filtersWithId} />)

    expect(
      screen.getByText('GET /api/v1/words?_id=5ffa1774c0831cbe1460e29c')
    ).toBeVisible()
    expect(
      screen.getByText(
        'Returns words filtered by: ID: "5ffa1774c0831cbe1460e29c"'
      )
    ).toBeVisible()
  })

  it('should render with category filter', () => {
    const filtersWithCategory = {
      ...defaultFilters,
      category: 'fruit',
    }

    render(<WordsApiRequestExample filters={filtersWithCategory} />)

    expect(screen.getByText('GET /api/v1/words?category=fruit')).toBeVisible()
    expect(
      screen.getByText('Returns words filtered by: category: "fruit"')
    ).toBeVisible()
  })

  it('should render with letter range filters', () => {
    const filtersWithLetterRange = {
      ...defaultFilters,
      minLetters: '4',
      maxLetters: '6',
    }

    render(<WordsApiRequestExample filters={filtersWithLetterRange} />)

    expect(
      screen.getByText('GET /api/v1/words?minLetters=4&maxLetters=6')
    ).toBeVisible()
    expect(
      screen.getByText('Returns words filtered by: 4-6 letters')
    ).toBeVisible()
  })

  it('should render with syllable range filters', () => {
    const filtersWithSyllableRange = {
      ...defaultFilters,
      minSyllables: '1',
      maxSyllables: '3',
    }

    render(<WordsApiRequestExample filters={filtersWithSyllableRange} />)

    expect(
      screen.getByText('GET /api/v1/words?minSyllables=1&maxSyllables=3')
    ).toBeVisible()
    expect(
      screen.getByText('Returns words filtered by: 1-3 syllables')
    ).toBeVisible()
  })

  it('should render with complex filter combination', () => {
    const complexFilters = {
      ...defaultFilters,
      category: 'animal',
      _id: '5ffa1774c0831cbe1460e29c',
      minLetters: '4',
      maxLetters: '6',
      minSyllables: '1',
      maxSyllables: '2',
      limit: '20',
      offset: '10',
    }

    render(<WordsApiRequestExample filters={complexFilters} />)

    expect(
      screen.getByText(
        'GET /api/v1/words?category=animal&_id=5ffa1774c0831cbe1460e29c&minLetters=4&maxLetters=6&minSyllables=1&maxSyllables=2&limit=20&offset=10'
      )
    ).toBeVisible()
    expect(
      screen.getByText(
        'Returns words filtered by: category: "animal", ID: "5ffa1774c0831cbe1460e29c", 4-6 letters, 1-2 syllables'
      )
    ).toBeVisible()
  })

  it('should handle single value ranges', () => {
    const filtersWithSingleMin = {
      ...defaultFilters,
      minLetters: '5',
    }

    render(<WordsApiRequestExample filters={filtersWithSingleMin} />)

    expect(screen.getByText('GET /api/v1/words?minLetters=5')).toBeVisible()
    expect(
      screen.getByText('Returns words filtered by: 5+ letters')
    ).toBeVisible()
  })

  it('should handle maximum-only ranges', () => {
    const filtersWithMaxOnly = {
      ...defaultFilters,
      maxSyllables: '3',
    }

    render(<WordsApiRequestExample filters={filtersWithMaxOnly} />)

    expect(screen.getByText('GET /api/v1/words?maxSyllables=3')).toBeVisible()
    expect(
      screen.getByText('Returns words filtered by: ≤3 syllables')
    ).toBeVisible()
  })

  it('should not include default limit and offset in URL', () => {
    const filtersWithDefaults = {
      ...defaultFilters,
      category: 'test',
      limit: '10',
      offset: '0',
    }

    render(<WordsApiRequestExample filters={filtersWithDefaults} />)

    expect(screen.getByText('GET /api/v1/words?category=test')).toBeVisible()
    expect(screen.queryByText(/limit=10/)).not.toBeInTheDocument()
    expect(screen.queryByText(/offset=0/)).not.toBeInTheDocument()
  })

  it('should include non-default limit and offset in URL', () => {
    const filtersWithCustomPagination = {
      ...defaultFilters,
      category: 'test',
      limit: '25',
      offset: '50',
    }

    render(<WordsApiRequestExample filters={filtersWithCustomPagination} />)

    expect(
      screen.getByText('GET /api/v1/words?category=test&limit=25&offset=50')
    ).toBeVisible()
  })

  it('should show fallback message when no filters are set', () => {
    const emptyFilters = {
      category: '',
      _id: '',
      minLetters: '',
      maxLetters: '',
      minSyllables: '',
      maxSyllables: '',
      limit: '10',
      offset: '0',
    }

    render(<WordsApiRequestExample filters={emptyFilters} />)

    expect(
      screen.getByText('Returns all words (no filters applied)')
    ).toBeVisible()
  })

  it('should handle special characters in _id', () => {
    const filtersWithSpecialId = {
      ...defaultFilters,
      _id: '507f1f77bcf86cd799439011',
    }

    render(<WordsApiRequestExample filters={filtersWithSpecialId} />)

    expect(
      screen.getByText('GET /api/v1/words?_id=507f1f77bcf86cd799439011')
    ).toBeVisible()
    expect(
      screen.getByText(
        'Returns words filtered by: ID: "507f1f77bcf86cd799439011"'
      )
    ).toBeVisible()
  })

  it('should have proper styling classes', () => {
    render(<WordsApiRequestExample filters={defaultFilters} />)

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

    const methodText = screen.getByText('GET /api/v1/words?category=animal')
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
      'Returns all words (no filters applied)'
    )
    expect(descriptionText).toHaveClass(
      'mt-2',
      'text-xs',
      'text-gray-500',
      'dark:text-gray-400'
    )
  })

  it('should handle empty string values gracefully', () => {
    const filtersWithEmptyStrings = {
      category: '',
      _id: '',
      minLetters: '5',
      maxLetters: '',
      minSyllables: '',
      maxSyllables: '3',
      limit: '10',
      offset: '0',
    }

    render(<WordsApiRequestExample filters={filtersWithEmptyStrings} />)

    expect(
      screen.getByText('GET /api/v1/words?minLetters=5&maxSyllables=3')
    ).toBeVisible()
    expect(
      screen.getByText('Returns words filtered by: 5+ letters, ≤3 syllables')
    ).toBeVisible()
  })

  it('should handle _id with category combination', () => {
    const filtersWithIdAndCategory = {
      ...defaultFilters,
      category: 'animal',
      _id: '5ffa1774c0831cbe1460e29c',
    }

    render(<WordsApiRequestExample filters={filtersWithIdAndCategory} />)

    expect(
      screen.getByText(
        'GET /api/v1/words?category=animal&_id=5ffa1774c0831cbe1460e29c'
      )
    ).toBeVisible()
    expect(
      screen.getByText(
        'Returns words filtered by: category: "animal", ID: "5ffa1774c0831cbe1460e29c"'
      )
    ).toBeVisible()
  })
})
