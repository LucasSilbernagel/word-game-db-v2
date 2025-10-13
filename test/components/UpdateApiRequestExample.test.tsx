import { UpdateApiRequestExample } from '@/components/EndpointDemo/UpdateApiRequestExample'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('UpdateApiRequestExample', () => {
  const defaultUpdateForm = {
    id: '',
    word: '',
    category: '',
    newCategory: '',
    numLetters: '',
    numSyllables: '',
    hint: '',
    categoryMode: 'existing' as const,
  }

  it('should render with default form values', () => {
    render(<UpdateApiRequestExample updateForm={defaultUpdateForm} />)

    expect(screen.getByText('API Request Example:')).toBeVisible()
    expect(screen.getByText('PUT /api/v2/words/WORD_ID')).toBeVisible()
    expect(screen.getByText('Content-Type: application/json')).toBeVisible()
  })

  it('should render with custom word ID', () => {
    const updateFormWithId = {
      ...defaultUpdateForm,
      id: 'test-id-123',
    }

    render(<UpdateApiRequestExample updateForm={updateFormWithId} />)

    expect(screen.getByText('PUT /api/v2/words/test-id-123')).toBeVisible()
  })

  it('should render with word and hint fields', () => {
    const updateFormWithWordAndHint = {
      ...defaultUpdateForm,
      word: 'elephant',
      hint: 'Large mammal with trunk',
    }

    render(<UpdateApiRequestExample updateForm={updateFormWithWordAndHint} />)

    expect(screen.getByText('PUT /api/v2/words/WORD_ID')).toBeVisible()
    expect(screen.getByText(/"word": "elephant"/)).toBeVisible()
    expect(screen.getByText(/"hint": "Large mammal with trunk"/)).toBeVisible()
  })

  it('should render with existing category', () => {
    const updateFormWithExistingCategory = {
      ...defaultUpdateForm,
      category: 'animal',
      categoryMode: 'existing' as const,
    }

    render(
      <UpdateApiRequestExample updateForm={updateFormWithExistingCategory} />
    )

    expect(screen.getByText(/"category": "animal"/)).toBeVisible()
  })

  it('should render with new category', () => {
    const updateFormWithNewCategory = {
      ...defaultUpdateForm,
      newCategory: 'technology',
      categoryMode: 'new' as const,
    }

    render(<UpdateApiRequestExample updateForm={updateFormWithNewCategory} />)

    expect(screen.getByText(/"category": "technology"/)).toBeVisible()
  })

  it('should render with numeric fields', () => {
    const updateFormWithNumericFields = {
      ...defaultUpdateForm,
      numLetters: '8',
      numSyllables: '3',
    }

    render(<UpdateApiRequestExample updateForm={updateFormWithNumericFields} />)

    expect(screen.getByText(/"numLetters": 8/)).toBeVisible()
    expect(screen.getByText(/"numSyllables": 3/)).toBeVisible()
  })

  it('should render with all fields populated', () => {
    const updateFormWithAllFields = {
      id: 'test-id-456',
      word: 'giraffe',
      category: 'animal',
      newCategory: '',
      numLetters: '7',
      numSyllables: '2',
      hint: 'Tall animal with long neck',
      categoryMode: 'existing' as const,
    }

    render(<UpdateApiRequestExample updateForm={updateFormWithAllFields} />)

    expect(screen.getByText('PUT /api/v2/words/test-id-456')).toBeVisible()
    expect(screen.getByText(/"word": "giraffe"/)).toBeVisible()
    expect(screen.getByText(/"category": "animal"/)).toBeVisible()
    expect(screen.getByText(/"numLetters": 7/)).toBeVisible()
    expect(screen.getByText(/"numSyllables": 2/)).toBeVisible()
    expect(
      screen.getByText(/"hint": "Tall animal with long neck"/)
    ).toBeVisible()
  })

  it('should render default example when no fields are populated', () => {
    render(<UpdateApiRequestExample updateForm={defaultUpdateForm} />)

    expect(screen.getByText(/"word": "example"/)).toBeVisible()
    expect(screen.getByText(/"hint": "Updated hint"/)).toBeVisible()
  })

  it('should handle empty string values correctly', () => {
    const updateFormWithEmptyStrings = {
      ...defaultUpdateForm,
      word: '',
      hint: '',
      category: '',
      newCategory: '',
      numLetters: '',
      numSyllables: '',
    }

    render(<UpdateApiRequestExample updateForm={updateFormWithEmptyStrings} />)

    // Should show default example since all fields are empty
    expect(screen.getByText(/"word": "example"/)).toBeVisible()
    expect(screen.getByText(/"hint": "Updated hint"/)).toBeVisible()
  })

  it('should have proper styling classes', () => {
    render(<UpdateApiRequestExample updateForm={defaultUpdateForm} />)

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

    const methodText = screen.getByText('PUT /api/v2/words/WORD_ID')
    expect(methodText).toHaveClass(
      'font-semibold',
      'text-blue-600',
      'dark:text-blue-400'
    )

    const contentTypeText = screen.getByText('Content-Type: application/json')
    expect(contentTypeText).toHaveClass(
      'mt-2',
      'text-gray-600',
      'dark:text-gray-300'
    )

    const jsonPre = screen.getByText(/"word": "example"/).closest('pre')
    expect(jsonPre).toHaveClass('mt-2', 'overflow-x-auto', 'text-xs')
  })

  it('should handle category mode switching correctly', () => {
    const updateFormWithExistingCategory = {
      ...defaultUpdateForm,
      category: 'animal',
      newCategory: 'technology',
      categoryMode: 'existing' as const,
    }

    render(
      <UpdateApiRequestExample updateForm={updateFormWithExistingCategory} />
    )

    expect(screen.getByText(/"category": "animal"/)).toBeVisible()
    expect(
      screen.queryByText(/"category": "technology"/)
    ).not.toBeInTheDocument()
  })

  it('should parse numeric strings correctly', () => {
    const updateFormWithNumericStrings = {
      ...defaultUpdateForm,
      numLetters: '10',
      numSyllables: '4',
    }

    render(
      <UpdateApiRequestExample updateForm={updateFormWithNumericStrings} />
    )

    expect(screen.getByText(/"numLetters": 10/)).toBeVisible()
    expect(screen.getByText(/"numSyllables": 4/)).toBeVisible()
  })

  it('should handle special characters in text fields', () => {
    const updateFormWithSpecialChars = {
      ...defaultUpdateForm,
      word: 'café',
      hint: 'A place with coffee & pastries',
    }

    render(<UpdateApiRequestExample updateForm={updateFormWithSpecialChars} />)

    expect(screen.getByText(/"word": "café"/)).toBeVisible()
    expect(
      screen.getByText(/"hint": "A place with coffee & pastries"/)
    ).toBeVisible()
  })

  it('should have proper JSON formatting', () => {
    const updateFormWithData = {
      ...defaultUpdateForm,
      word: 'test',
      hint: 'test hint',
    }

    render(<UpdateApiRequestExample updateForm={updateFormWithData} />)

    const jsonContent = screen.getByText(/"word": "test"/).closest('pre')
    expect(jsonContent).toBeInTheDocument()

    // Check that JSON is properly formatted with indentation
    expect(screen.getByText(/"word": "test"/)).toBeVisible()
    expect(screen.getByText(/"hint": "test hint"/)).toBeVisible()
  })

  it('should handle zero values for numeric fields', () => {
    const updateFormWithZeroValues = {
      ...defaultUpdateForm,
      numLetters: '0',
      numSyllables: '0',
    }

    render(<UpdateApiRequestExample updateForm={updateFormWithZeroValues} />)

    expect(screen.getByText(/"numLetters": 0/)).toBeVisible()
    expect(screen.getByText(/"numSyllables": 0/)).toBeVisible()
  })
})
