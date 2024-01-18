const {
  retrieveCommentsByArticleId,
  addComment,
  removeComment,
  updateComment,
} = require("../models/comments.model");

const { checkExistsInDb } = require("../models/check-exists.model");
const { response } = require("../app");


exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;


  const articleExistenceQuery = checkExistsInDb(
    "articles",
    "article_id",
    articleId
  );

  const retrieveCommentsQuery = retrieveCommentsByArticleId(articleId);

  Promise.all([retrieveCommentsQuery, articleExistenceQuery])
    .then((response) => {
      const comments = response[0];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const newComment = req.body;



  const articleExistenceQuery = checkExistsInDb(
    "articles",
    "article_id",
    articleId
  );

  const addCommentQuery = addComment(newComment, articleId);

  Promise.all([addCommentQuery, articleExistenceQuery])
    .then((response) => {
      const comment = response[0];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;


  const commentExistenceQuery = checkExistsInDb(
    "comments",
    "comment_id",
    commentId
  );

  const removeCommentQuery = removeComment(commentId);

  Promise.all([removeCommentQuery, commentExistenceQuery])
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const commentId = req.params.comment_id
  const commentUpdates = req.body


  const commentExistenceQuery = checkExistsInDb(
    "comments",
    "comment_id",
    commentId
  );

  const updateCommentQuery = updateComment(commentUpdates, commentId);

  Promise.all([updateCommentQuery, commentExistenceQuery]).then((response)=>{
    const comment = response[0]
    res.status(200).send({ comment });
  }).catch((err)=>{
    next(err)
  })
};
