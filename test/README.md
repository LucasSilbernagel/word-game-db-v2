# Test Suite Documentation

This directory contains a comprehensive test suite for the Word Game DB application using Vitest, Testing Library, and MSW for API mocking.

## Test Structure

```
test/
├── app/                    # App route tests
│   ├── about.test.tsx
│   ├── contact.test.tsx
│   ├── error.test.tsx
│   ├── layout.test.tsx
│   ├── not-found.test.tsx
│   └── page.test.tsx
├── components/             # React component tests (UI/UX focused)
│   ├── AboutPage.test.tsx
│   ├── ContactPage.test.tsx
│   ├── DeleteForm.test.tsx
│   ├── EndpointDemo.test.tsx
│   ├── ErrorPage.test.tsx
│   ├── FilterForm.test.tsx
│   ├── Footer.test.tsx
│   ├── HomePage.test.tsx
│   ├── MobileMenu.test.tsx
│   ├── MobileMenuContent.test.tsx
│   ├── Navigation.test.tsx
│   ├── NotFoundPage.test.tsx
│   ├── SearchApiRequestExample.test.tsx
│   ├── SearchForm.test.tsx
│   ├── UpdateApiRequestExample.test.tsx
│   ├── UpdateForm.test.tsx
│   ├── WordForm.test.tsx
│   ├── WordsApiRequestExample.test.tsx
│   └── ui/                 # UI component tests
│       ├── Button.test.tsx
│       ├── Card.test.tsx
│       ├── Input.test.tsx
│       ├── Label.test.tsx
│       ├── RadioGroup.test.tsx
│       ├── Select.test.tsx
│       ├── Sheet.test.tsx
│       └── Textarea.test.tsx
├── hooks/                  # Custom hook tests
│   ├── useApiState.test.ts
│   └── useFilters.test.ts
├── integration/            # Integration tests (comprehensive API coverage)
│   ├── api-integration.test.ts  # Complete API endpoint testing
│   ├── api-versions.test.ts     # API version compatibility tests
│   └── word-crud-flow.test.tsx  # User workflow tests
├── mocks/                  # MSW mock handlers
│   ├── browser.ts
│   ├── handlers.ts
│   └── server.ts
├── utils/                  # Test utilities
│   ├── apiWrapper.test.ts
│   └── validation.test.ts
├── setup.ts                # Global test setup
└── README.md               # This file
```

## Running Tests

### Available Scripts

```bash
# Run tests in watch mode (default)
pnpm test

# Run tests once (CI mode, no watch)
pnpm test:run

# Run tests with UI (browser-based interface)
pnpm test:ui
```

### Test Configuration

The test configuration is defined in `vitest.config.ts`:

- **Environment**: jsdom (for DOM testing)
- **Setup**: `test/setup.ts` (global setup)
- **Globals**: true (enables global test APIs)
- **Aliases**: `@` mapped to project root

## Test Categories

### 1. App Route Tests (`test/app/`)

Tests for Next.js app routes and pages:

- **about.test.tsx**: About page rendering and content
- **contact.test.tsx**: Contact page rendering and content
- **error.test.tsx**: Error page handling and display
- **layout.test.tsx**: Root layout component and metadata
- **not-found.test.tsx**: 404 page rendering
- **page.test.tsx**: Homepage rendering and content

Tests verify:

- Page rendering and structure
- Metadata and SEO elements
- Error boundaries
- Layout components

### 2. Component Tests (`test/components/`)

UI/UX focused tests for React components using Testing Library:

**Main Components:**

- **AboutPage**: About page content and links
- **ContactPage**: Contact information display
- **EndpointDemo**: API demo component and state management
- **ErrorPage**: Error page display
- **Footer**: Footer content and links
- **HomePage**: Homepage content and navigation
- **Navigation**: Navigation bar and mobile menu
- **NotFoundPage**: 404 page content

**Form Components:**

- **DeleteForm**: Delete form interactions
- **FilterForm**: Filter form UI and dropdown interactions
- **SearchForm**: Search form UI and input handling
- **UpdateForm**: Update form validation and submission
- **WordForm**: Word creation form and validation

**API Request Examples:**

- **SearchApiRequestExample**: Search API example display
- **UpdateApiRequestExample**: Update API example display
- **WordsApiRequestExample**: Words API example display

**UI Components (`test/components/ui/`):**

- **Button**: Button component variants and interactions
- **Card**: Card component rendering
- **Input**: Input field component
- **Label**: Label component
- **RadioGroup**: Radio button group component
- **Select**: Select dropdown component
- **Sheet**: Sheet/drawer component
- **Textarea**: Textarea component

Tests focus on:

- Component rendering and accessibility
- Form field interactions and validation
- UI state display (loading, errors, responses)
- User interface elements and attributes

### 3. Hook Tests (`test/hooks/`)

Tests for custom React hooks:

- **useApiState**: API call state management (loading, error, success states)
- **useFilters**: Filter state management (category, letters, syllables)

Tests verify:

- Initial state
- State updates
- Side effects
- Cleanup

### 4. Integration Tests (`test/integration/`)

Comprehensive API endpoint and workflow testing:

**API Integration (`api-integration.test.ts`):**

- GET `/api/v2/words` - List words with filtering and pagination
- POST `/api/v2/words` - Create new words
- GET `/api/v2/words/search` - Search words
- GET `/api/v2/words/random` - Get random word
- GET `/api/v2/words/[id]` - Get word by ID
- PUT `/api/v2/words/[id]` - Update word
- DELETE `/api/v2/words/[id]` - Delete word
- GET `/api/v2/categories` - Get all categories

**API Versions (`api-versions.test.ts`):**

- v1 vs v2 API compatibility
- Response format differences
- Pagination behavior

**User Workflows (`word-crud-flow.test.tsx`):**

- Complete CRUD workflows
- Search and filter flows
- Cross-component interactions

Each test includes:

- Success scenarios
- Error handling
- Validation
- Edge cases
- Real HTTP request/response cycles

### 5. Utility Tests (`test/utils/`)

Tests for utility functions:

- **apiWrapper.test.ts**: API route wrapper functionality and error handling
- **validation.test.ts**: Input validation and data transformation

## Mocking Strategy

### MSW (Mock Service Worker)

The test suite uses MSW to mock API calls instead of hitting real endpoints:

```typescript
// Example mock handler
http.get('http://localhost:3000/api/v2/words', () => {
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

Test data is centralized in `test/mocks/handlers.ts`:

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
2. **Add to appropriate directory**:
   - App routes → `test/app/`
   - Components → `test/components/`
   - Hooks → `test/hooks/`
   - Integration tests → `test/integration/`
   - Utility functions → `test/utils/`
3. **Update this README**: Document new test patterns or categories
4. **Maintain coverage**: Ensure new code is tested

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
