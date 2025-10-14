import {
  WordDataForm,
  type WordDataFormState,
} from '@/components/EndpointDemo/WordDataForm'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockCategories = ['fruit', 'animal', 'color', 'food']

const baseFormState = {
  word: '',
  category: '',
  newCategory: '',
  numLetters: '',
  numSyllables: '',
  hint: '',
  categoryMode: 'existing' as const,
}

const defaultCreateForm: WordDataFormState = baseFormState

const defaultUpdateForm: WordDataFormState = {
  id: '',
  ...baseFormState,
}

describe('WordDataForm', () => {
  const mockUpdateFormField = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Create Mode', () => {
    it('should render all form fields for create mode', () => {
      render(
        <WordDataForm
          mode="create"
          formState={defaultCreateForm}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      expect(screen.getByText('Create New Word')).toBeVisible()
      expect(screen.getByLabelText('Word: *')).toBeVisible()
      expect(screen.getByLabelText('Hint: *')).toBeVisible()
      expect(screen.getByLabelText('Number of Letters: *')).toBeVisible()
      expect(screen.getByLabelText('Number of Syllables: *')).toBeVisible()
      expect(screen.getByText('Select existing category')).toBeVisible()
      expect(screen.getByText('Create new category')).toBeVisible()
    })

    it('should not show ID field in create mode', () => {
      render(
        <WordDataForm
          mode="create"
          formState={defaultCreateForm}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      expect(screen.queryByLabelText('Word ID: *')).not.toBeInTheDocument()
    })

    it('should not show note box in create mode', () => {
      render(
        <WordDataForm
          mode="create"
          formState={defaultCreateForm}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      expect(screen.queryByText('Note:')).not.toBeInTheDocument()
    })

    it('should call updateFormField when input values change', () => {
      render(
        <WordDataForm
          mode="create"
          formState={defaultCreateForm}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      const wordInput = screen.getByLabelText('Word: *')
      fireEvent.change(wordInput, { target: { value: 'apple' } })

      expect(mockUpdateFormField).toHaveBeenCalledWith('word', 'apple')
    })

    it('should show category select when existing category mode is selected', () => {
      render(
        <WordDataForm
          mode="create"
          formState={{ ...defaultCreateForm, categoryMode: 'existing' }}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      expect(screen.getByRole('combobox')).toBeVisible()
      expect(screen.queryByLabelText('New Category: *')).not.toBeInTheDocument()
    })

    it('should show new category input when new category mode is selected', () => {
      render(
        <WordDataForm
          mode="create"
          formState={{ ...defaultCreateForm, categoryMode: 'new' }}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      expect(screen.getByLabelText('New Category: *')).toBeVisible()
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    })

    it('should display all categories in the select', () => {
      render(
        <WordDataForm
          mode="create"
          formState={{ ...defaultCreateForm, categoryMode: 'existing' }}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      const selectTrigger = screen.getByRole('combobox')
      fireEvent.click(selectTrigger)

      for (const category of mockCategories) {
        expect(screen.getByText(category)).toBeVisible()
      }
    })

    it('should have proper input types and attributes', () => {
      render(
        <WordDataForm
          mode="create"
          formState={defaultCreateForm}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      const numLettersInput = screen.getByLabelText('Number of Letters: *')
      expect(numLettersInput).toHaveAttribute('type', 'number')
      expect(numLettersInput).toHaveAttribute('min', '1')

      const numSyllablesInput = screen.getByLabelText('Number of Syllables: *')
      expect(numSyllablesInput).toHaveAttribute('type', 'number')
      expect(numSyllablesInput).toHaveAttribute('min', '1')
    })
  })

  describe('Update Mode', () => {
    it('should render all form fields for update mode', () => {
      render(
        <WordDataForm
          mode="update"
          formState={defaultUpdateForm}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      expect(screen.getByText('Update Word')).toBeVisible()
      expect(screen.getByLabelText('Word ID: *')).toBeVisible()
      expect(screen.getByLabelText('Word:')).toBeVisible()
      expect(screen.getByLabelText('Hint:')).toBeVisible()
      expect(screen.getByLabelText('Number of Letters:')).toBeVisible()
      expect(screen.getByLabelText('Number of Syllables:')).toBeVisible()
    })

    it('should show ID field in update mode', () => {
      render(
        <WordDataForm
          mode="update"
          formState={defaultUpdateForm}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      expect(screen.getByLabelText('Word ID: *')).toBeVisible()
    })

    it('should show note box in update mode', () => {
      render(
        <WordDataForm
          mode="update"
          formState={defaultUpdateForm}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      expect(screen.getByText('Note:')).toBeVisible()
      expect(
        screen.getByText(/Only the fields you want to update need to be filled/)
      ).toBeVisible()
    })

    it('should render category selection section', () => {
      render(
        <WordDataForm
          mode="update"
          formState={defaultUpdateForm}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      expect(screen.getByText('Category')).toBeVisible()
      expect(screen.getByText('Select existing category')).toBeVisible()
      expect(screen.getByText('Create new category')).toBeVisible()
    })

    it('should render existing category select when categoryMode is existing', () => {
      render(
        <WordDataForm
          mode="update"
          formState={defaultUpdateForm}
          updateFormField={mockUpdateFormField}
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
        <WordDataForm
          mode="update"
          formState={updateFormWithNewCategoryMode}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      expect(screen.getByText('New Category:')).toBeVisible()
      expect(screen.getByLabelText('New Category:')).toBeVisible()
      expect(screen.getByPlaceholderText('e.g., technology')).toBeVisible()
    })

    it('should handle input changes', () => {
      render(
        <WordDataForm
          mode="update"
          formState={defaultUpdateForm}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      const wordInput = screen.getByLabelText('Word:')
      fireEvent.change(wordInput, { target: { value: 'elephant' } })

      expect(mockUpdateFormField).toHaveBeenCalledWith('word', 'elephant')
    })

    it('should handle category selection', async () => {
      render(
        <WordDataForm
          mode="update"
          formState={defaultUpdateForm}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      const categorySelect = screen.getByRole('combobox')
      fireEvent.click(categorySelect)

      await waitFor(() => {
        expect(screen.getByText('animal')).toBeVisible()
      })

      fireEvent.click(screen.getByText('animal'))

      expect(mockUpdateFormField).toHaveBeenCalledWith('category', 'animal')
    })

    it('should display current form values', () => {
      const updateFormWithValues: WordDataFormState = {
        id: 'test-id-123',
        word: 'giraffe',
        hint: 'Tall animal',
        numLetters: '7',
        numSyllables: '2',
        category: 'animal',
        newCategory: '',
        categoryMode: 'existing',
      }

      render(
        <WordDataForm
          mode="update"
          formState={updateFormWithValues}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      expect(screen.getByDisplayValue('test-id-123')).toBeVisible()
      expect(screen.getByDisplayValue('giraffe')).toBeVisible()
      expect(screen.getByDisplayValue('Tall animal')).toBeVisible()
      expect(screen.getByDisplayValue('7')).toBeVisible()
      expect(screen.getByDisplayValue('2')).toBeVisible()
    })

    it('should handle empty categories array', () => {
      render(
        <WordDataForm
          mode="update"
          formState={defaultUpdateForm}
          updateFormField={mockUpdateFormField}
          categories={[]}
        />
      )

      const categorySelect = screen.getByRole('combobox')
      fireEvent.click(categorySelect)

      // Should not crash with empty categories
      expect(categorySelect).toBeVisible()
    })
  })

  describe('Common Behavior', () => {
    it.each([
      { mode: 'create' as const, formState: defaultCreateForm },
      { mode: 'update' as const, formState: defaultUpdateForm },
    ])(
      'should handle hint input changes in $mode mode',
      ({ mode, formState }) => {
        render(
          <WordDataForm
            mode={mode}
            formState={formState}
            updateFormField={mockUpdateFormField}
            categories={mockCategories}
          />
        )

        const hintInput = screen.getByLabelText(/Hint/)
        fireEvent.change(hintInput, { target: { value: 'A test hint' } })

        expect(mockUpdateFormField).toHaveBeenCalledWith('hint', 'A test hint')
      }
    )

    it.each([
      { mode: 'create' as const, formState: defaultCreateForm },
      { mode: 'update' as const, formState: defaultUpdateForm },
    ])('should handle number inputs in $mode mode', ({ mode, formState }) => {
      render(
        <WordDataForm
          mode={mode}
          formState={formState}
          updateFormField={mockUpdateFormField}
          categories={mockCategories}
        />
      )

      const numLettersInput = screen.getByLabelText(/Number of Letters/)
      fireEvent.change(numLettersInput, { target: { value: '5' } })

      expect(mockUpdateFormField).toHaveBeenCalledWith('numLetters', '5')

      const numSyllablesInput = screen.getByLabelText(/Number of Syllables/)
      fireEvent.change(numSyllablesInput, { target: { value: '2' } })

      expect(mockUpdateFormField).toHaveBeenCalledWith('numSyllables', '2')
    })

    it.each([
      { mode: 'create' as const, formState: defaultCreateForm },
      { mode: 'update' as const, formState: defaultUpdateForm },
    ])(
      'should handle category mode changes in $mode mode',
      ({ mode, formState }) => {
        render(
          <WordDataForm
            mode={mode}
            formState={formState}
            updateFormField={mockUpdateFormField}
            categories={mockCategories}
          />
        )

        const newCategoryRadio = screen.getByLabelText('Create new category')
        fireEvent.click(newCategoryRadio)

        expect(mockUpdateFormField).toHaveBeenCalledWith('categoryMode', 'new')
      }
    )

    it.each([
      {
        mode: 'create' as const,
        formState: { ...defaultCreateForm, categoryMode: 'new' as const },
      },
      {
        mode: 'update' as const,
        formState: { ...defaultUpdateForm, categoryMode: 'new' as const },
      },
    ])(
      'should handle new category input in $mode mode',
      ({ mode, formState }) => {
        render(
          <WordDataForm
            mode={mode}
            formState={formState}
            updateFormField={mockUpdateFormField}
            categories={mockCategories}
          />
        )

        const newCategoryInput = screen.getByLabelText(/New Category/)
        fireEvent.change(newCategoryInput, { target: { value: 'vegetable' } })

        expect(mockUpdateFormField).toHaveBeenCalledWith(
          'newCategory',
          'vegetable'
        )
      }
    )

    it.each([
      {
        mode: 'create' as const,
        formState: defaultCreateForm,
        label: 'Word: *',
      },
      { mode: 'update' as const, formState: defaultUpdateForm, label: 'Word:' },
    ])(
      'should have unique IDs for inputs in $mode mode',
      ({ mode, formState, label }) => {
        render(
          <WordDataForm
            mode={mode}
            formState={formState}
            updateFormField={mockUpdateFormField}
            categories={mockCategories}
          />
        )

        const wordInput = screen.getByLabelText(label)
        expect(wordInput).toHaveAttribute('id', `${mode}-word`)
      }
    )

    it('should allow both create and update forms to be rendered simultaneously', () => {
      const { container } = render(
        <div>
          <WordDataForm
            mode="create"
            formState={defaultCreateForm}
            updateFormField={mockUpdateFormField}
            categories={mockCategories}
          />
          <WordDataForm
            mode="update"
            formState={defaultUpdateForm}
            updateFormField={mockUpdateFormField}
            categories={mockCategories}
          />
        </div>
      )

      // Both forms should be present
      expect(screen.getByText('Create New Word')).toBeVisible()
      expect(screen.getByText('Update Word')).toBeVisible()

      // IDs should be unique for both forms
      const createWordInput = container.querySelector('#create-word')
      const updateWordInput = container.querySelector('#update-word')

      expect(createWordInput).toBeInTheDocument()
      expect(updateWordInput).toBeInTheDocument()
    })
  })
})
