# Pack On My Back

## Todos

### Top Priorities

- Auto add countries to list if in juncture while traveling
- Add some button links to profile page to edit info on own profle page (aka link to place to update countries visited etc)
- Look into search indexing (or lack there of...)
- Look at updating stores on mutation https://www.apollographql.com/docs/react/features/cache-updates.html#after-mutations
- Mobile usage!
    - overlays on hover need to always be there on mobile
- Pagination stories home screen
- Make sure ready to take live https://github.com/thedaviddias/Front-End-Checklist
- Test test test
- AWS domain email for S3 + RDS
- Currently trying to get application online
    - test ionic app up and running
    - pomb builds in prod flag so should be ready
    - Server is running MINUS the postgraphql setup. Need to spin up rds to test
        - AWS config being wonky. Would be preferred to fix.
    - Env vars
- Hosting

*AFTER ONLINE*

- Make sure we have efficient api calls and put some limiters on things like tripbyid so we dont get back all juncture or something when not required
- infinite scroll hub page
- netflix style infinite scroll for junctures view?
- Google Analytics - Page views working at least (on CN email... Make domain email)
    - Track activities - https://codeburst.io/using-google-analytics-with-angular-25c93bffaa18
    - Set up reporting api calls - http://2ality.com/2015/10/google-analytics-api.html
        - https://stackoverflow.com/questions/12837748/analytics-google-api-error-403-user-does-not-have-any-google-analytics-account
- Share buttons for posts / trips / junctures - in progress
- Need a way for user to reorder junctures or perhaps just by time ... need to consider
- Admin panels
- Flesh out user --> country page (bleh) trips, junctures, posts, pics
- Scroll to top when new route - fucked up because ionic...
- Favorites / 'add to pack' for posts, images, trips
- Search results view more - Look at reddit + maybe infinite scroll
- Think about sub trips ? i.e. a trek in the middle of a longer trip - Detour!
- Communit hub - Map view of trips users have posted + some kind of way to explore various places
- Open graph stuff http://ogp.me/



### ROUTING ITEM

- Changed to path strategy earlier for nicer looking url + disqus comments
- Caused local dev server to crash, but fix here in the node_modules/@ionic/app-scripts/dist/dev-server folder 
    - https://github.com/ionic-team/ionic/issues/10565
- Will need to make sure this work when we go live

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

- Figure out imgsrc for responsive choice on which size image to display on cards + posts (mostly for the primary photos since those ones have lots of options)

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
- Competitors: Polar Steps, Esplorio, inspirock

- Sponsored routes could be interesting. POMB would be used as a tracking/blogging tool for free to lure users, but non-obtrusive ads + sponsored routes could pay the bills. Travel companies around the world can gps their routes and show off what's avail to users. Get a cut or something of leads / conversions. Would need to flesh out the explore feature set and expand with hotels / activites / etc like lonely planet. Company accounts show off their trip options and user accounts.

- Company accounts could have their own accounts with subsequent dash to keep track of clciks / views etc. Custom comaany pages to show off their offerings and signups. Make these accounts premium with more analysis options etc.

- Most features available for free, but some premium like photo caps, private vs public posts, certain features. A couple bucks a year to stay premium. Maybe monthly? Seems like folks would only keep it as long as they're traveling. Maybe one off payments to post for a trip with limits to posts, pictures, etc but once it's there it's always there. Hard to say. 
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

## Digital Ocean

### Server Setup

- Linux terminal basics series https://www.digitalocean.com/community/tutorials/an-introduction-to-the-linux-terminal
- Create droplet
- Setup SSH https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-digitalocean-droplets
- Inital server setup (user + firewall) https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04
    - Common firewall rules / commands https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands
- Setup hostname https://www.digitalocean.com/community/tutorials/how-to-set-up-a-host-name-with-digitalocean
    - Create 'A' records
    - Point nameservers from registrar to DO https://www.digitalocean.com/community/tutorials/how-to-point-to-digitalocean-nameservers-from-common-domain-registrars#registrar-namecheap
- Install nginx https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04
- Create server blocks for multiple domains https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04
- Secure nginx with SSL https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04#step-4-%E2%80%94-obtaining-an-ssl-certificate
    - Issue as of writing https://github.com/certbot/certbot/issues/5405#issuecomment-356498627
    - Webroot aka path is how its set up in nginx. Example would be /var/www/bclynch.com/html
- Get node app rolling https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
    - Install node
    - Setup pm2
    - Setup reverse proxy for nginx
- Setup SFTP https://www.digitalocean.com/community/tutorials/how-to-use-sftp-to-securely-transfer-files-with-a-remote-server
- Setup mail https://www.digitalocean.com/community/tutorials/how-to-set-up-zoho-mail-with-a-custom-domain-managed-by-digitalocean-dns


### Logging Into Server

- SSH into server
    - `$ ssh <user>@<ip_address>`
    - `$ ssh bclynch@138.68.63.87`
- Switch user
    - `$ su - bclynch`
- Go to root
    - `$ exit`

#### Add New Key To Existing Server

- Suppose you have a new computer you want to log in with and need to setup ssh. Our server does not allow for password login so we need a workaround
- Login to digital ocean and head to the access console. Login to root
- `$ sudo nano /etc/ssh/sshd_config`
    - Change the line PasswordAuthentication from no to yes
- Save and exit the file and run `$ sudo systemctl reload sshd.service` and `sudo systemctl reload ssh` for config to take effect
- We can now login to root from our own terminal via password (where copy / paste actually works)
- `$ cd ~/.ssh`
- `$ nano authorized_keys`
- Copy the pub key from the local computer and paste in here
    - `$ cat ~/.ssh/id_rsa.pub` will display the pub key so we can copy
- Now we should be able to access root via ssh. Go ahead and revert the PasswordAuthentication from yes to no
- Save and exit the file and run `$ sudo systemctl reload sshd.service` and `sudo systemctl reload ssh` for config to take effect
- Do the same for any users you have to login as well so we can directly login through them

### Putting code on server

- First we want to build our code to minify and all. With Ionic we can do this with the following command
    - `$ npm run ionic:build -- --prod`

### Updating Servers

- Server should be updated frequently with the following:
    - `$ apt-get update && apt-get upgrade`

### nginx

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

### SFTP 

- Login: `$ sftp username@remote_hostname_or_IP`
- Current directory: `$ pwd`
- Get files: `$ get remoteFile`
- Get directory and all its contents: `$ get -r someDirectory`
- Transfer to remote: `$ put localFile`
- Transfer entire directory: `$ put -r localDirectory`
- End session: `$ bye`

Also cyberduck makes this easier.....

### Bash

#### Handy Commands

- Open file in editor
    - `$ sudo nano <path>`
    - ^x to quit then y to save
- Remove folder and all contents
    - `$ rm -rf <name>`
- Create folder
    - `$ mkdir <name>`
- Create file
    - `$ touch <name>`

### PM2

- PM2 provides an easy way to manage and daemonize applications (run them in the background as a service).
- Applications that are running under PM2 will be restarted automatically if the application crashes or is killed, but an additional step needs to be taken to get the application to launch on system startup (boot or reboot).

#### Start App

- `$ pm2 start <file>`

- The startup subcommand generates and configures a startup script to launch PM2 and its managed processes on server boots:

- `$ pm2 startup systemd`

- Run the command that was generated to set PM2 up to start on boot

- This will create a systemd unit which runs pm2 for your user on boot. This pm2 instance, in turn, runs hello.js. You can check the status of the systemd unit with systemctl:

- `$ systemctl status pm2-bclynch`

#### Sub Commands

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