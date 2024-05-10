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
    res.header("Access-Control-Allow-Headers", "*")
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
        res.status(200).send(data)
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
        res.status(200).send(data)
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
        res.status(200).send(data)
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
        res.status(200).send(data)
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
        res.status(200).send(data)
    })
})


function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

// 根据一级分类id 获取二级分类列表
// category.js/getTopCategoryAPI(id)
app.use(express.urlencoded({ extended: true }))
app.get('/category', (req, res) => {
    id = req.query.id
    client.query('SELECT * FROM category WHERE id=$1', [id], (error, results) => {
        if (error) throw error
        let data = {
            id: results.rows[0].id,
            name: results.rows[0].name,
            picture: results.rows[0].picture,
            children: []
        }
        subItem = results.rows[0].children
        // 查询每个二级目录对应的商品
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
                for (const key in subData.goods) {
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
        if (err) throw err
        const data = {
            code: "1",
            msg: "操作成功",
            result: result.rows[0]
        }
        res.status(200).send(data)
    })
})


const jwt = require('jsonwebtoken')
const jsonWebToken = require('jsonwebtoken')
const SECRET_KEY = 'SpyFamily'
// user.js/loginAPI(user)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.post("/login", (req, res) => {
    const account = req.body.account
    const password = req.body.password
    client.query('SELECT * FROM "user" WHERE "account"=$1', [account], (error, results) => {
        if (error) throw error
        let token = jwt.sign({ account }, SECRET_KEY, { expiresIn: '1h' })
        let result = results.rows[0]
        result.token = token
        delete result.password
        const data = {
            code: "1",
            msg: "操作成功",
            result: result
        }
        res.status(200).send(data)
    })
})


// cart.js/findNewCartListAPI() token
app.use(express.urlencoded({ extended: true }))
app.get("/member/cart", (req, res) => {
    if (!req.headers.authorization) return res.status(401)
    try {
        const token = req.headers.authorization.split(' ')[1]
        const { account } = jwt.verify(token, SECRET_KEY)
        client.query('SELECT * FROM cart WHERE account=$1', [account], (error, results) => {
            if (error) throw error
            const data = {
                code: "1",
                msg: "操作成功",
                result: results.rows
            }
            res.status(200).send(data)
        })
    } catch (error) {
        return res.status(401)
    }
})


// cart.js/insertCartAPI(goods) token
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.post("/member/cart", (req, res) => {

    if (!req.headers.authorization) return res.status(401)
    try {
        const token = req.headers.authorization.split(' ')[1]
        const { account } = jwt.verify(token, SECRET_KEY)
        const skuId = req.body.skuId

        const query = 'SELETE * FROM cart WHERE "account"=$1 AND "skuId"=$2'
        client.query(query, values, (error, result) => {
            if (error) throw error
            // 如果购物车中已经存在该商品，则更新数量
            if (result.rows.length > 0) {
                const count = req.body.count
                const query = 'UPDATE cart SET count = count + $1 WHERE "account"=$2 AND "skuId"=$3'
                const values = [count, account, skuId]
                client.query(query, values, (error, result) => {
                    if (error) throw error
                    const data = {
                        code: "1",
                        msg: "操作成功"
                    }
                    res.status(200).send(data)
                })
            } else { // 否则插入新的商品
                const goodsId = req.body.goodsId
                const name = req.body.name
                const picture = req.body.picture
                const price = req.body.price
                const count = req.body.count
                const attrsText = req.body.attrsText
                const selected = req.body.selected
                const query = 'INSERT INTO cart ("account", "goodsId", "name", "picture", "price", "count", "skuId", "attrsText", "selected") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
                const values = [account, goodsId, name, picture, price, count, skuId, attrsText, selected]
                client.query(query, values, (error, result) => {
                    if (error) throw error
                    const data = {
                        code: "1",
                        msg: "操作成功"
                    }
                    res.status(200).send(data)
                })
            }
        })
    } catch (error) {
        return res.status(401)
    }
})


// cart.js/delCartAPI(ids) token
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.delete("/member/cart", (req, res) => {
    if (!req.headers.authorization) return res.status(401)
    try {
        const token = req.headers.authorization.split(' ')[1]
        const { account } = jwt.verify(token, SECRET_KEY)
        const skuId = req.body.ids[0]
        const query = 'DELETE FROM "cart" WHERE "account"=$1 AND "skuId"=$2'
        const values = [account, skuId]
        client.query(query, values, (error, result) => {
            if (error) throw error
            const data = {
                code: "1",
                msg: "操作成功"
            }
            res.status(200).send(data)
        })
    } catch (error) {
        res.status(401)
    }
})



// cart.js/updateCartAPI(skuId, data:{ count, selected }) token
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.put("/member/cart/:id", (req, res) => {
    if (!req.headers.authorization) return res.status(401)
    try {
        const token = req.headers.authorization.split(' ')[1]
        const { account } = jwt.verify(token, SECRET_KEY)
        const skuId = req.params.id
        const count = req.body.count
        const selected = req.body.selected

        const query = 'UPDATE cart SET count = $1, selected = $2 WHERE "account"=$3 AND "skuId"=$4'
        const values = [count, selected, account, skuId]
        client.query(query, values, (error, result) => {
            if (error) throw error
            const data = {
                code: "1",
                msg: "操作成功"
            }
            res.status(200).send(data)
        })
    } catch (error) {
        res.status(401)
    }
})


// cart.js/mergeCartAPI(data) token
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.post("/member/cart/merge", (req, res) => {
    if (!req.headers.authorization) return res.status(401)
    try {
        const token = req.headers.authorization.split(' ')[1]
        const { account } = jwt.verify(token, SECRET_KEY)
        for (const key in req.body) {
            const item = req.body[key]
            const query = 'SELECT * FROM cart WHERE "account"=$1 AND "skuId"=$2'
            const values = [account, item.skuId]
            client.query(query, values, (error, result) => {
                if (error) throw error
                if (result.rows.length > 0) {
                    const query = 'UPDATE cart SET count = count + $1 WHERE "account"=$2 AND "skuId"=$3'
                    const values = [item.count, account, item.skuId]
                    client.query(query, values, (error, result) => {
                        if (error) throw error
                    })
                } else {
                    const query = 'INSERT INTO cart ("account", "goodsId", "name", "picture", "price", "count", "skuId", "attrsText", "selected") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
                    const values = [account, item.goodsId, item.name, item.picture, item.price, item.count, item.skuId, item.attrsText, item.selected]
                    client.query(query, values, (error, result) => {
                        if (error) throw error
                    })
                }
            })
        }

        return res.status(200).send({
            code: "1",
            msg: "操作成功"
        })
    } catch (error) {
        return res.status(401)
    }
})






// checkout.js/getCheckInfoAPI() token
app.use(express.urlencoded({ extended: true }))
app.get("/member/order/pre", (req, res) => {
    if (!req.headers.authorization) return res.status(401)
    try {
        const token = req.headers.authorization.split(' ')[1]
        const { account } = jwt.verify(token, SECRET_KEY)
        client.query('SELECT * FROM "userAddress" WHERE account=$1', [account], (error, results) => {
            if (error) throw error
            const userAddresses = results.rows
            client.query('SELECT * FROM "cart" WHERE account=$1 AND selected=true', [account], (error, results) => {
                if (error) throw error
                let goods = results.rows
                for (const key in goods) {
                    goods[key].totalPrice = goods[key].price * goods[key].count
                }
                let summary = {
                    "goodsCount": goods.length,
                    "totalPrice": goods.reduce((acc, cur) => acc + cur.totalPrice, 0),
                    "postFee": 8,
                }
                summary.totalPayPrice = summary.totalPrice + summary.postFee

                let data = {
                    "userAddresses": userAddresses,
                    "goods": goods,
                    "summary": summary
                }
                return res.status(200).send({
                    code: "1",
                    msg: "操作成功",
                    result: data
                })
            })
        })
    } catch (error) {
        return res.status(401)
    }
})



// checkout.js/getCheckAddressAPI() token
app.use(express.urlencoded({ extended: true }))
app.post("/member/order/pre", (req, res) => {
    if (!req.headers.authorization) return res.status(401)
    try {
        const token = req.headers.authorization.split(' ')[1]
        const { account } = jwt.verify(token, SECRET_KEY)
        receiver = req.body.receiver
        contact = req.body.contact
        fullLocation = req.body.fullLocation
        address = req.body.address
      
      const query = 'INSERT INTO "userAddress" ("account", "receiver", "contact", "fullLocation", "address") VALUES ($1, $2, $3, $4, $5)'
        const values = [account, receiver, contact, fullLocation, address]
        client.query(query, values, (error, result) => {
            if (error) throw error
            return res.status(200).send({
                code: "1",
                msg: "操作成功"
            })
        })
    } catch (error) {
        return res.status(401)
    }
})





const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})