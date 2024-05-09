const fs = require('fs')

fs.readFile(__dirname + '/categoods.json', 'utf8', (err, data) => {
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

  // CREATE TABLE "categoods" (
  //   "id" text,
  //   "name" text,
  //   "picture" text,
  //   "saleInfo" text,
  //   "children" json,
  //   "goods" json
  // );


  count = 0
  for (const key in jsonData) {
    const item = jsonData[key]
    const query = 'INSERT INTO categoods ("id", "name", "picture", "saleInfo", "children", "goods") VALUES ($1, $2, $3, $4, $5, $6)'
    const values = [item.id, item.name, item.picture, item.saleInfo, JSON.stringify(item.children), JSON.stringify(item.goods)]
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
