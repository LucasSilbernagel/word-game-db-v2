import { DEFAULT_DELETE_FORM_STATE } from '@/lib/constants'
import { useGenericForm } from '@/lib/hooks/useGenericForm'
import { DeleteFormState } from '../DeleteForm/DeleteForm'

export const useDeleteForm = () => {
  const {
    formState: deleteForm,
    updateField: updateDeleteForm,
    resetForm: resetDeleteForm,
  } = useGenericForm<DeleteFormState>(DEFAULT_DELETE_FORM_STATE)

  return {
    deleteForm,
    updateDeleteForm,
    resetDeleteForm,
  }
}
