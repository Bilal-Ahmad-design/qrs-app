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
import { TrustCenter } from './globals/TrustCenter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' - QRS CMS',
    },
    css: `
      /* ============================================
         RESPONSIVE & OVERFLOW FIXES
         ============================================ */

      /* Prevent horizontal overflow on all elements */
      * {
        box-sizing: border-box;
      }

      html, body {
        overflow-x: hidden;
        max-width: 100vw;
        width: 100%;
      }

      /* Main container fixes */
      .payload-admin {
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
      }

      /* Sidebar responsive */
      [class*="sidebar"],
      [class*="nav"],
      nav {
        max-width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      /* Content area responsive */
      [class*="content"],
      main,
      .payload-admin-wrapper {
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
        padding: 0;
      }

      /* Table/List responsive */
      table,
      [class*="table"],
      [class*="list"] {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        display: block;
      }

      /* Form fields responsive */
      input,
      textarea,
      select,
      [class*="field"] {
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
        word-wrap: break-word;
        word-break: break-word;
      }

      /* Buttons responsive */
      button,
      [class*="button"],
      [role="button"] {
        min-width: 44px;
        min-height: 44px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Modal/Dialog responsive */
      [class*="modal"],
      [class*="dialog"],
      [role="dialog"] {
        width: calc(100% - 32px);
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }

      /* Row/Grid responsive */
      [class*="row"],
      [class*="grid"],
      [class*="columns"] {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }

      /* Card responsive */
      [class*="card"] {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      /* Mobile responsive (max-width: 768px) */
      @media (max-width: 768px) {
        body {
          font-size: 14px;
        }

        [class*="sidebar"] {
          width: 100%;
          max-width: 100%;
        }

        button, [role="button"] {
          padding: 12px 16px;
          font-size: 14px;
        }

        table, [class*="table"] {
          font-size: 12px;
        }

        [class*="modal"],
        [class*="dialog"] {
          width: calc(100% - 16px);
          margin: 8px;
        }
      }

      /* Tablet responsive (768px - 1024px) */
      @media (min-width: 768px) and (max-width: 1024px) {
        [class*="columns"] {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      /* Desktop responsive (1024px+) */
      @media (min-width: 1024px) {
        [class*="columns"] {
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
      }

      /* Password field specific fix */
      input[type="password"] {
        font-family: inherit;
        overflow-x: hidden;
      }
      .field-password input {
        font-family: inherit;
        overflow-x: hidden;
      }

      /* Show password toggle button */
      input[type="password"]::placeholder {
        opacity: 1;
      }

      /* Scrollbar styling for consistency */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
      }
    `,
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
    ProductShowcase,
    Solutions,
    RegulatoryCompliance,
    PlatformCapability,
    Documentation,
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
