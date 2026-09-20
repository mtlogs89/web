-- CreateTable
CREATE TABLE "SearchQuery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL,
    "impressions" INTEGER NOT NULL,
    "position" REAL NOT NULL
);

-- CreateIndex
CREATE INDEX "SearchQuery_day_idx" ON "SearchQuery"("day");

-- CreateIndex
CREATE UNIQUE INDEX "SearchQuery_day_query_page_key" ON "SearchQuery"("day", "query", "page");

