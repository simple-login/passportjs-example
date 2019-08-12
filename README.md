# Step 1: Bootstrap

Create a folder for the project 

```bash
mkdir passportjs-example 
cd passportjs-example 
```

Install express generator:

> npm install express-generator -g

Generate the project

> express -e .

Install all dependencies:

> npm i

Run the project

> npm start

Open http://localhost:3000, you should see this empty page

![](./docs/step-1.png)

# Step 2: Bootstrap OpenID

Install `dotenv`

> npm install dotenv --save

Load `dotenv`, add the following lines on top of `app.js`:

```js
require('dotenv').config()
```

Create the `.env` file based on the `.env.example` one:

> cp .env.example .env

Get the OAuth-Client-Id and OAuth-Client-Secret from your SimpleLogin app and make sure to fill up the corresponding values in `.env`

Install `passport passport-openidconnect express-session`

> npm install passport@0.4.0 passport-openidconnect@0.0.2 express-session@1.15.6 --save

Add the following lines to `app.js` just below `var logger = require('morgan');` to import passport:

```js
var session = require('express-session');
var passport = require('passport');
var OidcStrategy = require('passport-openidconnect').Strategy;
```

At this step, `npm start` should still work and http://localhost:3000 is still this empty page.



