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
import { TEXT_CONTENT } from '@/lib/constants'

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
      <h4 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
        {TEXT_CONTENT.HEADINGS.CREATE_NEW_WORD}
      </h4>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div>
          <Label
            htmlFor="word"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            {TEXT_CONTENT.LABELS.WORD_REQUIRED}
          </Label>
          <Input
            id="word"
            type="text"
            value={wordForm.word}
            onChange={(e) => updateWordForm('word', e.target.value)}
            placeholder={TEXT_CONTENT.PLACEHOLDERS.WORD}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="hint"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            {TEXT_CONTENT.LABELS.HINT_REQUIRED}
          </Label>
          <Input
            id="hint"
            type="text"
            value={wordForm.hint}
            onChange={(e) => updateWordForm('hint', e.target.value)}
            placeholder={TEXT_CONTENT.PLACEHOLDERS.HINT}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="num-letters"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            {TEXT_CONTENT.LABELS.NUM_LETTERS_REQUIRED}
          </Label>
          <Input
            id="num-letters"
            type="number"
            value={wordForm.numLetters}
            onChange={(e) => updateWordForm('numLetters', e.target.value)}
            placeholder={TEXT_CONTENT.PLACEHOLDERS.NUM_LETTERS}
            min="1"
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="num-syllables"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            {TEXT_CONTENT.LABELS.NUM_SYLLABLES_REQUIRED}
          </Label>
          <Input
            id="num-syllables"
            type="number"
            value={wordForm.numSyllables}
            onChange={(e) => updateWordForm('numSyllables', e.target.value)}
            placeholder={TEXT_CONTENT.PLACEHOLDERS.NUM_SYLLABLES}
            min="1"
            className="mt-1"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="pt-4 border-t">
        <h5 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
          {TEXT_CONTENT.HEADINGS.CATEGORY}
        </h5>
        <div className="space-y-3">
          <RadioGroup
            value={wordForm.categoryMode}
            onValueChange={(value) => updateWordForm('categoryMode', value)}
            className="flex sm:flex-row flex-col gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing" className="text-sm">
                {TEXT_CONTENT.MESSAGES.SELECT_EXISTING_CATEGORY}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="text-sm">
                {TEXT_CONTENT.MESSAGES.CREATE_NEW_CATEGORY}
              </Label>
            </div>
          </RadioGroup>

          {wordForm.categoryMode === 'existing' ? (
            <div>
              <Label
                htmlFor="category-select"
                className="font-medium text-gray-600 dark:text-gray-400 text-xs"
              >
                {TEXT_CONTENT.LABELS.CATEGORY_REQUIRED}
              </Label>
              <Select
                value={wordForm.category}
                onValueChange={(value) => updateWordForm('category', value)}
              >
                <SelectTrigger className="mt-1" aria-label="Category selection">
                  <SelectValue
                    placeholder={TEXT_CONTENT.MESSAGES.SELECT_A_CATEGORY}
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
                htmlFor="new-category"
                className="font-medium text-gray-600 dark:text-gray-400 text-xs"
              >
                {TEXT_CONTENT.LABELS.NEW_CATEGORY_REQUIRED}
              </Label>
              <Input
                id="new-category"
                type="text"
                value={wordForm.newCategory}
                onChange={(e) => updateWordForm('newCategory', e.target.value)}
                placeholder={TEXT_CONTENT.PLACEHOLDERS.NEW_CATEGORY}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
