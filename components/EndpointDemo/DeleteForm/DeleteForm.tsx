import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

export type DeleteFormState = {
  id: string
}

type DeleteFormProps = {
  deleteForm: DeleteFormState
  updateDeleteForm: (key: keyof DeleteFormState, value: string) => void
}

export const DeleteForm = ({
  deleteForm,
  updateDeleteForm,
}: DeleteFormProps) => {
  return (
    <div className="space-y-4">
      <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        Delete Word
      </h4>
      <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-xs text-red-800 dark:text-red-200">
          <strong>Warning:</strong> This action will permanently delete the word
          from the database. This action cannot be undone.
        </p>
      </div>

      {/* Word ID Input */}
      <div>
        <Label
          htmlFor="delete-id"
          className="text-xs font-medium text-gray-600 dark:text-gray-400"
        >
          Word ID: *
        </Label>
        <Input
          id="delete-id"
          type="text"
          value={deleteForm.id}
          onChange={(e) => updateDeleteForm('id', e.target.value)}
          placeholder="e.g., 5ffa1774c0831cbe1460e29c"
          className="mt-1"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter the ID of the word you want to delete. You can find word IDs by
          using the GET /api/v1/words endpoint.
        </p>
      </div>
    </div>
  )
}
