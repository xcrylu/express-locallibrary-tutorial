const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt')

// 定义一个用户模型，username是唯一的索引，表示不能被重复
const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: { 
      type: String, 
      set(val) {
        // var hash = bcrypt.hashSync(val, saltRounds)
        // return require('bcrypt').hashSync(val, 10)
        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(val, salt)
        return hash
      }
    },
    role: [{ type: Schema.Types.ObjectId, ref: "Role" }]
    
  })
  
  // create the model for users and expose it to our app
  const User = mongoose.model('User', UserSchema);
  
  // 删除用户集合
  // User.db.dropCollection('users')
  
 // 导出 Genre 模型
module.exports = mongoose.model("User", UserSchema);