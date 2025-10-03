import { useGenericForm } from '@/lib/hooks/useGenericForm'
import { UpdateFormState } from '../UpdateForm/UpdateForm'

export const useUpdateForm = () => {
  const {
    formState: updateForm,
    updateField: updateUpdateForm,
    resetForm: resetUpdateForm,
  } = useGenericForm<UpdateFormState>({
    id: '',
    word: '',
    category: '',
    newCategory: '',
    numLetters: '',
    numSyllables: '',
    hint: '',
    categoryMode: 'existing',
  })

  return {
    updateForm,
    updateUpdateForm,
    resetUpdateForm,
  }
}
