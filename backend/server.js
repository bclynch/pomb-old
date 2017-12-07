const express = require('express'),
bodyParser = require('body-parser'),
cors = require('cors'),
app = express(),
postgraphql = require('postgraphql').postgraphql;

// pg testing
var pg = require('pg');
var PGUSER = 'pomb_admin';
var PGDATABASE = 'bclynch';

var config = {
  user: PGUSER, // name of the user account
  database: PGDATABASE, // name of the database
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);
var myClient;

app.use(bodyParser.json({limit: '50mb'}));
app.set('port', process.env.PORT || 8080);
app.use(cors()); // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.use(express.static("www")); // Our Ionic app build is in the www folder (kept up-to-date by the Ionic CLI using 'ionic serve')
//https://github.com/postgraphql/postgraphql/blob/d4fd6a4009fea75dbcaa00d743c985148050475e/docs/library.md
// app.use(postgraphql('postgresql://laze_anonymous:abc123@laze.c0up3bfsdxiy.us-east-1.rds.amazonaws.com:5432/laze?sslmode=require&ssl=1', ['laze','laze_private'], {graphiql: true, jwtSecret: new Buffer('some-secret', 'base64'), jwtPgTypeIdentifier: 'laze.jwt_token'})); // pgDefaultRole: 'bclynch'
app.use(postgraphql('postgres://pomb_anonymous:abc123@localhost:5432/bclynch', ['pomb','pomb_private'], {graphiql: true, jwtSecret: 'some-secret', jwtPgTypeIdentifier: 'pomb.jwt_token'}));

//routes
app.use('/upload-images', require('./imageUpload'));
app.use('/upload-gpx', require('./gpxProcessing'));


// pool.connect(function (err, client, done) {
//   if (err) console.log(err);
//   myClient = client;
//   myClient.query("INSERT INTO pomb.post_tag(name, tag_description) VALUES ('Example', 'Sweet');", function (err, result) {
//     if (err) {
//       console.log(err);
//     }
//     console.log(JSON.stringify(result));
//   })
// })


// Initialize the app.
app.listen(app.get('port'), () => console.log("You're a wizard, Harry. I'm a what? Yes, a wizard, on port", app.get('port')) );