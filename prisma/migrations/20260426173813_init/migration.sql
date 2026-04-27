/*
  Warnings:

  - You are about to drop the column `invite` on the `classes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteCode]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteCode` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "classes_invite_key";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "invite",
ADD COLUMN     "inviteCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "classes_inviteCode_key" ON "classes"("inviteCode");
