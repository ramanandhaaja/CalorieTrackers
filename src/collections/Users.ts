import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'fullName',
    group: 'Admin',
  },
  access: {
    // Everyone can read users
    read: () => true,
    // Only admins can create users through the admin panel
    // Regular users can create themselves through the auth endpoints
    create: ({ req }) => {
      // If no user is logged in, allow creation (for registration)
      if (!req.user) return true;
      // If user is an admin, allow creation
      return req.user.role === 'admin';
    },
    // Users can update their own data, admins can update anyone
    update: ({ req, id }) => {
      // If no user is logged in, deny access
      if (!req.user) return false;
      // If user is an admin, allow update
      if (req.user.role === 'admin') return true;
      // Otherwise, users can only update themselves
      return req.user.id === id;
    },
    // Only admins can delete users
    delete: ({ req }) => {
      return Boolean(req.user?.role === 'admin');
    },
  },
  auth: {
    // Allow users to register themselves
    useAPIKey: false,
  },
  fields: [
    // Email added by default by the auth feature
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'This username will be used for login',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Phone number with country code',
      },
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
        },
        {
          name: 'zipCode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
        },
      ],
      admin: {
        condition: (data) => Boolean(data?.role !== 'admin'),
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      access: {
        // Only admins can change roles
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'dateJoined',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      defaultValue: () => new Date(),
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set dateJoined on creation
        if (!data.dateJoined) {
          data.dateJoined = new Date();
        }
        return data;
      },
    ],
  },
}
