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
            expect(typeof body[endpoint].requestFormat).toBe("string");
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
            expect(article.body).toBe(undefined)
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
          const articleOne = articles.find((article) => 
            article.article_id === 1
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

    test("GET 200: should be sorted in date descending order by default",()=>{

        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const {articles} = body
            expect(articles).toBeSortedBy("created_at", {descending: true});
          });

    })

    

  });

  describe("GET /articles/:article_id/comments", ()=>{

    test("GET 200: sends an array of comments based on article_id", () => {
         return request(app).get("/api/articles/1/comments").expect(200).then(({body})=>{
            const {comments} = body;
            expect(comments.length).toBe(11)
            comments.forEach((comment)=>{
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.article_id).toBe("number");
            })
         })
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

        test("GET 400: sends an appropriate status and error message when given an invalid id", () => {
          return request(app)
            .get("/api/articles/nonsense/comments")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Bad request");
            });
        });

  })

});
