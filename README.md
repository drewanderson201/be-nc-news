# Northcoders News API

Hosted version: https://nc-news-da.onrender.com/api

This project is the backend service including api and database for News type application. The api was built for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture. It was created as part of the Northcoders software development bootcamp.

If you wish to clone the repo and test for yourself see the below instructions:

1. Clone the repository
2. Create two .env files for the project .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment. Database names: test - "nc_news_test" development - "nc_news"
3. run "npm install"
4. install dependencies outlined below
4. run "npm run setup-dbs"
5. run "npm run seed"
6. run "npm run test" to run the test suite

Dev Dependencies installed
"husky": "^8.0.2", https://www.npmjs.com/package/husky
"jest": "^27.5.1", https://www.npmjs.com/package/jest
"jest-extended": "^2.0.0", https://www.npmjs.com/package/jest-extended
"jest-sorted": "^1.0.14", https://www.npmjs.com/package/jest-sorted
"supertest": "^6.3.4", https://www.npmjs.com/package/supertest

Dependencies installed
"pg-format": "^1.0.4", https://www.npmjs.com/package/pg-format
"dotenv": "^16.3.1", https://www.npmjs.com/package/dotenv
"express": "^4.18.2", https://www.npmjs.com/package/express
"pg": "^8.7.3", https://www.npmjs.com/package/pg

Required
Postgres 14.10
Node v21.1.0
