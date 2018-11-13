var express = require('express');
var fs = require('fs');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bodyParser = require('body-parser');
var request=require('request');
var mongoose=require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/dist/node-media-server'));
app.get('/listUnFetchedMovies', function (req, res) {
  console.log('Requesting unfetched movies list');
  fs.readdir(__dirname + '/movies', function (err, moviesList) {
    if (err) {
      console.log('Error in getting unfetched movies: ', err);
      res.json({ success: false, data: { msg: 'Something went wrong. Please try again.' } });
    } else {
      const modifiedArray = [];
      moviesList.forEach(moviePath => {
        if (moviePath.indexOf('fetched_') == -1) {
          modifiedArray.push(moviePath);
        }
      });
      res.json({ success: true, data: { msg: 'Successful', data: modifiedArray } });
    }
  });
});

app.get('/listFetchedMovies',function(req,res){
  console.log('Requesting for fetched movies');
  fs.readdir(__dirname+'/movies',function(err,moviesList){
    if(error){
      console.log("Error while getting Fetched Movies: ",err);
      res.json({success:false,data:{msg:"something went wrong ! please try again."}});
    }else{
      const fetched_movie_list=[];
      moviesList.forEach(moviePath=>{
        if(moviePath.indexOf('fetched_')){
          fetched_movie_list.push(moviePath);
        }
      });
       res.json({success:true,data:{msg:'successfully fetched movie list',data:fetched_movie_list}});
    }
  });
});

app.post('/createMovie',function(req,res){
  const movieUrl=req.body.moviePath;
  const imdbId=req.body.imdbId;
  request.get('http://www.omdbapi.com/?i='+imdbId+'&apikey=7c6f180b',{json:true},function(err,res,body){
    if(err){
      console.log('error in getting request data from IMDB: ',err);
      res.json({success:false,data:{msg:'request for IMDB could not respond'}});
    }else{
      console.log(body.url);
      console.log(body.explanation);
       res.json({success:true,data:{msg:'Successful',data:body.explanation}});
    }
  });
});

app.get('/moviesList', function (req, res) {
  console.log('Requesting movies list...');
  fs.readdir(__dirname + '/movies', function (err, moviesList) {
    if (err) {
      console.log('Error in fetching movies list: ', err);
      res.json({ success: false, data: 'Error in fetching movies list' });
    } else {
      res.json({ success: true, data: { msg: 'Movies list fetched successfully', data: moviesList } });
    }
  });
});

app.get('/movie/:path', function (req, res) {
  const path = __dirname + '/movies/' + req.params.path;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/dist/node-media-server/index.html');
});

app.listen(3000, function (err) {
  if (err) {
    console.log('Error in starting server: ', err);
  } else {
    console.log('Server started successfully on port 3000');
  }
});

