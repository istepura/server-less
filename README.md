# Server "Less"

Simple and stupid REST service to fetch logs from the machine the service runs on

## Usage
The service worked on my machine™ with Node v20.11. I don't see any reson for it not to run in any recent-ish version of Node

### Installation
Run `npm install` to have dependencies installed

### Running the service
Run `npm start` in the console. 

There are a few tests for the file reader part, you can run them with `npm test` 

### API
Service has 2 simple endpoints

* `GET /files` - returns a list of files available in the logs directory (`/var/log/` by default)
* `GET /logs/{fileName}` - reads lines from the specified log file. Lines will be returned in the new-to-old order


More detailed API documentation will be available at http://localhost:3000/api-docs/ when service runs
### Using API

Swagger UI is also a good way to test the service, hit "Try it out" button and make requests with parameters you want

## Code style
If you feel inclined to change the code. This repo uses [StandardJS](https://standardjs.com/) style.
