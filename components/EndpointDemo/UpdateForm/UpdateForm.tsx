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
      <h4 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
        Update Word
      </h4>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800 rounded-md">
        <p className="text-blue-800 dark:text-blue-200 text-xs">
          <strong>Note:</strong> Only the fields you want to update need to be
          filled in. Leave other fields empty to keep their existing values.
        </p>
      </div>

      {/* Word ID Input */}
      <div>
        <Label
          htmlFor="update-id"
          className="font-medium text-gray-600 dark:text-gray-400 text-xs"
        >
          Word ID: *
        </Label>
        <Input
          id="update-id"
          type="text"
          value={updateForm.id}
          onChange={(e) => updateUpdateForm('id', e.target.value)}
          placeholder="e.g., 5ffa1774c0831cbe1460e29c"
          className="mt-1"
        />
        <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
          Enter the ID of the word you want to update. You can leave other
          fields empty to keep existing values.
        </p>
      </div>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div>
          <Label
            htmlFor="update-word"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            Word:
          </Label>
          <Input
            id="update-word"
            type="text"
            value={updateForm.word}
            onChange={(e) => updateUpdateForm('word', e.target.value)}
            placeholder="e.g., elephant"
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="update-hint"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            Hint:
          </Label>
          <Input
            id="update-hint"
            type="text"
            value={updateForm.hint}
            onChange={(e) => updateUpdateForm('hint', e.target.value)}
            placeholder="e.g., Large mammal with trunk"
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="update-num-letters"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            Number of Letters:
          </Label>
          <Input
            id="update-num-letters"
            type="number"
            value={updateForm.numLetters}
            onChange={(e) => updateUpdateForm('numLetters', e.target.value)}
            placeholder="e.g., 8"
            min="1"
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="update-num-syllables"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            Number of Syllables:
          </Label>
          <Input
            id="update-num-syllables"
            type="number"
            value={updateForm.numSyllables}
            onChange={(e) => updateUpdateForm('numSyllables', e.target.value)}
            placeholder="e.g., 3"
            min="1"
            className="mt-1"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="pt-4 border-t">
        <h5 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
          Category
        </h5>
        <div className="space-y-3">
          <RadioGroup
            value={updateForm.categoryMode}
            onValueChange={(value) => updateUpdateForm('categoryMode', value)}
            className="flex sm:flex-row flex-col gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="update-existing" />
              <Label htmlFor="update-existing" className="text-sm">
                Select existing category
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="update-new" />
              <Label htmlFor="update-new" className="text-sm">
                Create new category
              </Label>
            </div>
          </RadioGroup>

          {updateForm.categoryMode === 'existing' ? (
            <div>
              <Label
                htmlFor="update-category-select"
                className="font-medium text-gray-600 dark:text-gray-400 text-xs"
              >
                Category:
              </Label>
              <Select
                value={updateForm.category}
                onValueChange={(value) => updateUpdateForm('category', value)}
              >
                <SelectTrigger
                  className="mt-1"
                  aria-label="Category selection for update"
                >
                  <SelectValue placeholder="Keep existing category" />
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
                htmlFor="update-new-category"
                className="font-medium text-gray-600 dark:text-gray-400 text-xs"
              >
                New Category:
              </Label>
              <Input
                id="update-new-category"
                type="text"
                value={updateForm.newCategory}
                onChange={(e) =>
                  updateUpdateForm('newCategory', e.target.value)
                }
                placeholder="e.g., technology"
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
