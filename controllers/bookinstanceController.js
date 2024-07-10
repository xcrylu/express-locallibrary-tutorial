// /controllers/bookController.js

const BookInstance = require('../models/bookinstance.js');

// 显示完整的bookinstance列表
// Display list of all BookInstances.
exports.bookinstance_list =  function (req, resp, next) {
     BookInstance.find()
      .populate("book")
      .exec()
      .then(
        (res) =>{
            resp.render('bookinstance_list',{title:'Book Instance List',bookinstance_list:res});
        }
      )
};
    
    
  // 为每本bookinstance显示详细信息的页面
  exports.bookinstance_detail = (req, res) => {
    res.send("未实现：bookinstance详细信息：" + req.params.id);
  };
  
  // 由 GET 显示创建bookinstance的表单
  exports.bookinstance_create_get = (req, res) => {
    res.send("未实现：bookinstance创建表单的 GET");
  };
  
  // 由 POST 处理bookinstance创建操作
  exports.bookinstance_create_post = (req, res) => {
    res.send("未实现：创建bookinstance的 POST");
  };
  
  // 由 GET 显示删除bookinstance的表单
  exports.bookinstance_delete_get = (req, res) => {
    res.send("未实现：bookinstance删除表单的 GET");
  };
  
  // 由 POST 处理bookinstance删除操作
  exports.bookinstance_delete_post = (req, res) => {
    res.send("未实现：删除bookinstance的 POST");
  };
  
  // 由 GET 显示更新bookinstance的表单
  exports.bookinstance_update_get = (req, res) => {
    res.send("未实现：bookinstance更新表单的 GET");
  };
  
  // 由 POST 处理bookinstance更新操作
  exports.bookinstance_update_post = (req, res) => {
    res.send("未实现：更新bookinstance的 POST");
  };
  
