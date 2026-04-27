/*
  Warnings:

  - The values [ACTIVE,INACTIVE,ARCHIVED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `schedules` on table `classes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('activate', 'inactive', 'archived');
ALTER TABLE "public"."classes" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "classes" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
ALTER TABLE "classes" ALTER COLUMN "status" SET DEFAULT 'activate';
COMMIT;

-- AlterTable
ALTER TABLE "classes" ALTER COLUMN "status" SET DEFAULT 'activate',
ALTER COLUMN "schedules" SET NOT NULL;
