import { SearchForm } from '@/components/EndpointDemo/SearchForm/SearchForm'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const defaultSearchForm = {
  query: '',
  limit: '10',
  offset: '0',
}

describe('SearchForm', () => {
  const mockUpdateSearchForm = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all form fields', () => {
    render(
      <SearchForm
        searchForm={defaultSearchForm}
        updateSearchForm={mockUpdateSearchForm}
      />
    )

    expect(screen.getByLabelText('Search Query *')).toBeVisible()
    expect(screen.getByLabelText('Limit')).toBeVisible()
    expect(screen.getByLabelText('Offset')).toBeVisible()
  })

  it('should call updateSearchForm when query input changes', () => {
    render(
      <SearchForm
        searchForm={defaultSearchForm}
        updateSearchForm={mockUpdateSearchForm}
      />
    )

    const queryInput = screen.getByLabelText('Search Query *')
    fireEvent.change(queryInput, { target: { value: 'apple' } })

    expect(mockUpdateSearchForm).toHaveBeenCalledWith('query', 'apple')
  })

  it('should call updateSearchForm when limit input changes', () => {
    render(
      <SearchForm
        searchForm={defaultSearchForm}
        updateSearchForm={mockUpdateSearchForm}
      />
    )

    const limitInput = screen.getByLabelText('Limit')
    fireEvent.change(limitInput, { target: { value: '20' } })

    expect(mockUpdateSearchForm).toHaveBeenCalledWith('limit', '20')
  })

  it('should call updateSearchForm when offset input changes', () => {
    render(
      <SearchForm
        searchForm={defaultSearchForm}
        updateSearchForm={mockUpdateSearchForm}
      />
    )

    const offsetInput = screen.getByLabelText('Offset')
    fireEvent.change(offsetInput, { target: { value: '10' } })

    expect(mockUpdateSearchForm).toHaveBeenCalledWith('offset', '10')
  })

  it('should display current form values', () => {
    const formWithValues = {
      query: 'banana',
      limit: '15',
      offset: '5',
    }

    render(
      <SearchForm
        searchForm={formWithValues}
        updateSearchForm={mockUpdateSearchForm}
      />
    )

    expect(screen.getByDisplayValue('banana')).toBeVisible()
    expect(screen.getByDisplayValue('15')).toBeVisible()
    expect(screen.getByDisplayValue('5')).toBeVisible()
  })

  it('should have proper input types and attributes', () => {
    render(
      <SearchForm
        searchForm={defaultSearchForm}
        updateSearchForm={mockUpdateSearchForm}
      />
    )

    const limitInput = screen.getByLabelText('Limit')
    expect(limitInput).toHaveAttribute('type', 'number')
    expect(limitInput).toHaveAttribute('min', '1')

    const offsetInput = screen.getByLabelText('Offset')
    expect(offsetInput).toHaveAttribute('type', 'number')
    expect(offsetInput).toHaveAttribute('min', '0')
  })

  it('should show placeholder text for inputs', () => {
    render(
      <SearchForm
        searchForm={defaultSearchForm}
        updateSearchForm={mockUpdateSearchForm}
      />
    )

    const queryInput = screen.getByLabelText('Search Query *')
    expect(queryInput).toHaveAttribute('placeholder')

    const limitInput = screen.getByLabelText('Limit')
    expect(limitInput).toHaveAttribute('placeholder')

    const offsetInput = screen.getByLabelText('Offset')
    expect(offsetInput).toHaveAttribute('placeholder')
  })
})
