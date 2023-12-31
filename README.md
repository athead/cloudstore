# Cloud Store

[DEMO](http://89.223.122.39:3001/)

## Description

Pet-project.
Cloud store for sharing files with friends. 
Default: 100MB per user.

## Features

- React
- Redux
- Lazy load
- Node.js
- Express.js
- MongoDB Atlas
- Breadcrumbs

## Build and Setup

```bash
# Start client
$ cd ./client
$ npm install
$ npm start

# Start server
$ cd ./server
$ npm install
$ npm run dev
```

## DB Structure

### user Schema
- login: {type: String, required: true, unique: true},
- password: {type: String, required: true},
- freeSpace: {type: Number, default: 1024**2*100},
- usedSpace: {type: Number, default: 0},
- files: [{type: ObjectId, ref:'File'}]

### file Schema
- name: { type: String, required: true },
- type: { type: String, required: true },
- extension: { type: String, default: "" },
- date: { type: Date, default: Date.now() },
- size: { type: Number, default: 0 },
- path: { type: String, default: "" },
- access_link: { type: String },
- user: { type: ObjectId, ref: "User" },
- parent: { type: ObjectId, ref: "File" },
- child: [{ type: ObjectId, ref: "File" }],


## TODO list

1. [x] Close filter and search on click outside
2. [x] Search input "Enter" handler
3. [x] Fixed navbar "disk buttons" display (to avoid shaking)
4. [ ] Add preview for files
5. [x] Move size human view calculation function to _helpers
6. [x] Fix uploader (count from 1)
7. [x] Fix free space percentage
