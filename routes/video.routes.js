const router = require("express").Router();
const Video = require("../models/Video.model.js");

// require Cloudinary
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model.js");

// require axios
/* const { default: axios } = require('axios');
const ApiService = require('../services/api.service'); */

router.get("/videos", (req, res, next) => {
  Video.find().then((video) => {
    res.render("videos/videos", { video });
    // res.json(video);
  });
});

router.get("/videos/upload", (req, res, next) => {
  res.render("videos/upload");
});

router.post("/videos/upload", (req, res, next) => {
  const { title, level, description, duration, video } = req.body;

  Video.create(req.body)
    .then((newVideo) => {
      res.json(newVideo);
      console.log("new video created: ", newVideo);
    })
    .catch((err) => console.log(err));
});

router.get("/videos/:videoId", (req, res, next) => {
  Video.findById(req.params.videoId).then((oneVideo) => {
    res.json(oneVideo);
    res.render("videos/view-video", { oneVideo });
  });
});

router.get("/videos/:videoId/edit", (req, res, next) => {
  const { videoId } = req.params.videoId;
  const { title, level, description, duration, video } = req.body;

  Video.findById(req.params.videoId)
    .then((foundVideo) => {
      console.log(foundVideo);
      res.json(foundVideo);
      res.render("videos/edit-video", { foundVideo });
    })
    .catch((err) => console.log(err));
});

router.post("/videos/:videoId/edit", (req, res, next) => {
  const { videoId } = req.params.videoId;

  Video.findByIdAndUpdate(req.params.videoId, req.body)
    .then((updatedVideo) => {
      res.json(updatedVideo);
      // res.redirect(`/videos/${videoId}`);
    })
    .catch((err) => console.log(err));
});

router.post("/videos/:videoId/delete", (req, res, next) => {
  let { videoId } = req.params.videoId;

  Video.findByIdAndRemove(req.params.videoId)
    .then(() => {
      res.redirect("/videos");
    })
    .catch((err) => console.log(err));
});

router.get("/favorites/:id", (req, res, next) => {
  // res.render('favorites', {User.favorites})
  console.log(`req params: ${req.params.id}`)

  /* Video.find()
  .populate(favorites)
  .then((videos) => {
    res.render('videos/favorites', {videos})
  }) */
})

router.post("/favorites/:videoId", (req, res, next) => {
  
  console.log(req.session.user)
  console.log(`req params: ${req.params.videoId}`)

  User.findByIdAndUpdate(req.session.user._id, {$push: {favorites: req.params.videoId}})
  /* .then((value) => {
    console.log(`we are returning: ${value}`)
    if (req.params.id )
  }) */
  .then(() => res.redirect("/favorites/" + req.session.user._id))
});

module.exports = router;
