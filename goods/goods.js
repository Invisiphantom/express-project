const fs = require('fs')
const readline = require('readline')
const axios = require('axios')

const http = axios.create({
  baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
  timeout: 15000
})

http.interceptors.request.use(config => {
  return config
}, error => Promise.reject(error))

http.interceptors.response.use(res => res.data, error => {
  console.log('Error: ', error.response.data.message)
  return Promise.reject(error)
})


const fileStream = fs.createReadStream(__dirname + '/goods.txt')
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
})


const pg = require('pg')
const client = new pg.Client({
  host: "localhost",
  user: "ethan",
  password: "123456",
  database: "ethan"
})
client.connect()


function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const { Semaphore } = require('async-mutex')
const sem = new Semaphore(2)

var count = 0
rl.on('line', async (id) => {
  if (id.length > 4)
    await sem.acquire().then(async () => {
      console.log(id)
      const res = (await http.get('/goods', { params: { id } })).result
      const query = 'INSERT INTO goods ("id", "name", "desc", "price", "oldPrice", "discount", "inventory", "brand", "salesCount", "commentCount", "collectCount", "mainPictures", "specs", "skus", "categories_1", "categories_2", "categories", "details.pictures", "details.properties") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)'
      const values = [res.id, res.name, res.desc, res.price, res.oldPrice, res.discount, res.inventory, res.brand, res.salesCount, res.commentCount, res.collectCount, JSON.stringify(res.mainPictures), JSON.stringify(res.specs), JSON.stringify(res.skus), res.categories[1].id, res.categories[0].id, JSON.stringify(res.categories), JSON.stringify(res.details.pictures), JSON.stringify(res.details.properties)]
      client.query(query, values, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
        } else {
          count++
          console.log('Data inserted successfully')
          console.log('Total data inserted:', count)
        }
      })
      let randTime = Math.floor(Math.random() * 1000)
      wait(randTime).then(() => {
        sem.release()// 执行完成后释放信号量
      })
    })




})



rl.on('close', () => {
  console.log('File reading completed.')
})