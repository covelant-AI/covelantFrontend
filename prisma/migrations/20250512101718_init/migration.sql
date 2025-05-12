-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isCoache" BOOLEAN NOT NULL DEFAULT false,
    "coachId" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coache" (
    "id" SERIAL NOT NULL,
    "team" TEXT NOT NULL,

    CONSTRAINT "Coache_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coache"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
