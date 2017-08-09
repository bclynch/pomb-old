const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const postgraphql = require('postgraphql').postgraphql;

app.use(bodyParser.json());
app.set('port', process.env.PORT || 8080);
app.use(cors()); // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.use(express.static("www")); // Our Ionic app build is in the www folder (kept up-to-date by the Ionic CLI using 'ionic serve')
//https://github.com/postgraphql/postgraphql/blob/d4fd6a4009fea75dbcaa00d743c985148050475e/docs/library.md
// app.use(postgraphql('postgresql://bclynch:Bear2013@testinstance.c0up3bfsdxiy.us-east-1.rds.amazonaws.com:5432/testdb?sslmode=require&ssl=1', 'recipe_example', {graphiql: true, jwtSecret: 'some-secret', pgDefaultRole: 'laze_anonymous'}));
app.use(postgraphql('postgresql://laze_anonymous:abc123@laze.c0up3bfsdxiy.us-east-1.rds.amazonaws.com:5432/laze?sslmode=require&ssl=1', ['laze','laze_private'], {graphiql: true, jwtSecret: 'some-secret', jwtPgTypeIdentifier: 'laze.jwt_token'})); // pgDefaultRole: 'bclynch'

// Initialize the app.
app.listen(app.get('port'), function () {
    console.log("You're a wizard, Harry. I'm a what? Yes, a wizard, on port", app.get('port'));
});