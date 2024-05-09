const fs = require('fs')

fs.readFile(__dirname + '/new.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }
  const jsonData = JSON.parse(data).result

  const pg = require('pg')
  const client = new pg.Client({
    host: "localhost",
    user: "ethan",
    password: "123456",
    database: "ethan"
  })
  client.connect()

  // CREATE TABLE "new" (
  //   "id" text,
  //   "name" text,
  //   "desc" text,
  //   "price" text,
  //   "picture" text,
  //   "discount" text NULL,
  //   "orderNum" bigint
  // );

  count = 0
  for (const key in jsonData) {
    const item = jsonData[key]
    const query = 'INSERT INTO new ("id", "name", "desc", "price", "picture", "discount", "orderNum") VALUES ($1, $2, $3, $4, $5, $6, $7)'
    const values = [item.id, item.name, item.desc, item.price, item.picture, item.discount, item.orderNum]
    client.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err)
      } else {
        count++
        console.log('Data inserted successfully')
        console.log('Total data inserted:', count)
      }
    })
  }
})
