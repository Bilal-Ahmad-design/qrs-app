import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { Blog } from './collections/Blog'
import { ValidationReports } from './collections/ValidationReports'
import { PerilStatus } from './collections/PerilStatus'
import { Redirects } from './collections/Redirects'
import { FormSubmissions } from './collections/FormSubmissions'
import { AuditLogs } from './collections/AuditLogs'
import { Media } from './collections/Media'
import { TrustCenter } from './globals/TrustCenter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' - QRS CMS',
    },
  },
  collections: [
    Users,
    Pages,
    Blog,
    ValidationReports,
    PerilStatus,
    Redirects,
    FormSubmissions,
    AuditLogs,
    Media,
  ],
  globals: [
    TrustCenter,
  ],
  db: postgresAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  editor: lexicalEditor(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
})
