-- CreateEnum
CREATE TYPE "Corner" AS ENUM ('RED', 'BLUE');

-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Budget" (
    "eventId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("eventId","userEmail")
);

-- CreateTable
CREATE TABLE "Bet" (
    "eventId" TEXT NOT NULL,
    "fightId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "wager" DOUBLE PRECISION NOT NULL,
    "corner" "Corner" NOT NULL,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("eventId","fightId","userEmail")
);

-- CreateTable
CREATE TABLE "Winnings" (
    "eventId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "winnings" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Winnings_pkey" PRIMARY KEY ("eventId","userEmail")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Winnings" ADD CONSTRAINT "Winnings_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
