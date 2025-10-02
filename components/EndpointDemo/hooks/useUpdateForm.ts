import { DEFAULT_UPDATE_FORM_STATE } from '@/lib/constants'
import { useState } from 'react'
import { UpdateFormState } from '../UpdateForm/UpdateForm'

export const useUpdateForm = () => {
  const [updateForm, setUpdateForm] = useState<UpdateFormState>(
    DEFAULT_UPDATE_FORM_STATE
  )

  const updateUpdateForm = (key: keyof UpdateFormState, value: string) => {
    setUpdateForm((prev) => ({ ...prev, [key]: value }))
  }

  const resetUpdateForm = () => {
    setUpdateForm(DEFAULT_UPDATE_FORM_STATE)
  }

  return {
    updateForm,
    updateUpdateForm,
    resetUpdateForm,
  }
}
