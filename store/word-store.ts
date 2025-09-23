import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Word = {
  _id: string
  word: string
  category: string
  numLetters: number
  numSyllables: number
  hint: string
  createdAt: string
  updatedAt: string
}

type WordState = {
  words: Word[]
  loading: boolean
  error: string | null
  searchQuery: string
  filters: {
    category: string
    difficulty: string
    minLength: number | null
    maxLength: number | null
  }
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

type WordActions = {
  setWords: (words: Word[]) => void
  addWord: (word: Word) => void
  updateWord: (id: string, word: Partial<Word>) => void
  removeWord: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<WordState['filters']>) => void
  setPagination: (pagination: Partial<WordState['pagination']>) => void
  resetFilters: () => void
  clearWords: () => void
}

const initialState: WordState = {
  words: [],
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    category: '',
    difficulty: '',
    minLength: null,
    maxLength: null,
  },
  pagination: {
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false,
  },
}

export const useWordStore = create<WordState & WordActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setWords: (words) => set({ words }),

      addWord: (word) =>
        set((state) => ({
          words: [...state.words, word],
          pagination: {
            ...state.pagination,
            total: state.pagination.total + 1,
          },
        })),

      updateWord: (id, updatedWord) =>
        set((state) => ({
          words: state.words.map((word) =>
            word._id === id ? { ...word, ...updatedWord } : word
          ),
        })),

      removeWord: (id) =>
        set((state) => ({
          words: state.words.filter((word) => word._id !== id),
          pagination: {
            ...state.pagination,
            total: Math.max(0, state.pagination.total - 1),
          },
        })),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      setPagination: (pagination) =>
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),

      resetFilters: () =>
        set({
          filters: initialState.filters,
          searchQuery: '',
          pagination: { ...initialState.pagination, offset: 0 },
        }),

      clearWords: () =>
        set({
          words: [],
          pagination: { ...initialState.pagination, total: 0 },
        }),
    }),
    {
      name: 'word-store',
    }
  )
)
