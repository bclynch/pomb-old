const express = require('express'),
bodyParser = require('body-parser'),
cors = require('cors'),
app = express(),
postgraphql = require('postgraphql').postgraphql,
aws = require('aws-sdk'),
S3_BUCKET =  'laze-app',//process.env.S3_BUCKET;
Jimp = require("jimp");
// multer  = require('multer');

app.use(bodyParser.json({limit: '50mb'}));
app.set('port', process.env.PORT || 8080);
app.use(cors()); // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.use(express.static("www")); // Our Ionic app build is in the www folder (kept up-to-date by the Ionic CLI using 'ionic serve')
//https://github.com/postgraphql/postgraphql/blob/d4fd6a4009fea75dbcaa00d743c985148050475e/docs/library.md
// app.use(postgraphql('postgresql://laze_anonymous:abc123@laze.c0up3bfsdxiy.us-east-1.rds.amazonaws.com:5432/laze?sslmode=require&ssl=1', ['laze','laze_private'], {graphiql: true, jwtSecret: new Buffer('some-secret', 'base64'), jwtPgTypeIdentifier: 'laze.jwt_token'})); // pgDefaultRole: 'bclynch'
app.use(postgraphql('postgres://pomb_admin:abc123@localhost:5432', ['pomb','pomb_private'], {graphiql: true, jwtSecret: 'some-secret', jwtPgTypeIdentifier: 'pomb.jwt_token'}));

/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
// app.get('/sign-s3', (req, res) => {
//   const s3 = new aws.S3();
//   const fileName = req.query['file-name'];
//   const fileType = req.query['file-type'];
//   const s3Params = {
//     Bucket: S3_BUCKET,
//     Key: fileName,
//     Expires: 60,
//     ContentType: fileType,
//     ACL: 'public-read'
//   };

//   s3.getSignedUrl('putObject', s3Params, (err, data) => {
//     if(err){
//       console.log(err);
//       return res.end();
//     }
//     const returnData = {
//       signedRequest: data,
//       url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
//     };
//     res.write(JSON.stringify(returnData));
//     res.end();
//   });
// });

// const imageFilter = function (req, file, cb) {
//   // accept image only
//   if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error('Only image files are allowed!'), false);
//   }
//   cb(null, true);
// };

// const upload = multer({ fileFilter: imageFilter });

// app.post('/img-test', upload.array('files', 12), function(req,res){
//   console.log(req.files);
//   //console.log(req);
//   res.end("yes");
// });

// app.post('/photos', upload.array('photos', 12), async (req, res) => {
//   try {
//       console.log(req.body);
//       console.log(req.files);
//       console.log('good grief');

//       res.send(req.files);
//       res.send('fuck');
//   } catch (err) {
//       res.sendStatus(400);
//   }
// })

// function convertImgs(files) {
  
//   let promises = [];

  // _.forEach(files, (file)=>{
  //   let promise = new Promise((resolve, reject)=>{
  //   //Resolve image file type
  //   let type = fileType(file.buffer);

  //   //Create a jimp instance for this image
  //   // new Jimp(file.buffer, (err, image)=>{

  //   //   //Resize this image
  //   //   image.resize(512, 512)
  //   //     //lower the quality by 30%
  //   //     .quality(70)
  //   //     .getBuffer(type.mime, (err, buffer)=>{
  //   //       //Transfer image file buffer to base64 string
  //   //       let base64Image = buffer.toString('base64');
  //   //       let imgSrcString = "data:" + type.mime + ';base64, ' + base64Image;
  //   //       //Resolve base94 string
  //   //       resolve(imgSrcString);
  //   //     });
  //   //   })
  //   });

  //   promises.push(promise);
  // });

  // console.log(files);

  //Return promise array
  //return Promise.all(promises);
// }
var multer = require('multer');
// var storage = multer.diskStorage({
//   // destino del fichero
//   destination: function (req, file, cb) {
//     cb(null, './uploads/')
//   },
//   // renombrar fichero
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

var storage = multer.memoryStorage();

var upload = multer({ storage: storage });

app.post("/upload", upload.array("uploads[]", 12), function (req, res) {
  let promises = [];

  console.log('files', req.files);
  req.files.forEach((file) => {
    console.log(file);
    let promise = new Promise((resolve, reject)=>{
      Jimp.read(file.buffer).then(function (lenna) {
        lenna.resize(1000, Jimp.AUTO)            // resize
                .quality(100)                 // set JPEG quality 80 is like 1/5 the kb of 100
                .write(`./uploads/${file.originalname}`, () => resolve()); // save
      }).catch(function (err) {
          console.error(err);
      });
    });

    promises.push(promise);
  });
  res.send(req.files);
});

// Initialize the app.
app.listen(app.get('port'), function () {
  console.log("You're a wizard, Harry. I'm a what? Yes, a wizard, on port", app.get('port'));
});