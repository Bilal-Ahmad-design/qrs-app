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
import { ProductShowcase } from './collections/ProductShowcase'
import { Solutions } from './collections/Solutions'
import { RegulatoryCompliance } from './collections/RegulatoryCompliance'
import { PlatformCapability } from './collections/PlatformCapability'
import { Documentation } from './collections/Documentation'
import { PageSections } from './collections/PageSections'
import { EmailSettings } from './collections/EmailSettings'
import { EmailLogs } from './collections/EmailLogs'
import { FormEntries } from './collections/FormEntries'
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
    FormEntries,
    EmailLogs,
    EmailSettings,
    AuditLogs,
    Media,
    ProductShowcase,
    Solutions,
    RegulatoryCompliance,
    PlatformCapability,
    Documentation,
    PageSections,
  ],
  globals: [
    TrustCenter,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
})
