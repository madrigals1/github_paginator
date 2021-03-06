# JSON Formatter and Github Paginator

It consists of 2 parts:
1) Formatter for **JSON**
2) Pagination using **Github Search API**

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

To test server functionality one by one, run
```
npm run test:server
npm run test:json
npm run test:pagination
```
To generate documentation, run
```
npm run doc
```
## Usage

#### Part 1 - JSON Formatter

JSON Formatter gets JSON document provided in **request** and formats
it, so that **children objects** are in the **children
array** of **parent objects.**

To format the JSON document, send request to http://localhost:3000/json 
along with JSON document in this format:

```json
{"0":
  [{"id": 10,
    "title": "House",
    "level": 0,
    "children": [],
    "parent_id": null}],
 "1":
  [{"id": 12,
    "title": "Red Roof",
    "level": 1,
    "children": [],
    "parent_id": 10},
   {"id": 18,
    "title": "Blue Roof",
    "level": 1,
    "children": [],
    "parent_id": 10},
   {"id": 13,
    "title": "Wall",
    "level": 1,
    "children": [],
    "parent_id": 10}],
 "2":
  [{"id": 17,
    "title": "Blue Window",
    "level": 2,
    "children": [],
    "parent_id": 12},
   {"id": 16,
    "title": "Door",
    "level": 2,
    "children": [],
    "parent_id": 13},
   {"id": 15,
    "title": "Red Window",
    "level": 2,
    "children": [],
    "parent_id": 12}]}
```

Can use [Postman](https://www.postman.com/) for sending requests.

Server will:
- Throw **HTTP** errors **400, 415, 422** if the JSON document is not valid
- Return **formatted JSON** in this format:

```json
[{"id": 10,
  "title": "House",
  "level": 0,
  "children":
   [{"id": 12,
     "title": "Red Roof",
     "level": 1,
     "children":
      [{"id": 17,
        "title": "Blue Window",
        "level": 2,
        "children": [],
        "parent_id": 12},
       {"id": 15,
        "title": "Red Window",
        "level": 2,
        "children": [],
        "parent_id": 12}],
     "parent_id": 10},
    {"id": 18,
     "title": "Blue Roof",
     "level": 1,
     "children": [],
     "parent_id": 10},
    {"id": 13,
     "title": "Wall",
     "level": 1,
     "children":
      [{"id": 16,
        "title": "Door",
        "level": 2,
        "children": [],
        "parent_id": 13}],
     "parent_id": 10}],
  "parent_id": null}]
```

#### Part 2 - Pagination with Github Search API

> For this feature to work, we should obtain **Github Token**.
It can work without Github Token, but the amount of requests will be limited to **60 per hour**.
Having Github Token, this amount will increase to **5000 requests per hour**, which will help
while running lots of auto tests.

This feature sends request to https://api.github.com/search/repositories 
with parameters:
- **PAGE** - current page of pagination.
- **PER_PAGE** - amount of repositories per page.
- **QUERY** - query word.

In our example, by default we will use:
- **PAGE** = 1
- **PER_PAGE** = 10
- **QUERY** = word

> These can be changed in **.env** file. Also, using simple **UI**, that is present on 
> http://localhost:3000/main, we can change values of **PAGE** and **QUERY** dynamically.

To see the results, check http://localhost:3000/main.

![UI Example](https://i.imgur.com/MDUBZeZ.png)

#### Additional

We can also check documentation for this project in http://localhost:3000

## Author

* **Adi Sabyrbayev** - [Github](https://github.com/madrigals1), [LinkedIn](https://www.linkedin.com/in/madrigals1/)
