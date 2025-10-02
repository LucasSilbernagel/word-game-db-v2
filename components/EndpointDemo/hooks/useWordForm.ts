import { DEFAULT_WORD_FORM_STATE } from '@/lib/constants'
import { useGenericForm } from '@/lib/hooks/useGenericForm'
import { WordFormState } from '../WordForm/WordForm'

export const useWordForm = () => {
  const {
    formState: wordForm,
    updateField: updateWordForm,
    resetForm: resetWordForm,
  } = useGenericForm<WordFormState>(DEFAULT_WORD_FORM_STATE)

  return {
    wordForm,
    updateWordForm,
    resetWordForm,
  }
}
