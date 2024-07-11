

const asyncHandler = require("express-async-handler");
var async = require("async");
const { body, validationResult } = require("express-validator");

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
exports.book_list = (req, resp, next) => {
  //    let list_books ;
  Book.find({}, "title author")
    .populate("author")
    .exec()
    .then(
      (res) => {   // list_books = res;  
        //    console.log(res);
        resp.render("book_list", { title: "Book List", book_list: res })
      },
      (err) => { }
    );
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


// Display book create form on GET.
exports.book_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  const [authors, genres] = await Promise.all([
    Author.find().exec(),
    Genre.find().exec()
  ]);

  if (authors === null) {
    // 没有结果。
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  };

  res.render("book_form", {
    title: "Create Book",
    authors: authors,
    genres: genres,
  });
})

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate fields.
  body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
  body("author", "Author must not be empty.").isLength({ min: 1 }).trim(),
  body("summary", "Summary must not be empty.").isLength({ min: 1 }).trim(),
  body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim(),

  // Sanitize fields (using wildcard).
  body("*").trim().escape(),
  body("genre.*").escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: function () {
            Author.find();
          },
          genres: function () {
            Genre.find();
          },
        },
        function (results, err) {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }
          res.render("book_form", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        },
      );
      return;
    } else {
      // Data from form is valid. Save book.
      book.save().then(function (result, err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to new book record.
        res.redirect(book.url);
      });
    }
  },
];


// 由 GET 显示删除书本的表单
exports.book_delete_get = (req, res) => {
  res.send("未实现：书本删除表单的 GET");
};

// 由 POST 处理书本删除操作
exports.book_delete_post = (req, res) => {
  res.send("未实现：删除书本的 POST");
};

// 由 GET 显示更新书本的表单
// Display book update form on GET.
exports.book_update_get = asyncHandler(async function (req, res, next) {
  // Get book, authors and genres for form.
  // console.log('step0');
  const [    book,    authors,    genres] = await Promise.all([  
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(),      
        Author.find().exec(),       
        Genre.find().exec(),
  ]);
    // console.log('step0.5');
    
      // console.log('step1');
      // if (book==undefined) {        
      //   return next(err);
      // }
      if (book == null) {     
        // console.log('step2');
        // No results.
        var err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected genres as checked.
      // console.log('step3');
      for (
        var all_g_iter = 0;
        all_g_iter < genres.length;
        all_g_iter++
      ) {
        for (
          var book_g_iter = 0;
          book_g_iter < book.genre.length;
          book_g_iter++
        ) {
          if (
            genres[all_g_iter]._id.toString() ==
            book.genre[book_g_iter]._id.toString()
          ) {
            genres[all_g_iter].checked = "true";
          }
        }
      };
      
      // console.log('step4');
      res.render("book_form", {
        title: "Update Book",
        authors: authors,
        genres: genres,
        book: book,
      });   

   

  });


// 由 POST 处理书本更新操作
// Handle book update on POST.
exports.book_update_post = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate fields.
  body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
  body("author", "Author must not be empty.").isLength({ min: 1 }).trim(),
  body("summary", "Summary must not be empty.").isLength({ min: 1 }).trim(),
  body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim(),

  // Sanitize fields.
  body("title").trim().escape(),
  body("author").trim().escape(),
  body("summary").trim().escape(),
  body("isbn").trim().escape(),
  body("genre.*").trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      console.log("!erros.isEmpty");
      // Get all authors and genres for form.
      async.parallel(
        {
          authors: function (callback) {
            Author.find(callback);
          },
          genres: function (callback) {
            Genre.find(callback);
          },
        },
        function (err,results) {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }
          res.render("book_form", {
            title: "Update Book",
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        },
      );
      return;
    } else {
      // Data from form is valid. Update the record.
      Book.findByIdAndUpdate(req.params.id, book, {}).then(function ( thebook,err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to book detail page.
        res.redirect(thebook.url);
      });
    }
  },
];
