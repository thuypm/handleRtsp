const Stream = require('node-rtsp-stream-jsmpeg')

function runNow()
{
	const options = {
  name: 'streamName',
  url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
  wsPort: 3333
}

stream = new Stream(options)
stream.start();
}

module.exports = {
	runNow: runNow
}