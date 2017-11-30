const convertGPX = require('@mapbox/togeojson'),
fs = require('fs'),
geolib = require('geolib'),
DOMParser = require('xmldom').DOMParser,
multer = require('multer'),
tempFolderPath = './tempFiles/',
express = require('express'),
router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempFolderPath)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage });

var gpx = new DOMParser().parseFromString(fs.readFileSync('./test.gpx', 'utf8'));

var converted = convertGPX.gpx(gpx);

// console.log(JSON.stringify(converted));

let convertedTimeArr = [];
let distanceArr = [];

//Route 
router.post("/", upload.array("uploads[]", 5), (req, res) => {
  const files = req.files;
  const name = files[0].originalname;

  var gpx = new DOMParser().parseFromString(fs.readFileSync(`${tempFolderPath}${name}`, 'utf8'));
  var converted = convertGPX.gpx(gpx);

  const totalDistance = getTotalDistance(converted.features[0].geometry.coordinates);
  console.log('TOTAL DISTANCE in kms: ', totalDistance / 1000);
  converted.features[0].totalDistance = totalDistance;

  const speeds = getSpeedArr(converted.features[0].geometry.coordinates, converted.features[0].properties.coordTimes);
  converted.features[0].speedsArr = speeds;

  converted.timeArr = convertedTimeArr.slice(0);
  convertedTimeArr = [];

  converted.distanceArr = distanceArr.slice(0);
  distanceArr = [];

  fs.unlink(`${tempFolderPath}${name}`, () => {
    console.log('deleted temp file');

    res.send(JSON.stringify({data: converted}));
  }); 
});

//take in coord arr and find total distance
function getTotalDistance(arr) {
  totalDistance = 0;

  for(let i = 0; i < arr.length; i++) {
    if(i < arr.length - 1) {
      const distance = geolib.getDistance(
        { latitude: arr[i][1], longitude: arr[i][0] },
        { latitude: arr[i + 1][1], longitude: arr[i + 1][0] }
      );

      totalDistance += distance;
      distanceArr.push(totalDistance);
    }
  }
  //copying the last elem and pushing to end of arr so it has same count as coord arr.
  distanceArr.splice(distanceArr.length - 1, 0, distanceArr[distanceArr.length - 1]);

  return totalDistance;
}

function getSpeedArr(geoArr, timeArr) {
  let speedsArr = [];
  console.log(Date.parse(timeArr[0]));
  for(let i = 0; i < geoArr.length; i++) {
    if(i < geoArr.length - 1) {
      const timeToMs = Date.parse(timeArr[i]);
      convertedTimeArr.push(timeToMs);
      speedsArr.push(geolib.getSpeed(
        { lat: geoArr[i][1], lng: geoArr[i][0], time: timeToMs },
        { lat: geoArr[i + 1][1], lng: geoArr[i + 1][0], time: Date.parse(timeArr[i + 1]) }
      ));
    }
  }
  //copying the last elem and pushing to end of arr so it has same count as coord arr. Same for times
  speedsArr.splice(speedsArr.length - 1, 0, speedsArr[speedsArr.length - 1]);
  convertedTimeArr.splice(convertedTimeArr.length - 1, 0, convertedTimeArr[convertedTimeArr.length - 1])

  return speedsArr;
}

module.exports = router;