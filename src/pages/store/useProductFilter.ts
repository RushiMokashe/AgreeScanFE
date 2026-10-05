import { useState } from 'react'
import type { ProductCategory } from '../../lib/types'
import { useDebouncedValue } from './useDebouncedValue'

const SEARCH_DEBOUNCE_MS = 300

/**
 * Department and search filters of the product list. Typing reaches the API once the farmer pauses;
 * clearing the search box applies at once.
 */
export function useProductFilter() {
  const [category, setCategory] = useState<ProductCategory | null>(null)
  const [query, setQuery] = useState('')
  const typed = query.trim()
  const debounced = useDebouncedValue(typed, SEARCH_DEBOUNCE_MS)

  return {
    category,
    setCategory,
    /** What is in the search box. */
    query,
    setQuery,
    /** The search sent to the API. */
    searchTerm: typed === '' ? '' : debounced,
    clear: () => {
      setCategory(null)
      setQuery('')
    },
  }
}
