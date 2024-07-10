
// const asyncHandler = require('express-async-handler');
const asyncHandler = require("express-async-handler");

const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

// 显示完整的book列表
exports.index = asyncHandler(async (req, res, next) => {
    // 并行获取书的详细信息、书实例、作者和体裁的数量
    const [
      numBooks,
      numBookInstances,
      numAvailableBookInstances,
      numAuthors,
      numGenres,
    ] = await Promise.all([
      Book.countDocuments({}).exec(),
      BookInstance.countDocuments({}).exec(),
      BookInstance.countDocuments({ status: "Available" }).exec(),
      Author.countDocuments({}).exec(),
      Genre.countDocuments({}).exec(),
    ]);
  
    res.render("index", {
      title: "Local Library Home",
      book_count: numBooks,
      book_instance_count: numBookInstances,
      book_instance_available_count: numAvailableBookInstances,
      author_count: numAuthors,
      genre_count: numGenres,
    });
  });

// Display list of all Books.
exports.book_list =   (req, resp, next) =>{
//    let list_books ;
    Book.find({}, "title author")
      .populate("author")
      .exec()
      .then(
        (res) => {   // list_books = res;  
        //    console.log(res);
            resp.render("book_list", { title: "Book List", book_list: res })
        } ,
        (err)=> {}     
    );
    //   .exec(function (err, list_books) {
    //     if (err) {
    //       return next(err);
    //     }
    //     //Successful, so render
    //     res.render("book_list", { title: "Book List", book_list: list_books });
    //   });

    //  res.render("book_list",{ title: "Book List", book_list: list_books });

  };
  
  // 为每位书本显示详细信息的页面
  // 显示特定书籍的详细信息页面。
exports.book_detail = asyncHandler(async (req, res, next) => {
  // 获取书籍的详细信息，以及特定书籍的实例
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (book === null) {
    // 没有结果。
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  res.render("book_detail", {
    title: book.title,
    book: book,
    book_instances: bookInstances,
  });
});

  
  // 由 GET 显示创建书本的表单
  exports.book_create_get = (req, res) => {
    res.send("未实现：书本创建表单的 GET");
  };
  
  // 由 POST 处理书本创建操作
  exports.book_create_post = (req, res) => {
    res.send("未实现：创建书本的 POST");
  };
  
  // 由 GET 显示删除书本的表单
  exports.book_delete_get = (req, res) => {
    res.send("未实现：书本删除表单的 GET");
  };
  
  // 由 POST 处理书本删除操作
  exports.book_delete_post = (req, res) => {
    res.send("未实现：删除书本的 POST");
  };
  
  // 由 GET 显示更新书本的表单
  exports.book_update_get = (req, res) => {
    res.send("未实现：书本更新表单的 GET");
  };
  
  // 由 POST 处理书本更新操作
  exports.book_update_post = (req, res) => {
    res.send("未实现：更新书本的 POST");
  };