const express = require('express');
const planetsRouter = express.Router();
const { getAllPlantes } = require('./planets.controller');

planetsRouter.get('/', getAllPlantes);


module.exports = planetsRouter;