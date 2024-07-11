// /controllers/bookController.js

const BookInstance = require('../models/bookinstance.js');
const Book = require('../models/book.js');
const { body, validationResult } = require("express-validator");


// 显示完整的bookinstance列表
// Display list of all BookInstances.
exports.bookinstance_list = function (req, resp, next) {
  BookInstance.find()
    .populate("book")
    .exec()
    .then(
      (res) => {
        resp.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: res });
      }
    )
};


// 为每本bookinstance显示详细信息的页面
// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function (req, res, next) {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec()
    .then((bookinstance, err) => {
      // console.log("debug:",bookinstance,err);
      if (err) {
        return next(err);
      }
      if (bookinstance == null) {
        // No results.
        var err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("bookinstance_detail", {
        title: "Book:",
        bookinstance: bookinstance,
      });
    });
};


// 由 GET 显示创建bookinstance的表单
// Display BookInstance create form on GET.
exports.bookinstance_create_get = function (req, res, next) {
  Book.find({}, "title").exec()
    .then(function (books, err) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: books,
      });
    });
};


// 由 POST 处理bookinstance创建操作
// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  // Validate fields.
  body("book", "Book must be specified").isLength({ min: 1 }).trim(),
  body("imprint", "Imprint must be specified").isLength({ min: 1 }).trim(),
  body("due_back", "Invalid date").optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields.
  body("book").trim().escape(),
  body("imprint").trim().escape(),
  body("status").trim().escape(),
  body("due_back").toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    var bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages.
      Book.find({}, "title").exec()
        .then(function (books, err) {
          if (err) {
            return next(err);
          }
          // Successful, so render.
          res.render("bookinstance_form", {
            title: "Create BookInstance",
            book_list: books,
            selected_book: bookinstance.book._id,
            errors: errors.array(),
            bookinstance: bookinstance,
          });
        });
      return;
    } else {
      // Data from form is valid.
      bookinstance.save().then(function ( _, err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new record.
        res.redirect(bookinstance.url);
      });
    }
  },
];

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

