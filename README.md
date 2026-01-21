# Word Game DB v2

A read-only REST API for building word games and puzzles. While the original Word Game DB was a MERN stack application, this v2 update uses modern Next.js for both the frontend and backend. New functionality and endpoints have also been added.

<img width="3000" height="1800" alt="Screen Shot 2025-10-14 at 19 27 39" src="https://github.com/user-attachments/assets/edce7933-0548-4f88-8072-74f5fc0fd56b" />

## 🚀 Live Demo

**Production API**: [https://www.wordgamedb.com](https://www.wordgamedb.com) (Read-only endpoints)

## Features

- **Full-Stack Next.js Application**: Built with Next.js 15 using the App Router
- **MongoDB Integration**: Robust database with Mongoose ODM
- **TypeScript Support**: Full type safety throughout the application
- **Modern UI**: Beautiful interface built with Tailwind CSS 4 and Radix UI
- **RESTful API**: Comprehensive API endpoints for word management
- **CORS Support**: Full CORS headers for cross-origin requests
- **Security Headers**: CSP, XSS protection, and other security headers
- **Production Safety**: Destructive endpoints (POST, PUT, DELETE) are automatically disabled in production
- **Comprehensive Testing**: Full test coverage with Vitest and Testing Library

## Tech Stack

- **Frontend**: React 19, Next.js 15, Tailwind CSS 4, Radix UI, Lucide React
- **Backend**: Next.js API Routes, MongoDB, Mongoose ODM
- **Development**: TypeScript, ESLint, Prettier
- **Testing**: Vitest, Testing Library, MSW (Mock Service Worker)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/LucasSilbernagel/word-game-db-v2.git
cd word-game-db-v2
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/word-game-db

# Enable destructive endpoints (POST, PUT, DELETE) for development
ENABLE_DESTRUCTIVE_ENDPOINTS=true

# Optional: MongoDB connection pool configuration
# For serverless environments (Vercel, AWS Lambda), use smaller pools (10-20)
# For traditional servers, you can use larger pools (50-100)
# Default: maxPoolSize=10, minPoolSize=1
# MONGODB_MAX_POOL_SIZE=10
# MONGODB_MIN_POOL_SIZE=1
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Set up MongoDB Atlas (Recommended)

https://www.mongodb.com/products/platform

## Deployment

### Environment Variables

The `ENABLE_DESTRUCTIVE_ENDPOINTS` environment variable controls API endpoint availability:

**For Production (Recommended):**

```env
MONGODB_URI=your_production_mongodb_connection_string
# Do NOT set ENABLE_DESTRUCTIVE_ENDPOINTS in production

# Connection pool configuration (recommended for serverless)
# Limits connections per instance to prevent exhausting MongoDB Atlas limits
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=1
```

**For Development:**

```env
MONGODB_URI=mongodb://localhost:27017/word-game-db
ENABLE_DESTRUCTIVE_ENDPOINTS=true

# Optional: Adjust pool size for local development
# MONGODB_MAX_POOL_SIZE=50
# MONGODB_MIN_POOL_SIZE=5
```

#### MongoDB Connection Pool Configuration

To prevent connection exhaustion on MongoDB Atlas (especially important if you're seeing "Connections % of configured limit has gone above 80%" alerts):

- **Serverless environments** (Vercel, AWS Lambda, etc.): Use `MONGODB_MAX_POOL_SIZE=10-20`
  - Each serverless function instance gets its own connection pool
  - With many concurrent requests, you can have many instances
  - Smaller pools per instance = more instances can run without exhausting Atlas limits

- **Traditional servers**: Use `MONGODB_MAX_POOL_SIZE=50-100`
  - Fewer instances, so each can have a larger pool

**Default values**: `maxPoolSize=10`, `minPoolSize=1` (optimized for serverless)

### Production Behavior

- **Default (ENABLE_DESTRUCTIVE_ENDPOINTS not set)**: Only read-only endpoints (GET) are available
- **With ENABLE_DESTRUCTIVE_ENDPOINTS=true**: All endpoints (including POST, PUT, DELETE) are available
- **Security**: Destructive endpoints are automatically disabled in production for safety

### Example Implementation

Check out this example implementation using the API:

**Hangman Game**: [https://lucassilbernagel.github.io/hangman/](https://lucassilbernagel.github.io/hangman/)

**Source Code**: [https://github.com/LucasSilbernagel/hangman](https://github.com/LucasSilbernagel/hangman)

## API Versions

### Version 1 (v1) (Legacy) - Simple Array Format

**Response Format:** Direct array of word objects

```json
[
  {
    "_id": "5fee49e11935ff7c8aa1660b",
    "word": "cobra",
    "category": "animal",
    "numLetters": 5,
    "numSyllables": 2,
    "hint": "Hooded snake"
  }
]
```

### Version 2 (v2) - Paginated Format

**Response Format:** Object with words array and pagination metadata

```json
{
  "words": [...],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

## API Endpoints

### Available Endpoints

#### Version 1 (v1) - Simple Array Format

- `GET /api/v1/words` - Retrieve all words with optional query filtering (returns simple array)
- `GET /api/v1/words/search` - Search for words by name with partial matching
- `GET /api/v1/words/random` - Get a random word from the database
- `GET /api/v1/words/[id]` - Get a specific word by ID
- `GET /api/v1/categories` - Get all distinct categories
- `GET /api/v1/config` - Get API configuration (destructive endpoints status)
- `POST /api/v1/words` - Create a new word entry _(requires ENABLE_DESTRUCTIVE_ENDPOINTS=true)_
- `PUT /api/v1/words/[id]` - Update an existing word _(requires ENABLE_DESTRUCTIVE_ENDPOINTS=true)_
- `DELETE /api/v1/words/[id]` - Delete a word from the database _(requires ENABLE_DESTRUCTIVE_ENDPOINTS=true)_

#### Version 2 (v2) - Paginated Format

- `GET /api/v2/words` - Retrieve words with pagination and optional query filtering
- `GET /api/v2/words/search` - Search for words by name with partial matching (paginated)
- `GET /api/v2/words/random` - Get a random word from the database
- `GET /api/v2/words/[id]` - Get a specific word by ID
- `GET /api/v2/categories` - Get all distinct categories
- `GET /api/v2/config` - Get API configuration (destructive endpoints status)
- `POST /api/v2/words` - Create a new word entry _(requires ENABLE_DESTRUCTIVE_ENDPOINTS=true)_
- `PUT /api/v2/words/[id]` - Update an existing word _(requires ENABLE_DESTRUCTIVE_ENDPOINTS=true)_
- `DELETE /api/v2/words/[id]` - Delete a word from the database _(requires ENABLE_DESTRUCTIVE_ENDPOINTS=true)_

### Query Parameters

#### GET /api/v1/words and GET /api/v2/words

**Filtering Parameters:**

- `category` - Filter by category
- `_id` - Filter by specific word ID (MongoDB ObjectId)
- `numLetters` - Exact number of letters (v1 & v2)
- `numSyllables` - Exact number of syllables (v1 & v2)
- `minLetters` - Minimum number of letters
- `maxLetters` - Maximum number of letters
- `minSyllables` - Minimum number of syllables
- `maxSyllables` - Maximum number of syllables

**Pagination Parameters (v2 only):**

- `limit` - Number of words to return (default: 10)
- `offset` - Number of words to skip (default: 0)

**Note:** v1 returns ALL matching words (no pagination), v2 supports pagination.

#### GET /api/v1/words/search and GET /api/v2/words/search

- `q` - Search query (required, minimum 2 characters)
- `limit` - Number of words to return (default: 10)
- `offset` - Number of words to skip (default: 0)

**Examples:**

- v1: `/api/v1/words?numLetters=5` (returns all 5-letter words as array)
- v2: `/api/v2/words?numLetters=5&limit=10` (returns paginated response)
- Get by ID: `/api/v1/words/5ffa1774c0831cbe1460e29c` (returns specific word)
- Combined filters: `/api/v1/words?category=animal&minLetters=4&maxLetters=6`
- Search: `/api/v1/words/search?q=cat&limit=5`

## Data Model

### Word Schema

```typescript
type Word = {
  _id: string
  word: string // The actual word (lowercase, required)
  category: string // Word category (lowercase, required)
  numLetters: number // Number of letters (required)
  numSyllables: number // Number of syllables (required)
  hint: string // Word hint (required)
  createdAt: Date
  updatedAt: Date
}
```

## Development

### Code Quality

- **ESLint**: Configured with Unicorn ruleset for best practices
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Testing**: Comprehensive test suite with Vitest, Testing Library, and MSW
- **Quality Checks**: Automated checks for linting, formatting, and testing

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm test` - Run tests in watch mode with Vitest
- `pnpm test:ui` - Run tests with Vitest UI
- `pnpm test:run` - Run tests once (CI mode)
- `pnpm check` - Run quality checks (lint, format, test)
- `pnpm audit` - Run security audit

### Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── v1/           # API version 1 (legacy - simple array format)
│   │   │   ├── categories/  # Category endpoints
│   │   │   ├── config/     # Configuration endpoints
│   │   │   └── words/      # Word management endpoints
│   │   │       ├── [id]/   # Individual word operations
│   │   │       ├── random/ # Random word endpoint
│   │   │       └── search/ # Word search endpoint
│   │   └── v2/           # API version 2 (paginated format)
│   │       ├── categories/  # Category endpoints
│   │       ├── config/     # Configuration endpoints
│   │       └── words/      # Word management endpoints
│   │           ├── [id]/   # Individual word operations
│   │           ├── random/ # Random word endpoint
│   │           └── search/ # Word search endpoint
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── error.tsx          # Error page
│   ├── favicon.ico        # Site favicon
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── not-found.tsx      # 404 page
│   ├── page.tsx           # Homepage
│   ├── robots.ts          # Robots.txt configuration
│   └── sitemap.ts         # Sitemap configuration
├── components/            # React components
│   ├── AboutPage.tsx      # About page component
│   ├── ContactPage.tsx    # Contact page component
│   ├── EndpointDemo/      # API testing components
│   │   ├── hooks/         # Custom hooks for API interactions
│   │   ├── utils/         # Utility functions
│   │   ├── DeleteForm.tsx
│   │   ├── EndpointDemo.tsx
│   │   ├── FilterForm.tsx
│   │   ├── SearchApiRequestExample.tsx
│   │   ├── SearchForm.tsx
│   │   ├── UpdateApiRequestExample.tsx
│   │   ├── UpdateForm.tsx
│   │   ├── WordForm.tsx
│   │   └── WordsApiRequestExample.tsx
│   ├── ErrorPage.tsx      # Error page component
│   ├── Footer.tsx         # Footer component
│   ├── HomePage.tsx       # Homepage component
│   ├── Navigation/        # Navigation components
│   │   ├── MobileMenu/    # Mobile menu components
│   │   └── Navigation.tsx
│   ├── NotFoundPage.tsx   # 404 page component
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and configuration
│   ├── constants/         # Application constants
│   ├── hooks/             # Shared custom hooks
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── mongodb.ts         # Database connection
│   ├── middleware.ts      # Middleware utilities
│   └── utils.ts           # Common utilities
├── models/                # Mongoose models
│   └── word.ts            # Word model definition
├── public/                # Static assets
│   ├── _headers           # Custom headers for hosting
│   └── og-image.png       # Open Graph image
├── scripts/               # Utility scripts
│   └── check-quality.sh   # Quality check script
├── test/                  # Test files
│   ├── app/               # App route tests
│   ├── components/        # Component tests
│   ├── hooks/             # Hook tests
│   ├── integration/       # Integration tests
│   ├── mocks/             # MSW mocks
│   └── utils/             # Test utilities
├── eslint.config.js       # ESLint configuration
├── middleware.ts          # Next.js middleware
├── next.config.ts         # Next.js configuration
├── package.json           # Project dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
├── vitest.config.ts       # Vitest configuration
└── README.md              # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, questions, or feature requests, please:

- Open an issue on GitHub
- Contact me through the contact page
