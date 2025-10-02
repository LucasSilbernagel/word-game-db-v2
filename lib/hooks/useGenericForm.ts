import { useCallback, useState } from 'react'

/**
 * Generic form hook that provides common form state management functionality
 * Eliminates repetitive form handling logic across different form types
 */
export const useGenericForm = <T extends Record<string, unknown>>(
  initialState: T
) => {
  const [formState, setFormState] = useState<T>(initialState)

  const updateField = useCallback((key: keyof T, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateFields = useCallback((updates: Partial<T>) => {
    setFormState((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetForm = useCallback(() => {
    setFormState(initialState)
  }, [initialState])

  const setFormState_ = useCallback((newState: T) => {
    setFormState(newState)
  }, [])

  return {
    formState,
    updateField,
    updateFields,
    resetForm,
    setFormState: setFormState_,
  }
}
