CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "account" text,
  "password" text,
  "mobile" text NULL,
  "email" text NULL,
  "nickname" text NULL,
  "avatar" text NULL,
  "gender" text NULL,
  "birthday" date NULL
);
