import { FilterForm } from '@/components/EndpointDemo/FilterForm'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockCategories = ['fruit', 'animal', 'color', 'food']

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

describe('FilterForm', () => {
  const mockUpdateFilter = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all filter fields', () => {
    render(
      <FilterForm
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    expect(screen.getByRole('combobox')).toBeVisible()
    expect(screen.getByLabelText('Word ID:')).toBeVisible()
    expect(screen.getByLabelText('Min Letters:')).toBeVisible()
    expect(screen.getByLabelText('Max Letters:')).toBeVisible()
    expect(screen.getByLabelText('Min Syllables:')).toBeVisible()
    expect(screen.getByLabelText('Max Syllables:')).toBeVisible()
  })

  it('should call updateFilter when category changes', () => {
    render(
      <FilterForm
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    const categorySelect = screen.getByRole('combobox')
    fireEvent.click(categorySelect)

    const fruitOption = screen.getByText('fruit')
    fireEvent.click(fruitOption)

    expect(mockUpdateFilter).toHaveBeenCalledWith('category', 'fruit')
  })

  it('should call updateFilter when minLetters changes', () => {
    render(
      <FilterForm
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    const minLettersInput = screen.getByLabelText(/min.*letters/i)
    fireEvent.change(minLettersInput, { target: { value: '5' } })

    expect(mockUpdateFilter).toHaveBeenCalledWith('minLetters', '5')
  })

  it('should call updateFilter when maxSyllables changes', () => {
    render(
      <FilterForm
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    const maxSyllablesInput = screen.getByLabelText(/max.*syllables/i)
    fireEvent.change(maxSyllablesInput, { target: { value: '2' } })

    expect(mockUpdateFilter).toHaveBeenCalledWith('maxSyllables', '2')
  })

  it('should display all categories in the select', () => {
    render(
      <FilterForm
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    const categorySelect = screen.getByRole('combobox')
    fireEvent.click(categorySelect)

    for (const category of mockCategories) {
      expect(screen.getByText(category)).toBeVisible()
    }
  })

  it('should display current filter values', () => {
    const filtersWithValues = {
      category: 'fruit',
      _id: '',
      minLetters: '5',
      maxLetters: '10',
      minSyllables: '1',
      maxSyllables: '2',
      limit: '20',
      offset: '0',
    }

    render(
      <FilterForm
        filters={filtersWithValues}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    expect(screen.getByDisplayValue('5')).toBeVisible()
    expect(screen.getByDisplayValue('2')).toBeVisible()
  })

  it('should have proper input types and attributes', () => {
    render(
      <FilterForm
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    const minLettersInput = screen.getByLabelText(/min.*letters/i)
    expect(minLettersInput).toHaveAttribute('type', 'number')
    expect(minLettersInput).toHaveAttribute('min', '1')

    const maxSyllablesInput = screen.getByLabelText(/max.*syllables/i)
    expect(maxSyllablesInput).toHaveAttribute('type', 'number')
    expect(maxSyllablesInput).toHaveAttribute('min', '1')
  })

  it('should show placeholder text for inputs', () => {
    render(
      <FilterForm
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    const minLettersInput = screen.getByLabelText(/min.*letters/i)
    expect(minLettersInput).toHaveAttribute('placeholder')

    const maxSyllablesInput = screen.getByLabelText(/max.*syllables/i)
    expect(maxSyllablesInput).toHaveAttribute('placeholder')
  })

  it('should show "All Categories" option in category select', () => {
    render(
      <FilterForm
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    const categorySelect = screen.getByRole('combobox')
    fireEvent.click(categorySelect)

    expect(screen.getByText('Any Category')).toBeVisible()
  })

  it('should call updateFilter when _id changes', () => {
    render(
      <FilterForm
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    const wordIdInput = screen.getByLabelText('Word ID:')
    fireEvent.change(wordIdInput, {
      target: { value: '5ffa1774c0831cbe1460e29c' },
    })

    expect(mockUpdateFilter).toHaveBeenCalledWith(
      '_id',
      '5ffa1774c0831cbe1460e29c'
    )
  })

  it('should display current _id value', () => {
    const filtersWithId = {
      ...defaultFilters,
      _id: '5ffa1774c0831cbe1460e29c',
    }

    render(
      <FilterForm
        filters={filtersWithId}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    expect(screen.getByDisplayValue('5ffa1774c0831cbe1460e29c')).toBeVisible()
  })

  it('should have proper attributes for _id input', () => {
    render(
      <FilterForm
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
        categories={mockCategories}
      />
    )

    const wordIdInput = screen.getByLabelText('Word ID:')
    expect(wordIdInput).toHaveAttribute('type', 'text')
    expect(wordIdInput).toHaveAttribute(
      'placeholder',
      'e.g., 5ffa1774c0831cbe1460e29c'
    )
  })
})
