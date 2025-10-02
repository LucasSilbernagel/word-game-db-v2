export type UpdateFormState = {
  id: string
  word: string
  category: string
  newCategory: string
  numLetters: string
  numSyllables: string
  hint: string
  categoryMode: 'existing' | 'new'
}

type UpdateFormProps = {
  updateForm: UpdateFormState
  updateUpdateForm: (key: keyof UpdateFormState, value: string) => void
  categories: string[]
}

export const UpdateForm = ({
  updateForm,
  updateUpdateForm,
  categories,
}: UpdateFormProps) => {
  return (
    <div className="space-y-4">
      <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        Update Word
      </h4>
      <div className="rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> Only the fields you want to update need to be
          filled in. Leave other fields empty to keep their existing values.
        </p>
      </div>

      {/* Word ID Input */}
      <div>
        <label
          htmlFor="update-id"
          className="text-xs font-medium text-gray-600 dark:text-gray-400"
        >
          Word ID: *
        </label>
        <input
          id="update-id"
          type="text"
          value={updateForm.id}
          onChange={(e) => updateUpdateForm('id', e.target.value)}
          placeholder="e.g., 5ffa1774c0831cbe1460e29c"
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter the ID of the word you want to update. You can leave other
          fields empty to keep existing values.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="update-word"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Word:
          </label>
          <input
            id="update-word"
            type="text"
            value={updateForm.word}
            onChange={(e) => updateUpdateForm('word', e.target.value)}
            placeholder="e.g., elephant"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor="update-hint"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Hint:
          </label>
          <input
            id="update-hint"
            type="text"
            value={updateForm.hint}
            onChange={(e) => updateUpdateForm('hint', e.target.value)}
            placeholder="e.g., Large mammal with trunk"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor="update-num-letters"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Number of Letters:
          </label>
          <input
            id="update-num-letters"
            type="number"
            value={updateForm.numLetters}
            onChange={(e) => updateUpdateForm('numLetters', e.target.value)}
            placeholder="e.g., 8"
            min="1"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor="update-num-syllables"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Number of Syllables:
          </label>
          <input
            id="update-num-syllables"
            type="number"
            value={updateForm.numSyllables}
            onChange={(e) => updateUpdateForm('numSyllables', e.target.value)}
            placeholder="e.g., 3"
            min="1"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="border-t pt-4">
        <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </h5>
        <div className="space-y-3">
          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex items-center">
              <input
                type="radio"
                name="updateCategoryMode"
                value="existing"
                checked={updateForm.categoryMode === 'existing'}
                onChange={(e) =>
                  updateUpdateForm('categoryMode', e.target.value)
                }
                className="mr-2"
              />
              <span className="text-sm">Select existing category</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="updateCategoryMode"
                value="new"
                checked={updateForm.categoryMode === 'new'}
                onChange={(e) =>
                  updateUpdateForm('categoryMode', e.target.value)
                }
                className="mr-2"
              />
              <span className="text-sm">Create new category</span>
            </label>
          </div>

          {updateForm.categoryMode === 'existing' ? (
            <div>
              <label
                htmlFor="update-category-select"
                className="text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                Category:
              </label>
              <select
                id="update-category-select"
                value={updateForm.category}
                onChange={(e) => updateUpdateForm('category', e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="">Keep existing category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label
                htmlFor="update-new-category"
                className="text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                New Category:
              </label>
              <input
                id="update-new-category"
                type="text"
                value={updateForm.newCategory}
                onChange={(e) =>
                  updateUpdateForm('newCategory', e.target.value)
                }
                placeholder="e.g., technology"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
