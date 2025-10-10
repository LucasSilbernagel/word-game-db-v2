// Export CORS configuration
export * from './cors'

// API Constants
export const API_ROUTES = {
  BASE: '/api/v2',
  WORDS: '/api/v2/words',
  WORDS_WITH_ID: '/api/v2/words/[id]',
  WORDS_SEARCH: '/api/v2/words/search',
  WORDS_RANDOM: '/api/v2/words/random',
  CATEGORIES: '/api/v2/categories',
  CONFIG: '/api/v2/config',
} as const

// Common Text Content
export const TEXT_CONTENT = {
  // Form labels and placeholders
  LABELS: {
    WORD: 'Word:',
    WORD_REQUIRED: 'Word: *',
    HINT: 'Hint:',
    HINT_REQUIRED: 'Hint: *',
    NUM_LETTERS: 'Number of Letters:',
    NUM_LETTERS_REQUIRED: 'Number of Letters: *',
    NUM_SYLLABLES: 'Number of Syllables:',
    NUM_SYLLABLES_REQUIRED: 'Number of Syllables: *',
    CATEGORY: 'Category:',
    CATEGORY_REQUIRED: 'Category: *',
    NEW_CATEGORY: 'New Category:',
    NEW_CATEGORY_REQUIRED: 'New Category: *',
    WORD_ID: 'Word ID:',
    WORD_ID_REQUIRED: 'Word ID: *',
    SEARCH_QUERY: 'Search Query',
    LIMIT: 'Limit',
    OFFSET: 'Offset',
  },

  PLACEHOLDERS: {
    WORD: 'e.g., elephant',
    HINT: 'e.g., Large mammal with trunk',
    NUM_LETTERS: 'e.g., 8',
    NUM_SYLLABLES: 'e.g., 3',
    NEW_CATEGORY: 'e.g., technology',
    WORD_ID: 'e.g., 5ffa1774c0831cbe1460e29c',
    SEARCH_QUERY: 'Enter word to search for...',
  },

  HEADINGS: {
    CREATE_NEW_WORD: 'Create New Word',
    UPDATE_WORD: 'Update Word',
    CATEGORY: 'Category',
    LIVE_DEMO: 'Live Demo',
  },

  MESSAGES: {
    SELECT_EXISTING_CATEGORY: 'Select existing category',
    CREATE_NEW_CATEGORY: 'Create new category',
    SELECT_A_CATEGORY: 'Select a category',
    KEEP_EXISTING_CATEGORY: 'Keep existing category',
    LOADING: 'Loading...',
    TESTING_ENDPOINT: 'Testing endpoint...',
    UPDATE_NOTE:
      'Only the fields you want to update need to be filled in. Leave other fields empty to keep their existing values.',
    DELETE_ID_HELP:
      'Enter the ID of the word you want to update. You can leave other fields empty to keep existing values.',
  },

  ERRORS: {
    FILL_REQUIRED_FIELDS: 'Please fill in all required fields',
    ENTER_SEARCH_QUERY: 'Please enter a search query',
    ENTER_WORD_ID_UPDATE: 'Please enter a word ID to update',
    ENTER_WORD_ID_DELETE: 'Please enter a valid word ID to delete',
    FILL_ONE_FIELD_UPDATE: 'Please fill in at least one field to update',
    DESTRUCTIVE_DISABLED:
      'This endpoint is disabled. To test it, set ENABLE_DESTRUCTIVE_ENDPOINTS=true in your environment variables.',
  },
} as const

// Application Metadata
export const APP_METADATA = {
  TITLE: 'Word Game DB',
  DESCRIPTION:
    'A REST API for building word games and puzzles. Word Game DB is designed for educational purposes, helping developers practice their coding skills by building word games that incorporate an API. Each word comes with a category, letter count, syllable count, and helpful hint.',
  BASE_URL: 'https://www.wordgamedb.com',
  OG_IMAGE: '/og-image.png',
  OG_IMAGE_WIDTH: 1200,
  OG_IMAGE_HEIGHT: 630,
  OG_IMAGE_ALT: 'Word Game DB - A REST API for building word games and puzzles',
} as const

// Demo Data
export const DEMO_DATA = {
  WORD_ID: '5ffa1774c0831cbe1460e29c',
} as const

// Default values
export const DEFAULTS = {
  PAGINATION_LIMIT: '10',
  PAGINATION_OFFSET: '0',
  SEARCH_MIN_LENGTH: 2,
} as const
