import { useGenericForm } from '@/lib/hooks/useGenericForm'
import { WordFormState } from '../WordForm/WordForm'

export const useWordForm = () => {
  const {
    formState: wordForm,
    updateField: updateWordForm,
    resetForm: resetWordForm,
  } = useGenericForm<WordFormState>({
    word: '',
    category: '',
    newCategory: '',
    numLetters: '',
    numSyllables: '',
    hint: '',
    categoryMode: 'existing',
  })

  return {
    wordForm,
    updateWordForm,
    resetWordForm,
  }
}
