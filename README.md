# Pack On My Back

## Todos

### Top Priorities

- Finish juncture creation modal
    - gpx upload component is uploading every time user adds something. Should ONLY be when they save
- Work on separate page for junctures beyond the trip viewer for more information like data if avail and otherwise. Could show graphs, map with specific part visited etc.
    - Need metric / imperial conversion for graphs / data (total distance, elevation climbed / descended / flat) -- Did the stats on juncture page. Need to hold this info in settings based on local storage and have toggles around where required. Need to do for chart data
    - Component for toggle imperial / metric
    - Need to add posts, photos, description
- Linode Hosting
- Mobile usage!
- Would be nice to have a trip page thats a little more static, but graphical. Shows all junctures, posts, photos, stats in some nice way.
    - junctures (bubble looking things and maybe they animate / scroll if there are enough of them)(also have an 'all junctures' page that displays chronological in a nice vertical timeline look)
        - Need banner img for timeline page
    - gallery + all photos page w/ infinite scroll
    - couple stats (countries, distance, w/e)
- Place newsletter component around (one of the nav shades, blog posts, w/e)
- Can probably pare down the nav to just the following: -- in progress
    - Community
        - Shade would have social links for POMB, link / design to community hub, featured members/trips?
        - Community hub would have featured or recent trips, nice map with curated trips on it, suggested people
    - Stories
        - Shade would have link + icon to main blog page (current main page), featured posts, categories links
        - Blog itself would be curated list of posts
        - Route would be /stories and /stories?tag=some-tag and /stories/postId
    - Profile
        - Shade would have nice layout to get to settings, some quick links/btns for trips/junctures, etc
        - Profile page would be like facebook in that what you see is what a vistor would see, but you have the ability to edit some stuff. Posts, pics, trips assembled nicely
        - Route for trips should user/trip/name-of-trip
        - Juncture could be user/trip/name-of-trip/juncture/name-of-juncture
- Footer needs a pick me up
- Context dependent search (blog posts, trip info, users)
- Better error handling
- Make sure ready to take live https://github.com/thedaviddias/Front-End-Checklist

*AFTER ONLINE*

- Flesh out user profile - Would be nice to have stats for countries visited + % of world etc
- DB security
- Google Analytics
- Share buttons for posts / trips / junctures - in progress
- Add to data model for views / likes
- Need a way for user to reorder junctures or perhaps just by time ... need to consider
- Admin panels
- Favorites / 'add to pack' for posts, images, trips
- Figure out what main page looks like (thinking a combo of liked/followed subs if you're logged in otherwise curated for non logged in. Sort of a newsfeed for better or worse)
    - uber eats, stripe, fresh desk
- Figure out what main hub pages look like. --> trips hub, explore hub, etc
- Think about sub trips ? i.e. a trek in the middle of a longer trip - Detour!
- Password Retrieval + mailing on new account
- Map view of trips users have posted + some kind of way to explore various places
- Open graph stuff http://ogp.me/

#### Create/edit post dash

- Would like some kind of alert that intercepts page if user tries to leave if changes need to be saved.
- Search for within posts (titles, subtitles, content, tags)
- Need to consider options for mobile (likely just have left menu as entire UI. Can create/edit posts which pops the modal. Will be a button to trigger preview instead of auto there)
- Validation for the user only seeing their posts

#### Explore Pages
- Begin populating country/city/region etc pages
- Consider how we would like to organize much of the information. Probably need separate pages for certain features since don't really want to pull down all that data ea time. Might be better when server caching enabled...
- Climate for country/region level can have maybe five cities pinned with their precip/temp over the course of year in a little popover

#### Other

- Validation on create juncture modal
- Figure out imgsrc for responsive choice on which size image to display on cards + posts (mostly for the primary photos since those ones have lots of options)
- Admin page to change certain types of things like hero banner, highlighted posts, or grid design
- Auth validation for certain routes to check logged in state (post create, favorites, profile, etc)
- Would like to add some tracking measures. Similar to gizmodo can display views, favs, and comments on posts
    - Google analytics required as well https://github.com/angulartics/angulartics2

#### Analytics

- Wire in Google analytics for page views - check
- Wire in analytics for events
    - Create post
    - Create juncture
    - Create Trip
    - Upload photos
    - ...

### Bugs + Issues

- Need to consider how to retrieve thumbnail for search results. Currently the index doesn't give back the relational options. Need to figure out how to do so (better) or add a prop on the main post object with a link to the thumbnail.
- Need to redraw geo map on regions when changing region (doesn't destroy the original element)
- Fix transition on mobile nav. Probably some kind of fade in with no moving transition. https://forum.ionicframework.com/t/adding-custom-transitions-custom-modal-transition/75924/3

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

## Linode

### Updating Servers

- Server should be updated frequently with the following:
    - `$ apt-get update && apt-get upgrade`

### Getting Started

- https://www.linode.com/docs/getting-started
    - Follow the above instructions for setting up + adding security measures
        - Make sure to reboot for hostname to take effect
    - When setting up the hostname it must be edited correct in the /etc/hosts file. To check run the following:
        - `$ cat /etc/hosts`
    - If it just says local host you need to edit it. Enter in with `$ sudo nano /etc/hosts`
    - To make sure it works run `$ sudo true` and you shouldn't get an error

### Connect Via Terminal

- Go to remote access page https://manager.linode.com/linodes/remote_access/linode4207486
- Take four numbers up to the slash in the first of the public ips
- Enter `$ ssh bclynch@50.116.9.92` in your terminal

### Setup Instructions

#### Create Server

- Setup Ubuntu 16.04LTS server with appropriate security measures per directions in the getting started section above

### nginx

#### Installation

https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04

`$ sudo apt-get install nginx`

- Before we can test Nginx, we need to reconfigure our firewall software to allow access to the service. Nginx registers itself as a service with ufw, our firewall, upon installation.

`$ sudo ufw app list`

- It is recommended that you enable the most restrictive profile that will still allow the traffic you've configured. Since we haven't configured SSL for our server yet, in this guide, we will only need to allow traffic on port 80.

`$ sudo ufw allow 'Nginx HTTP'`

- At the end of the installation process, Ubuntu 16.04 starts Nginx. The web server should already be up and running.

`$ systemctl status nginx`

- See if the server is up and running at your ipaddress http://50.116.9.92/

#### Commands

- To stop your web server, you can type:

`$ sudo systemctl stop nginx`
- To start the web server when it is stopped, type:

`$ sudo systemctl start nginx`
- To stop and then start the service again, type:

`$ sudo systemctl restart nginx`
- If you are simply making configuration changes, Nginx can often reload without dropping connections. To do this, this command can be used:

`$ sudo systemctl reload nginx`
- By default, Nginx is configured to start automatically when the server boots. If this is not what you want, you can disable this behavior by typing:

`$ sudo systemctl disable nginx`
- To re-enable the service to start up at boot, you can type:

`$ sudo systemctl enable nginx`

#### Files + Directories

**Content**

/var/www/html: The actual web content, which by default only consists of the default Nginx page you saw earlier, is served out of the /var/www/html directory. This can be changed by altering Nginx configuration files.

To change the directory being served:

`$ sudo nano /etc/nginx/sites-enabled/default`

- Change the 'root' path to wherever your dist/www folder is
- Will need to restart nginx with `$ sudo systemctl restart nginx`

**Server Configuration**

/etc/nginx: The nginx configuration directory. All of the Nginx configuration files reside here.

/etc/nginx/nginx.conf: The main Nginx configuration file. This can be modified to make changes to the Nginx global configuration.

/etc/nginx/sites-available/: The directory where per-site "server blocks" can be stored. Nginx will not use the configuration files found in this directory unless they are linked to the sites-enabled directory (see below). Typically, all server block configuration is done in this directory, and then enabled by linking to the other directory.

/etc/nginx/sites-enabled/: The directory where enabled per-site "server blocks" are stored. Typically, these are created by linking to configuration files found in the sites-available directory.

/etc/nginx/snippets: This directory contains configuration fragments that can be included elsewhere in the Nginx configuration. Potentially repeatable configuration segments are good candidates for refactoring into snippets.

**Server Logs**

/var/log/nginx/access.log: Every request to your web server is recorded in this log file unless Nginx is configured to do otherwise.

/var/log/nginx/error.log: Any Nginx errors will be recorded in this log.

#### SSL Registration
- https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04

#### Configuring multiple domains on one server

- https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04

## Bash

### Handy Commands:
- Open file in editor
    - `$ sudo nano <path>`
    - ^x to quit then y to save
- Remove folder and all contents
    - `$ rm -rf <name>`
- Create folder
    - `$ mkdir <name>`
- Create file
    - `$ touch <name>`

## PM2

- https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
- PM2 provides an easy way to manage and daemonize applications (run them in the background as a service).
- Applications that are running under PM2 will be restarted automatically if the application crashes or is killed, but an additional step needs to be taken to get the application to launch on system startup (boot or reboot).

### Start App

- `$ pm2 start <file>`

- The startup subcommand generates and configures a startup script to launch PM2 and its managed processes on server boots:

- `$ pm2 startup systemd`

- Run the command that was generated to set PM2 up to start on boot

- This will create a systemd unit which runs pm2 for your user on boot. This pm2 instance, in turn, runs hello.js. You can check the status of the systemd unit with systemctl:

- `$ systemctl status pm2-bclynch`

### Sub Commands

PM2 provides many subcommands that allow you to manage or look up information about your applications. Note that running pm2 without any arguments will display a help page, including example usage, that covers PM2 usage in more detail than this section of the tutorial.

- Stop an application with this command (specify the PM2 App name or id):

`$ pm2 stop app_name_or_id`

- Restart an application with this command (specify the PM2 App name or id):

`$ pm2 restart app_name_or_id`

- The list of applications currently managed by PM2 can also be looked up with the list subcommand:

`$ pm2 list`

- More information about a specific application can be found by using the info subcommand (specify the PM2 App name or id):

`$ pm2 info example`

- The PM2 process monitor can be pulled up with the monit subcommand. This displays the application status, CPU, and memory usage:

`$ pm2 monit`

- Now that your Node.js application is running, and managed by PM2, let's set up the reverse proxy.

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

## Maps

### Type
- mapTypeId prop: 'roadmap' | 'hybrid' | 'satellite' | 'terrain'
- styles prop for road map styling

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