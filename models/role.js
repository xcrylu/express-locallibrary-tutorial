
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSechma = new Schema({
    name: { type: String, required: true,unique: true  }  
 });

 // 虚拟属性'url'：role URL
 RoleSechma.virtual("url").get(function () {
    return "/user/role/" + this._id;
  });
 // 导出 Role 模型
module.exports = mongoose.model("Role", RoleSechma);