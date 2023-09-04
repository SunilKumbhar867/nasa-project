const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const planets = require('./plantes.schema');

const habitablePlanets = [];

function isHabitablePlanet(planet) {

  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          // habitablePlanets.push(data);
          savePlantes(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err)
      })
      .on('end', async() => {
        // console.log(habitablePlanets.map((planet) => {
        //   return planet['kepler_name'];
        // }));
        const countPlanetsFound = (await getAllPlantes1()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
      });
    resolve();
  });
}

async function getAllPlantes1() {
  return await planets.find({},{
    '__id' : 0, '__v': 0,
  });
}

async function savePlantes(planet){
 try{
  await planets.updateOne({
    keplerName: planet.kepler_name
  }, {
    keplerName: planet.kepler_name
  }, {
    upsert: true
  });
 }catch(err){
  console.error(`Could not Save planet ${err}`);
 }
}

module.exports = {
  loadPlanetData,
  // planets: habitablePlanets,
  getAllPlantes1,
};