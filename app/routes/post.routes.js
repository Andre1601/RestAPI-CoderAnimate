module.exports = (app) => {
  const posts = require("../controllers/post.controller");
  const router = require("express").Router();
  const verifyToken = require("../routes/verifyToken");

  router.get("/", verifyToken, posts.findAll);
  router.post("/create", posts.create);
  router.get("/:id", posts.findOne);
  router.put("/update/:id", posts.update);
  router.delete("/delete/:id", posts.delete);

  app.use("/post", router);
};
