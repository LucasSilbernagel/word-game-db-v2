import { UpdateForm } from '@/components/EndpointDemo/UpdateForm/UpdateForm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '../utils/test-utils'

describe('UpdateForm', () => {
  const mockUpdateUpdateForm = vi.fn()
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
  const mockCategories = ['animal', 'fruit', 'color', 'technology']

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with default props', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    expect(screen.getByText('Update Word')).toBeVisible()
    expect(screen.getByText('Note:')).toBeVisible()
    expect(screen.getByLabelText('Word ID: *')).toBeVisible()
  })

  it('should render all form fields', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    expect(screen.getByLabelText('Word ID: *')).toBeVisible()
    expect(screen.getByLabelText('Word:')).toBeVisible()
    expect(screen.getByLabelText('Hint:')).toBeVisible()
    expect(screen.getByLabelText('Number of Letters:')).toBeVisible()
    expect(screen.getByLabelText('Number of Syllables:')).toBeVisible()
  })

  it('should render category selection section', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    expect(screen.getByText('Category')).toBeVisible()
    expect(screen.getByText('Select existing category')).toBeVisible()
    expect(screen.getByText('Create new category')).toBeVisible()
  })

  it('should render existing category select when categoryMode is existing', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    expect(screen.getByText('Category:')).toBeVisible()
    expect(screen.getByRole('combobox')).toBeVisible()
    expect(screen.getByText('Keep existing category')).toBeVisible()
  })

  it('should render new category input when categoryMode is new', () => {
    const updateFormWithNewCategoryMode = {
      ...defaultUpdateForm,
      categoryMode: 'new' as const,
    }

    render(
      <UpdateForm
        updateForm={updateFormWithNewCategoryMode}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    expect(screen.getByText('New Category:')).toBeVisible()
    expect(screen.getByLabelText('New Category:')).toBeVisible()
    expect(screen.getByPlaceholderText('e.g., technology')).toBeVisible()
  })

  it('should handle input changes', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    const wordInput = screen.getByLabelText('Word:')
    fireEvent.change(wordInput, { target: { value: 'elephant' } })

    expect(mockUpdateUpdateForm).toHaveBeenCalledWith('word', 'elephant')
  })

  it('should handle category mode changes', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    const newCategoryRadio = screen.getByLabelText('Create new category')
    fireEvent.click(newCategoryRadio)

    expect(mockUpdateUpdateForm).toHaveBeenCalledWith('categoryMode', 'new')
  })

  it('should handle category selection', async () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    const categorySelect = screen.getByRole('combobox')
    fireEvent.click(categorySelect)

    await waitFor(() => {
      expect(screen.getByText('animal')).toBeVisible()
    })

    fireEvent.click(screen.getByText('animal'))

    expect(mockUpdateUpdateForm).toHaveBeenCalledWith('category', 'animal')
  })

  it('should handle new category input changes', () => {
    const updateFormWithNewCategoryMode = {
      ...defaultUpdateForm,
      categoryMode: 'new' as const,
    }

    render(
      <UpdateForm
        updateForm={updateFormWithNewCategoryMode}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    const newCategoryInput = screen.getByLabelText('New Category:')
    fireEvent.change(newCategoryInput, { target: { value: 'technology' } })

    expect(mockUpdateUpdateForm).toHaveBeenCalledWith(
      'newCategory',
      'technology'
    )
  })

  it('should display current form values', () => {
    const updateFormWithValues = {
      ...defaultUpdateForm,
      id: 'test-id-123',
      word: 'giraffe',
      hint: 'Tall animal',
      numLetters: '7',
      numSyllables: '2',
      category: 'animal',
    }

    render(
      <UpdateForm
        updateForm={updateFormWithValues}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    expect(screen.getByDisplayValue('test-id-123')).toBeVisible()
    expect(screen.getByDisplayValue('giraffe')).toBeVisible()
    expect(screen.getByDisplayValue('Tall animal')).toBeVisible()
    expect(screen.getByDisplayValue('7')).toBeVisible()
    expect(screen.getByDisplayValue('2')).toBeVisible()
  })

  it('should render warning message with proper styling', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    const warningBox = screen.getByText('Note:').closest('div')
    expect(warningBox).toHaveClass(
      'rounded-md',
      'border',
      'border-blue-200',
      'bg-blue-50',
      'p-3',
      'dark:border-blue-800',
      'dark:bg-blue-900/20'
    )

    const warningText = screen.getByText('Note:').closest('p')
    expect(warningText).toHaveClass(
      'text-xs',
      'text-blue-800',
      'dark:text-blue-200'
    )
  })

  it('should have proper styling classes', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    const container = screen.getByText('Update Word').parentElement
    expect(container).toHaveClass('space-y-4')

    const heading = screen.getByText('Update Word')
    expect(heading).toHaveClass(
      'mb-3',
      'text-sm',
      'font-medium',
      'text-gray-700',
      'dark:text-gray-300'
    )

    const gridContainer = screen.getByLabelText('Word:').closest('.grid')
    expect(gridContainer).toHaveClass(
      'grid',
      'grid-cols-1',
      'gap-4',
      'md:grid-cols-2'
    )
  })

  it('should have proper accessibility attributes', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    const idInput = screen.getByLabelText('Word ID: *')
    const idLabel = screen.getByText('Word ID: *')

    expect(idLabel).toHaveAttribute('for', 'update-id')
    expect(idInput).toHaveAttribute('id', 'update-id')
  })

  it('should handle numeric input changes', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    const numLettersInput = screen.getByLabelText('Number of Letters:')
    fireEvent.change(numLettersInput, { target: { value: '8' } })

    expect(mockUpdateUpdateForm).toHaveBeenCalledWith('numLetters', '8')

    const numSyllablesInput = screen.getByLabelText('Number of Syllables:')
    fireEvent.change(numSyllablesInput, { target: { value: '3' } })

    expect(mockUpdateUpdateForm).toHaveBeenCalledWith('numSyllables', '3')
  })

  it('should have proper input attributes', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    const numLettersInput = screen.getByLabelText('Number of Letters:')
    expect(numLettersInput).toHaveAttribute('type', 'number')
    expect(numLettersInput).toHaveAttribute('min', '1')

    const numSyllablesInput = screen.getByLabelText('Number of Syllables:')
    expect(numSyllablesInput).toHaveAttribute('type', 'number')
    expect(numSyllablesInput).toHaveAttribute('min', '1')
  })

  it('should render help text', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    expect(
      screen.getByText(/Enter the ID of the word you want to update/)
    ).toBeVisible()
    expect(
      screen.getByText(
        /You can leave other fields empty to keep existing values/
      )
    ).toBeVisible()
  })

  it('should handle empty categories array', () => {
    render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={[]}
      />
    )

    const categorySelect = screen.getByRole('combobox')
    fireEvent.click(categorySelect)

    // Should not crash with empty categories
    expect(categorySelect).toBeVisible()
  })

  it('should switch between category modes correctly', () => {
    const { rerender } = render(
      <UpdateForm
        updateForm={defaultUpdateForm}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    // Initially should show existing category select
    expect(screen.getByText('Category:')).toBeVisible()
    expect(screen.queryByText('New Category:')).not.toBeInTheDocument()

    // Switch to new category mode
    const updateFormWithNewMode = {
      ...defaultUpdateForm,
      categoryMode: 'new' as const,
    }

    rerender(
      <UpdateForm
        updateForm={updateFormWithNewMode}
        updateUpdateForm={mockUpdateUpdateForm}
        categories={mockCategories}
      />
    )

    expect(screen.getByText('New Category:')).toBeVisible()
    expect(screen.queryByText('Category:')).not.toBeInTheDocument()
  })
})
