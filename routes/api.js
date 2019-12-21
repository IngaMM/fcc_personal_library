/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

const mongoose = require("mongoose");
mongoose.connect(MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.once("open", function() {
  console.log("Successfully connected");
});

const Schema = mongoose.Schema;

let bookSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  comments: [
    {
      type: String
    }
  ],
  commentcount: { type: Number }
});

var Book = mongoose.model("Book", bookSchema, "books");

function done(err, data) {
  if (err) {
    console.log(err);
  }
  if (data) {
    console.log(data);
  }
  return;
}

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      Book.find({}, "_id title commentcount").exec(function(err, list_books) {
        if (err) {
          return done(err);
        }

        res.json(list_books);
      });
    })

    .post(function(req, res) {
      if (!req.body.title || req.body.title === "") {
        res.send("missing title");
      } else {
        var book = new Book({
          _id: new mongoose.mongo.ObjectId(),
          title: req.body.title,
          comments: [],
          commentcount: 0
        });

        book.save(function(err, book) {
          if (err) {
            return done(err);
          }

          Book.findOne({ title: book.title }, function(err, savedBook) {
            if (err) {
              return done(err);
            }
            res.json({
              title: savedBook.title,
              comments: savedBook.comments,
              _id: savedBook._id
            });
          });
        });
      }
    })

    .delete(function(req, res) {
      Book.deleteMany({}, function(err) {
        if (err) {
          return done(err);
        }
        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var bookid = req.params.id;
      Book.findById(req.params.id, function(err, book) {
        if (err) {
          res.send("no book exists");
        } else {
          res.json({
            _id: book.id,
            title: book.title,
            comments: book.comments
          });
        }
      });
    })

    .post(function(req, res) {
      var bookid = req.params.id;
      Book.findById(bookid, function(err, book) {
        if (err) {
          res.send("no book exists");
        } else {
          var comment = req.body.comment;
          var commentUpdate = book.comments.concat(comment);

          var bookUpdate = {
            _id: bookid,
            comments: commentUpdate,
            commentcount: commentUpdate.length
          };

          Book.findByIdAndUpdate(bookid, bookUpdate, {}, function(
            err,
            thebook
          ) {
            if (err) {
              return done(err);
            }

            res.json({
              _id: thebook.id,
              title: thebook.title,
              comments: commentUpdate
            });
          });
        }
      });
    })

    .delete(function(req, res) {
      var bookid = req.params.id;

      Book.findByIdAndRemove(bookid, function(err) {
        if (err) {
          res.send("no book exists");
        } else {
          res.send("delete successful");
        }
      });
    });
};
//
