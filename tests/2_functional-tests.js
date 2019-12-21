/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  before(function(done) {
    chai
      .request(server)
      .post("/api/books")
      .send({
        title: "Book for example test"
      })
      .end(function(err, res) {
        done();
      });
  });

  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function(done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "Book for post test" })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "Book for post test");
              assert.isArray(res.body.comments);
              assert.property(
                res.body,
                "_id",
                "Books in array should contain _id"
              );
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "" })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      let id;
      before(function(done) {
        chai
          .request(server)
          .post("/api/books")
          .send({
            title: "Book for get test"
          })
          .end(function(err, res) {
            id = res.body._id;
            done();
          });
      });

      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/1111")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        let path = "/api/books/" + id;

        chai
          .request(server)
          .get(path)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "Book for get test");
            assert.isArray(res.body.comments);
            assert.property(
              res.body,
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        let id;
        before(function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "Another book for post test"
            })
            .end(function(err, res) {
              id = res.body._id;
              done();
            });
        });

        test("Test POST /api/books/[id] with comment", function(done) {
          let path = "/api/books/" + id;

          chai
            .request(server)
            .post(path)
            .send({ comment: "test comment" })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body.comments);
              assert.equal(res.body.title, "Another book for post test");
              assert.equal(res.body.comments[0], "test comment");
              assert.property(
                res.body,
                "_id",
                "Books in array should contain _id"
              );
              done();
            });
        });
      }
    );
  });
});
