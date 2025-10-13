import { useGenericForm } from '@/lib/hooks/useGenericForm'
import { DeleteFormState } from '../DeleteForm'

export const useDeleteForm = () => {
  const {
    formState: deleteForm,
    updateField: updateDeleteForm,
    resetForm: resetDeleteForm,
  } = useGenericForm<DeleteFormState>({
    id: '',
  })

  return {
    deleteForm,
    updateDeleteForm,
    resetDeleteForm,
  }
}
