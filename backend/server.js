const express = require('express'),
bodyParser = require('body-parser'),
cors = require('cors'),
app = express(),
postgraphql = require('postgraphql').postgraphql,
aws = require('aws-sdk'),
Jimp = require("jimp"),
multer = require('multer'),
upload = multer({ storage: multer.memoryStorage(), fileFilter: imageFilter });

app.use(bodyParser.json({limit: '50mb'}));
app.set('port', process.env.PORT || 8080);
app.use(cors()); // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.use(express.static("www")); // Our Ionic app build is in the www folder (kept up-to-date by the Ionic CLI using 'ionic serve')
//https://github.com/postgraphql/postgraphql/blob/d4fd6a4009fea75dbcaa00d743c985148050475e/docs/library.md
// app.use(postgraphql('postgresql://laze_anonymous:abc123@laze.c0up3bfsdxiy.us-east-1.rds.amazonaws.com:5432/laze?sslmode=require&ssl=1', ['laze','laze_private'], {graphiql: true, jwtSecret: new Buffer('some-secret', 'base64'), jwtPgTypeIdentifier: 'laze.jwt_token'})); // pgDefaultRole: 'bclynch'
app.use(postgraphql('postgres://pomb_admin:abc123@localhost:5432/bclynch', ['pomb','pomb_private'], {graphiql: true, jwtSecret: 'some-secret', jwtPgTypeIdentifier: 'pomb.jwt_token'}));

function imageFilter(req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

aws.config.loadFromPath('./config/aws-config.json');
const photoBucket = new aws.S3({params: {Bucket: 'laze-app'}});

///////////////////////////////////////////////////////
///////////////////Save To S3
///////////////////////////////////////////////////////

function uploadToS3(buffer, destFileName, callback) {
  return new Promise((resolve, reject) => {
    photoBucket
      .upload({
          ACL: 'public-read', 
          Body: buffer,
          Key: destFileName, // file name
          ContentType: 'application/octet-stream' // force download if it's accessed as a top location
      })
      // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event
      // .on('httpUploadProgress', function(evt) { console.log(evt); })
      // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#send-property
      .send(callback);
    });
}

//endpoint uploads a bunch of different sizes since this will be primary photo for a post and used for banners, icons etc
app.post("/upload-primary", upload.array("uploads[]", 1), function (req, res) {
  let promises = [];
  //If ever accept png need to change buffer MIME type to be dynamic
  let fileType = 'jpg';

  S3LinksArr = [];

  console.log('files', req.files);
  req.files.forEach((file, i) => {
    let promise = new Promise((resolve, reject) => {

      resizeImagesWriteBuffer(file, [{width: 300, height: 200}, {width:2400, height: 1600}], 80, fileType).then((bufferArr) => {
        console.log(`finished file ${i + 1}`);
        console.log('Processed img buffer arr: ', bufferArr);

        let S3PromiseArr = [];

        bufferArr.forEach((obj) => {
          let S3Promise = new Promise((resolve, reject)=> { //promise for each size of the image
            //send off to S3
            const key = `${file.originalname.split('.')[0]}-w${obj.width}-${Date.now()}.${fileType}`;
            
            uploadToS3(obj.buffer, key, function (err, data) {
              if (err) {
                console.error(err)
                reject(err);
              };
              S3LinksArr.push({size: obj.width, url: data.Location});
              resolve();
            });
          });
          S3PromiseArr.push(S3Promise);
        });
        Promise.all(S3PromiseArr).then(() => {
          console.log('S3 upload promise all complete');
          resolve(); //resolve for resize img promise
        });
      });
    });

    promises.push(promise);
  });
  console.log(promises);
  Promise.all(promises).then(() => {
    console.log('promise all complete');
    res.send(JSON.stringify(S3LinksArr));
  });
});

app.post("/upload-post-photo/:size", upload.array("uploads[]", 1), function (req, res) {
  //If ever accept png need to change buffer MIME type to be dynamic
  let fileType = 'jpg';
  const file = req.files[0];
  const size = req.params.size;
  const dimensions = size === 'large' ? {width: 800, height: 533} : {width: 400, height: 267};

  resizeImagesWriteBuffer(file, [dimensions], 80, fileType).then((bufferArr) => {
    console.log('Processed img buffer arr: ', bufferArr);
    const buffer = bufferArr[0];

    const key = `${file.originalname.split('.')[0]}-w${buffer.width}-${Date.now()}.${fileType}`;
    
    uploadToS3(buffer.buffer, key, function (err, data) {
      if (err) {
        console.error(err)
        reject(err);
      };
      res.send(JSON.stringify({size: buffer.width, url: data.Location}));
    });
  });
});

//endpoint to upload banner img
app.post("/upload-hero-banner", upload.array("uploads[]", 1), function (req, res) {
  //If ever accept png need to change buffer MIME type to be dynamic
  let fileType = 'jpg';
  const file = req.files[0];

  resizeImagesWriteBuffer(file, [{ width: 1200, height: 300 }], 80, fileType).then((bufferArr) => {
    console.log('Processed img buffer arr: ', bufferArr);
    const buffer = bufferArr[0];

    const key = `${file.originalname.split('.')[0]}-w${buffer.width}-${Date.now()}.${fileType}`;
    
    uploadToS3(buffer.buffer, key, function (err, data) {
      if (err) {
        console.error(err)
        reject(err);
      };
      res.send(JSON.stringify({size: buffer.width, url: data.Location}));
    });
  });
});

//endpoint to upload gallery imgs
app.post("/upload-gallery", upload.array("uploads[]", 12), function (req, res) {
  let promises = [];
  //If ever accept png need to change buffer MIME type to be dynamic
  let fileType = 'jpg';

  S3LinksArr = [];

  console.log('files', req.files);
  req.files.forEach((file, i) => {
    let promise = new Promise((resolve, reject) => {

      resizeImagesWriteBuffer(file, [{width: 1220, height: 813}], 80, fileType).then((bufferArr) => {
        console.log(`finished file ${i + 1}`);
        console.log('Processed img buffer arr: ', bufferArr);

        let S3PromiseArr = [];

        bufferArr.forEach((obj) => {
          let S3Promise = new Promise((resolve, reject)=> { //promise for each size of the image
            //send off to S3
            const key = `${file.originalname.split('.')[0]}-w${obj.width}-${Date.now()}.${fileType}`;
            
            uploadToS3(obj.buffer, key, function (err, data) {
              if (err) {
                console.error(err)
                reject(err);
              };
              S3LinksArr.push({size: obj.width, url: data.Location});
              resolve();
            });
          });
          S3PromiseArr.push(S3Promise);
        });
        Promise.all(S3PromiseArr).then(() => {
          console.log('S3 upload promise all complete');
          resolve(); //resolve for resize img promise
        });
      });
    });

    promises.push(promise);
  });
  console.log(promises);
  Promise.all(promises).then(() => {
    console.log('promise all complete');
    res.send(JSON.stringify(S3LinksArr));
  });
});

function resizeImagesWriteBuffer(file, sizes, quality, type) {
  return new Promise((resolve, reject)=> { //promise for the overall resize img function
    Jimp.read(file.buffer).then(function (img) {
      console.log('ready to buffer')
      let bufferPromiseArr = [];
      let finishedBuffersArr = [];
      sizes.forEach((size, i) => {

        let promise = new Promise((resolve, reject)=> { //promise for each size of the image
          img.clone()                      // Makes a copy because otherwise some of these methods mutate the original
          .cover(size.width, size.height)  // resize to specific dimensions. Looks like the best way to do it. Crops a little on edges to maintain scale
          .quality(quality)                 // set JPEG quality 80 is like 1/5 the kb of 100
          .getBuffer(Jimp.MIME_JPEG, (err, buffer) => { // grabbing as buffer. 
            console.log(`Buffer for img size ${size.width}`, buffer);
            console.log(`finished size ${i + 1}`);
            finishedBuffersArr.push({buffer, width: size.width});
            resolve(); // resolve for ea size img
          });
        });
        bufferPromiseArr.push(promise);

      });
      Promise.all(bufferPromiseArr).then(() => {
        console.log('resize img promise all complete');
        resolve(finishedBuffersArr); // resolve for resize img fn promise
      });
    }).catch(function (err) {
        console.error(err);
        reject();
    });
  });
}


///////////////////////////////////////////////////////
///////////////////Save To uploads folder
///////////////////////////////////////////////////////

app.post("/upload-local", upload.array("uploads[]", 12), function (req, res) {
  let promises = [];

  console.log('files', req.files);
  req.files.forEach((file, i) => {
    let promise = new Promise((resolve, reject)=>{

      resizeImagesWriteLocal(file, [{width: 2400, height: 1600}, {width: 1200, height: 800}, {width: 600, height: 400}, {width: 300, height: 200}], 80, 'jpg').then(() => {
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

function resizeImagesWriteLocal(file, sizes, quality, type) {
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