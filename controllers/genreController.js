const Genre = require('../models/genre');
const Book = require('../models/book');
const debug = require('debug')

var async = require("async");
const asyncHandler = require("express-async-handler");

// const { body, validationResult } = require("express-validator/check");
const { body, validationResult, Result } = require("express-validator");
// const { sanitizeBody } = require("express-validator/filter");


// 显示完整的genre列表
exports.genre_list = (req, resp, next) => {
    Genre.find()
        .sort([['name', "ascending"]])
        .exec()
        .then(
            (res, err) => {
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
// Display Genre create form on GET.
exports.genre_create_get = function (req, res, next) {
    // console.log(req)
    // res.send("没有出错");
    res.render("genre_form", { title: "Create Genre" });
    // res.send("未实现：书本创建表单的 GET");
};


// 由 POST 处理流派创建操作
// Handle Genre create on POST.
exports.genre_create_post = [
    // Validate that the name field is not empty.
    body("name", "Genre name required").isLength({ min: 1 }).trim(),

    // Sanitize (trim and escape) the name field.
    // sanitizeBody("name").trim().escape(),
    // validationResult(req),
    body("name").trim().escape(),

    // Process request after validation and sanitization.
    (req, resp, next) => {
        // console.log(req);;
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre({ name: req.body.name });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            resp.render("genre_form", {
                title: "Create Genre",
                genre: genre,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ name: req.body.name }).exec()
                .then(function (found_genre, err) {
                    if (err) {
                        return next(err);
                    }

                    if (found_genre) {
                        // Genre exists, redirect to its detail page.
                        resp.redirect(found_genre.url);
                    } else {
                        genre.save()
                            .then(function (res, err) {
                                if (err) {
                                    return next(err);
                                }
                                // Genre saved. Redirect to genre detail page.
                                resp.redirect(genre.url);
                            });
                    }
                });
        }
    },
];


// 由 GET 显示删除流派的表单
exports.genre_delete_get = (req, res,next) => {
    Genre.findById(req.params.id).then(( genre,err0) => {
        if(err0) return next(err0)
        if (genre) {
            Book.find({ genre: req.params.id }).then((books,err1) => {
                if(err1) return next(err1);                
                if (Array.isArray(books)&&books.length>0) { //有本genre的书本，不能删除本genre
                    res.redirect("/catalog/genre/"+genre.id);                      
                }else{
                    console.log(genre.id);
                    Genre.findByIdAndDelete(genre.id).exec();
                    res.redirect('/catalog/genres');
                }
            })
        }
    })

}




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