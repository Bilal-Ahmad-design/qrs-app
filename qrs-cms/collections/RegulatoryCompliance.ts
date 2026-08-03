import { CollectionConfig } from 'payload'

export const RegulatoryCompliance: CollectionConfig = {
  slug: 'regulatory-compliance',
  labels: {
    singular: 'Regulatory Requirement',
    plural: 'Regulatory Requirements',
  },
  admin: {
    useAsTitle: 'framework',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'super-admin' || req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'super-admin' || req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'region',
      type: 'select',
      required: true,
      label: 'Geographic Region',
      options: [
        { label: 'European Union', value: 'eu' },
        { label: 'United States', value: 'us' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Global', value: 'global' },
      ],
      admin: {
        description: 'Region where this regulation applies',
      },
    },
    {
      name: 'framework',
      type: 'select',
      required: true,
      label: 'Regulatory Framework',
      options: [
        { label: 'Solvency II (EU)', value: 'solvency-ii' },
        { label: 'ORSA (Own Risk & Solvency Assessment)', value: 'orsa' },
        { label: 'NAIC RBC (Risk-Based Capital)', value: 'naic-rbc' },
        { label: "Lloyd's/BMA (Lloyd's Market)", value: 'lloyds-bma' },
        { label: 'TCFD (Climate Disclosure)', value: 'tcfd' },
        { label: 'SOC 2 (Security & Compliance)', value: 'soc2' },
        { label: 'Model Governance', value: 'model-governance' },
      ],
      admin: {
        description: 'Specific regulatory framework or requirement',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Framework Description',
      admin: {
        description: 'Overview of what this framework requires',
      },
    },
    {
      name: 'requirements',
      type: 'array',
      label: 'Key Requirements',
      fields: [
        {
          name: 'requirement',
          type: 'richText',
          label: 'Requirement',
        },
      ],
      admin: {
        description: 'Specific requirements or checkpoints for this framework',
      },
    },
    {
      name: 'qrsCompliance',
      type: 'richText',
      label: 'How QRS Supports Compliance',
      admin: {
        description: 'Explanation of how QRS helps meet these requirements',
      },
    },
    {
      name: 'evidencePackage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Evidence/Documentation Package (Optional)',
      admin: {
        description: 'Downloadable compliance documentation (PDF)',
      },
    },
    {
      name: 'resources',
      type: 'array',
      label: 'Additional Resources',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Resource Title',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Resource URL',
        },
        {
          name: 'type',
          type: 'select',
          label: 'Resource Type',
          options: [
            { label: 'Whitepaper', value: 'whitepaper' },
            { label: 'Checklist', value: 'checklist' },
            { label: 'Template', value: 'template' },
            { label: 'External Link', value: 'external' },
          ],
        },
      ],
      admin: {
        description: 'Related resources and documentation',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description: 'Controls the display order on regulatory page',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Published',
      defaultValue: true,
      admin: {
        description: 'Show this requirement on the website',
      },
    },
  ],
}
