import { v4 as uuidv4 } from 'uuid';

export function requestIdMiddleware(req, res, next) {
  const existingId = req.headers['x-request-id'];
  const requestId = existingId && typeof existingId === 'string' ? existingId : uuidv4();
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}

export default requestIdMiddleware;
