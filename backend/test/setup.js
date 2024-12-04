// Set test environment
process.env.NODE_ENV = 'test';

// Set test JWT secret
process.env.JWT_SECRET = 'test-secret-key';

// Increase test timeout
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Clean up resources after all tests
afterAll(async () => {
  // Add any global cleanup here
});
