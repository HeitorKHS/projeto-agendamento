/*
  Warnings:

  - You are about to drop the column `reason` on the `BlockedSlot` table. All the data in the column will be lost.
  - Added the required column `time` to the `BlockedSlot` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlockedSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    CONSTRAINT "BlockedSlot_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BlockedSlot" ("date", "id", "professionalId") SELECT "date", "id", "professionalId" FROM "BlockedSlot";
DROP TABLE "BlockedSlot";
ALTER TABLE "new_BlockedSlot" RENAME TO "BlockedSlot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
