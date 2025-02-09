/*
  Warnings:

  - A unique constraint covering the columns `[departmentId]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Resource_departmentId_key" ON "Resource"("departmentId");
