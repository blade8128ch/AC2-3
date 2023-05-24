const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {     //---用戶輸入的網址---
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  address: {    //---縮網址的5個字元---
    type: String, // 資料型別是字串
    //required: true // 這是個必填欄位
  },
 done: {
  type: Boolean
  }
})
module.exports = mongoose.model('Todo', todoSchema)