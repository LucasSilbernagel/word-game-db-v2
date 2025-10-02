export type WordFormState = {
  word: string
  category: string
  newCategory: string
  numLetters: string
  numSyllables: string
  hint: string
  categoryMode: 'existing' | 'new'
}

type WordFormProps = {
  wordForm: WordFormState
  updateWordForm: (key: keyof WordFormState, value: string) => void
  categories: string[]
}

export const WordForm = ({
  wordForm,
  updateWordForm,
  categories,
}: WordFormProps) => {
  return (
    <div className="space-y-4">
      <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        Create New Word
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="word"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Word: *
          </label>
          <input
            id="word"
            type="text"
            value={wordForm.word}
            onChange={(e) => updateWordForm('word', e.target.value)}
            placeholder="e.g., elephant"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor="hint"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Hint: *
          </label>
          <input
            id="hint"
            type="text"
            value={wordForm.hint}
            onChange={(e) => updateWordForm('hint', e.target.value)}
            placeholder="e.g., Large mammal with trunk"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor="num-letters"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Number of Letters: *
          </label>
          <input
            id="num-letters"
            type="number"
            value={wordForm.numLetters}
            onChange={(e) => updateWordForm('numLetters', e.target.value)}
            placeholder="e.g., 8"
            min="1"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor="num-syllables"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Number of Syllables: *
          </label>
          <input
            id="num-syllables"
            type="number"
            value={wordForm.numSyllables}
            onChange={(e) => updateWordForm('numSyllables', e.target.value)}
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
                name="categoryMode"
                value="existing"
                checked={wordForm.categoryMode === 'existing'}
                onChange={(e) => updateWordForm('categoryMode', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Select existing category</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="categoryMode"
                value="new"
                checked={wordForm.categoryMode === 'new'}
                onChange={(e) => updateWordForm('categoryMode', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Create new category</span>
            </label>
          </div>

          {wordForm.categoryMode === 'existing' ? (
            <div>
              <label
                htmlFor="category-select"
                className="text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                Category: *
              </label>
              <select
                id="category-select"
                value={wordForm.category}
                onChange={(e) => updateWordForm('category', e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="">Select a category</option>
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
                htmlFor="new-category"
                className="text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                New Category: *
              </label>
              <input
                id="new-category"
                type="text"
                value={wordForm.newCategory}
                onChange={(e) => updateWordForm('newCategory', e.target.value)}
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
