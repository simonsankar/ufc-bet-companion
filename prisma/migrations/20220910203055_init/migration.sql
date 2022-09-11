-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fight" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "bout" TEXT NOT NULL,
    "redCornerFirstName" TEXT NOT NULL,
    "redCornerLastName" TEXT NOT NULL,
    "redCornerRank" TEXT NOT NULL,
    "redCornerOdds" INTEGER NOT NULL,
    "redCornerOutcome" TEXT NOT NULL,
    "redCountry" TEXT NOT NULL,
    "redFlag" TEXT NOT NULL,
    "blueCornerFirstName" TEXT NOT NULL,
    "blueCornerLastName" TEXT NOT NULL,
    "blueCornerRank" TEXT NOT NULL,
    "blueCornerOdds" INTEGER NOT NULL,
    "blueCornerOutcome" TEXT NOT NULL,
    "blueCountry" TEXT NOT NULL,
    "blueFlag" TEXT NOT NULL,

    CONSTRAINT "Fight_pkey" PRIMARY KEY ("id","eventId")
);

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
