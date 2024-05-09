CREATE TABLE "goods" (
  "id" text PRIMARY KEY,
  "name" text,
  "desc" text,
  "price" text,
  "oldPrice" text,
  "discount" real,
  "inventory" bigint,
  "brand" json NULL,
  "salesCount" bigint,
  "commentCount" bigint,
  "collectCount" bigint,
  "mainPictures" json,
  "specs" json,
  "skus" json,
  "categories_1" text,
  "categories_2" text,
  "categories" json,
  "details.pictures" json,
  "details.properties" json
);

