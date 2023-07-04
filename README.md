# Prerequisites:

### Node.js environment
yarn or npm package manager


### Database Installation 
Install PostgreSQL latest version
Create new database
Migration tables which is stored into src/migration/create.table.sql directory
Set database username, password and db port into .env.development


### Install dependencies from root directory where located package.json
yarn or npm install 
Set port into .env or default port 4002


### Run Project Development Environment
yarn start:dev or npm start:dev
Your project will be started http://localhost:4002/


### Run Project Production Environment
yarn start:prod or npm start:prod for production environment

### Example .env.development to run the project 
PORT <br/>
DB_HOST <br/>
DB_PORT <br/>
DB_USER <br/>
DB_PASS <br/>
DB_NAME <br/>
JKS_FILE <br/>
FIREBASE_SERVICE_ACCOUNT <br/>
GOOGLE_APPLICATION_CREDENTIALS <br/>
RTDB <br/>
POSTMARK_SERVER_TOKEN <br/>
BASE_URL <br/>
FROM_EMAIL <br/>
ZOOM_TOKEN <br/>
PROJECT_ID <br/>
