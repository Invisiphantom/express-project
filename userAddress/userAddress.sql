CREATE TABLE "userAddress" (
  "id" SERIAL PRIMARY KEY,
  "account" text,
  "receiver" text,
  "contact" text,
  "fullLocation" text,
  "address" text,
  "isDefault" int
);


DROP TABLE "userAddress";