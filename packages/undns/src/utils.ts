// Result type for error handling
export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      data: T;
      error: Error;
    };

/**
 * Safely execute a function and wrap result in Result type
 * @param fn - Function to execute
 * @param fallback - Fallback value if function throws
 */
export async function safeCall<T>(
  fn: () => Promise<T>,
  fallback: T,
): Promise<Result<T>> {
  try {
    const data = await fn();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      data: fallback,
      error: error as Error,
    };
  }
}

/**
 * Extract data from Result, throwing error if failed
 * @param result - Result to extract from
 */
export function unwrapResult<T>(result: Result<T>): T {
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}
