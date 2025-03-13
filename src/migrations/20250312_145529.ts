import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // First, update any existing 'non-binary' values to 'not-specified'
  await db.execute(sql`
    UPDATE "user_details" 
    SET "gender" = 'not-specified' 
    WHERE "gender" = 'non-binary';
  `);
  
  // Then recreate the enum type
  await db.execute(sql`
    -- Create a temporary column with text type
    ALTER TABLE "user_details" 
    ADD COLUMN "gender_new" text;
    
    -- Copy data from the enum column to the text column
    UPDATE "user_details" 
    SET "gender_new" = "gender"::text;
    
    -- Drop the enum column
    ALTER TABLE "user_details" 
    DROP COLUMN "gender";
    
    -- Drop the enum type
    DROP TYPE IF EXISTS "enum_user_details_gender";
    
    -- Create the new enum type with updated values
    CREATE TYPE "enum_user_details_gender" AS ENUM('male', 'female', 'not-specified');
    
    -- Add back the column with the new enum type
    ALTER TABLE "user_details" 
    ADD COLUMN "gender" "enum_user_details_gender";
    
    -- Copy data from the temporary column to the new enum column
    UPDATE "user_details" 
    SET "gender" = "gender_new"::"enum_user_details_gender";
    
    -- Drop the temporary column
    ALTER TABLE "user_details" 
    DROP COLUMN "gender_new";
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Revert the changes by adding back the 'non-binary' option
  await db.execute(sql`
    -- Create a temporary column with text type
    ALTER TABLE "user_details" 
    ADD COLUMN "gender_temp" text;
    
    -- Copy data from the enum column to the text column
    UPDATE "user_details" 
    SET "gender_temp" = "gender"::text;
    
    -- Drop the enum column
    ALTER TABLE "user_details" 
    DROP COLUMN "gender";
    
    -- Drop the enum type
    DROP TYPE IF EXISTS "enum_user_details_gender";
    
    -- Create the original enum type with all options
    CREATE TYPE "enum_user_details_gender" AS ENUM('male', 'female', 'non-binary', 'not-specified');
    
    -- Add back the column with the original enum type
    ALTER TABLE "user_details" 
    ADD COLUMN "gender" "enum_user_details_gender";
    
    -- Copy data back to the enum column
    UPDATE "user_details" 
    SET "gender" = "gender_temp"::"enum_user_details_gender";
    
    -- Drop the temporary column
    ALTER TABLE "user_details" 
    DROP COLUMN "gender_temp";
  `);
}
