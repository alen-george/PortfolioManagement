import prisma from "../lib/prisma.js";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.Console()],
});

/**
 * Persist any user-related event to AUDIT_ACTION and also emit to the app log.
 * @param {Object} opts
 * @param {number|null} opts.userId
 * @param {string} opts.action            – e.g. LOGIN_SUCCESS, ORDER UPDATE
 * @param {object} [opts.metadata]        – optional JSON payload (ip, filters, etc.)
 */
export async function logAction({ userId = null, action, metadata = {} }) {
  try {
    await prisma.auditAction.create({
      data: { userId, action, metadata },
    });
    logger.info(
      `AUDIT action=${action} user=${userId ?? "anon"} meta=${JSON.stringify(
        metadata
      )}`
    );
  } catch (err) {
    logger.error("Failed to write AuditAction", err);
  }
}

/**
 * Convenience helper dedicated to login attempts.
 * Internally calls logAction so everything still lives in AUDIT_ACTION.
 */
export async function logUserLogin({
  userId = null,
  ip,
  userAgent,
  succeeded = true,
}) {
  await logAction({
    userId,
    action: succeeded ? "LOGIN_SUCCESS" : "LOGIN_FAILURE",
    metadata: { ip, userAgent },
  });
}
