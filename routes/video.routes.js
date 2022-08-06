const router = require('express').Router();
const Video = require('../models/Video.model.js');

// require Cloudinary
const fileUploader = require("../config/cloudinary.config");

// require axios
const { default: axios } = require('axios');
// const ApiService = require('../services/api.service');




router.get('/videos', (req, res, next) => {
    res.render('videos')
})

router.get('/videos/upload', (req, res, next) => {
    
})

router.post('/videos/upload', (req, res, next) => {
    const {title, level, description, duration, video} = req.body;
})


module.exports = router;