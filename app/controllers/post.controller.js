const { user } = require("../models");
const db = require("../models");
const Post = db.posts;

exports.findAll = (req, res) => {
  Post.find()
    .then((result) => {
      res.send({ status: "Success", result: result });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving post.",
      });
    });
};

exports.create = (req, res) => {
  const post = new Post({
    uid: req.user.id,
    title: req.body.title,
    code: req.body.code,
    description: req.body.description,
    tags: req.body.tags,
  });

  post
    .save(post)
    .then((result) => {
      res.send({ message: "Success", result: result });
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

      res.send({ message: "Success", result: result });
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

exports.delete = (req, res) => {
  const id = req.params.id;

  Post.findByIdAndRemove(id)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Post not found",
        });
      }

      res.send({
        message: "post was deleted",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while delete post.",
      });
    });
};

exports.likePost = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  const findUser = await user.findById(req.user.id);

  
  if (!post.liked.includes(findUser.username)) {
    return Post.findByIdAndUpdate(id, { $push: { liked: findUser.username } })
      .then((result) => {
        if (!result) {
          res.status(404).send({
            message: "post not found",
          });
        }
        res.send({
          message: "success",
        });
      })
      .catch((err) => {
        res.status(409).send({
          message: err.message || "Some error while liking post.",
        });
      });
  }

  return Post.findByIdAndUpdate(id, { $pull: { liked: findUser.username } })
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "post not found",
        });
      }
      res.send({
        message: "success",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while liking post.",
      });
    });
};
