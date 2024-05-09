const express = require('express')
const pg = require('pg')

const client = new pg.Client({
    host: "localhost",
    user: "ethan",
    password: "123456",
    database: "ethan"
})
client.connect()


const app = express()
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("Cache-Control", "no-store")
    next()
})

// layout.js/getCategoryAPI()
app.get('/home/category/head', (req, res) => {
    client.query('SELECT * FROM category', (error, results) => {
        if (error) throw error
        const data = {
            code: "1",
            msg: "操作成功",
            result: results.rows
        }
        res.send(data)
    })
})

// home.js/getBannerAPI()
app.get('/home/banner', (req, res) => {
    client.query('SELECT * FROM banner', (error, results) => {
        if (error) throw error
        const data = {
            code: "1",
            msg: "操作成功",
            result: results.rows
        }
        res.send(data)
    })
})

// home.js/getHotAPI()
app.get('/home/hot', (req, res) => {
    client.query('SELECT * FROM hot', (error, results) => {
        if (error) throw error
        const data = {
            code: "1",
            msg: "操作成功",
            result: results.rows
        }
        res.send(data)
    })
})

// home.js/getNewAPI()
app.get('/home/new', (req, res) => {
    client.query('SELECT * FROM new', (error, results) => {
        if (error) throw error
        const data = {
            code: "1",
            msg: "操作成功",
            result: results.rows
        }
        res.send(data)
    })
})

// home.js/getGoodsAPI
app.get('/home/goods', (req, res) => {
    client.query('SELECT * FROM categoods', (error, results) => {
        if (error) throw error
        const data = {
            code: "1",
            msg: "操作成功",
            result: results.rows
        }
        res.send(data)
    })
})


function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// 根据一级分类id 获取二级分类列表
// category.js/getTopCategoryAPI(id)
app.use(express.urlencoded({ extended: true }))
app.get('/category', (req, res) => {
    id = req.query.id
    client.query('SELECT * FROM category WHERE id = $1', [id], (error, results) => {
        if (error) throw error
        let data = {
            id: results.rows[0].id,
            name: results.rows[0].name,
            picture: results.rows[0].picture,
            children: []
        }

        subItem = results.rows[0].children
        for (const key in subItem) {
            let subData = {
                id: subItem[key].id,
                name: subItem[key].name,
                picture: subItem[key].picture,
                goods: []
            }
            let query = 'SELECT "id", "name", "desc", "price", "mainPictures" FROM goods WHERE categories_2=$1'
            client.query(query, [subItem[key].id], (error, results) => {
                if (error) throw error
                subData.goods = results.rows
                for(const key in subData.goods){
                    subData.goods[key].picture = subData.goods[key].mainPictures[0]
                    delete subData.goods[key].mainPictures
                }
            })
                data.children.push(subData)
        }
        wait(20).then(() => {
            res.send({
                code: "1",
                msg: "操作成功",
                result: data
            })
        })
    })
})






// details.js/getDetail(id)
app.use(express.urlencoded({ extended: true }))
app.get("/goods", (req, res) => {
    const id = req.query.id

    const values = [id]
    const query = 'SELECT * FROM goods WHERE id = $1'
    client.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err)
            const data = {
                code: "10004",
                msg: "操作失败",
            }
            res.send(data)
        } else {
            const data = {
                code: "1",
                msg: "操作成功",
                result: result.rows[0]
            }
            res.send(data)
        }
    })
})


// 监听端口
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})