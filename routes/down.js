const express = require('express')
const router = express.Router()
const download = require('../lib/downloader')
const fs = require('fs')

const filenameAudio = `${__dirname}/../data/mavideo.mp3`
const filenameVideo = `${__dirname}/../data/mavideo.mp4`

//
// Download the video
//
router.post('/', function (req, res) {
  download(req.body.todown, filenameVideo)
  res.locals.result = 'ok'
  res.locals.todown = req.body.todown
  res.render('index')
})

//
// Get
//
router.get('/video', function (req, res) {
  res.attachment(filenameVideo)
  fs.createReadStream(filenameVideo).pipe(res)
})

router.get('/audio', function (req, res) {
  res.attachment(filenameAudio)
  fs.createReadStream(filenameAudio).pipe(res)
})

module.exports = router
