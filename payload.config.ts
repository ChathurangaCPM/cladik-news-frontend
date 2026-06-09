import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor, BlocksFeature, CodeBlock } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
      admin: {
        useAsTitle: 'email',
      },
      fields: [],
    },
    {
      slug: 'posts',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'publishedDate'],
      },
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      hooks: {
        beforeValidate: [
          (args) => {
            const data = args.data
            if (data && !data.slug && data.title) {
              data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            }
            return data
          },
        ],
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'summary',
          type: 'textarea',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'publishedDate',
          type: 'date',
          required: true,
          admin: {
            position: 'sidebar',
          },
        },
      ],
    },
    {
      slug: 'media',
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      upload: {
        staticDir: path.resolve(dirname, 'public/media'),
        mimeTypes: ['image/*'],
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 512,
            position: 'centre',
          },
          {
            name: 'tablet',
            width: 1024,
            height: undefined,
            position: 'centre',
          },
        ],
        adminThumbnail: 'thumbnail',
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [
          CodeBlock({}),
        ],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-for-dev-only',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    try {
      const users = await payload.find({
        collection: 'users',
        limit: 1,
      })

      if (users.docs.length === 0) {
        await payload.create({
          collection: 'users',
          data: {
            email: 'admin@neuralpress.site',
            password: 'NeuralPressAdmin2026!',
          },
        })
        payload.logger.info('Default admin user created: admin@neuralpress.site / NeuralPressAdmin2026!')
      }
    } catch (err) {
      payload.logger.error('Error seeding default admin user: ' + (err instanceof Error ? err.message : String(err)))
    }
  },
})
