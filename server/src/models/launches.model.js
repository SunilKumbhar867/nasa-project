const launches = require("./launches.schema");
const planets = require("./plantes.schema");
const axios = require("axios");
// const launches = new Map();
const DEFAULT_FILGHT_NUMBER = 100;
// let latestFlightNumber = 100;

// const launch = {
//   flightNumber: 100, // flight_number
//   mission: "Kepler Exploration X", //name
//   rocket: "Explorer IS1", // rocket.name
//   launchDate: new Date("December 27, 2030"), //date_local
//   target: "Kepler-442 b", // not applicable
//   customers: ["ZTM", "ISRO"], // payload.customer for each payload
//   upcoming: true, //upcoming
//   success: true, //success
// };

// launches.set(launch.flightNumber, launch);
// console.log(launches,'launches');
// saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches(){
    console.log("Downloading launch data.....");
    const response = await axios.post(SPACEX_API_URL, {
      query: {},
      options: {
          "pagination": false,
           // "page":5,
          // "limit":20,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    });

    if(response.status !== 200){
      console.log(`Probleming downloading launch data`);
      throw new Error('Launch data download failed')
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
      const payloads = launchDoc["payloads"];
      const customers = payloads.flatMap((payload) => {
        return payload["customers"];
      });
  
      const launch = {
        flightNumber: launchDoc["flight_number"],
        mission: launchDoc["name"],
        rocket: launchDoc["rocket"]["name"],
        launchDate: launchDoc["date_local"],
        upcoming: launchDoc["upcoming"],
        success: launchDoc["success"],
        customers,
      };
      // console.log(`${launchDoc["name"]}`);
      // populate launches collect do to for next video ....
      await saveLaunch(launch);
    }
}

async function loadLaunchData() {
   const firstLaunch =  await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });
    console.log(firstLaunch);
    if(firstLaunch){
        console.log(`Launch data already loaded!`);
    }else{
        await populateLaunches();
    }
}


async function findLaunch(filter){
    return await launches.findOne(filter)
}

async function existsLaunchWithId(launchId) {
  // return launches.has(launchId);
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getLastestFlightNumber() {
  const lastestLaunch = await launches.findOne().sort("-flightNumber");

  if (!lastestLaunch) {
    return DEFAULT_FILGHT_NUMBER;
  }

  return lastestLaunch.flightNumber;
}

async function getAllLanuches(skip, limit) {
  // return Array.from(launches.values());
  console.log(skip)
  return await launches
  .find({},{__id: 0,__v: 0,})
  .sort({ flightNumber : 1}) // -1 for desc and 1 for asec
  .skip(skip)
  .limit(limit);
}

async function saveLaunch(launch) {
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

// async function addNewLaunch(launch) {
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber,
//         Object.assign(launch, {
//             success: true,
//             upcoming: true,
//             customers: ['Zero to Mastery', "NASA"],
//             flightNumber: latestFlightNumber,
//         }));
// }

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
    // console.log(`No matching planet found`)
  }
  const newFlightNumber = (await getLastestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  // doubt
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;

  const aborted = await launches.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
  getAllLanuches,
  // addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
  loadLaunchData,
};
