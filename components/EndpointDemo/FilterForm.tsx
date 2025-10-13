import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { FilterState } from './hooks/useFilters'

type FilterFormProps = {
  filters: FilterState
  updateFilter: (key: keyof FilterState, value: string) => void
  categories: string[]
}

export const FilterForm = ({
  filters,
  updateFilter,
  categories,
}: FilterFormProps) => {
  return (
    <div className="space-y-4">
      {/* General filters */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label
            htmlFor="category"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            Category:
          </Label>
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilter('category', value)}
          >
            <SelectTrigger className="mt-1" aria-label="Category filter">
              <SelectValue placeholder="Any Category" />
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

        <div>
          <Label
            htmlFor="_id"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            Word ID:
          </Label>
          <Input
            id="_id"
            type="text"
            value={filters._id}
            onChange={(e) => updateFilter('_id', e.target.value)}
            placeholder="e.g., 5ffa1774c0831cbe1460e29c"
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="min-letters"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            Min Letters:
          </Label>
          <Input
            id="min-letters"
            type="number"
            value={filters.minLetters}
            onChange={(e) => updateFilter('minLetters', e.target.value)}
            placeholder="e.g., 3"
            min="1"
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="max-letters"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            Max Letters:
          </Label>
          <Input
            id="max-letters"
            type="number"
            value={filters.maxLetters}
            onChange={(e) => updateFilter('maxLetters', e.target.value)}
            placeholder="e.g., 10"
            min="1"
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="min-syllables"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            Min Syllables:
          </Label>
          <Input
            id="min-syllables"
            type="number"
            value={filters.minSyllables}
            onChange={(e) => updateFilter('minSyllables', e.target.value)}
            placeholder="e.g., 1"
            min="1"
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="max-syllables"
            className="font-medium text-gray-600 dark:text-gray-400 text-xs"
          >
            Max Syllables:
          </Label>
          <Input
            id="max-syllables"
            type="number"
            value={filters.maxSyllables}
            onChange={(e) => updateFilter('maxSyllables', e.target.value)}
            placeholder="e.g., 3"
            min="1"
            className="mt-1"
          />
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="pt-4 border-t">
        <h4 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
          Pagination
        </h4>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <div>
            <Label
              htmlFor="limit"
              className="font-medium text-gray-600 dark:text-gray-400 text-xs"
            >
              Limit (items per page):
            </Label>
            <Input
              id="limit"
              type="number"
              value={filters.limit}
              onChange={(e) => updateFilter('limit', e.target.value)}
              placeholder="e.g., 10"
              min="1"
              max="100"
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="offset"
              className="font-medium text-gray-600 dark:text-gray-400 text-xs"
            >
              Offset (skip items):
            </Label>
            <Input
              id="offset"
              type="number"
              value={filters.offset}
              onChange={(e) => updateFilter('offset', e.target.value)}
              placeholder="e.g., 0"
              min="0"
              className="mt-1"
            />
          </div>
        </div>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-xs">
          Use limit and offset to paginate through results. Default: limit=10,
          offset=0
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 mt-3 p-3 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-blue-800 dark:text-blue-200 text-xs">
            The API returns a pagination object with total count, current
            limit/offset, and hasMore flag to help you implement pagination in
            your app.
          </p>
        </div>
      </div>
    </div>
  )
}
