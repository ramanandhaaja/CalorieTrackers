/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    media: Media;
    menu: Menu;
    'water-entries': WaterEntry;
    'food-entries': FoodEntry;
    'user-details': UserDetail;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    menu: MenuSelect<false> | MenuSelect<true>;
    'water-entries': WaterEntriesSelect<false> | WaterEntriesSelect<true>;
    'food-entries': FoodEntriesSelect<false> | FoodEntriesSelect<true>;
    'user-details': UserDetailsSelect<false> | UserDetailsSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: number;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: number;
  fullName: string;
  /**
   * This username will be used for login
   */
  username: string;
  /**
   * Phone number with country code
   */
  phone?: string | null;
  address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
    country?: string | null;
  };
  role: 'admin' | 'user';
  profilePicture?: (number | null) | Media;
  bio?: string | null;
  dateJoined?: string | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: number;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "menu".
 */
export interface Menu {
  id: number;
  name: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "water-entries".
 */
export interface WaterEntry {
  id: number;
  /**
   * Amount of water consumed
   */
  amount: number;
  /**
   * Unit of measurement
   */
  unit: 'ml' | 'oz' | 'cup';
  /**
   * When the water was consumed
   */
  time: string;
  /**
   * Total amount in milliliters (calculated field)
   */
  totalMilliliters?: number | null;
  user: number | User;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "food-entries".
 */
export interface FoodEntry {
  id: number;
  /**
   * Name of the food item
   */
  name: string;
  /**
   * Portion size (e.g., "1 cup (250g)")
   */
  portion: string;
  /**
   * Calories in the food item
   */
  calories: number;
  /**
   * Protein content in grams
   */
  protein: number;
  /**
   * Carbohydrate content in grams
   */
  carbs: number;
  /**
   * Fat content in grams
   */
  fat: number;
  /**
   * Type of meal
   */
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  /**
   * When the food was consumed
   */
  date: string;
  user: number | User;
  /**
   * Calculated macronutrient totals
   */
  totalMacros?: {
    /**
     * Calories from protein (4 calories per gram)
     */
    caloriesFromProtein?: number | null;
    /**
     * Calories from carbohydrates (4 calories per gram)
     */
    caloriesFromCarbs?: number | null;
    /**
     * Calories from fat (9 calories per gram)
     */
    caloriesFromFat?: number | null;
    /**
     * Percentage of calories from protein
     */
    proteinPercentage?: number | null;
    /**
     * Percentage of calories from carbohydrates
     */
    carbsPercentage?: number | null;
    /**
     * Percentage of calories from fat
     */
    fatPercentage?: number | null;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "user-details".
 */
export interface UserDetail {
  id: number;
  /**
   * User age in years
   */
  age: number;
  /**
   * User gender
   */
  gender: 'male' | 'female' | 'not-specified';
  /**
   * User height (required)
   */
  height: {
    value: number;
    unit: 'cm' | 'ft';
    /**
     * Additional inches (if using feet/inches)
     */
    inches?: number | null;
  };
  /**
   * User weight (required)
   */
  weight: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  /**
   * User activity level
   */
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  /**
   * User fitness goal
   */
  goal: 'lose' | 'maintain' | 'gain' | 'build';
  /**
   * User dietary preferences
   */
  dietaryPreferences?:
    | ('vegetarian' | 'vegan' | 'pescatarian' | 'gluten-free' | 'dairy-free' | 'keto' | 'paleo' | 'low-carb')[]
    | null;
  /**
   * Basal Metabolic Rate (calculated)
   */
  bmr?: number | null;
  /**
   * Total Daily Energy Expenditure (calculated)
   */
  tdee?: number | null;
  /**
   * Daily calorie target based on goals (calculated)
   */
  dailyCalorieTarget?: number | null;
  /**
   * Daily protein target based on goals (calculated)
   */
  dailyProtein?: number | null;
  /**
   * Daily carbohydrate target based on goals (calculated)
   */
  dailyCarbs?: number | null;
  /**
   * Daily fat target based on goals (calculated)
   */
  dailyFat?: number | null;
  user: number | User;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: number;
  document?:
    | ({
        relationTo: 'users';
        value: number | User;
      } | null)
    | ({
        relationTo: 'media';
        value: number | Media;
      } | null)
    | ({
        relationTo: 'menu';
        value: number | Menu;
      } | null)
    | ({
        relationTo: 'water-entries';
        value: number | WaterEntry;
      } | null)
    | ({
        relationTo: 'food-entries';
        value: number | FoodEntry;
      } | null)
    | ({
        relationTo: 'user-details';
        value: number | UserDetail;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: number;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: number;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  fullName?: T;
  username?: T;
  phone?: T;
  address?:
    | T
    | {
        street?: T;
        city?: T;
        state?: T;
        zipCode?: T;
        country?: T;
      };
  role?: T;
  profilePicture?: T;
  bio?: T;
  dateJoined?: T;
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  alt?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "menu_select".
 */
export interface MenuSelect<T extends boolean = true> {
  name?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "water-entries_select".
 */
export interface WaterEntriesSelect<T extends boolean = true> {
  amount?: T;
  unit?: T;
  time?: T;
  totalMilliliters?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "food-entries_select".
 */
export interface FoodEntriesSelect<T extends boolean = true> {
  name?: T;
  portion?: T;
  calories?: T;
  protein?: T;
  carbs?: T;
  fat?: T;
  mealType?: T;
  date?: T;
  user?: T;
  totalMacros?:
    | T
    | {
        caloriesFromProtein?: T;
        caloriesFromCarbs?: T;
        caloriesFromFat?: T;
        proteinPercentage?: T;
        carbsPercentage?: T;
        fatPercentage?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "user-details_select".
 */
export interface UserDetailsSelect<T extends boolean = true> {
  age?: T;
  gender?: T;
  height?:
    | T
    | {
        value?: T;
        unit?: T;
        inches?: T;
      };
  weight?:
    | T
    | {
        value?: T;
        unit?: T;
      };
  activityLevel?: T;
  goal?: T;
  dietaryPreferences?: T;
  bmr?: T;
  tdee?: T;
  dailyCalorieTarget?: T;
  dailyProtein?: T;
  dailyCarbs?: T;
  dailyFat?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}