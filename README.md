# Word Game DB v2

A modern, full-stack word game database built with Next.js 15, MongoDB, and TypeScript. This application provides a comprehensive API for word games, puzzles, and vocabulary management.

## 🚀 Live Demo

**Production API**: [https://wordgamedb.com](https://wordgamedb.com) (Read-only endpoints)

## Features

- **Full-Stack Next.js Application**: Built with Next.js 15 using the App Router
- **MongoDB Integration**: Robust database with Mongoose ODM
- **TypeScript Support**: Full type safety throughout the application
- **Modern UI**: Beautiful interface built with Tailwind CSS and Radix UI
- **RESTful API**: Comprehensive API endpoints for word management
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
# MongoDB connection string (supports both MONGODB_URI and DB for compatibility)
MONGODB_URI=mongodb://localhost:27017/word-game-db
# Alternative: DB=mongodb://localhost:27017/word-game-db

# Enable destructive endpoints for local development (optional)
# This controls both API endpoint availability and demo display
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

## Deployment

### Production Deployment

When deploying to production (Vercel, Netlify, etc.), destructive endpoints (POST, PUT, DELETE) are disabled by default for security. Only read-only endpoints are available unless explicitly enabled:

**Default Production Behavior (ENABLE_DESTRUCTIVE_ENDPOINTS not set or false):**

- ✅ `GET /api/v1/words` - Retrieve words
- ✅ `GET /api/v1/words/random` - Get random word
- ✅ `GET /api/v1/categories` - Get categories
- ✅ `GET /api/v1/words/[id]` - Get specific word
- ❌ `POST /api/v1/words` - Create word (disabled)
- ❌ `PUT /api/v1/words/[id]` - Update word (disabled)
- ❌ `DELETE /api/v1/words/[id]` - Delete word (disabled)

**With ENABLE_DESTRUCTIVE_ENDPOINTS=true:**

- ✅ All endpoints available (including POST, PUT, DELETE)
- ✅ Destructive endpoint demos visible on homepage
- ⚠️ **Warning**: Only enable this if you specifically need database modification capabilities

### Environment Variables for Production

For production deployment, you only need:

```env
MONGODB_URI=your_production_mongodb_connection_string
```

**Do NOT set** `ENABLE_DESTRUCTIVE_ENDPOINTS=true` in production unless you specifically need to allow database modifications.

### Environment Variable Behavior

The `ENABLE_DESTRUCTIVE_ENDPOINTS` environment variable controls:

1. **API Endpoint Availability**: Whether POST, PUT, and DELETE endpoints are accessible
2. **Demo Display**: Whether destructive endpoint demos are shown on the homepage
3. **Demo Functionality**: Whether the demo buttons for destructive endpoints actually make requests

When `ENABLE_DESTRUCTIVE_ENDPOINTS=true`:

- ✅ Destructive API endpoints are enabled
- ✅ Destructive endpoint demos are displayed on the homepage
- ✅ Demo buttons make actual API requests

When `ENABLE_DESTRUCTIVE_ENDPOINTS=false` or not set:

- ❌ Destructive API endpoints return 403 Forbidden
- ❌ Destructive endpoint demos are hidden from the homepage
- ❌ Only read-only endpoints (GET) are available and displayed

### Example Implementation

Check out this example implementation using the API:

**Hangman Game**: [https://lucassilbernagel.github.io/hangman/](https://lucassilbernagel.github.io/hangman/)

**Source Code**: [https://github.com/LucasSilbernagel/hangman](https://github.com/LucasSilbernagel/hangman)

## API Endpoints

### Public Endpoints (Available in Production)

- `GET /api/v1/words` - Retrieve all words with optional query filtering
- `GET /api/v1/words/random` - Get a random word from the database
- `GET /api/v1/categories` - Get all distinct categories
- `GET /api/v1/words/[id]` - Get a specific word by ID

### Development Endpoints (Conditional)

- `POST /api/v1/words` - Create a new word entry
- `PUT /api/v1/words/[id]` - Update an existing word
- `DELETE /api/v1/words/[id]` - Delete a word from the database

> **Note**: Destructive endpoints (POST, PUT, DELETE) are only available when `ENABLE_DESTRUCTIVE_ENDPOINTS=true` is set in your environment variables. This applies to both development and production environments. When not enabled, these endpoints return 403 Forbidden and are hidden from the demo interface.

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
