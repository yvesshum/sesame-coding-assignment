# Sesame Coding Assignment 

This repo contains my solution to Sesame Lab's coding assignment.

You can view the live version on https://yvesshum.github.io/sesame-coding-assignment/

## Overview 

This project is split into 3 components: Frontend, Backend Database.

- The frontend is a ReactJS app that is being hosted by GitHub Pages 

- The backend is a NodeJS app that is being hosted on one of my personal GCP containers 

- The database is a PostgreSQL database that is also being hosted by the same container as the backend

## Requirements 

- Node >= 18 (might work with 16, I have not tested it)
- Docker (unless you want to supply your own postgres DB)

## How to run (local dev mode)

Running on local dev mode pretty much relies on the frontend proxying requests 
to the local backend server to avoid CORS issues.

There's a config file in `frontend/src/config.json` and `backend/config/default.json` 
if you want to change anything. I recommend leaving it as-is for local development.

The default config assumes that the database is available on localhost, port 5432, 
with username=postgres and password=password.

### Database 

0. Navigate to `/database`
1. Build the docker container with `docker build -t postgres .`
2. Run the container with `docker run -itd -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password postgres`

> If you want to change the username/password, make sure to update the backend config 

### Frontend 

0. Navigate to `/frontend` 
1. Install dependencies with `npm install` 
2. Run `npm run start` to launch the web server 

### Backend 

0. Navigate to `/backend`
1. Install dependencies with `npm install`
2. Run `npm run start:dev` to launch the dev version of the backend 


