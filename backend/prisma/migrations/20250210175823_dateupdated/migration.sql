/*
  Warnings:

  - You are about to drop the column `date` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "date",
ADD COLUMN     "dateRequested" TEXT;
