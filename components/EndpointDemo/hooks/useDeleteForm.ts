import { DEFAULT_DELETE_FORM_STATE } from '@/lib/constants'
import { useState } from 'react'
import { DeleteFormState } from '../DeleteForm/DeleteForm'

export const useDeleteForm = () => {
  const [deleteForm, setDeleteForm] = useState<DeleteFormState>(
    DEFAULT_DELETE_FORM_STATE
  )

  const updateDeleteForm = (key: keyof DeleteFormState, value: string) => {
    setDeleteForm((prev) => ({ ...prev, [key]: value }))
  }

  const resetDeleteForm = () => {
    setDeleteForm(DEFAULT_DELETE_FORM_STATE)
  }

  return {
    deleteForm,
    updateDeleteForm,
    resetDeleteForm,
  }
}
