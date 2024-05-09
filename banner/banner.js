const fs = require('fs')

fs.readFile(__dirname + '/banner.json', 'utf8', (err, data) => {
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


  count = 0
  for (const key in jsonData) {
    const item = jsonData[key]
    const query = 'INSERT INTO banner ("id", "imgUrl", "hrefUrl", "type") VALUES ($1, $2, $3, $4)'
    const values = [item.id, item.imgUrl, item.hrefUrl, item.type]
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
