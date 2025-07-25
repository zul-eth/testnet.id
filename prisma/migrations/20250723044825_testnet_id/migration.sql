-- CreateEnum
CREATE TYPE "Network" AS ENUM ('MAINNET', 'TESTNET');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'EXPIRED', 'FAILED');

-- CreateTable
CREATE TABLE "PaymentRoute" (
    "id" TEXT NOT NULL,
    "coinId" TEXT NOT NULL,
    "network" "Network" NOT NULL,
    "protocol" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coin" (
    "id" TEXT NOT NULL,
    "network" "Network" NOT NULL DEFAULT 'TESTNET',
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coin_pkey" PRIMARY KEY ("id")
);

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
    "paymentRouteId" TEXT NOT NULL,

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
CREATE UNIQUE INDEX "Coin_symbol_key" ON "Coin"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderHash_key" ON "Order"("orderHash");

-- CreateIndex
CREATE UNIQUE INDEX "OrderHistory_orderId_key" ON "OrderHistory"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderHistory_txHash_key" ON "OrderHistory"("txHash");

-- AddForeignKey
ALTER TABLE "PaymentRoute" ADD CONSTRAINT "PaymentRoute_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "Coin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_baseCoinId_fkey" FOREIGN KEY ("baseCoinId") REFERENCES "Coin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_quoteCoinId_fkey" FOREIGN KEY ("quoteCoinId") REFERENCES "Coin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentRouteId_fkey" FOREIGN KEY ("paymentRouteId") REFERENCES "PaymentRoute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
