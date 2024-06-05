

Added craco-module-federation to support being in a microfront-end architecture. 
This made it possible to not `eject` the Create React App while adding this functionality. 
This way I can update this standalone nba app and host it on www.guicoder.com/nbaApp for demo purposes and update a single code base.

running node v16.15.0 

NBA Stats API v1.1 Beta Documentation
https://documenter.getpostman.com/view/24232555/2s93shzpR3?ref=apilist.fun#intro

Table of top 200 players their stats sortable and filtered via name search or selected year.
Slide out panel displays player shot selection with basketballs drawn to a canvas element basketaball court.

Custom components:
    - dropdown
    - sliding-panel
    - search

## Available Scripts

### `npm start`

Runs the app in the development http://localhost:3001

### `npm test`

### `npm run build`

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

--legacy-peer-deps
--strict-peer-deps
--force

npm run build:prod