# Word Game Database v2

A modern, full-stack word game database built with Next.js 15, MongoDB, and TypeScript. This application provides a comprehensive API for word games, puzzles, and vocabulary management.

## 🚀 Live Demo

**Production API**: [https://wordgamedb.com](https://wordgamedb.com) (Read-only endpoints)

## Features

- **Full-Stack Next.js Application**: Built with Next.js 15 using the App Router
- **MongoDB Integration**: Robust database with Mongoose ODM
- **TypeScript Support**: Full type safety throughout the application
- **Modern UI**: Beautiful interface built with Tailwind CSS and Radix UI
- **State Management**: Zustand for efficient client-side state management
- **RESTful API**: Comprehensive API endpoints for word management
- **Search & Filtering**: Advanced search capabilities with multiple filters
- **CORS Support**: Full CORS headers for cross-origin requests
- **Error Handling**: Comprehensive error handling and logging
- **Responsive Design**: Mobile-first approach with modern design patterns
- **Production Safety**: Destructive endpoints (POST, PUT, DELETE) are automatically disabled in production

## Tech Stack

### Backend

- Next.js 15 with App Router
- MongoDB with Mongoose ODM
- TypeScript
- RESTful API design

### Frontend

- React 19 with Server Components
- Tailwind CSS 4
- Radix UI components
- Zustand for state management
- Lucide React icons

### Development Tools

- ESLint with Unicorn ruleset
- Prettier for code formatting
- TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/word-game-db-v2.git
cd word-game-db-v2
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
# MongoDB connection string (supports both MONGODB_URI and DB for compatibility)
MONGODB_URI=mongodb://localhost:27017/word-game-db
# Alternative: DB=mongodb://localhost:27017/word-game-db

# Enable destructive endpoints for local development (optional)
ENABLE_DESTRUCTIVE_ENDPOINTS=true
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting up MongoDB Atlas (Recommended)

For a free cloud database, follow these steps:

1. **Create a MongoDB Atlas account**: [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)

2. **Create a new cluster**:
   - Choose the free tier (M0)
   - Select a region close to you
   - Give your cluster a name

3. **Set up database access**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"

4. **Configure network access**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get your connection string**:
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `word-game-db`)

6. **Update your `.env.local`**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/word-game-db
   ENABLE_DESTRUCTIVE_ENDPOINTS=true
   ```

## Local Development with Full Functionality

To enable all endpoints (including POST, PUT, DELETE) for local development:

1. **Set up your environment** as described above
2. **Add the environment variable** to your `.env.local`:
   ```env
   ENABLE_DESTRUCTIVE_ENDPOINTS=true
   ```
3. **Start the development server**:
   ```bash
   pnpm dev
   ```

Now you can:

- **Create new words** using `POST /api/v1/words`
- **Update existing words** using `PUT /api/v1/words/[id]`
- **Delete words** using `DELETE /api/v1/words/[id]`
- **Test all functionality** locally before deploying

### Example: Adding a New Word

```bash
curl -X POST http://localhost:3000/api/v1/words \
  -H "Content-Type: application/json" \
  -d '{
    "word": "lion",
    "category": "animals",
    "numLetters": 4,
    "numSyllables": 2,
    "hint": "King of the jungle"
  }'
```

### Example: Updating a Word

```bash
curl -X PUT http://localhost:3000/api/v1/words/WORD_ID \
  -H "Content-Type: application/json" \
  -d '{
    "hint": "Updated hint text"
  }'
```

### Example: Deleting a Word

```bash
curl -X DELETE http://localhost:3000/api/v1/words/WORD_ID
```

## Deployment

### Production Deployment

When deploying to production (Vercel, Netlify, etc.), the destructive endpoints (POST, PUT, DELETE) are automatically disabled for security. Only read-only endpoints are available:

- ✅ `GET /api/v1/words` - Retrieve words
- ✅ `GET /api/v1/words/random` - Get random word
- ✅ `GET /api/v1/categories` - Get categories
- ✅ `GET /api/v1/words/[id]` - Get specific word
- ✅ `GET /api/v1/words/search` - Search words
- ❌ `POST /api/v1/words` - Create word (disabled)
- ❌ `PUT /api/v1/words/[id]` - Update word (disabled)
- ❌ `DELETE /api/v1/words/[id]` - Delete word (disabled)

### Environment Variables for Production

For production deployment, you only need:

```env
MONGODB_URI=your_production_mongodb_connection_string
```

**Do NOT set** `ENABLE_DESTRUCTIVE_ENDPOINTS=true` in production unless you specifically need to allow database modifications.

### Example Implementation

Check out this example implementation using the API:

**Hangman Game**: [https://lucassilbernagel.github.io/hangman/](https://lucassilbernagel.github.io/hangman/)

**Source Code**: [https://github.com/LucasSilbernagel/hangman](https://github.com/LucasSilbernagel/hangman)

## API Endpoints

### Public Endpoints (Available in Production)

- `GET /api/v1/words` - Retrieve all words with direct query filtering
- `GET /api/v1/words/random` - Get a random word from the database
- `GET /api/v1/categories` - Get all distinct categories
- `GET /api/v1/words/[id]` - Get a specific word by ID
- `GET /api/v1/words/search` - Search for words by various criteria

### Development Endpoints (Local Only)

- `POST /api/v1/words` - Create a new word entry
- `PUT /api/v1/words/[id]` - Update an existing word
- `DELETE /api/v1/words/[id]` - Delete a word from the database

> **Note**: Destructive endpoints (POST, PUT, DELETE) are automatically disabled in production to protect the database. They are only available when running locally with `NODE_ENV=development` or when explicitly enabled with `ENABLE_DESTRUCTIVE_ENDPOINTS=true`.

### Query Parameters

#### GET /api/v1/words

- `category` - Filter by category
- `numLetters` - Filter by exact number of letters
- `numSyllables` - Filter by exact number of syllables
- `limit` - Number of words to return (default: 10)
- `offset` - Number of words to skip (default: 0)
- `minLetters` - Minimum number of letters
- `maxLetters` - Maximum number of letters
- `minSyllables` - Minimum number of syllables
- `maxSyllables` - Maximum number of syllables
- Any other field from the Word model for direct filtering

#### GET /api/v1/words/search

- `q` - Search query (required)
- `type` - Game type filter (crossword, scrabble, wordsearch)
- `limit` - Number of results (default: 10)
- `offset` - Number of results to skip (default: 0)

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

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── navigation.tsx    # Navigation component
├── lib/                  # Utility functions
│   ├── mongodb.ts        # Database connection
│   └── utils.ts          # Common utilities
├── models/               # Mongoose models
├── store/                # Zustand stores
└── types/                # TypeScript type definitions
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
