export class AppError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AppError';
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function handleError(error: unknown): never {
  if (isAppError(error)) {
    throw error;
  }
  throw new AppError(
    error instanceof Error ? error.message : 'An unknown error occurred',
    'UNKNOWN_ERROR'
  );
} 