import { useGenericForm } from '@/lib/hooks/useGenericForm'
import { WordDataFormState } from '../WordDataForm'

type UseWordDataFormProps = {
  mode: 'create' | 'update'
}

export const useWordDataForm = ({ mode }: UseWordDataFormProps) => {
  const initialState: WordDataFormState = {
    ...(mode === 'update' && { id: '' }),
    word: '',
    category: '',
    newCategory: '',
    numLetters: '',
    numSyllables: '',
    hint: '',
    categoryMode: 'existing',
  }

  const { formState, updateField, resetForm } =
    useGenericForm<WordDataFormState>(initialState)

  return {
    formState,
    updateFormField: updateField,
    resetForm,
  }
}
