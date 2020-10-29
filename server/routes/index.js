var express = require('express');
var router = express.Router();
var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
// var bac = require('../public/video/a');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('hls', { title: 'HLS' });
});
router.get('/lp', function(req, res, next) {
	res.json({cc: 'cc'});
});
// router.get('/demo', function(req, res, next) {
// 	res.render('useHlc', { title: 'Express' });
// });

router.post('/getRtspVideo',async function(req, res, next) {
	var cmd = 'ffmpeg -i "' +req.body.rtspLink+  '" -c copy -hls_time 2 -hls_wrap 5 "public/video/streaming.m3u8"';
	var args = [
	"-rtsp_transport", "tcp",
	"-i",
	req.body.rtspLink,
	"-c",
	"copy",
	'-b:v', '800k',
	"-hls_time",
	"2",
	"-hls_wrap",
	"3",
	"public/video/streaming.m3u8"
	];
	var sd = 0;

	var files = await  fs.readdirSync('public/video'); // xóa các file cũ
	for (const file in files) {
		await  fs.unlinkSync(path.join("public/video", files[file]));
	}
	var fmp = child_process.spawn("ffmpeg", args);// khởi tạo process mới
	fmp.stdout.on("data", (data)=>{
	})
	fmp.stderr.on('data', (data) => {
		if(!sd && (data.toString()).indexOf("for writing") != -1)
		{
			sd = 1;
			res.send("1");
		}
		console.error(data.toString());
	});

	fmp.on('close', (code) => {
		console.log(`Child exited with code ${code}`); 
	});	
});

module.exports = router;
