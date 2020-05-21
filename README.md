# Pomelo Challenge

This project is a [NodeJS challenge](https://github.com/pomelofashion/challenges/tree/master/challenge-nodejs) by Pomelo.

It consists of 2 parts:
1) Formatter for JSON, see [Part 1](https://github.com/pomelofashion/challenges/tree/master/challenge-nodejs#part-1)
2) Pagination using Github Search API, see [Part 2](https://github.com/pomelofashion/challenges/tree/master/challenge-nodejs#part-2)

Project was made by using [HapiJS](https://hapi.dev/) framework. 

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running](#running)
- [Author](#author)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites

- [Node.js](https://nodejs.org/en/) - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. 

## Installation

```
npm install
```

## Running

To start the server, simply run
```
npm start
```

To run unit test
```
npm test
```

To test server functionality or json formatting separately, run
```
npm test:server
npm test:json
```
respectively.

## Usage

#### Part 1 - JSON Formatter

JSON Formatter gets JSON document provided in **request** and formats
it, so that **children objects** are in the **children
array** of **parent objects.**

To format the JSON document, send request to http://localhost:3000/json 
along with JSON document in [this format](https://github.com/pomelofashion/challenges/tree/master/challenge-nodejs#appendix-1-input). 

Can use [Postman](https://www.postman.com/) for sending requests.

Server will:
- Throw **HTTP** errors **400, 415, 422** if the JSON document is not valid
- Return **formatted JSON** in [this format](https://github.com/pomelofashion/challenges/tree/master/challenge-nodejs#appending-2-output).

#### Part 2 - Pagination with Github Search API

> For this feature to work, we should obtain **Github Token**.
It can work without Github Token, but the amount of requests will be limited to **60 per hour**.
Having Github Token, this amount will increase to **5000 requests per hour**, which will help
while running lots of auto tests.

>P.S. I will provide my Github TOKEN inside **.env** file for this project.

This feature sends request to https://api.github.com/search/repositories 
with parameters:
- **PAGE** - current page of pagination.
- **PER_PAGE** - amount of repositories per page.
- **QUERY** - query word.

In our example, by default we will use:
- **PAGE** = 1
- **PER_PAGE** = 10
- **QUERY** - nodejs

> These can be changed in **.env** file


To see the results, check http://localhost:3000/main.

#### Additional

We can also check documentation for this project in http://localhost:3000

## Author

* **Adi Sabyrbayev** - [Github](https://github.com/madrigals1), [LinkedIn](https://www.linkedin.com/in/madrigals1/)