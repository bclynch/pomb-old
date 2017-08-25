const express = require('express'),
bodyParser = require('body-parser'),
cors = require('cors'),
app = express(),
postgraphql = require('postgraphql').postgraphql,
aws = require('aws-sdk'),
S3_BUCKET =  'laze-app',//process.env.S3_BUCKET;
Jimp = require("jimp"),
multer = require('multer'),
upload = multer({ storage: multer.memoryStorage(), fileFilter: imageFilter });

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

aws.config.loadFromPath('./config/aws-config.json');
const photoBucket = new aws.S3({params: {Bucket: 'laze-app'}});

function uploadToS3(buffer, destFileName, callback) {
  photoBucket
    .upload({
        ACL: 'public-read', 
        Body: buffer, //fs.createReadStream(file.path)
        Key: destFileName.toString(), //randomized key. I probably just want to do name + width + type like to disk ex
        ContentType: 'application/octet-stream' // force download if it's accessed as a top location
    })
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event
    // .on('httpUploadProgress', function(evt) { console.log(evt); })
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#send-property
    .send(callback);
}

function imageFilter(req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

///////////////////////////////////////////////////////
///////////////////Save To S3
///////////////////////////////////////////////////////

// app.post("/upload", upload.array("uploads[]", 12), function (req, res) {
//   let promises = [];

//   console.log('files', req.files);
//   req.files.forEach((file, i) => {
//     let promise = new Promise((resolve, reject)=>{

//       resizeImage(file, [{width: 300, height: 200}], 80, 'jpg').then((buffer) => {
//         console.log(`finished file ${i + 1}`);
//         console.log('Processed img buffer: ', buffer);

//         //send off to S3
//         var pid = '10000' + parseInt(Math.random() * 10000000);
        
//         uploadToS3(buffer, pid, function (err, data) {
//           if (err) console.error(err);
//           console.log('DATA LOCATION: ', data.Location); //URL where the image is. Need to save this to our db. Can use the width of the size we will send along to this point to identify how to save this to our table
//           console.log('File uploaded to S3: ' + data.Location.replace(/</g, '&lt;') + ' src would be ' + data.Location.replace(/"/g, '&quot;'));
//           resolve();
//         });
//       });
//     });

//     promises.push(promise);
//   });
//   console.log(promises);
//   Promise.all(promises).then(() => {
//     console.log('promise all complete');
//     res.send(JSON.stringify({result: 'Processing complete'}));
//   });
// });

// function resizeImage(file, sizes, quality, type) {
//   return new Promise((resolve, reject)=>{
//     Jimp.read(file.buffer).then(function (img) {
//       console.log('ready to buffer')
//       sizes.forEach((size, i) => {
//         img.cover(size.width, size.height)  // resize to specific dimensions. Looks like the best way to do it. Crops a little on edges to maintain scale
//           .quality(quality)                 // set JPEG quality 80 is like 1/5 the kb of 100
//           .getBuffer(Jimp.AUTO, (err, buffer) => { // grabbing as buffer. 
//             //callback to resolve
//             console.log('Something from the buffer callback?', buffer);
//             console.log(`finished size ${i + 1}`);
//             resolve(buffer);
//           });
//       });
//     }).catch(function (err) {
//         console.error(err);
//         reject();
//     });
//   });
// }


///////////////////////////////////////////////////////
///////////////////Save To uploads folder
///////////////////////////////////////////////////////

app.post("/upload", upload.array("uploads[]", 12), function (req, res) {
  let promises = [];

  console.log('files', req.files);
  req.files.forEach((file, i) => {
    let promise = new Promise((resolve, reject)=>{

      resizeImages(file, [{width: 2400, height: 1600}, {width: 1200, height: 800}, {width: 600, height: 400}, {width: 300, height: 200}], 80, 'jpg').then(() => {
        console.log(`finished file ${i + 1}`);
        resolve();
      });
    });

    promises.push(promise);
  });
  console.log(promises);
  Promise.all(promises).then(() => {
    console.log('promise all complete');
    res.send(JSON.stringify({result: 'Processing complete'}));
  });
});

function resizeImages(file, sizes, quality, type) {
  return new Promise((resolve, reject)=>{
    Jimp.read(file.buffer).then(function (img) {
      console.log('ready to buffer')
      sizes.forEach((size, i) => {
        img.cover(size.width, size.height)  // resize to specific dimensions. Looks like the best way to do it. Crops a little on edges to maintain scale
          .quality(quality)                 // set JPEG quality 80 is like 1/5 the kb of 100
          .write(`./uploads/${file.originalname.split('.')[0]}-w${size.width}.${type}`); // save to uploads folder // eventually will just be uploading the buffer to s3
          console.log(`finished size ${i + 1}`);
      });
      resolve();
    }).catch(function (err) {
        console.error(err);
        reject();
    });
  });
}

// Initialize the app.
app.listen(app.get('port'), function () {
  console.log("You're a wizard, Harry. I'm a what? Yes, a wizard, on port", app.get('port'));
});