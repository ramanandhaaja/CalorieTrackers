import { CollectionConfig } from 'payload';

// Define unit types to match WaterEntryModal
type WaterUnit = 'ml' | 'oz' | 'cup';

// Define conversion factors for water units
const CONVERSION_FACTORS: Record<WaterUnit, number> = {
  ml: 1,
  oz: 29.5735,
  cup: 236.588,
};

export const Water: CollectionConfig = {
  slug: 'water-entries',
  admin: {
    useAsTitle: 'amount',
    defaultColumns: ['amount', 'unit', 'time', 'user', 'createdAt'],
    group: 'User Content',
  },
  access: {
    // Basic access control - can be enhanced later
    read: () => true,
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    create: () => true,
  },
  fields: [
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Amount of water consumed',
      },
    },
    {
      name: 'unit',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Milliliters (ml)',
          value: 'ml',
        },
        {
          label: 'Fluid Ounces (oz)',
          value: 'oz',
        },
        {
          label: 'Cups',
          value: 'cup',
        },
      ],
      defaultValue: 'ml',
      admin: {
        description: 'Unit of measurement',
      },
    },
    {
      name: 'time',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'yyyy-MM-dd HH:mm',
        },
        description: 'When the water was consumed',
      },
    },
    {
      name: 'totalMilliliters',
      type: 'number',
      label: 'Total Milliliters',
      defaultValue: 0, // Provide a default value to avoid validation errors
      admin: {
        description: 'Total amount in milliliters (calculated field)',
        readOnly: true,
      },
      hooks: {
        beforeChange: [ // Change from beforeValidate to beforeChange
          ({ data }) => {
            if (!data || !data.amount || !data.unit) return 0; // Return a default value
            
            // Calculate total ml using the conversion factors
            const unit = data.unit as WaterUnit;
            return Math.round(data.amount * CONVERSION_FACTORS[unit]);
          },
        ],
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            if (operation === 'create' && req.user) {
              return req.user.id;
            }
            return undefined;
          },
        ],
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        // Here you could add hooks to update daily water totals or other aggregations
        return doc;
      },
    ],
  },
};
