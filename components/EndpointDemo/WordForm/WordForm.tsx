import { CSS_CLASSES, TEXT_CONTENT } from '@/lib/constants'

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
        {TEXT_CONTENT.HEADINGS.CREATE_NEW_WORD}
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="word" className={CSS_CLASSES.LABEL_BASE}>
            {TEXT_CONTENT.LABELS.WORD_REQUIRED}
          </label>
          <input
            id="word"
            type="text"
            value={wordForm.word}
            onChange={(e) => updateWordForm('word', e.target.value)}
            placeholder={TEXT_CONTENT.PLACEHOLDERS.WORD}
            className={CSS_CLASSES.INPUT_BASE}
          />
        </div>

        <div>
          <label htmlFor="hint" className={CSS_CLASSES.LABEL_BASE}>
            {TEXT_CONTENT.LABELS.HINT_REQUIRED}
          </label>
          <input
            id="hint"
            type="text"
            value={wordForm.hint}
            onChange={(e) => updateWordForm('hint', e.target.value)}
            placeholder={TEXT_CONTENT.PLACEHOLDERS.HINT}
            className={CSS_CLASSES.INPUT_BASE}
          />
        </div>

        <div>
          <label htmlFor="num-letters" className={CSS_CLASSES.LABEL_BASE}>
            {TEXT_CONTENT.LABELS.NUM_LETTERS_REQUIRED}
          </label>
          <input
            id="num-letters"
            type="number"
            value={wordForm.numLetters}
            onChange={(e) => updateWordForm('numLetters', e.target.value)}
            placeholder={TEXT_CONTENT.PLACEHOLDERS.NUM_LETTERS}
            min="1"
            className={CSS_CLASSES.INPUT_BASE}
          />
        </div>

        <div>
          <label htmlFor="num-syllables" className={CSS_CLASSES.LABEL_BASE}>
            {TEXT_CONTENT.LABELS.NUM_SYLLABLES_REQUIRED}
          </label>
          <input
            id="num-syllables"
            type="number"
            value={wordForm.numSyllables}
            onChange={(e) => updateWordForm('numSyllables', e.target.value)}
            placeholder={TEXT_CONTENT.PLACEHOLDERS.NUM_SYLLABLES}
            min="1"
            className={CSS_CLASSES.INPUT_BASE}
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="border-t pt-4">
        <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {TEXT_CONTENT.HEADINGS.CATEGORY}
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
              <span className="text-sm">
                {TEXT_CONTENT.MESSAGES.SELECT_EXISTING_CATEGORY}
              </span>
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
              <span className="text-sm">
                {TEXT_CONTENT.MESSAGES.CREATE_NEW_CATEGORY}
              </span>
            </label>
          </div>

          {wordForm.categoryMode === 'existing' ? (
            <div>
              <label
                htmlFor="category-select"
                className={CSS_CLASSES.LABEL_BASE}
              >
                {TEXT_CONTENT.LABELS.CATEGORY_REQUIRED}
              </label>
              <select
                id="category-select"
                value={wordForm.category}
                onChange={(e) => updateWordForm('category', e.target.value)}
                className={CSS_CLASSES.INPUT_BASE}
              >
                <option value="">
                  {TEXT_CONTENT.MESSAGES.SELECT_A_CATEGORY}
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label htmlFor="new-category" className={CSS_CLASSES.LABEL_BASE}>
                {TEXT_CONTENT.LABELS.NEW_CATEGORY_REQUIRED}
              </label>
              <input
                id="new-category"
                type="text"
                value={wordForm.newCategory}
                onChange={(e) => updateWordForm('newCategory', e.target.value)}
                placeholder={TEXT_CONTENT.PLACEHOLDERS.NEW_CATEGORY}
                className={CSS_CLASSES.INPUT_BASE}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
