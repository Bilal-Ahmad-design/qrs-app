import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload"

interface AuditLogData {
  user?: string | null
  userEmail: string
  collectionName: string
  documentId: string | number
  action: "create" | "update" | "delete" | "publish" | "unpublish"
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

export function createDiff(before: Record<string, any>, after: Record<string, any>) {
  const changes: Record<string, any> = {}
  const allKeys = new Set([
    ...Object.keys(before || {}),
    ...Object.keys(after || {}),
  ])

  for (const key of allKeys) {
    // Skip sensitive fields (case-insensitive)
    const keyLower = key.toLowerCase()
    if (["password", "token", "secret", "apikey"].includes(keyLower)) {
      continue
    }

    const beforeVal = before?.[key]
    const afterVal = after?.[key]

    if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
      changes[key] = {
        before: beforeVal,
        after: afterVal,
      }
    }
  }

  return Object.keys(changes).length > 0 ? changes : null
}

export const auditAfterChangeHook =
  (collectionName: string): CollectionAfterChangeHook =>
  async ({ req, doc, previousDoc }) => {
    if (!req.user || !req.user.email) return

    try {
      const changes = createDiff(previousDoc || {}, doc || {})

      const auditData: AuditLogData = {
        user: String(req.user.id),
        userEmail: req.user.email,
        collectionName,
        documentId: doc.id,
        action: previousDoc ? "update" : "create",
        changes: changes ?? undefined,
        ipAddress: req.ip,
        userAgent: req.headers?.get?.("user-agent") || undefined,
        timestamp: new Date(),
      }

      await req.payload.create({
        collection: "audit-logs",
        data: auditData,
      })
    } catch (error) {
      console.error(`Failed to create audit log for ${collectionName}:`, error)
    }
  }

export const auditAfterDeleteHook =
  (collectionName: string): CollectionAfterDeleteHook =>
  async ({ req, doc }) => {
    if (!req.user || !req.user.email) return

    try {
      const auditData: AuditLogData = {
        user: String(req.user.id),
        userEmail: req.user.email,
        collectionName,
        documentId: doc.id,
        action: "delete",
        changes: { deletedDoc: doc },
        ipAddress: req.ip,
        userAgent: req.headers?.get?.("user-agent") || undefined,
        timestamp: new Date(),
      }

      await req.payload.create({
        collection: "audit-logs",
        data: auditData,
      })
    } catch (error) {
      console.error(`Failed to create delete audit log for ${collectionName}:`, error)
    }
  }
