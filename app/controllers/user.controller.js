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
    social: [
      {twitter: ''},
      {facebook: ''},
      {instagram: ''},
      {github: ''},
      {linkedin: ''},
    ]
  });

  user
    .save(user)
    .then((result) => {
      res.send({ message: "Success", result: result });
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
    .select("-password -email")
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "account not found",
        });
      }

      res.send({ status: "Success", result: result });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while show account.",
      });
    });
};

exports.findUser = (req, res) => {
  const username = req.params.id;
  
  User.findOne({username: username})
    .select("-password -email")
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "account not found",
        });
      }

      res.send({ status: "Success", result: result });
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
      res.send({ message: "Success", result: result });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving Account.",
      });
    });
};

exports.updateGeneral = (req, res) => {
  User.findByIdAndUpdate(req.user.id, { email: req.body.email })
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

exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    location: req.body.location,
    bio: req.body.bio,
  })
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

exports.verifyPassword = async (req, res) => {
  const user = await User.findById(req.user.id);
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({
      status: res.statusCode,
      message: "Password Anda Salah!",
    });

  return res.send({
    message: "Password Anda Benar!",
  });
};

exports.updatePassword = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  User.findByIdAndUpdate(req.user.id, { password: hashPassword })
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

exports.updateSocial = (req, res) => {
  User.findByIdAndUpdate(req.user.id, { social: req.body.social })
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

exports.following = async (req, res) => {
  const username = req.params.id;
  const user = await User.findOne({ username: username });
  const findUser = await User.findById(req.user.id);

  if (!user.followers.includes(findUser.username)) {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { following: username },
    })
    return User.findByIdAndUpdate(user.id, {
      $push: { followers: findUser.username },
    })
      .then((result) => {
        if (!result) {
          res.status(404).send({
            message: "Account not found",
          });
        }
        res.send({
          message: "account was followed",
        });
      })
      .catch((err) => {
        res.status(409).send({
          message: err.message || "Some error while liking post.",
        });
      });
  }

  await User.findByIdAndUpdate(req.user.id, { $pull: { following: username } });
  return User.findByIdAndUpdate(user.id, {
    $pull: { followers: findUser.username },
  })
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "account not found",
        });
      }

      res.send({
        message: "account was unfollow",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while liking post.",
      });
    });
};
