CREATE TABLE "cart" (
  "id" SERIAL PRIMARY KEY,
  "account" TEXT,
  "goodsId" TEXT,
  "name" text,
  "picture" text,
  "price" text,
  "count" bigint,
  "skuId" text,
  "attrsText" text NULL,
  "selected" boolean,
  "specs" json NULL,
  "postFee" real NULL
);


DROP TABLE "cart";