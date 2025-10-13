import { UpdateFormState } from './UpdateForm'

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
      <p className="mb-2 text-muted-foreground text-sm">API Request Example:</p>
      <div className="bg-gray-50 dark:bg-gray-800 p-3 border rounded">
        <div className="font-mono text-sm">
          <div className="font-semibold text-blue-600 dark:text-blue-400 break-all">
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
