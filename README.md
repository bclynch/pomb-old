# Pack On My Back

## Todos

# THE TRICK WHERE YOU CAN PASS IN VARS TO SCSS IS IN THE GRID COMPONENT. CAN MAKE USE OF THAT WITH THE MAP STUFF I THINK

#### Trip report page

- Maybe a vertical progress bar like polar steps horizontal one
- Would like to be able to click a marker (probably end up as a juncture photo or default) for a preview window + quick stats. Can click somehwere in there to open it up fully in the pane.

#### Create/edit post dash

- Would like some kind of alert that intercepts page if user tries to leave if changes need to be saved.
- Search for within posts (titles, subtitles, content, tags)
- Need to consider options for mobile (likely just have left menu as entire UI. Can create/edit posts which pops the modal. Will be a button to trigger preview instead of auto there)
- Validation for the user only seeing their posts

#### Other

- User avatars
- Validation on create juncture modal
- Fix up the img upload functions in the server.
    - Abstract it out of the damn main server itself (look at biotechne scripts for examples of this)
    - Would like to make the endpoint more generic. Aka multiple or single uploads. How many max. Image quality. Image size. All can be img params or something.
- Figure out imgsrc for responsive choice on which size image to display on cards + posts (mostly for the primary photos since those ones have lots of options)
- Admin page to change certain types of things like hero banner, highlighted posts, or grid design
- Auth validation for certain routes to check logged in state (post create, favorites, profile, etc)
- Would like to add some tracking measures. Similar to gizmodo can display views, favs, and comments on posts
    - Google analytics would be nice as well
- Would like to mod the categories a bit. Similar to bikepacking.com in that you can have broader features for topics. Probably backpacking, biking, travel, join, etc. Gear would be a subset for ea category.

### Bugs + Issues

- Need to consider how to retrieve thumbnail for search results. Currently the index doesn't give back the relational options. Need to figure out how to do so (better) or add a prop on the main post object with a link to the thumbnail.
- Mobile navbar jacked up

## Long Term Todos

- Better error handling
- Mobile friendly fine tooth comb!
- Other hosting options would likely be cheaper than Heroku.
    - https://aws.amazon.com/blogs/aws/amazon-lightsail-the-power-of-aws-the-simplicity-of-a-vps/
    - https://www.digitalocean.com/pricing/

## Feature Ideas

It would be fun to work on a few of these things:

**Interactive Map:**
https://developers.google.com/chart/interactive/docs/gallery/geochart
- Create base map that will create the geochart component
- Swap in own API key
- Extend base a ala https://stackoverflow.com/questions/37542408/angular2-google-charts-how-to-integrate-google-charts-in-angular2 for both a selector on the excursion explorer page AND one thats more personal showing places a user has been. Perhaps if one were to click on it it would take them to a hub of posts/tags they have about it? Dunno.
- Popover could be nice maybe.
- For exlorer would be nice to have a hub for each continent. Nice banner a la LP. Also have a map render for the continent so users can click from there

**Excursion Explorer:** 
App interface similar to lonely planet that shows information about various countries. Done this before. Look to those examples.

**Pack Diary:**
A centralized hub that a user can use to keep track of their trip. Look at something like polar steps or whatever for ideas. Probably like a day by day where am I + where'd I go. Could connect with the users blog posts as well. Interactive map would be perfect for this with points along the way that exhibit pictures, posts, etc. Can have a check in feature for users to snag their GPS coordinates to update progress. Maybe another hub to make trips public to inspire others.

**User Profile:**
Could create a front page of sorts for each user that has their own grid or look via user admin panel. Something to share with friends + commemorate trip. Perhaps have a way to show off multiple trips/filter by trip etc.

**Monetization:**
Most features available for free, but some premium like photo caps, private vs public posts, certain features. A couple bucks a year to stay premium. Maybe monthly? Seems like folks would only keep it as long as they're traveling. Maybe one off payments to post for a trip with limits to posts, pictures, etc but once it's there it's always there. Hard to say. 
- https://www.partner.viator.com/partner/home.jspa
- https://www.travelpayouts.com/
- http://developer.ean.com/

## Project Setup

```bash
$ ionic start <name> blank
```

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
Seems like 620 size would cover the grid cards? Maybe need to taker into account hi res?
Card thumb (browser) 280 x 158 (Mobile) 85 x 57 - Primary src sizes

Pics that wont be used anywhere besides in article all seem to have one size for browser/mobile: 

Larger post pictures 1200 x 800  // 3x2
medium post pic 800 x 533  // 3 x 2
small post pic 400 x 267  // 3 x 2

Sizes in src set of primary post picture (for thumbs and banners I think) all 3 x 2

- 2420 x 1613
- 2120 x 1413
- 1820 x 1213
- 1520 x 1013
- 1220 x 813
- 920 x 613
- 620 x 413
- 320 x 213
- 280 x 158 (Browser thumb)
- 85 x 57 (Mobile thumb)

For future might be fun to add a watermark too to my images
https://github.com/oliver-moran/jimp/issues/175