// API Constants
export const API_ROUTES = {
  BASE: '/api/v1',
  WORDS: '/api/v1/words',
  WORDS_WITH_ID: '/api/v1/words/[id]',
  WORDS_SEARCH: '/api/v1/words/search',
  WORDS_RANDOM: '/api/v1/words/random',
  CATEGORIES: '/api/v1/categories',
  CONFIG: '/api/v1/config',
} as const

// Default Form States
export const DEFAULT_WORD_FORM_STATE = {
  word: '',
  category: '',
  newCategory: '',
  numLetters: '',
  numSyllables: '',
  hint: '',
  categoryMode: 'existing' as const,
}

export const DEFAULT_UPDATE_FORM_STATE = {
  id: '',
  word: '',
  category: '',
  newCategory: '',
  numLetters: '',
  numSyllables: '',
  hint: '',
  categoryMode: 'existing' as const,
}

export const DEFAULT_DELETE_FORM_STATE = {
  id: '',
}

export const DEFAULT_SEARCH_FORM_STATE = {
  query: '',
  limit: '10',
  offset: '0',
}

export const DEFAULT_FILTER_STATE = {
  category: '',
  minLetters: '',
  maxLetters: '',
  minSyllables: '',
  maxSyllables: '',
  limit: '10',
  offset: '0',
}

// Common CSS Classes
export const CSS_CLASSES = {
  // Input and form elements
  INPUT_BASE:
    'mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800',
  LABEL_BASE: 'text-xs font-medium text-gray-600 dark:text-gray-400',

  // Layout and containers
  CONTAINER: 'container mx-auto px-4 py-8',
  MAX_WIDTH_4XL: 'mx-auto max-w-4xl',
  SPACE_Y_4: 'space-y-4',
  GRID_MD_2: 'grid grid-cols-1 gap-4 md:grid-cols-2',

  // Text styles
  HEADING_4XL: 'mb-4 text-4xl font-bold tracking-tight',
  HEADING_3XL: 'mb-4 text-3xl font-semibold',
  HEADING_2XL: 'mb-6 text-2xl font-semibold',
  HEADING_XL: 'text-xl font-semibold',
  TEXT_MUTED: 'text-muted-foreground',
  TEXT_SM_MEDIUM: 'text-sm font-medium',
  TEXT_XS: 'text-xs',

  // Button and interactive elements
  BUTTON_PRIMARY: 'bg-primary text-primary-foreground hover:bg-primary/90',

  // Alerts and messages
  ALERT_YELLOW:
    'rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20',
  ALERT_BLUE:
    'rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20',
  ALERT_RED:
    'rounded bg-red-50 p-3 text-xs text-wrap text-red-800 dark:bg-red-900/20 dark:text-red-200',

  // Loading spinner
  SPINNER:
    'h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
  SPINNER_LARGE:
    'h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent',

  // Code blocks
  CODE_BLOCK: 'bg-muted overflow-x-auto rounded p-3 text-xs',
  CODE_INLINE: 'bg-muted rounded px-2 py-1 font-mono text-sm',

  // Navigation
  NAV_BAR:
    'bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur',
  NAV_CONTAINER: 'container mx-auto px-4',
  NAV_CONTENT: 'flex h-16 items-center justify-between',
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
  BASE_URL: 'https://wordgamedb.com',
  OG_IMAGE: '/og-image.png',
  OG_IMAGE_WIDTH: 1200,
  OG_IMAGE_HEIGHT: 630,
  OG_IMAGE_ALT: 'Word Game DB - A REST API for building word games and puzzles',
} as const

// Demo Data
export const DEMO_DATA = {
  WORD_ID: '5ffa1774c0831cbe1460e29c',
} as const

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const

// Default values
export const DEFAULTS = {
  PAGINATION_LIMIT: '10',
  PAGINATION_OFFSET: '0',
  SEARCH_MIN_LENGTH: 2,
} as const
