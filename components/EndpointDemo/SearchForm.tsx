'use client'

import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { SearchFormState } from './hooks/useSearchForm'

type SearchFormProps = {
  searchForm: SearchFormState
  updateSearchForm: (key: keyof SearchFormState, value: string) => void
}

export const SearchForm = ({
  searchForm,
  updateSearchForm,
}: SearchFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search-query" className="font-medium text-sm">
          Search Query *
        </Label>
        <Input
          id="search-query"
          type="text"
          placeholder="Enter word to search for..."
          value={searchForm.query}
          onChange={(e) => updateSearchForm('query', e.target.value)}
        />
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          Search for words by name (minimum 2 characters)
        </p>
      </div>

      <div className="gap-4 grid grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="search-limit" className="font-medium text-sm">
            Limit
          </Label>
          <Input
            id="search-limit"
            type="number"
            min="1"
            max="100"
            placeholder="10"
            value={searchForm.limit}
            onChange={(e) => updateSearchForm('limit', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="search-offset" className="font-medium text-sm">
            Offset
          </Label>
          <Input
            id="search-offset"
            type="number"
            min="0"
            placeholder="0"
            value={searchForm.offset}
            onChange={(e) => updateSearchForm('offset', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
