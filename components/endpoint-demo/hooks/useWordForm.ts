import { useState } from 'react'
import { WordFormState } from '../WordForm/WordForm'

export const useWordForm = () => {
  const [wordForm, setWordForm] = useState<WordFormState>({
    word: '',
    category: '',
    newCategory: '',
    numLetters: '',
    numSyllables: '',
    hint: '',
    categoryMode: 'existing',
  })

  const updateWordForm = (key: keyof WordFormState, value: string) => {
    setWordForm((prev) => ({ ...prev, [key]: value }))
  }

  const resetWordForm = () => {
    setWordForm({
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
    wordForm,
    updateWordForm,
    resetWordForm,
  }
}
