const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("Request on invalid endpoint", () => {
    test("404: api request to an invalid endpoint results in error message", () => {
      return request(app)
        .get("/api/topicss")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found - Invalid Endpoint");
        });
    });
  });

  describe("GET /api", () => {
    test("GET 200: returns object describing all the available endpoints of the API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          for (const endpoint in body) {
            expect(typeof body[endpoint].description).toBe("string");
            expect(Array.isArray(body[endpoint].queries)).toBe(true);
            expect(typeof body[endpoint].requestFormat).toBe("object");
            expect(typeof body[endpoint].exampleResponse).toBe("object");
          }
        });
    });
  });

  describe("GET /topics", () => {
    test("GET 200: sends an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics.length).toBe(data.topicData.length);
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });

  describe("GET /articles/:article_id", () => {
    test("GET 200: sends single article based on article id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.article_id).toBe(1);
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("butter_bridge");
          expect(article.body).toBe("I find this existence challenging");
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article.votes).toBe(100);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });

    test("GET 404: sends an appropriate status and error message when given a valid but non existent id", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article does not exist");
        });
    });

    test("GET 400: sends an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/nonsense")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
  });

  describe("GET /articles", () => {
    test("GET 200: sends an array of article objects with following properties: author,title, article_id,topic, created_at, votes, article_img_url. Not including a body property ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(data.articleData.length);
          articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(article.body).toBe(undefined);
          });
        });
    });

    test("GET 200: sends an array of article objects including a comment count property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(data.articleData.length);
          const articleOne = articles.find(
            (article) => article.article_id === 1
          );
          const articleTwo = articles.find(
            (article) => article.article_id === 2
          );
          const articleThree = articles.find(
            (article) => article.article_id === 3
          );
          const articleOneCommentCount = articleOne.comment_count;
          const articleTwoCommentCount = articleTwo.comment_count;
          const articleThreeCommentCount = articleThree.comment_count;

          expect(articleOneCommentCount).toBe(11);
          expect(articleTwoCommentCount).toBe(0);
          expect(articleThreeCommentCount).toBe(2);
          articles.forEach((article) => {
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });

    test("GET 200: should be sorted in date descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });

  describe("GET /articles/:article_id/comments", () => {
    test("GET 200: sends an array of comments based on article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.article_id).toBe("number");
          });
        });
    });

    test("GET 200: comments are default sorted by date in decending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    test("GET 404: sends an appropriate status and error message when given a valid but non existent id", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article does not exist");
        });
    });

    test("GET 400: sends an appropriate status and error message when given an invalid article id", () => {
      return request(app)
        .get("/api/articles/nonsense/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });

    test("GET 200: sends an empty array when given a article id with no comments ", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toEqual([]);
        });
    });
  });

  describe("POST /articles/:article_id/comments", () => {
    test("POST 201: adds a new comment for an article", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({
          username: "rogersop",
          body: "Posting a brand new comment for testing",
        })
        .expect(201)
        .then(({ body }) => {
          const comment = body.comment;
          expect(comment.comment_id).toBe(19);
          expect(comment.body).toBe("Posting a brand new comment for testing");
          expect(comment.article_id).toBe(2);
          expect(comment.author).toBe("rogersop");
          expect(comment.votes).toBe(0);
          expect(typeof comment.created_at).toBe("string");
        });
    });

    test("POST 400: will respond with error message if body is missing mandatory keys", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({
          body: "Posting a brand new comment for testing",
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });

    test("POST 400: will respond with error message if no body is sent in request", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send()
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });

    test("POST 404: will respond with error message if request has username that doesn't exist", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({
          username: "nonsense",
          body: "new test comment",
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Resource not found");
        });
    });

    test("POST 400: will respond with error message if given and invalid article id", () => {
      return request(app)
        .post("/api/articles/nonsense/comments")
        .send({
          username: "rogersop",
          body: "new test comment",
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });

    test("POST 404: will respond with error message if given a valid but non existent article id", () => {
      return request(app)
        .post("/api/articles/100/comments")
        .send({
          username: "rogersop",
          body: "new test comment",
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article does not exist");
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    test("PATCH 200: Updates the article vote count based on article id and positive increment value", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 101,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    test("PATCH 200: Updates the article vote count based on article id and negative increment value", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 99,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    test("PATCH 200: Will return article with vote count of zero if decrement value is greater than current article vote count", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -101 })
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    test("PATCH 400: will respond with error message if vote update value is wrong data type", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "nonsense" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });

    test("PATCH 400: will respond with error message if given an invalid article id", () => {
      return request(app)
        .patch("/api/articles/nonsense")
        .send({ inc_votes: 1 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });

    test("PATCH 404: will respond with error message if given a valid but non existent article id", () => {
      return request(app)
        .patch("/api/articles/100")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("article does not exist");
        });
    });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    test("DELETE 204: Removes a comment based on comment id and responds with correct status code", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });

    test("DELETE 400: will respond with error message if given an invalid comment id", () => {
      return request(app)
        .delete("/api/comments/nonsense")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });

    test("DELETE 404: will respond with error message if given a valid but non existent comment id", () => {
      return request(app)
        .delete("/api/comments/100")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("comment does not exist");
        });
    });
  });

  describe("GET /api/users", () => {
    test("GET 200: sends an array of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length).toBe(data.userData.length);
          users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
  });

  describe("GET /articles?topic=topic_query", () => {
    test("GET 200: Will accept a query parameter of topic and return all the articles for that topic when there is a single article for that topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(1);
          articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
            expect(article.body).toBe(undefined);
          });
        });
    });

    test("GET 200: Will accept a query parameter of topic and return all the articles for that topic when there are multiple articles for that topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
            expect(article.body).toBe(undefined);
          });
        });
    });

    test("GET 404: Will respond with error message if given an non-existent topic as a query parameter", () => {
      return request(app)
        .get("/api/articles?topic=nonsense")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("topic does not exist");
        });
    });

    test("GET 200: Will respond with empty array if given a valid topic which has not articles associated with it", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toEqual([]);
        });
    });
  });

  describe("GET /api/articles/:article_id (comment_count)", () => {
    test("GET 200: sends single article based on article id including a comment count when comment count is greater than zero", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.article_id).toBe(1);
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("butter_bridge");
          expect(article.body).toBe("I find this existence challenging");
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article.votes).toBe(100);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(article.comment_count).toBe(11);
        });
    });

    test("GET 200: sends single article based on article id including a comment count when comment count is equal to zero", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.comment_count).toBe(0);
        });
    });
  });
});
