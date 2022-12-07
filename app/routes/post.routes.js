module.exports = (app) => {
  const posts = require("../controllers/post.controller");
  const router = require("express").Router();
  const verifyToken = require("../routes/verifyToken");

  router.get("/", posts.findAll);
  router.post("/create", verifyToken, posts.create);
  router.get("/:id", posts.findOne);
  router.put("/update/:id", verifyToken, posts.update);
  router.delete("/delete/:id", verifyToken, posts.delete);
  router.put("/like/:id", verifyToken, posts.likePost);

  app.use("/post", router);
};
