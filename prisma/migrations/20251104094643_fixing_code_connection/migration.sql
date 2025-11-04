/*
  Warnings:

  - Made the column `toNodeId` on table `Connection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Connection" ALTER COLUMN "toNodeId" SET NOT NULL;
