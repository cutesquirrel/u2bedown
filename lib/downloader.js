const fs = require('fs')
const youtubedl = require('youtube-dl')
const through2 = require('through2')
const { spawn } = require('child_process')

module.exports = function (url, toFile) {
  const video = youtubedl(
    url,
    //'http://www.youtube.com/watch?v=90AiXO1pAiA',
    // Optional arguments passed to youtube-dl.
    ['--format=18', '-x'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname },
  )

  // Will be called when the download starts.
  video.on('info', function (info) {
    console.log('Download started')
    console.log(`filename: ${info._filename}`)
    console.log(`size: ${info.size / 1000000} MB`)
  })

  video.on('error', function (err) {
    console.error('download: error=', err)
  })

  video
    .pipe(fs.createWriteStream(toFile))
    //on('finish', function (truc, mach) {
    .on('finish', function () {
      extractAudio(toFile)
    })

  return video
}

function extractAudio(toFile) {
  // ffmpeg -i sample.avi -q:a 0 -map a sample.mp3
  return spawn('ffmpeg', ['-y', '-i', toFile, '-vn', '-ar', '44100', '-ac', '2', '-ab', '192k', '-f', 'mp3', toFile.replace('mp4', 'mp3')], {
    stdio: ['pipe', process.stdout, process.stdout],
  })
}
