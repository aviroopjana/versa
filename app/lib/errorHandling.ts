import { NextRequest, NextResponse } from 'next/server';

export interface APIError extends Error {
  statusCode?: number;
  code?: string;
}

export class ValidationError extends Error {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  statusCode = 401;
  code = 'AUTHENTICATION_ERROR';
  
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  statusCode = 403;
  code = 'AUTHORIZATION_ERROR';
  
  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  code = 'NOT_FOUND';
  
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends Error {
  statusCode = 429;
  code = 'RATE_LIMIT_EXCEEDED';
  
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends Error {
  statusCode = 503;
  code = 'EXTERNAL_SERVICE_ERROR';
  
  constructor(message: string, public service?: string) {
    super(message);
    this.name = 'ExternalServiceError';
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Handle known error types
  if (error instanceof ValidationError) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
      type: 'validation_error'
    }, { status: error.statusCode });
  }

  if (error instanceof AuthenticationError) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
      type: 'authentication_error'
    }, { status: error.statusCode });
  }

  if (error instanceof AuthorizationError) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
      type: 'authorization_error'
    }, { status: error.statusCode });
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
      type: 'not_found_error'
    }, { status: error.statusCode });
  }

  if (error instanceof RateLimitError) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
      type: 'rate_limit_error'
    }, { status: error.statusCode });
  }

  if (error instanceof ExternalServiceError) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
      type: 'external_service_error',
      service: error.service
    }, { status: error.statusCode });
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json({
          error: 'A record with this information already exists',
          code: 'DUPLICATE_RECORD',
          type: 'database_error'
        }, { status: 409 });
      
      case 'P2025':
        return NextResponse.json({
          error: 'Record not found',
          code: 'RECORD_NOT_FOUND',
          type: 'database_error'
        }, { status: 404 });
      
      case 'P2003':
        return NextResponse.json({
          error: 'Foreign key constraint failed',
          code: 'FOREIGN_KEY_ERROR',
          type: 'database_error'
        }, { status: 400 });
      
      default:
        return NextResponse.json({
          error: 'Database operation failed',
          code: 'DATABASE_ERROR',
          type: 'database_error'
        }, { status: 500 });
    }
  }

  // Handle other known error types
  if (error instanceof Error) {
    // Handle network/fetch errors
    if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
      return NextResponse.json({
        error: 'External service unavailable',
        code: 'SERVICE_UNAVAILABLE',
        type: 'network_error'
      }, { status: 503 });
    }

    // Handle timeout errors
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      return NextResponse.json({
        error: 'Request timeout',
        code: 'REQUEST_TIMEOUT',
        type: 'timeout_error'
      }, { status: 408 });
    }

    // Handle file system errors
    if (error.message.includes('ENOENT') || error.message.includes('file not found')) {
      return NextResponse.json({
        error: 'File not found',
        code: 'FILE_NOT_FOUND',
        type: 'file_error'
      }, { status: 404 });
    }

    if (error.message.includes('ENOSPC') || error.message.includes('no space left')) {
      return NextResponse.json({
        error: 'Insufficient storage space',
        code: 'STORAGE_FULL',
        type: 'storage_error'
      }, { status: 507 });
    }
  }

  // Generic server error
  return NextResponse.json({
    error: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
    type: 'server_error'
  }, { status: 500 });
}

// Wrapper function for API routes
export function withErrorHandling(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

// Validation helpers
export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
}

export function validateFileType(file: File, allowedTypes: string[]): void {
  if (!allowedTypes.includes(file.type)) {
    throw new ValidationError(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
}

export function validateFileSize(file: File, maxSizeBytes: number): void {
  if (file.size > maxSizeBytes) {
    const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
    throw new ValidationError(`File size exceeds ${maxSizeMB}MB limit`);
  }
}

// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const current = rateLimitMap.get(identifier);
  
  if (!current || current.resetTime < now) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return;
  }
  
  if (current.count >= limit) {
    throw new RateLimitError(`Rate limit exceeded. Try again in ${Math.ceil((current.resetTime - now) / 1000)} seconds`);
  }
  
  current.count++;
}

export default {
  handleAPIError,
  withErrorHandling,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  ExternalServiceError,
  validateRequired,
  validateEmail,
  validateFileType,
  validateFileSize,
  checkRateLimit
};
