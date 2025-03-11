import { CollectionConfig } from 'payload';

// Define meal type to match FoodEntryModal
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const Food: CollectionConfig = {
  slug: 'food-entries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'calories', 'mealType', 'user', 'date', 'createdAt'],
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
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the food item',
      },
    },
    {
      name: 'portion',
      type: 'text',
      required: true,
      admin: {
        description: 'Portion size (e.g., "1 cup (250g)")',
      },
    },
    {
      name: 'calories',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Calories in the food item',
      },
    },
    {
      name: 'protein',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Protein content in grams',
      },
    },
    {
      name: 'carbs',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Carbohydrate content in grams',
      },
    },
    {
      name: 'fat',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Fat content in grams',
      },
    },
    {
      name: 'mealType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Breakfast',
          value: 'breakfast',
        },
        {
          label: 'Lunch',
          value: 'lunch',
        },
        {
          label: 'Dinner',
          value: 'dinner',
        },
        {
          label: 'Snack',
          value: 'snack',
        },
      ],
      defaultValue: 'breakfast',
      admin: {
        description: 'Type of meal',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'yyyy-MM-dd HH:mm',
        },
        description: 'When the food was consumed',
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
    {
      name: 'totalMacros',
      type: 'group',
      admin: {
        description: 'Calculated macronutrient totals',
      },
      fields: [
        {
          name: 'caloriesFromProtein',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Calories from protein (4 calories per gram)',
          },
        },
        {
          name: 'caloriesFromCarbs',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Calories from carbohydrates (4 calories per gram)',
          },
        },
        {
          name: 'caloriesFromFat',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Calories from fat (9 calories per gram)',
          },
        },
        {
          name: 'proteinPercentage',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Percentage of calories from protein',
          },
        },
        {
          name: 'carbsPercentage',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Percentage of calories from carbohydrates',
          },
        },
        {
          name: 'fatPercentage',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Percentage of calories from fat',
          },
        },
      ],
      hooks: {
        beforeValidate: [
          ({ data, siblingData }) => {
            if (!siblingData) return {};
            
            // Calculate calories from each macronutrient
            const caloriesFromProtein = Math.round(siblingData.protein * 4);
            const caloriesFromCarbs = Math.round(siblingData.carbs * 4);
            const caloriesFromFat = Math.round(siblingData.fat * 9);
            
            // Calculate total calories from macros
            const totalCaloriesFromMacros = caloriesFromProtein + caloriesFromCarbs + caloriesFromFat;
            
            // Calculate percentages
            const proteinPercentage = totalCaloriesFromMacros > 0 
              ? Math.round((caloriesFromProtein / totalCaloriesFromMacros) * 100) 
              : 0;
            const carbsPercentage = totalCaloriesFromMacros > 0 
              ? Math.round((caloriesFromCarbs / totalCaloriesFromMacros) * 100) 
              : 0;
            const fatPercentage = totalCaloriesFromMacros > 0 
              ? Math.round((caloriesFromFat / totalCaloriesFromMacros) * 100) 
              : 0;
            
            return {
              ...data,
              caloriesFromProtein,
              caloriesFromCarbs,
              caloriesFromFat,
              proteinPercentage,
              carbsPercentage,
              fatPercentage,
            };
          },
        ],
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        // Here you could add hooks to update daily food totals or other aggregations
        return doc;
      },
    ],
  },
};
