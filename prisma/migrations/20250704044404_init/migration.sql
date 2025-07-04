/*
  Warnings:

  - You are about to drop the column `section` on the `Drink` table. All the data in the column will be lost.
  - Added the required column `category` to the `Drink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Drink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `ShishaFlavor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drink" DROP COLUMN "section",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShishaFlavor" ADD COLUMN     "category" TEXT NOT NULL;
