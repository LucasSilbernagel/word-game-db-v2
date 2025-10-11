import {
  WordForm,
  type WordFormState,
} from '@/components/EndpointDemo/WordForm/WordForm'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockCategories = ['fruit', 'animal', 'color', 'food']

const defaultWordForm: WordFormState = {
  word: '',
  category: '',
  newCategory: '',
  numLetters: '',
  numSyllables: '',
  hint: '',
  categoryMode: 'existing',
}

describe('WordForm', () => {
  const mockUpdateWordForm = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all form fields', () => {
    render(
      <WordForm
        wordForm={defaultWordForm}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    expect(screen.getByLabelText(/word/i)).toBeVisible()
    expect(screen.getByLabelText(/hint/i)).toBeVisible()
    expect(screen.getByLabelText(/letters/i)).toBeVisible()
    expect(screen.getByLabelText(/syllables/i)).toBeVisible()
    expect(screen.getByText(/select existing category/i)).toBeVisible()
    expect(screen.getByText(/create new category/i)).toBeVisible()
  })

  it('should call updateWordForm when input values change', () => {
    render(
      <WordForm
        wordForm={defaultWordForm}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    const wordInput = screen.getByLabelText(/word/i)
    fireEvent.change(wordInput, { target: { value: 'apple' } })

    expect(mockUpdateWordForm).toHaveBeenCalledWith('word', 'apple')
  })

  it('should call updateWordForm when hint input changes', () => {
    render(
      <WordForm
        wordForm={defaultWordForm}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    const hintInput = screen.getByLabelText(/hint/i)
    fireEvent.change(hintInput, { target: { value: 'A red fruit' } })

    expect(mockUpdateWordForm).toHaveBeenCalledWith('hint', 'A red fruit')
  })

  it('should call updateWordForm when number inputs change', () => {
    render(
      <WordForm
        wordForm={defaultWordForm}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    const numLettersInput = screen.getByLabelText(/letters/i)
    fireEvent.change(numLettersInput, { target: { value: '5' } })

    expect(mockUpdateWordForm).toHaveBeenCalledWith('numLetters', '5')

    const numSyllablesInput = screen.getByLabelText(/syllables/i)
    fireEvent.change(numSyllablesInput, { target: { value: '2' } })

    expect(mockUpdateWordForm).toHaveBeenCalledWith('numSyllables', '2')
  })

  it('should show category select when existing category mode is selected', () => {
    render(
      <WordForm
        wordForm={{ ...defaultWordForm, categoryMode: 'existing' }}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    expect(screen.getByRole('combobox')).toBeVisible()
    expect(screen.queryByLabelText('New Category: *')).not.toBeInTheDocument()
  })

  it('should show new category input when new category mode is selected', () => {
    render(
      <WordForm
        wordForm={{ ...defaultWordForm, categoryMode: 'new' }}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    expect(screen.getByLabelText('New Category: *')).toBeVisible()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('should call updateWordForm when category mode changes', () => {
    render(
      <WordForm
        wordForm={defaultWordForm}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    const newCategoryRadio = screen.getByLabelText(/create new category/i)
    fireEvent.click(newCategoryRadio)

    expect(mockUpdateWordForm).toHaveBeenCalledWith('categoryMode', 'new')
  })

  it('should display all categories in the select', () => {
    render(
      <WordForm
        wordForm={{ ...defaultWordForm, categoryMode: 'existing' }}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    const selectTrigger = screen.getByRole('combobox')
    fireEvent.click(selectTrigger)

    for (const category of mockCategories) {
      expect(screen.getByText(category)).toBeVisible()
    }
  })

  it('should call updateWordForm when category is selected', () => {
    render(
      <WordForm
        wordForm={{ ...defaultWordForm, categoryMode: 'existing' }}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    const selectTrigger = screen.getByRole('combobox')
    fireEvent.click(selectTrigger)

    const fruitOption = screen.getByText('fruit')
    fireEvent.click(fruitOption)

    expect(mockUpdateWordForm).toHaveBeenCalledWith('category', 'fruit')
  })

  it('should call updateWordForm when new category input changes', () => {
    render(
      <WordForm
        wordForm={{ ...defaultWordForm, categoryMode: 'new' }}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    const newCategoryInput = screen.getByLabelText('New Category: *')
    fireEvent.change(newCategoryInput, { target: { value: 'vegetable' } })

    expect(mockUpdateWordForm).toHaveBeenCalledWith('newCategory', 'vegetable')
  })

  it('should display current form values', () => {
    const formWithValues: WordFormState = {
      word: 'apple',
      category: 'fruit',
      newCategory: '',
      numLetters: '5',
      numSyllables: '2',
      hint: 'A red fruit',
      categoryMode: 'existing',
    }

    render(
      <WordForm
        wordForm={formWithValues}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    expect(screen.getByDisplayValue('apple')).toBeVisible()
    expect(screen.getByDisplayValue('5')).toBeVisible()
    expect(screen.getByDisplayValue('2')).toBeVisible()
    expect(screen.getByDisplayValue('A red fruit')).toBeVisible()
  })

  it('should have proper input types and attributes', () => {
    render(
      <WordForm
        wordForm={defaultWordForm}
        updateWordForm={mockUpdateWordForm}
        categories={mockCategories}
      />
    )

    const numLettersInput = screen.getByLabelText(/letters/i)
    expect(numLettersInput).toHaveAttribute('type', 'number')
    expect(numLettersInput).toHaveAttribute('min', '1')

    const numSyllablesInput = screen.getByLabelText(/syllables/i)
    expect(numSyllablesInput).toHaveAttribute('type', 'number')
    expect(numSyllablesInput).toHaveAttribute('min', '1')
  })
})
