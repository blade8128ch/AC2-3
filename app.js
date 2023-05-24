// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
// 引用 body-parser
const bodyParser = require('body-parser')

const Todo = require('./models/todo') // 載入 Todo model

const exphbs = require('express-handlebars')

const generatePassword = require('./generate_password')



// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

  
const app = express()

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) 


// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 設定首頁路由
app.get('/', (req, res) => {
  //res.send('hello world')
  res.render('index')
})

// 設定 成功 轉址路由
app.get('/:ADDRESS', (req, res) => {
  //res.redirect('https://www.google.com/')
  console.log("抓抓",req.params)
  const inputAddress = req.params.ADDRESS
  //console.log(typeof(inputAddress))
  //console.log(Todo.find({address : inputAddress}))
  if(inputAddress){
    return Todo.findOne({address : inputAddress})
    .then((todo) => {
      console.log("這是轉址",todo)
      //console.log(todo.name) 
      if(todo!=null){
        res.redirect(todo.name)//若用find()需先指定index
      }else{
        
        res.redirect('/') //跳轉失敗 , default會回到root?
        
      }
      
    })
  }
  
})


app.post('/', (req, res) => {
    // 例外處理  - 判斷是輸入是否為空
    if (!req.body.name) {
      return res.render('index', { error : "請輸入網址" } )
    }

    const name = req.body.name //名稱要跟todo.js定義的一樣, // 從 req.body 拿出表單裡的 name 資料
    //const address=generatePassword()
    
    let address=""
    Todo.findOne({name : name})
    .then((todo) => {
      //例外處理  - 判斷是否已存在資料庫
      if(todo!==null){
        //若存在,撈資料庫裡的回傳
        console.log("存在",todo.address,"前address後name",todo.name)
        res.render('index', { address: todo.address , name: todo.name } )
      }else{
        //若不存在, 產生新網址
        address=generatePassword() 
        console.log("ok",address)
        return Todo.create({ address,name })     // 存入資料庫,順序可不一樣
        .then(() => {
        res.render('index', { address: address , name:name } )// 新增完成後導回首頁
          }) 
        .catch(error => console.log(error))
      }
    })
    
  })

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})