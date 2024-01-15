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
        .then(({body}) => {
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
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });

});
