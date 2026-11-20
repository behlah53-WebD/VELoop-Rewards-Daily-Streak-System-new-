import { AuditLog } from '../models/AuditLog.js';

/**
 * VELoop Rewards — Audit Service
 * Records security and lifecycle events.
 */
export async function logAudit({
  userId = null,
  event,
  requestId = null,
  ip = null,
  userAgent = null,
  details = {},
  session = null,
}) {
  try {
    const doc = new AuditLog({
      userId,
      event,
      requestId,
      ip,
      userAgent,
      details,
    });

    if (session) {
      await doc.save({ session });
    } else {
      await doc.save();
    }
    return doc;
  } catch (error) {
    // Non-blocking for primary flows, but logged
    console.error(`[AuditService Error] Failed to write audit event ${event}:`, error.message);
    return null;
  }
}

export default { logAudit };
