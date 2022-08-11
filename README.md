# Tulsa Remote Application

- [Local Installation](#local-install)
- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)

## Local Install

The project is divided into frontend (`client`) and backend (`server`).

- Install frontend:
```
cd client
npm install
```

- Install backend:
```
cd server
npm install
cp .env.default .env
```

Note: The server expects a local instance of MongoDB running.

- Run `npm start` in both the `client` and `server` directories.

Upon first npm start in server directory, a default admin user will be created with the following login credentials:
email: nitwit@gitwit.com
password: admin1234

# Deployment
Note: For right now, any changes to the `.env` files need to be made manually on the server. They are located in the `ubuntu` user's home directory. The deployment process copies this file to the directory where the application runs.

## Staging Deployment
- Merge changes from the `development` branch into staging. This will kick off a GH action to deploy the branch to the [staging environment](https://appstaging.tulsaremote.com/). 

## Production Deployment
- Increment the version number in the `package.json` file for both the [client](https://github.com/tulsateam/tulsa-remote-application/blob/master/client/package.json#L3) and [server](https://github.com/tulsateam/tulsa-remote-application/blob/master/server/package.json#L3). Note: the version number must match the `X.Y.Z` format.
- Rebase and merge master off the staging branch. This will kick off a GH action to deploy the branch to the [production environment](https://https://apply.tulsaremote.com/). 
