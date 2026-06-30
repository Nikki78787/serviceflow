/*
  Warnings:

  - A unique constraint covering the columns `[staffId,dayOfWeek,startTime,endTime]` on the table `StaffAvailability` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "StaffAvailability" DROP CONSTRAINT "StaffAvailability_staffId_fkey";

-- AlterTable
ALTER TABLE "StaffAvailability" ALTER COLUMN "businessMemberId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "StaffAvailability_staffId_dayOfWeek_idx" ON "StaffAvailability"("staffId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "StaffAvailability_staffId_dayOfWeek_startTime_endTime_key" ON "StaffAvailability"("staffId", "dayOfWeek", "startTime", "endTime");

-- AddForeignKey
ALTER TABLE "StaffAvailability" ADD CONSTRAINT "StaffAvailability_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
