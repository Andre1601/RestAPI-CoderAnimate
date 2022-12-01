const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = db.key;


const { registerValidation } = require("../../config/validation.config");

const User = db.user;

exports.findAll = (req, res) => {
  User.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving Account.",
      });
    });
};

exports.register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error)
    return res.status(400).send({
      status: res.statusCode,
      message: error.details[0].message,
    });

  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist)
    return res.status(400).send({
      status: res.statusCode,
      message: "Username Sudah Digunakan",
    });

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send({
      status: res.statusCode,
      message: "Email Sudah Digunakan",
    });

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  user
    .save(user)
    .then((result) => {
      res.send({ message:"Success", result: result});
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while create account.",
      });
    });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({
      status: res.statusCode,
      message: "Email Anda Salah!",
    });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({
      status: res.statusCode,
      message: "Password Anda Salah!",
    });

  const token = jwt.sign({ id: user.id }, key);
  res.header("auth-token", token).send({
    status: "success",
    data: { accessToken: token },
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "account not found",
        });
      }

      res.send({ status: "success", result: result });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while show account.",
      });
    });
};

exports.findMe = (req, res) => {
    User.findById(req.user.id)
    .then((result) => {
      res.send({message: "Success", result: result});
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving Account.",
      });
    });
}

exports.update = (req, res) => {
  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Account not found",
        });
      }

      res.send({
        message: "account was updated",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while update account.",
      });
    });
};
