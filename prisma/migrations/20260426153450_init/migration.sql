/*
  Warnings:

  - The values [STUDENT,TEACHER,ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `classId` on the `Subjects` table. All the data in the column will be lost.
  - Added the required column `bannerUrl` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('student', 'teacher', 'admin');
ALTER TABLE "public"."user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'student';
COMMIT;

-- DropIndex
DROP INDEX "Subjects_classId_key";

-- AlterTable
ALTER TABLE "Subjects" DROP COLUMN "classId";

-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "bannerUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'student';
