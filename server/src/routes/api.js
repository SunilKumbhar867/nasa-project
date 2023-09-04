const express = require('express');
const api = express.Router();
const planetsRouter = require('./planets/planets.route');
const launchesRouter = require('./launches/launches.route');


api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = api;