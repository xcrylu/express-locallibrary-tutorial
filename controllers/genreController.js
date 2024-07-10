const Genre = require('../models/genre');
const Book = require('../models/book');
var async = require("async");
const asyncHandler = require("express-async-handler");

// 显示完整的genre列表
exports.genre_list = (req, resp, next) => {
    Genre.find()
        .sort([['name', "ascending"]])
        .exec()
        .then(
            (res,err) => {
                resp.render("genre_list", { title: 'Genre List', genre_list: res });
            }
        )
};

// 为每位流派显示详细信息的页面
// Display detail page for a specific Genre.
// exports.genre_detail = function (req, resp, next) {
//     async.parallel( 
//         {
//             genre: function (callback) {
//                 Genre.findById(req.params.id).exec().then(callback);
//             },

//             genre_books: function (callback) {
//                 Book.find({ genre: req.params.id }).exec().then(callback);
//             }            
//         }, 
//         function ( err,results) {    
//             // console.log(genre,genre_books);  
//             if (err) {
//                 return next(err);
//             }
//             if (results.genre == null) {
//                 // No results.
//                 var err = new Error("Genre not found");
//                 err.status = 404;
//                 return next(err);
//             }
//             // Successful, so render
//             // console.log("genre:",genre);
//             // console.log("genre_books:",genre_books);
//             resp.render("genre_detail", {
//                 title: "Genre Detail",
//                 genre: genre,
//                 genre_books: genre_books,
//             });
//         },
//     );

// };
exports.genre_detail = asyncHandler(async (req, res, next) => {
    // 并行获取书的详细信息、书实例、作者和体裁的数量
    const [
        genre,
        genre_books,      
    ] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }).exec(),
    ]);
  
    res.render("genre_detail", {
      title: "Genre Detail",
      genre: genre,
      genre_books: genre_books,
    });
  });


// 由 GET 显示创建流派的表单
exports.genre_create_get = (req, res) => {
    res.send("未实现：流派创建表单的 GET");
};

// 由 POST 处理流派创建操作
exports.genre_create_post = (req, res) => {
    res.send("未实现：创建流派的 POST");
};

// 由 GET 显示删除流派的表单
exports.genre_delete_get = (req, res) => {
    res.send("未实现：流派删除表单的 GET");
};

// 由 POST 处理流派删除操作
exports.genre_delete_post = (req, res) => {
    res.send("未实现：删除流派的 POST");
};

// 由 GET 显示更新流派的表单
exports.genre_update_get = (req, res) => {
    res.send("未实现：流派更新表单的 GET");
};

// 由 POST 处理流派更新操作
exports.genre_update_post = (req, res) => {
    res.send("未实现：更新流派的 POST");
};