const aws = require('aws-sdk'),
Jimp = require("jimp"),
multer = require('multer'),
upload = multer({ storage: multer.memoryStorage(), fileFilter: imageFilter }),
express = require('express'),
router = express.Router();

aws.config.loadFromPath('./config/aws-config.json');
const photoBucket = new aws.S3({params: {Bucket: 'packonmyback'}});


//Route 
router.post("/", upload.array("uploads[]", 12), (req, res) => {
  //avail query params:
  //quality: number - between 0 - 100 **Required
  //sizes: semicolon seperated wxh i.e -> ?sizes=1220x813;320x213 **Required

  const sizes = req.query.sizes.split(';').map((size) => {
    const sizeArr = size.split('x');
    return { width: +sizeArr[0], height: +sizeArr[1] };
  });
  const quality = +req.query.quality;

  let promises = [];
  //If ever accept png need to change buffer MIME type to be dynamic
  let fileType = 'jpg';

  S3LinksArr = [];

  console.log('files', req.files);
  req.files.forEach((file, i) => {
    let promise = new Promise((resolve, reject) => {

      resizeImagesWriteBuffer(file, sizes, quality, fileType).then((bufferArr) => {
        console.log(`finished file ${i + 1}`);
        console.log('Processed img buffer arr: ', bufferArr);

        let S3PromiseArr = [];

        bufferArr.forEach((obj) => {
          let S3Promise = new Promise((resolve, reject) => { //promise for each size of the image
            //send off to S3
            const key = `${file.originalname.split('.')[0]}-w${obj.width}-${Date.now()}.${fileType}`;
            
            uploadToS3(obj.buffer, key, (err, data) => {
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

//Take in img file, what sizes we would like, and the quality of img
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

router.post("/local", upload.array("uploads[]", 12), (req, res) => {
  //avail query params:
  //quality: number - between 0 - 100 **Required
  //sizes: semicolon seperated wxh i.e -> ?sizes=1220x813;320x213 **Required

  const sizes = req.query.sizes.split(';').map((size) => {
    const sizeArr = size.split('x');
    return { width: +sizeArr[0], height: +sizeArr[1] };
  });
  const quality = +req.query.quality;

  let promises = [];

  console.log('files', req.files);
  req.files.forEach((file, i) => {
    let promise = new Promise((resolve, reject)=>{

      resizeImagesWriteLocal(file, [{width: 2400, height: 1600}, {width: 1200, height: 800}, {width: 600, height: 400}, {width: 300, height: 200}], quality, 'jpg').then(() => {
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

function imageFilter(req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

module.exports = router;