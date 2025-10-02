import { DEFAULT_WORD_FORM_STATE } from '@/lib/constants'
import { useState } from 'react'
import { WordFormState } from '../WordForm/WordForm'

export const useWordForm = () => {
  const [wordForm, setWordForm] = useState<WordFormState>(
    DEFAULT_WORD_FORM_STATE
  )

  const updateWordForm = (key: keyof WordFormState, value: string) => {
    setWordForm((prev) => ({ ...prev, [key]: value }))
  }

  const resetWordForm = () => {
    setWordForm(DEFAULT_WORD_FORM_STATE)
  }

  return {
    wordForm,
    updateWordForm,
    resetWordForm,
  }
}
