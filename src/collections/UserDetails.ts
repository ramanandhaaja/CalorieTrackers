import { CollectionConfig } from 'payload';

/**
 * Collection for storing user details.
 */
export const UserDetails: CollectionConfig = {
  slug: 'user-details',
  admin: {
    useAsTitle: 'user',
    defaultColumns: ['user', 'age', 'gender', 'height', 'weight', 'activityLevel', 'createdAt'],
    group: 'User Content',
  },
  access: {
    // Only allow users to read their own details
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    // Only allow users to update their own details
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    // Only allow users to delete their own details
    delete: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    // Only allow authenticated users to create details
    create: ({ req }) => Boolean(req.user),
  },
  fields: [
    // Basic Information
    {
      name: 'age',
      type: 'number',
      required: true,
      min: 13,
      max: 120,
      admin: {
        description: 'User age in years',
      },
    },
    {
      name: 'gender',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
        {
          label: 'Prefer not to say',
          value: 'not-specified',
        },
      ],
      admin: {
        description: 'User gender',
      },
    },
    
    // Physical Measurements
    {
      name: 'height',
      type: 'group',
      admin: {
        description: 'User height (required)',
      },
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
          min: 50,
          max: 300,
        },
        {
          name: 'unit',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Centimeters (cm)',
              value: 'cm',
            },
            {
              label: 'Feet/Inches',
              value: 'ft',
            },
          ],
          defaultValue: 'cm',
        },
        {
          name: 'inches',
          type: 'number',
          min: 0,
          max: 11,
          admin: {
            condition: (data, siblingData) => siblingData?.unit === 'ft',
            description: 'Additional inches (if using feet/inches)',
          },
        },
      ],
    },
    {
      name: 'weight',
      type: 'group',
      admin: {
        description: 'User weight (required)',
      },
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
          min: 30,
          max: 500,
        },
        {
          name: 'unit',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Kilograms (kg)',
              value: 'kg',
            },
            {
              label: 'Pounds (lbs)',
              value: 'lbs',
            },
          ],
          defaultValue: 'kg',
        },
      ],
    },
    
    // Activity & Goals
    {
      name: 'activityLevel',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Sedentary (little or no exercise)',
          value: 'sedentary',
        },
        {
          label: 'Lightly active (light exercise/sports 1-3 days/week)',
          value: 'light',
        },
        {
          label: 'Moderately active (moderate exercise/sports 3-5 days/week)',
          value: 'moderate',
        },
        {
          label: 'Very active (hard exercise/sports 6-7 days a week)',
          value: 'very',
        },
        {
          label: 'Extra active (very hard exercise & physical job or 2x training)',
          value: 'extra',
        },
      ],
      admin: {
        description: 'User activity level',
      },
    },
    {
      name: 'goal',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Lose weight',
          value: 'lose',
        },
        {
          label: 'Maintain weight',
          value: 'maintain',
        },
        {
          label: 'Gain weight',
          value: 'gain',
        },
        {
          label: 'Build muscle',
          value: 'build',
        },
      ],
      admin: {
        description: 'User fitness goal',
      },
    },
    
    // Dietary Preferences
    {
      name: 'dietaryPreferences',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Vegetarian',
          value: 'vegetarian',
        },
        {
          label: 'Vegan',
          value: 'vegan',
        },
        {
          label: 'Pescatarian',
          value: 'pescatarian',
        },
        {
          label: 'Gluten-free',
          value: 'gluten-free',
        },
        {
          label: 'Dairy-free',
          value: 'dairy-free',
        },
        {
          label: 'Keto',
          value: 'keto',
        },
        {
          label: 'Paleo',
          value: 'paleo',
        },
        {
          label: 'Low-carb',
          value: 'low-carb',
        },
      ],
      admin: {
        description: 'User dietary preferences',
      },
    },
    
    // Calculated Fields
    {
      name: 'bmr',
      type: 'number',
      admin: {
        description: 'Basal Metabolic Rate (calculated)'
      }
    },
    {
      name: 'tdee',
      type: 'number',
      admin: {
        description: 'Total Daily Energy Expenditure (calculated)',
      },
    },
    {
      name: 'dailyCalorieTarget',
      type: 'number',
      admin: {
        description: 'Daily calorie target based on goals (calculated)',
      },
    },
    {
      name: 'dailyProtein',
      type: 'number',
      admin: {
        description: 'Daily protein target based on goals (calculated)',
      },
    },
    {
      name: 'dailyCarbs',
      type: 'number',
      admin: {
        description: 'Daily carbohydrate target based on goals (calculated)',
      },
    },
    {
      name: 'dailyFat',
      type: 'number',
      admin: {
        description: 'Daily fat target based on goals (calculated)',
      },
    },
    
    // Relationship to User
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      unique: true, // Each user can only have one details record
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            if (operation === 'create' && req?.user) {
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
      ({ doc }: { doc: any }) => {
        // Here you could add hooks to update user preferences or other systems
        return doc;
      },
    ],
  },
};

export default UserDetails;