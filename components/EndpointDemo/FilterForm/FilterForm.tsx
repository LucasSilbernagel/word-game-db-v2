import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { FilterState } from '../hooks/useFilters'

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label
            htmlFor="category"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
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
            htmlFor="min-letters"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
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
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
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
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
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
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
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
      <div className="border-t pt-4">
        <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Pagination
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label
              htmlFor="limit"
              className="text-xs font-medium text-gray-600 dark:text-gray-400"
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
              className="text-xs font-medium text-gray-600 dark:text-gray-400"
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
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Use limit and offset to paginate through results. Default: limit=10,
          offset=0
        </p>
        <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            The API returns a pagination object with total count, current
            limit/offset, and hasMore flag to help you implement pagination in
            your app.
          </p>
        </div>
      </div>
    </div>
  )
}
