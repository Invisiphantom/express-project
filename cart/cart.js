const pg = require('pg')
const client = new pg.Client({
  host: "localhost",
  user: "ethan",
  password: "123456",
  database: "ethan"
})
client.connect()



const item1 = {
  "id": "4026116",
  "account": "xiaotuxian001",
  "skuId": "300476434",
  "name": "探险者黑胶防晒防雨遮阳伞户外钓鱼伞",
  "attrsText": "规格:黑胶防晒钓鱼伞（2.2米）+暗月折叠椅 ",
  "specs": [],
  "picture": "https://yanxuan-item.nosdn.127.net/66090c5de391e43e4516601e14870842.jpg",
  "price": "278.00",
  "nowPrice": "278.00",
  "nowOriginalPrice": "278.00",
  "selected": true,
  "stock": 3036,
  "count": 3,
  "isEffective": true,
  "discount": null,
  "isCollect": true,
  "postFee": 1
}


const item2 = {
  "id": "4026116",
  "account": "xiaotuxian001",
  "skuId": "300476433",
  "name": "探险者黑胶防晒防雨遮阳伞户外钓鱼伞",
  "attrsText": "规格:黑胶防晒钓鱼伞（2米）+暗月折叠椅 ",
  "specs": [],
  "picture": "https://yanxuan-item.nosdn.127.net/66090c5de391e43e4516601e14870842.jpg",
  "price": "269.00",
  "nowPrice": "269.00",
  "nowOriginalPrice": "269.00",
  "selected": true,
  "stock": 4738,
  "count": 2,
  "isEffective": true,
  "discount": null,
  "isCollect": true,
  "postFee": 1
}

// CREATE TABLE "cart" (
//   "id" SERIAL PRIMARY KEY,
//   "account" TEXT,
//   "goodsId" TEXT,
//   "name" text,
//   "picture" text,
//   "price" text,
//   "count" bigint,
//   "skuId" text,
//   "attrsText" text NULL,
//   "selected" boolean,
//   "specs" json NULL,
//   "postFee" real NULL
// );


const query = 'INSERT INTO "cart" ("account", "skuId", "name", "attrsText", "specs", "picture", "price", "selected", "count", "postFee") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
const values1 = [item1.account, item1.skuId, item1.name, item1.attrsText, item1.specs, item1.picture, item1.price, item1.selected, item1.count, item1.postFee]
const values2 = [item2.account, item2.skuId, item2.name, item2.attrsText, item2.specs, item2.picture, item2.price, item2.selected, item2.count, item2.postFee]
client.query(query, values1, (err, result) => {
  if (err) {
    console.error('Error inserting data:', err)
  } else {
    console.log('Data inserted successfully')
  }
})

client.query(query, values2, (err, result) => {
  if (err) {
    console.error('Error inserting data:', err)
  } else {
    console.log('Data inserted successfully')
  }
})