import { useState } from 'react'
import { DeleteFormState } from '../DeleteForm/DeleteForm'

export const useDeleteForm = () => {
  const [deleteForm, setDeleteForm] = useState<DeleteFormState>({
    id: '',
  })

  const updateDeleteForm = (key: keyof DeleteFormState, value: string) => {
    setDeleteForm((prev) => ({ ...prev, [key]: value }))
  }

  const resetDeleteForm = () => {
    setDeleteForm({
      id: '',
    })
  }

  return {
    deleteForm,
    updateDeleteForm,
    resetDeleteForm,
  }
}
