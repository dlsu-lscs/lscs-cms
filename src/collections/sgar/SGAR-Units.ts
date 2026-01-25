import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'
import type { CollectionConfig } from 'payload'
import { array } from 'payload/shared'

export const SGAR_Units: CollectionConfig = {
  slug: 'sgar-units',
  admin: {
    useAsTitle: 'unit-name',
    group: 'SGAR',
  },
  access: {
    // Only authenticated users can read user data
    read: isAuthenticated,
    // Only admins can create new users
    create: isAdminOrEditor,
    // Users can update their own profile, admins can update anyone
    update: isAdminOrSelf,
    // Only admins can delete users
    delete: isAdminOrSelf,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Unit',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'unit-name', type: 'text', required: true },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'cluster',
                  type: 'relationship',
                  relationTo: 'sgar-clusters',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  admin: {
                    rows: 5,
                  },
                },
                {
                  name: 'form-link',
                  type: 'text',
                  required: true,
                },
              ],
            },

            // PUBS
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                },
                {
                  name: 'main-pub',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                },
                {
                  name: 'org-chart',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                },
              ],
            },

            {
              type: 'row',
              fields: [
                {
                  name: 'application-process',
                  type: 'textarea',
                  admin: { rows: 8 },
                  required: false,
                },
                {
                  name: 'application-timeline',
                  type: 'textarea',
                  admin: { rows: 8 },
                  required: false,
                },
              ],
            },
          ],
        },

        {
          label: 'Executive Board',
          fields: [
            // EXECUTIVE BOARD
            {
              name: 'executive-board',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'full-name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'position',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'email',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'telegram-username',
                      type: 'text',
                      required: false,
                    },
                  ],
                },
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                },
              ],
            },
          ],
        },

        {
          label: 'Committees',
          fields: [
            // COMMITTEES
            {
              name: 'committees',
              type: 'array',
              fields: [
                { name: 'committee-name', type: 'text', required: true },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'description',
                      type: 'textarea',
                      required: true,
                      admin: {
                        rows: 5,
                      },
                    },
                    {
                      name: 'requirements',
                      type: 'textarea',
                      required: false,
                      admin: {
                        rows: 5,
                      },
                    },
                  ],
                },
                {
                  name: 'position',
                  type: 'array',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'position-name', type: 'text', required: true },
                        {
                          name: 'status',
                          type: 'select',
                          required: true,
                          options: [
                            { label: 'open', value: 'open' },
                            { label: 'closed', value: 'closed' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  // hooks: {
  //   afterChange: [
  //     async ({ req, doc, operation }) => {
  //       if (operation === 'create') {
  //         const unitId = doc.id
  //         // Common denormalized fields
  //         const pseudoFields = {
  //           unit: unitId,
  //           'unit-name__pseudo': doc['unit-name'],
  //           slug__pseudo: doc['slug'],
  //           description__pseudo: doc['description'],
  //           'form-link__pseudo': doc['form-link'],
  //         }
  //         // Create SGAR-Committee (minimal required fields)
  //         await req.payload.create({
  //           collection: 'sgar-committees',
  //           data: {
  //             ...pseudoFields,
  //             'committee-name': `Default Committee for ${doc['unit-name']}`,
  //             description: doc['description'] || '',
  //             'available-positions': [],
  //           },
  //         })
  //         // Create SGAR-Exec-Board (minimal required fields)
  //         await req.payload.create({
  //           collection: 'sgar-exec-board',
  //           data: {
  //             ...pseudoFields,
  //             'full-name': `Default Executive for ${doc['unit-name']}`,
  //             contact: '',
  //             position: null,
  //           },
  //         })
  //         // Create SGAR-Media (minimal required fields)
  //         await req.payload.create({
  //           collection: 'sgar-media',
  //           data: {
  //             ...pseudoFields,
  //             'sgar-unit': unitId,
  //             logo: null,
  //             'main-pub': null,
  //             'application-process': null,
  //           },
  //         })
  //         // Create SGAR-Positions (minimal required fields)
  //         await req.payload.create({
  //           collection: 'sgar-positions',
  //           data: {
  //             ...pseudoFields,
  //             position: `Default Position for ${doc['unit-name']}`,
  //             status: 'open',
  //           },
  //         })
  //       }
  //     },
  //   ],
  // },
}
