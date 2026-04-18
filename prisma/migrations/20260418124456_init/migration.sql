/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Subjects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Subjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subjects" DROP CONSTRAINT "Subjects_departmentId_fkey";

-- AlterTable
ALTER TABLE "Subjects" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subjects_code_key" ON "Subjects"("code");

-- AddForeignKey
ALTER TABLE "Subjects" ADD CONSTRAINT "Subjects_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
