const router = require("express").Router();
const Video = require("../models/Video.model.js");

// body parser
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

// require Cloudinary
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model.js");

// start routes

router.get("/videos", async (req, res, next) => {
  let video = await Video.find();

  if(!req.session.user){
    res.render("videos/videos", { video});
  } else {
    let user = await User.findById(req.session.user._id)
    res.render("videos/videos", { video, user });
    console.log(user)
  }

});

router.get("/videos/upload", (req, res, next) => {
  res.render("videos/upload");
});

// Getting the easy videos

router.get("/videos-easy", async (req, res, next) => {
  let video = await Video.find({ level: "Beginner" });

  if(!req.session.user){
    res.render("videos/videos", { video});
  } else {
    let user = await User.findById(req.session.user._id)
    res.render("videos/videos", { video, user });
    console.log(user)
  }

});

// getting the medium videos
router.get("/videos-intermediate", async (req, res, next) => {
  let video = await Video.find({ level: "Intermediate" });

  if(!req.session.user){
    res.render("videos/videos", { video});
  } else {
    let user = await User.findById(req.session.user._id)
    res.render("videos/videos", { video, user });
    console.log(user)
  }

});

// getting the hard videos
router.get("/videos-hard", async (req, res, next) => {
  let video = await Video.find({ level: "Advanced" });

  if(!req.session.user){
    res.render("videos/videos", { video});
  } else {
    let user = await User.findById(req.session.user._id)
    res.render("videos/videos", { video, user });
    console.log(user)
  }

});

router.post(
  "/videos/upload",
  fileUploader.single("cloudinary"),
  (req, res, next) => {
    /* const videoUrl = req.file.path; */
    const { title, level, description, duration } = req.body;

    /* Video.find({name: req.query}) */

    Video.create({
      title,
      level,
      description,
      duration,
      videoUrl: req.file.path,
    })
      .then((newVideo) => {
        res.redirect("/videos");
        console.log("new video created: ", newVideo);
      })
      .catch((err) => console.log(err));
  }
);

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
      // res.json(foundVideo);
      res.render("videos/edit-video", { foundVideo });
    })
    .catch((err) => console.log(err));
});

router.post("/videos/:videoId/edit", (req, res, next) => {
  const videoId = req.params.videoId;

  Video.findByIdAndUpdate(videoId, req.body)
    .then(() => {
      // res.json(updatedVideo);
      res.redirect(`/videos`);
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


router.get("/favorites", (req, res, next) => {
  const user = req.session.user;

  User.findById(user._id)
    .populate("favorites")
    .then((userInfo) => {
      userInfo.favorites.forEach((el) => {
        el.isFavorite = true
      })
      console.log(userInfo);
      res.render("videos/favorites", userInfo);
    })
    .catch((err) => next(err));
}); 

router.post("/favorites/:videoId", async (req, res, next) => {
  console.log(req.session.user);
  const {videoId} = req.params
  console.log(`req params: ${videoId}`);

  let user = await User.findById(req.session.user._id)
  console.log('User in route', user)

  if(user.favorites.includes(videoId)){
    await User.findByIdAndUpdate(req.session.user._id, {
      $pull: { favorites: videoId },
    })
      res.redirect("/videos")
  } else {
    await User.findByIdAndUpdate(req.session.user._id, {
      $push: { favorites: req.params.videoId },
    })
    res.redirect("/videos")
  }

});

module.exports = router;
