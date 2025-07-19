/*
  Warnings:

  - The primary key for the `Rate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `Rate` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Rate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[from,to]` on the table `Rate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rate` to the `Rate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rate" DROP CONSTRAINT "Rate_pkey",
DROP COLUMN "updatedAt",
DROP COLUMN "value",
ADD COLUMN     "rate" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Rate_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Rate_id_seq";

-- CreateTable
CREATE TABLE "SupportedSendCoin" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "SupportedSendCoin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportedReceiveCoin" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "SupportedReceiveCoin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rate_from_to_key" ON "Rate"("from", "to");
