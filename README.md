# URL Shortener

URL Shortener is a system that allows the user to shorten long URLs.

## Setup

* node 11.2.0
* mongodb 3.6.3
* mongoose 5.10.19
* express 4.16.4

Clone the repository to the local.

From the terminal reach the relevant directory and run "npm install" command to get all dependencies that are listed in package.json

Ensure that Mongo DB is installed

Start the application with "npm start"

## Details

#### index.js (Server Side)
```
Modules
body-parser -> to parse all incoming request bodies
dns -> enables name resolution (look up IP addresses of host names)
nanoid -> to generate unique string ids (to be replaced with slug)

Operations
Database connection & collection update, insert
Validity check for the URL

```

#### shorten.js (ClientSide)

#### db.js (Database Operations)

### Tests
```
Modules
supertest -> provides abstraction for testing HTTP
```

Jest is used as a test framework.

## Architecture:
- 3-Tier Architecture is used
- APIs are based on REST
