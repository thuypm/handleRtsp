module.exports = function(io){
  var fs = require("fs");
    var { v4: uid } = require('uuid') // sinh ra mã ngẫu nhiên theo thời gian thực 
    var chokidar = require('chokidar')
    var listProcess = [];
    var child_process = require('child_process');

    async function deleteAllFile(path) {
      if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
          var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
        fs.rmdirSync(path);
      }
    };

    io.sockets.on('connection', function(socket){
      socket.on('join-a-video-stream',async (linkRtsp)=>{
        let rooms = Object.keys(socket.rooms);
        if(rooms.indexOf(linkRtsp) == -1) // cái này để kiểm tra ko bị join 2 lần
        {
          socket.join(linkRtsp);  // join room cái đã
          io.in(linkRtsp).clients(async (error, client) => {
            console.log('emit')
          if (error) throw error;
          if(client.length <= 1)  // xem room này đã tạo process nào chưa
          {
            var idVideo = uid();
            var linkFolder = (await fs.mkdirSync('./public/videoStream/'+ idVideo,{recursive: true}));
            var dirVideo = 'public/videoStream/'+ idVideo + '/streaming.m3u8';
            var args = [
            "-rtsp_transport", "tcp",
            "-i",
            linkRtsp,
            "-c",
            "copy",
            '-b:v', '800k',
            "-hls_time",
            "2",
            "-hls_wrap",
            "3",
            dirVideo
            ];
           var fmp = child_process.spawn("ffmpeg", args);// khởi tạo process
           // fmp.stderr.on('data', (data) => {
           //      // console.log('linkRtsp');
           //    });
           var idProcess = listProcess.push({
            linkRtsp: linkRtsp,
            linkVideo: dirVideo.slice(dirVideo.indexOf('videoStream')),// cắt ghép cho phù hợp với dir config trong express
            process: fmp
          }) 
         }; // end of if(not exist)

        var prc = listProcess.find((item)=> item.linkRtsp == linkRtsp);// sau đó đợi khởi tạo xong sẽ gửi link video về
        var fileWatcher = chokidar.watch('./public/' + prc.linkVideo.slice(0, prc.linkVideo.indexOf('/streaming')));
        fileWatcher.on('change', (path, err)=>{
          socket.emit('response-video' ,prc.linkVideo);
          fileWatcher.unwatch();
          fileWatcher.close();
        })
      }); 
        }  }) ;
      socket.on('disconnecting',async (reason) => {
        let rooms = Object.keys(socket.rooms);
          var realRooms = rooms.filter((item)=> item != socket.id); // lọc ra các room không trùng với socketID
          console.log('real', realRooms);
          for(room of realRooms)

          {
            console.log('73',room);
            await io.in(room).clients(async (error, cli) => { // xóa thư mục và kill process
              if (error) throw error;
              client = cli.filter((item)=> item != socket.id);
              console.log('destroy;', client);
              if(client.length <1) 
              {
                var idx = listProcess.findIndex((item)=> item.linkRtsp == room);
                console.log('now', listProcess[idx].linkRtsp);
                await listProcess[idx].process.kill();
                await deleteAllFile('./public/'+listProcess[idx].linkVideo.slice(0, listProcess[idx].linkVideo.indexOf('/streaming')));
                listProcess.splice(idx, 1);
              }
            })
          }
        });

    })

  }