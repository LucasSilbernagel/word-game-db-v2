# Test Suite Documentation

This directory contains a comprehensive test suite for the Word Game DB application using Vitest, Testing Library, and MSW for API mocking.

## Test Structure

```
src/test/
├── api/                    # API endpoint tests
│   ├── words.test.ts       # Words CRUD operations
│   ├── words-search.test.ts # Word search functionality
│   ├── words-id.test.ts    # Individual word operations
│   ├── words-random.test.ts # Random word generation
│   └── categories.test.ts  # Categories API
├── components/             # React component tests
│   ├── EndpointDemo.test.tsx
│   ├── WordForm.test.tsx
│   ├── SearchForm.test.tsx
│   └── FilterForm.test.tsx
├── hooks/                  # Custom hook tests
│   ├── useFilters.test.ts
│   └── useApiState.test.ts
├── integration/            # Integration tests
│   ├── word-crud-flow.test.tsx
│   └── api-integration.test.ts
├── utils/                  # Utility function tests
│   ├── validation.test.ts
│   ├── apiWrapper.test.ts
│   └── test-helpers.ts     # Test utilities
├── mocks/                  # MSW mock handlers
│   ├── server.ts
│   ├── handlers.ts
│   └── browser.ts
├── utils/
│   ├── test-utils.tsx      # Testing Library setup
│   └── test-helpers.ts     # Custom test utilities
├── setup.ts               # Global test setup
└── README.md              # This file
```

## Running Tests

### Available Scripts

```bash
# Run tests in watch mode (development)
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI (browser-based)
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

### Test Configuration

The test configuration is defined in `vitest.config.ts`:

- **Environment**: jsdom (for DOM testing)
- **Setup**: `src/test/setup.ts` (global setup)
- **Coverage**: v8 provider with HTML, JSON, and text reports
- **Aliases**: `@` mapped to project root

## Test Categories

### 1. API Tests (`src/test/api/`)

Tests for all API endpoints including:

- GET `/api/v1/words` - List words with filtering and pagination
- POST `/api/v1/words` - Create new words
- GET `/api/v1/words/search` - Search words
- GET `/api/v1/words/random` - Get random word
- GET `/api/v1/words/[id]` - Get word by ID
- PUT `/api/v1/words/[id]` - Update word
- DELETE `/api/v1/words/[id]` - Delete word
- GET `/api/v1/categories` - Get all categories

Each test includes:

- Success scenarios
- Error handling
- Validation
- Edge cases

### 2. Component Tests (`src/test/components/`)

Tests for React components using Testing Library:

- **EndpointDemo**: Main demo component with all form types
- **WordForm**: Word creation form
- **SearchForm**: Word search form
- **FilterForm**: Word filtering form

Tests cover:

- Rendering
- User interactions
- Form validation
- State management
- Accessibility

### 3. Hook Tests (`src/test/hooks/`)

Tests for custom React hooks:

- **useFilters**: Filter state management
- **useApiState**: API call state management

Tests verify:

- Initial state
- State updates
- Side effects
- Cleanup

### 4. Integration Tests (`src/test/integration/`)

End-to-end user flow tests:

- **Word CRUD Flow**: Complete create, read, update, delete operations
- **API Integration**: Full API interaction testing

Tests simulate:

- Real user interactions
- Complete workflows
- Error scenarios
- Loading states

### 5. Utility Tests (`src/test/utils/`)

Tests for utility functions:

- **validation.ts**: Input validation and transformation
- **apiWrapper.ts**: API route wrapper functionality

## Mocking Strategy

### MSW (Mock Service Worker)

The test suite uses MSW to mock API calls instead of hitting real endpoints:

```typescript
// Example mock handler
http.get('http://localhost:3000/api/v1/words', () => {
  return HttpResponse.json({
    words: mockWords,
    pagination: { total: 1, limit: 10, offset: 0, hasMore: false },
  })
})
```

### Benefits of MSW:

- Realistic HTTP requests
- No need to mock fetch/axios
- Works with any HTTP client
- Easy to test different scenarios

### Mock Data

Test data is centralized in `src/test/mocks/handlers.ts`:

- Consistent mock data across tests
- Easy to modify for different test scenarios
- Realistic data structures

## Testing Best Practices

### 1. Test Structure

Follow the AAA pattern:

```typescript
it('should do something', () => {
  // Arrange - Set up test data and mocks
  // Act - Execute the code being tested
  // Assert - Verify the results
})
```

### 2. Test Naming

Use descriptive test names:

```typescript
// Good
it('should return 404 when word not found')

// Bad
it('should work')
```

### 3. Test Isolation

Each test should be independent:

- Use `beforeEach` for setup
- Clean up after each test
- Don't rely on test execution order

### 4. Mock Management

- Mock at the right level (not too high, not too low)
- Use MSW for API mocking
- Mock external dependencies
- Keep mocks simple and focused

### 5. Assertions

Use specific assertions:

```typescript
// Good
expect(response.status).toBe(201)
expect(data.word).toBe('apple')

// Avoid
expect(response).toBeTruthy()
```

## Coverage Goals

The test suite aims for:

- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

Run coverage with:

```bash
pnpm test:coverage
```

## Debugging Tests

### Using Vitest UI

```bash
pnpm test:ui
```

Opens a browser-based interface for:

- Running individual tests
- Viewing test results
- Debugging failures

### Console Logging

```typescript
// In tests
console.log('Debug info:', data)

// In components
console.log('Component state:', state)
```

### Breakpoints

Set breakpoints in VS Code:

1. Open test file
2. Set breakpoint on line
3. Run test in debug mode

## Continuous Integration

The test suite is designed to run in CI environments:

- No external dependencies
- Deterministic results
- Fast execution
- Clear error messages

## Contributing

When adding new tests:

1. **Follow naming conventions**: `*.test.ts` or `*.test.tsx`
2. **Add to appropriate directory**: Match the source file structure
3. **Update this README**: Document new test patterns
4. **Maintain coverage**: Ensure new code is tested
5. **Use helpers**: Leverage test utilities in `test-helpers.ts`

## Troubleshooting

### Common Issues

1. **Tests not running**: Check `vitest.config.ts` and `setup.ts`
2. **MSW not working**: Verify handlers are properly configured
3. **Component not rendering**: Check for missing providers
4. **Async issues**: Use `waitFor` for async operations

### Getting Help

- Check existing tests for patterns
- Review Testing Library documentation
- Consult Vitest documentation
- Check MSW documentation for mocking issues
