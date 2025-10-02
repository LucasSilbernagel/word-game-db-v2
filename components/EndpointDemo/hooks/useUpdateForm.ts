import { DEFAULT_UPDATE_FORM_STATE } from '@/lib/constants'
import { useGenericForm } from '@/lib/hooks/useGenericForm'
import { UpdateFormState } from '../UpdateForm/UpdateForm'

export const useUpdateForm = () => {
  const {
    formState: updateForm,
    updateField: updateUpdateForm,
    resetForm: resetUpdateForm,
  } = useGenericForm<UpdateFormState>(DEFAULT_UPDATE_FORM_STATE)

  return {
    updateForm,
    updateUpdateForm,
    resetUpdateForm,
  }
}
