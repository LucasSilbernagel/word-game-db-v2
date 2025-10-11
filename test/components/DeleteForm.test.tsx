import { DeleteForm } from '@/components/EndpointDemo/DeleteForm/DeleteForm'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('DeleteForm', () => {
  const mockUpdateDeleteForm = vi.fn()
  const defaultDeleteForm = {
    id: '',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with default props', () => {
    render(
      <DeleteForm
        deleteForm={defaultDeleteForm}
        updateDeleteForm={mockUpdateDeleteForm}
      />
    )

    expect(screen.getByText('Delete Word')).toBeVisible()
    expect(screen.getByText('Warning:')).toBeVisible()
    expect(screen.getByLabelText('Word ID: *')).toBeVisible()
  })

  it('should render warning message with proper styling', () => {
    render(
      <DeleteForm
        deleteForm={defaultDeleteForm}
        updateDeleteForm={mockUpdateDeleteForm}
      />
    )

    const warningBox = screen.getByText('Warning:').closest('div')
    expect(warningBox).toHaveClass(
      'rounded-md',
      'border',
      'border-red-200',
      'bg-red-50',
      'p-3',
      'dark:border-red-800',
      'dark:bg-red-900/20'
    )

    const warningText = screen.getByText('Warning:').closest('p')
    expect(warningText).toHaveClass(
      'text-xs',
      'text-red-800',
      'dark:text-red-200'
    )
  })

  it('should render word ID input with proper attributes', () => {
    render(
      <DeleteForm
        deleteForm={defaultDeleteForm}
        updateDeleteForm={mockUpdateDeleteForm}
      />
    )

    const idInput = screen.getByLabelText('Word ID: *')
    expect(idInput).toHaveAttribute('id', 'delete-id')
    expect(idInput).toHaveAttribute('type', 'text')
    expect(idInput).toHaveAttribute(
      'placeholder',
      'e.g., 5ffa1774c0831cbe1460e29c'
    )
    expect(idInput).toHaveValue('')
  })

  it('should handle input changes', () => {
    render(
      <DeleteForm
        deleteForm={defaultDeleteForm}
        updateDeleteForm={mockUpdateDeleteForm}
      />
    )

    const idInput = screen.getByLabelText('Word ID: *')
    fireEvent.change(idInput, { target: { value: 'test-id-123' } })

    expect(mockUpdateDeleteForm).toHaveBeenCalledWith('id', 'test-id-123')
  })

  it('should display current form value', () => {
    const deleteFormWithValue = {
      id: 'existing-id-456',
    }

    render(
      <DeleteForm
        deleteForm={deleteFormWithValue}
        updateDeleteForm={mockUpdateDeleteForm}
      />
    )

    const idInput = screen.getByLabelText('Word ID: *')
    expect(idInput).toHaveValue('existing-id-456')
  })

  it('should render help text', () => {
    render(
      <DeleteForm
        deleteForm={defaultDeleteForm}
        updateDeleteForm={mockUpdateDeleteForm}
      />
    )

    expect(
      screen.getByText(/Enter the ID of the word you want to delete/)
    ).toBeVisible()
    expect(
      screen.getByText(
        /You can find word IDs by using the GET \/api\/v2\/words endpoint/
      )
    ).toBeVisible()
  })

  it('should have proper styling classes', () => {
    render(
      <DeleteForm
        deleteForm={defaultDeleteForm}
        updateDeleteForm={mockUpdateDeleteForm}
      />
    )

    const container = screen.getByText('Delete Word').parentElement
    expect(container).toHaveClass('space-y-4')

    const heading = screen.getByText('Delete Word')
    expect(heading).toHaveClass(
      'mb-3',
      'text-sm',
      'font-medium',
      'text-gray-700',
      'dark:text-gray-300'
    )

    const label = screen.getByText('Word ID: *')
    expect(label).toHaveClass(
      'text-xs',
      'font-medium',
      'text-gray-600',
      'dark:text-gray-400'
    )

    const helpText = screen.getByText(
      /Enter the ID of the word you want to delete/
    )
    expect(helpText).toHaveClass(
      'mt-1',
      'text-xs',
      'text-gray-500',
      'dark:text-gray-400'
    )
  })

  it('should have proper accessibility attributes', () => {
    render(
      <DeleteForm
        deleteForm={defaultDeleteForm}
        updateDeleteForm={mockUpdateDeleteForm}
      />
    )

    const idInput = screen.getByLabelText('Word ID: *')
    const label = screen.getByText('Word ID: *')

    expect(label).toHaveAttribute('for', 'delete-id')
    expect(idInput).toHaveAttribute('id', 'delete-id')
  })

  it('should handle multiple input changes', () => {
    render(
      <DeleteForm
        deleteForm={defaultDeleteForm}
        updateDeleteForm={mockUpdateDeleteForm}
      />
    )

    const idInput = screen.getByLabelText('Word ID: *')

    fireEvent.change(idInput, { target: { value: 'first-id' } })
    expect(mockUpdateDeleteForm).toHaveBeenCalledWith('id', 'first-id')

    fireEvent.change(idInput, { target: { value: 'second-id' } })
    expect(mockUpdateDeleteForm).toHaveBeenCalledWith('id', 'second-id')

    expect(mockUpdateDeleteForm).toHaveBeenCalledTimes(2)
  })

  it('should render with proper form structure', () => {
    render(
      <DeleteForm
        deleteForm={defaultDeleteForm}
        updateDeleteForm={mockUpdateDeleteForm}
      />
    )

    const container = screen.getByText('Delete Word').parentElement
    const heading = screen.getByText('Delete Word')
    const warningBox = screen.getByText('Warning:').closest('div')
    const inputContainer = screen.getByLabelText('Word ID: *').closest('div')

    expect(container).toContainElement(heading)
    expect(container).toContainElement(warningBox)
    expect(container).toContainElement(inputContainer)
  })

  it('should handle empty string input', () => {
    render(
      <DeleteForm
        deleteForm={{ id: 'test-id' }}
        updateDeleteForm={mockUpdateDeleteForm}
      />
    )

    const idInput = screen.getByLabelText('Word ID: *')
    fireEvent.change(idInput, { target: { value: '' } })

    expect(mockUpdateDeleteForm).toHaveBeenCalledWith('id', '')
  })
})
