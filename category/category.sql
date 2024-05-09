CREATE TABLE "category" (
  "id" text PRIMARY KEY,
  "name" text,
  "picture" text,
  "children" json,
  "goods" json
);