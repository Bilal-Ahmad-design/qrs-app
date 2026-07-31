import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      access: {
        read: () => false,
        create: ({ req: { user } }) => !user,
        update: ({ req: { user }, id }) => user?.id === id,
        delete: ({ req: { user } }) => user?.role === 'admin',
      },
      fields: [
        {
          name: 'role',
          type: 'select',
          options: ['admin', 'editor'],
          defaultValue: 'editor',
          required: true,
        },
      ],
    },
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'status'],
      },
      access: {
        read: () => true,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => user?.role === 'admin',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor(),
        },
        {
          name: 'seoTitle',
          type: 'text',
        },
        {
          name: 'seoDescription',
          type: 'text',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
          required: true,
        },
      ],
      versions: {
        drafts: true,
      },
    },
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
