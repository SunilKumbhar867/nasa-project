const express = require('express');
const launchesRouter = express.Router();
const { getAllLaunches , httpAddNewLaunch , httpAbortLaunch} = require('./launches.controller')

launchesRouter.get('/', getAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);
module.exports = launchesRouter;