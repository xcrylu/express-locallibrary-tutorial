const Author = require("../models/author");
var Book = require("../models/book");

var debug = require("debug")("author");

const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");
var async = require("async");


// Display list of all Authors.
exports.author_list = function (req, resp, next) {
  Author.find()
    .sort([["family_name", "ascending"]])
    .exec()
    .then(
      //Successful, so render
      (res) => {
        resp.render("author_list", {
          title: "Author List",
          author_list: res,
        });
      },
      //err 
      (err) => {
        debug(' author.find err:' + err);
        return next(err);
      })
}

// 为每位作者显示详细信息的页面
// Display detail page for a specific Author.
// exports.author_detail = function (req, res, next) {
//   async.parallel(
//     {
//       author: function (callback) {
//         Author.findById(req.params.id).exec(callback);
//       },
//       authors_books: function (callback) {
//         Book.find({ author: req.params.id }, "title summary").exec(callback);
//       },
//     },
//     function (err, results) {
//       if (err) {
//         return next(err);
//       } // Error in API usage.
//       if (results.author == null) {
//         // No results.
//         var err = new Error("Author not found");
//         err.status = 404;
//         return next(err);
//       }
//       // Successful, so render.
//       res.render("author_detail", {
//         title: "Author Detail",
//         author: results.author,
//         author_books: results.authors_books,
//       });
//     },
//   );
// };

exports.author_detail = asyncHandler(async (req, res, next) => {
  // 并行获取书的详细信息、书实例、作者和体裁的数量
  const [
    author,
    author_books,
  ] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_books: author_books,
  });
});


// Display Author create form on GET.
exports.author_create_get = function (req, res, next) {
  res.render("author_form", { title: "Create Author" });
};


// Handle Author create on POST.
exports.author_create_post = [
  // Validate fields.
  body("first_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601(),

  // Sanitize fields.
  body("first_name").trim().escape(),
  body("family_name").trim().escape(),
  body("date_of_birth").toDate(),
  body("date_of_death").toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("author_form", {
        title: "Create Author",
        author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Create an Author object with escaped and trimmed data.
      var author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
      author.save().then(function (result, err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new author record.
        res.redirect(author.url);
      });
    }
  },
];


// 由 GET 显示删除作者的表单
// Display Author delete form on GET.
exports.author_delete_get = asyncHandler(async function (req, res, next) {
  [author, author_books] = await Promise.all(
    [
      Author.findById(req.params.id).exec(),
      Book.find({ author: req.params.id }).exec(),
    ]),

    function () {
      // console.log(results);      
      if (author == null) {
        // No results.
        res.redirect("/catalog/authors");
      }
      // Successful, so render.
      res.render("author_delete", {
        title: "Delete Author",
        author: author,
        author_books: author_books,
      });
    }();
});



// 由 POST 处理作者删除操作
// Handle Author delete on POST.
// exports.author_delete_post = (req,res,next)=>{
//   res.send(req.body.authorid);
// }
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  const [
    author,
    authors_books,
  ] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);
  {
    if (!author) {
      return next(err);
    }
    // Success
    if (authors_books.length > 0) {
      // Author has books. Render in same way as for GET route.
      res.render("author_delete", {
        title: "Delete Author",
        author: author,
        author_books: authors_books,
      });
      return;
    } else {

      // Author has no books. Delete object and redirect to the list of authors.
      Author.findByIdAndDelete(req.body.authorid).exec().then((_, err) => {
        if (err) {
          return next(err);
        }
        // Success - go to author list
        res.redirect("/catalog/authors");
      });
    };
  }
});




// 由 GET 显示更新作者的表单
exports.author_update_get = (req, res) => {
  res.send("未实现：作者更新表单的 GET");
};

// 由 POST 处理作者更新操作
exports.author_update_post = (req, res) => {
  res.send("未实现：更新作者的 POST");
};
