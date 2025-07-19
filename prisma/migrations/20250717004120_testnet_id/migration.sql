/*
  Warnings:

  - The primary key for the `Coin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `label` on the `Coin` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Coin` table. All the data in the column will be lost.
  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupportedReceiveCoin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupportedSendCoin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[symbol]` on the table `Coin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `iconUrl` to the `Coin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Coin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Coin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Coin` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Network" AS ENUM ('MAINNET', 'TESTNET');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'EXPIRED', 'FAILED');

-- DropIndex
DROP INDEX "Coin_value_key";

-- AlterTable
ALTER TABLE "Coin" DROP CONSTRAINT "Coin_pkey",
DROP COLUMN "label",
DROP COLUMN "value",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "iconUrl" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "network" "Network" NOT NULL DEFAULT 'TESTNET',
ADD COLUMN     "symbol" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Coin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Coin_id_seq";

-- DropTable
DROP TABLE "Log";

-- DropTable
DROP TABLE "Rate";

-- DropTable
DROP TABLE "SupportedReceiveCoin";

-- DropTable
DROP TABLE "SupportedSendCoin";

-- CreateTable
CREATE TABLE "Pair" (
    "id" TEXT NOT NULL,
    "network" "Network" NOT NULL DEFAULT 'TESTNET',
    "baseCoinId" TEXT NOT NULL,
    "quoteCoinId" TEXT NOT NULL,
    "priceBase" DOUBLE PRECISION NOT NULL,
    "priceQuote" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "network" "Network" NOT NULL DEFAULT 'TESTNET',
    "orderHash" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "addressDestination" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderHistory" (
    "id" TEXT NOT NULL,
    "network" "Network" NOT NULL DEFAULT 'TESTNET',
    "orderId" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderHash_key" ON "Order"("orderHash");

-- CreateIndex
CREATE UNIQUE INDEX "OrderHistory_orderId_key" ON "OrderHistory"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderHistory_txHash_key" ON "OrderHistory"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "Coin_symbol_key" ON "Coin"("symbol");

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_baseCoinId_fkey" FOREIGN KEY ("baseCoinId") REFERENCES "Coin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_quoteCoinId_fkey" FOREIGN KEY ("quoteCoinId") REFERENCES "Coin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
