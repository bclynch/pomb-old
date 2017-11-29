const convertGPX = require('@mapbox/togeojson'),
fs = require('fs'),
geolib = require('geolib'),
DOMParser = require('xmldom').DOMParser,
multer = require('multer'),
express = require('express'),
router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage });

var gpx = new DOMParser().parseFromString(fs.readFileSync('./test.gpx', 'utf8'));

var converted = convertGPX.gpx(gpx);

// console.log(JSON.stringify(converted));

//Route 
router.post("/", upload.array("uploads[]", 5), (req, res) => {
  const files = req.files;
  const name = files[0].originalname;

  var gpx = new DOMParser().parseFromString(fs.readFileSync(`./temp/${name}`, 'utf8'));
  var converted = convertGPX.gpx(gpx);

  const totalDistance = getTotalDistance(converted.features[0].geometry.coordinates);
  console.log('TOTAL DISTANCE in kms: ', totalDistance / 1000);
  converted.features[0].totalDistance = totalDistance;

  const speeds = getSpeedArr(converted.features[0].geometry.coordinates, converted.features[0].properties.coordTimes);
  converted.features[0].speedsArr = speeds;

  fs.unlink(`./temp/${name}`, () => console.log('deleted temp file')); 

  res.send(JSON.stringify({data: converted}));
});

//take in coord arr and find total distance
function getTotalDistance(arr) {
  totalDistance = 0;

  for(let i = 0; i < arr.length; i++) {
    if(i < arr.length - 1) {
      totalDistance += geolib.getDistance(
        { latitude: arr[i][1], longitude: arr[i][0] },
        { latitude: arr[i + 1][1], longitude: arr[i + 1][0] }
      );
    }
  }

  return totalDistance;
}

function getSpeedArr(geoArr, timeArr) {
  let speedsArr = [];
  for(let i = 0; i < geoArr.length; i++) {
    if(i < geoArr.length - 1) {
      speedsArr.push(geolib.getSpeed(
        { lat: geoArr[i][1], lng: geoArr[i][0], time: Date.parse(timeArr[i]) },
        { lat: geoArr[i + 1][1], lng: geoArr[i + 1][0], time: Date.parse(timeArr[i + 1]) }
      ));
    }
  }

  return speedsArr;
}

module.exports = router;