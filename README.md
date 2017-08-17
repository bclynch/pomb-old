# Pack On My Back

## Todos
- Post create page coming along. Nee dto style up the form a bit and add some validation. Set up a submit btn and create post mutation to include our title, subtitle, leadphoto s3 url, and content from the editor.
    - Need to have the img title be written before sending off to s3. Probably want some kind of submit for it to make sure thats done.
    - Would be nice to reuse most of this page as an editor for existing posts too. Can display what the post already has an make changes.
- Create account login/sign up (probably just use laze one)
- Create profile page with user info, maybe favorited posts or some shit. Dunno
- Implement search

## Long Term Todos
- Better error handling
- Mobile friendly fine tooth comb!
- Other hosting options would likely be cheaper than Heroku.
    - https://aws.amazon.com/blogs/aws/amazon-lightsail-the-power-of-aws-the-simplicity-of-a-vps/
    - https://www.digitalocean.com/pricing/

## Project Setup
- `$ ionic start <name> blank`

Running The App
------
*Run in local postgraph/db so no unneeded AWS charges*
    - Localhost 5000 and ionic serve not node server with AWS

### In a Browser
```bash
$ ionic serve
$ postgraphql  --schema pomb,pomb_private --secret some_secret -t pomb.jwt_token  //seperate terminal
```
- Some kind of CORS extension will be needed for cross security issues
    - https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en

## Local Postgraphql Setup
- Run `$ psql -f laze_schema.sql`
- Run `$ psql -f laze_data.sql`
- To update: 
    - Run `$ psql -f schema_drop.sql`
    - Run the above setup again

## Heroku Setup
- Run `$ heroku create <name>`
- Snag required npm modules: `$ npm install express cors body-parser postgraphql --save`
- Add heroku postgre addon to project
- To add data schemas/data with psql:
    - `$ heroku pg:psql --app <app_name> < <file.name>`
- Need to change client.ts uri prop to simply '/graphql' instead of our dev version 'http://localhost:5000/graphql'
- Require in postgraphql to server.js and add following line:
    - app.use(postgraphql('<my_uri>', '<my_schema>', {graphiql: true}));
- Add a Procfile with `web: node server.js` in root of project
- *Important* Remove www/ folder from .gitignore 
- Git add/commit then `$ git push heroku master`
- Activate app with `$ heroku ps:scale web=1`
- Open with `$ heroku open`
- If Heroku is being cranky running `$ heroku restart` resets the dynos and can help
- Make sure Graphql server wired up correctly by visiting root_url/graphiql

## AWS
*AWS allows multiple schemas whereas Heorku does not!*
### Basic Setup
- Install AWS CLI `$ brew install awscli`
- Launch a new RDS instance from AWS console
- Run `$ aws rds describe-db-instances` to check on your db's info
- Change the parameter group of your instance to force ssl. (set to one)
### Connect to Postgres GUI
- http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html
    - In the SSL tab check 'Use SSL' and require it.
- Can right click on a db and select 'Execute SQL File'. Load up the schema then load up any data.
### Connect to psql
- psql --host=<instance_endpoint> --port=<port_number> --username <username> --password --dbname=<dbname>
- psql --host=laze.c0up3bfsdxiy.us-east-1.rds.amazonaws.com --port=5432 --username bclynch --password --dbname=laze
- Make sure you identify the schema with your query statements + semicolons to get it to work properly.
- Need to change the security group setting to allow inbound traffic from anywhere to avoid 503
### Connect with front end
- Add following lines
``` js
var postgraphql = require('postgraphql').postgraphql;
var app = express();
app.use(postgraphql('postgresql://<username>:<password>@<endpoint>:<port#>/<db_name>?sslmode=require&ssl=1', '<schema_name>', {graphiql: true}));
```