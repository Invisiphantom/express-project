const pg = require('pg')
const client = new pg.Client({
  host: "localhost",
  user: "ethan",
  password: "123456",
  database: "ethan"
})
client.connect()



const item = {
  "account": "xiaotuxian001",
  "password": "123456",
  "mobile": "18304508754",
  "email": "xiaotuxian@gmail.com",
  "nickname": "xiaotuxian00",
  "avatar": "http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/avatar/2024-04-26/e066cccd-a13c-493f-8400-39ed7690b203.png",
  "gender": "男",
  "birthday": "2023-02-25",
}


// CREATE TABLE "user" (
//   "id" SERIAL PRIMARY KEY,
//   "account" text,
//   "password" text,
//   "mobile" text NULL,
//   "email" text NULL,
//   "nickname" text NULL,
//   "avatar" text NULL,
//   "gender" text NULL,
//   "birthday" date NULL
// );



const query = 'INSERT INTO "user" ( "account", "password", "mobile", "email", "nickname", "avatar", "gender", "birthday") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
const values = [item.account, item.password, item.mobile, item.email, item.nickname, item.avatar, item.gender, item.birthday]
client.query(query, values, (err, result) => {
  if (err) {
    console.error('Error inserting data:', err)
  } else {
    console.log('Data inserted successfully')
  }
})