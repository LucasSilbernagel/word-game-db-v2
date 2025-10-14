import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { TEXT_CONTENT } from '@/lib/constants/app'

export type WordDataFormState = {
  id?: string
  word: string
  category: string
  newCategory: string
  numLetters: string
  numSyllables: string
  hint: string
  categoryMode: 'existing' | 'new'
}

type WordDataFormProps = {
  mode: 'create' | 'update'
  formState: WordDataFormState
  updateFormField: (key: keyof WordDataFormState, value: string) => void
  categories: string[]
}

export const WordDataForm = ({
  mode,
  formState,
  updateFormField,
  categories,
}: WordDataFormProps) => {
  const isUpdateMode = mode === 'update'

  return (
    <div className="space-y-4">
      <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        {isUpdateMode ? 'Update Word' : TEXT_CONTENT.HEADINGS.CREATE_NEW_WORD}
      </h4>

      {isUpdateMode && (
        <>
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Only the fields you want to update need to
              be filled in. Leave other fields empty to keep their existing
              values.
            </p>
          </div>

          {/* Word ID Input - Only for Update */}
          <div>
            <Label
              htmlFor={`${mode}-id`}
              className="text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              Word ID: *
            </Label>
            <Input
              id={`${mode}-id`}
              type="text"
              value={formState.id || ''}
              onChange={(e) => updateFormField('id', e.target.value)}
              placeholder="e.g., 5ffa1774c0831cbe1460e29c"
              className="mt-1"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter the ID of the word you want to update. You can leave other
              fields empty to keep existing values.
            </p>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label
            htmlFor={`${mode}-word`}
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            {isUpdateMode ? 'Word:' : TEXT_CONTENT.LABELS.WORD_REQUIRED}
          </Label>
          <Input
            id={`${mode}-word`}
            type="text"
            value={formState.word}
            onChange={(e) => updateFormField('word', e.target.value)}
            placeholder={
              isUpdateMode ? 'e.g., elephant' : TEXT_CONTENT.PLACEHOLDERS.WORD
            }
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor={`${mode}-hint`}
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            {isUpdateMode ? 'Hint:' : TEXT_CONTENT.LABELS.HINT_REQUIRED}
          </Label>
          <Input
            id={`${mode}-hint`}
            type="text"
            value={formState.hint}
            onChange={(e) => updateFormField('hint', e.target.value)}
            placeholder={
              isUpdateMode
                ? 'e.g., Large mammal with trunk'
                : TEXT_CONTENT.PLACEHOLDERS.HINT
            }
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor={`${mode}-num-letters`}
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            {isUpdateMode
              ? 'Number of Letters:'
              : TEXT_CONTENT.LABELS.NUM_LETTERS_REQUIRED}
          </Label>
          <Input
            id={`${mode}-num-letters`}
            type="number"
            value={formState.numLetters}
            onChange={(e) => updateFormField('numLetters', e.target.value)}
            placeholder={
              isUpdateMode ? 'e.g., 8' : TEXT_CONTENT.PLACEHOLDERS.NUM_LETTERS
            }
            min="1"
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor={`${mode}-num-syllables`}
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            {isUpdateMode
              ? 'Number of Syllables:'
              : TEXT_CONTENT.LABELS.NUM_SYLLABLES_REQUIRED}
          </Label>
          <Input
            id={`${mode}-num-syllables`}
            type="number"
            value={formState.numSyllables}
            onChange={(e) => updateFormField('numSyllables', e.target.value)}
            placeholder={
              isUpdateMode ? 'e.g., 3' : TEXT_CONTENT.PLACEHOLDERS.NUM_SYLLABLES
            }
            min="1"
            className="mt-1"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="border-t pt-4">
        <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {isUpdateMode ? 'Category' : TEXT_CONTENT.HEADINGS.CATEGORY}
        </h5>
        <div className="space-y-3">
          <RadioGroup
            value={formState.categoryMode}
            onValueChange={(value) => updateFormField('categoryMode', value)}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id={`${mode}-existing`} />
              <Label htmlFor={`${mode}-existing`} className="text-sm">
                {isUpdateMode
                  ? 'Select existing category'
                  : TEXT_CONTENT.MESSAGES.SELECT_EXISTING_CATEGORY}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id={`${mode}-new`} />
              <Label htmlFor={`${mode}-new`} className="text-sm">
                {isUpdateMode
                  ? 'Create new category'
                  : TEXT_CONTENT.MESSAGES.CREATE_NEW_CATEGORY}
              </Label>
            </div>
          </RadioGroup>

          {formState.categoryMode === 'existing' ? (
            <div>
              <Label
                htmlFor={`${mode}-category-select`}
                className="text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                {isUpdateMode
                  ? 'Category:'
                  : TEXT_CONTENT.LABELS.CATEGORY_REQUIRED}
              </Label>
              <Select
                value={formState.category}
                onValueChange={(value) => updateFormField('category', value)}
              >
                <SelectTrigger
                  className="mt-1"
                  aria-label={`Category selection for ${mode}`}
                >
                  <SelectValue
                    placeholder={
                      isUpdateMode
                        ? 'Keep existing category'
                        : TEXT_CONTENT.MESSAGES.SELECT_A_CATEGORY
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label
                htmlFor={`${mode}-new-category`}
                className="text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                {isUpdateMode
                  ? 'New Category:'
                  : TEXT_CONTENT.LABELS.NEW_CATEGORY_REQUIRED}
              </Label>
              <Input
                id={`${mode}-new-category`}
                type="text"
                value={formState.newCategory}
                onChange={(e) => updateFormField('newCategory', e.target.value)}
                placeholder={
                  isUpdateMode
                    ? 'e.g., technology'
                    : TEXT_CONTENT.PLACEHOLDERS.NEW_CATEGORY
                }
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
