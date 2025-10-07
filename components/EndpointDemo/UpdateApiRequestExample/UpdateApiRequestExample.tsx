import { UpdateFormState } from '../UpdateForm/UpdateForm'

type UpdateApiRequestExampleProps = {
  updateForm: UpdateFormState
}

export const UpdateApiRequestExample = ({
  updateForm,
}: UpdateApiRequestExampleProps) => {
  const selectedCategory =
    updateForm.categoryMode === 'existing'
      ? updateForm.category
      : updateForm.newCategory

  const body: Record<string, unknown> = {}
  if (updateForm.word) body.word = updateForm.word
  if (selectedCategory) body.category = selectedCategory
  if (updateForm.numLetters)
    body.numLetters = Number.parseInt(updateForm.numLetters)
  if (updateForm.numSyllables)
    body.numSyllables = Number.parseInt(updateForm.numSyllables)
  if (updateForm.hint) body.hint = updateForm.hint

  if (Object.keys(body).length === 0) {
    body.word = 'example'
    body.hint = 'Updated hint'
  }

  return (
    <div>
      <p className="text-muted-foreground mb-2 text-sm">API Request Example:</p>
      <div className="rounded border bg-gray-50 p-3 dark:bg-gray-800">
        <div className="font-mono text-sm">
          <div className="font-semibold break-all text-blue-600 dark:text-blue-400">
            PUT /api/v2/words/{updateForm.id || 'WORD_ID'}
          </div>
          <div className="mt-2 text-gray-600 dark:text-gray-300">
            Content-Type: application/json
          </div>
          <pre className="mt-2 overflow-x-auto text-xs">
            {JSON.stringify(body, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
