const db = require("../models");
const Post = db.user;

exports.create = (req, res) => {
  const post = new Post({
    uid: req.body.id,
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags,
    viewed: req.body.viewed || 0,
    liked: req.body.liked || 0,
    published: req.body.published ? req.body.published : false,
  });

  post
    .save(post)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while create post.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Post not found",
        });
      }

      res.send({ result });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while show post.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Post.findByIdAndUpdate(id, req.body)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Post not found",
        });
      }

      res.send({
        message: "post was updated",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while update post.",
      });
    });
};
