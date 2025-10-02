# Word Game DB v2

A modern, full-stack word game database built with Next.js 15, MongoDB, and TypeScript. This application provides a comprehensive API for word games, puzzles, and vocabulary management.

## 🚀 Live Demo

**Production API**: [https://wordgamedb.com](https://wordgamedb.com) (Read-only endpoints)

## Features

- **Full-Stack Next.js Application**: Built with Next.js 15 using the App Router
- **MongoDB Integration**: Robust database with Mongoose ODM
- **TypeScript Support**: Full type safety throughout the application
- **Modern UI**: Beautiful interface built with Tailwind CSS 4 and Radix UI
- **RESTful API**: Comprehensive API endpoints for word management
- **CORS Support**: Full CORS headers for cross-origin requests
- **Production Safety**: Destructive endpoints (POST, PUT, DELETE) are automatically disabled in production

## Tech Stack

- **Frontend**: React 19, Next.js 15, Tailwind CSS 4, Radix UI, Lucide React
- **Backend**: Next.js API Routes, MongoDB, Mongoose ODM
- **Development**: TypeScript, ESLint (Unicorn ruleset), Prettier

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

## Deployment

### Environment Variables

The `ENABLE_DESTRUCTIVE_ENDPOINTS` environment variable controls API endpoint availability:

**For Production (Recommended):**

```env
MONGODB_URI=your_production_mongodb_connection_string
# Do NOT set ENABLE_DESTRUCTIVE_ENDPOINTS in production
```

**For Development:**

```env
MONGODB_URI=mongodb://localhost:27017/word-game-db
ENABLE_DESTRUCTIVE_ENDPOINTS=true
```

### Production Behavior

- **Default (ENABLE_DESTRUCTIVE_ENDPOINTS not set)**: Only read-only endpoints (GET) are available
- **With ENABLE_DESTRUCTIVE_ENDPOINTS=true**: All endpoints (including POST, PUT, DELETE) are available
- **Security**: Destructive endpoints are automatically disabled in production for safety

### Example Implementation

Check out this example implementation using the API:

**Hangman Game**: [https://lucassilbernagel.github.io/hangman/](https://lucassilbernagel.github.io/hangman/)

**Source Code**: [https://github.com/LucasSilbernagel/hangman](https://github.com/LucasSilbernagel/hangman)

## API Endpoints

### Available Endpoints

- `GET /api/v1/words` - Retrieve all words with optional query filtering
- `GET /api/v1/words/search` - Search for words by name with partial matching
- `GET /api/v1/words/random` - Get a random word from the database
- `GET /api/v1/categories` - Get all distinct categories
- `GET /api/v1/words/[id]` - Get a specific word by ID
- `POST /api/v1/words` - Create a new word entry _(requires ENABLE_DESTRUCTIVE_ENDPOINTS=true)_
- `PUT /api/v1/words/[id]` - Update an existing word _(requires ENABLE_DESTRUCTIVE_ENDPOINTS=true)_
- `DELETE /api/v1/words/[id]` - Delete a word from the database _(requires ENABLE_DESTRUCTIVE_ENDPOINTS=true)_

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

- `q` - Search query (required, minimum 2 characters)
- `limit` - Number of words to return (default: 10)
- `offset` - Number of words to skip (default: 0)

**Example**: `/api/v1/words/search?q=cat&limit=5`

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

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production with Turbopack
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
│   └── *.tsx             # Page components
├── lib/                  # Utility functions
│   ├── mongodb.ts        # Database connection
│   └── utils.ts          # Common utilities
├── models/               # Mongoose models
└── middleware.ts         # Next.js middleware
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
