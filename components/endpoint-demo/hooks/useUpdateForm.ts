import { useState } from 'react'
import { UpdateFormState } from '../UpdateForm/UpdateForm'

export const useUpdateForm = () => {
  const [updateForm, setUpdateForm] = useState<UpdateFormState>({
    id: '',
    word: '',
    category: '',
    newCategory: '',
    numLetters: '',
    numSyllables: '',
    hint: '',
    categoryMode: 'existing',
  })

  const updateUpdateForm = (key: keyof UpdateFormState, value: string) => {
    setUpdateForm((prev) => ({ ...prev, [key]: value }))
  }

  const resetUpdateForm = () => {
    setUpdateForm({
      id: '',
      word: '',
      category: '',
      newCategory: '',
      numLetters: '',
      numSyllables: '',
      hint: '',
      categoryMode: 'existing',
    })
  }

  return {
    updateForm,
    updateUpdateForm,
    resetUpdateForm,
  }
}
