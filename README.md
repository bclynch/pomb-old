# Pack On My Back

## Todos

- Define required image sizes + integrate modded buffers with s3
    - Uploads to S3 working with multiple files - check
    - Set up service for methods on front end that cover 'primary' images (with a bunch of sizes) and just normal post images with just one. Would like to have grids for some posts too, so maybe they would have a couple sizes.
    - Finish UI on front end to show image(s) after its uploaded - check
    - Will need another join table with links per image - check
- Using squarespace as a template for building a nice post creation dashboard.
    - Modal for post creation/editing - In progress
    - Dash preview to see posts as they'd look - check
    - Left menu has drafts, scheduled, and published posts. - check
    - Search for within posts (titles, subtitles, content, tags)
    - Need to consider options for mobile (likely just have left menu as entire UI. Can create/edit posts which pops the modal. Will be a button to trigger preview instead of auto there)
    - Validation for the user only seeing their posts
    - Wire up model and get save/submit/delete working
- Create profile page with user info, maybe favorited posts or some shit. Option for valid accounts to create posts if they wish
- Admin page to change certain types of things like hero banner, highlighted posts, or grid design
- Auth validation for certain routes to check logged in state (post create, favorites, profile, etc)

### Bugs

- On load when the JWT has expired it will make the API calls fail. Reloading puts the role back to anonymous and works, but need to make it better experience. Maybe just reload the page if its that error?

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

## Image Sizing

- Hero banner images should be png high res photos
- Card img thumb max size is 240x240
- Max width on mobile is about 150px

https://support.squarespace.com/hc/en-us/articles/206542517-Formatting-your-images-for-display-on-the-web
Squarespace does following:

- 100 pixels
- 300 pixels
- 500 pixels
- 750 pixels
- 1000 pixels
- 1500 pixels
- 2500 pixels

http://www.1dogwoof.com/10-tips-best-image-size-blog/

https://ciphertrick.com/2016/10/24/file-upload-with-angular2-nodejs/

Verge:

Hero Banner: 1200 x 300
grid cards (all) 1200 x 800 - Would be one of the primary src sizes
Card thumb (browser) 280 x 158 (Mobile) 85 x 57 - Primary src sizes

Pics that wont be used anywhere besides in article all seem to have one size for browser/mobile: 

Larger post pictures 1200 x 800  // 3x2
medium post pic 800 x 533  // 3 x 2
small post pic 400 x 267  // 3 x 2

Sizes in src set of primary post picture (for thumbs and banners I think) all 3 x 2

- 2420 x 1613
- 2120 x 1413
- 1820x1213
- 1520 x 1013
- 1220 x 813
- 920 x 613
- 620 x 413
- 320 x 213

For future might be fun to add a watermark too to my images
https://github.com/oliver-moran/jimp/issues/175