/**
 * Middleware factory that validates request body against a Zod schema.
 * Automatically strips unknown fields to prevent mass assignment / client spoofing.
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issue = result.error.issues[0];
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid request payload',
          details: result.error.format(),
          requestId: req.id,
        },
      });
    }

    // Replace req.body with sanitized & stripped data
    req.body = result.data;
    next();
  };
}

/**
 * Middleware factory that validates query parameters against a Zod schema.
 */
export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const issue = result.error.issues[0];
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid query parameters',
          details: result.error.format(),
          requestId: req.id,
        },
      });
    }

    req.query = result.data;
    next();
  };
}

export default { validateBody, validateQuery };
