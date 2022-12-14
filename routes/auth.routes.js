const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post(
  "/signup",
  fileUploader.single("avatar"),
  isLoggedOut,
  (req, res, next) => {
    const { name, email, password, level } = req.body;
    let image;
    if (req.file) {
      image = req.file.path;
    } else {
      image =
        "https://res.cloudinary.com/poletto/image/upload/v1660226517/IMG_3403_hnenu1.jpg";
    }
    if (!email) {
      return res.status(400).render("auth/signup", {
        errorMessage: "Please provide your email.",
      });
    }

    if (password.length < 8) {
      return res.status(400).render("auth/signup", {
        errorMessage: "Your password needs to be at least 8 characters long.",
      });
    }

    //   ! This use case is using a regular expression to control for special characters and min length
    /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

    // Search the database for a user with the username submitted in the form
    User.findOne({ email }).then((found) => {
      // If the user is found, send the message username is taken
      if (found) {
        return res
          .status(400)
          .render("auth/signup", { errorMessage: "Email is already used." });
      }

      // if user is not found, create a new user - start with hashing the password
      return bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hashedPassword) => {
          // Create a user and save it in the database
          return User.create({
            name,
            email,
            password: hashedPassword,
            avatar: image,
          });
        })
        .then((user) => {
          // Bind the user to the session object
          req.session.user = user;
          req.app.locals.loggedInUser = user;
          res.redirect("/videos");
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            return res
              .status(400)
              .render("auth/signup", { errorMessage: error.message });
          }
          if (error.code === 11000) {
            return res.status(400).render("auth/signup", {
              errorMessage:
                "Email need to be unique. The email you chose is already in use.",
            });
          }
          return res
            .status(500)
            .render("auth/signup", { errorMessage: error.message });
        });
    });
  }
);

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).render("auth/login", {
      errorMessage: "Please provide your email.",
    });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials.",
        });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render("auth/login", {
            errorMessage: "Wrong credentials.",
          });
        }
        req.session.user = user;
        req.app.locals.loggedInUser = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.app.locals.loggedInUser = null;
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

// Profile page

router.get("/profile", isLoggedIn, (req, res, next) => {
  User.findById(req.session.user._id).then((user) => {
    console.log(user);
    res.render("profile", { user });
  });
});

// Edit profile page

router.get("/profile/:id/edit", isLoggedIn, (req, res, next) => {
  const user = req.session.user;
  User.findById(req.session.user._id)
    .then((user) => res.render("profile-edit", user))
    .catch((err) => next(err));
});

router.post(
  "/profile/:id/edit",
  isLoggedIn,
  fileUploader.single("avatar"),
  isLoggedIn,
  (req, res, next) => {
    const { id } = req.params;
    const { email, password } = req.body;
    if (!req.file) {
      User.findByIdAndUpdate(id, { level, avatar })
        .then(() => {
          return res.redirect("/profile");
        })
        .catch((err) => next(err));
    } else {
      const avatar = req.file.path;
      User.findByIdAndUpdate(id, { level, avatar }).then(() => {
        return res.redirect("/profile");
      });
    }
  }
);

// Delete profile page

router.post("/profile/:id/delete", isLoggedIn, (req, res, next) => {
  req.app.locals.loggedInUser = null;
  User.findByIdAndDelete(req.session.user._id).then(() => {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .render("auth/logout", { errorMessage: err.message });
      }
      res.redirect("/");
    });
  });
});

module.exports = router;