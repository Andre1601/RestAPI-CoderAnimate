const jwt = require("jsonwebtoken");
const db = require("../models");
const key = db.key;

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token')
  if(!token) return res.status(400).send({
    status: res.statusCode,
    message: "Access Denied!"
  })

  try {
    const verified = jwt.verify(token, key);
    req.user = verified
    next()
  } catch (error) {
    res.status(400).send({
      status: res.statusCode,
      message: "Invalid Token!",
    });
  }
};

module.exports = verifyToken;
