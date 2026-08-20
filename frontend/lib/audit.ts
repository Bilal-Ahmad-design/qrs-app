import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

interface AuditLogEntry {
  userId?: string | null
  tableName: string
  recordId: number
  action: 'create' | 'update' | 'delete' | 'publish'
  changes?: Record<string, unknown>
  ipAddress: string
}

/**
 * Log an action to the audit trail
 * Used for SOC 2 compliance (H5/H7 accountability)
 */
export async function logAuditEntry(entry: AuditLogEntry): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, table_name, record_id, action, changes, ip_address, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        entry.userId || null,
        entry.tableName,
        entry.recordId,
        entry.action,
        entry.changes ? JSON.stringify(entry.changes) : null,
        entry.ipAddress,
        new Date().toISOString(),
      ]
    )
  } catch (error) {
    console.error('Failed to log audit entry:', error)
    // Don't throw - audit logging shouldn't fail the main request
  }
}
