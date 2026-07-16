import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fieldErrors = errors.array().map((err) => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg,
    }));
    const combinedMessage = fieldErrors.map((e) => e.message).join('. ');
    res.status(400).json({
      success: false,
      message: combinedMessage,
      errors: fieldErrors,
    });
    return;
  }
  next();
};
