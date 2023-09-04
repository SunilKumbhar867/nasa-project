const {
  getAllLanuches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function getAllLaunches(req, res, next) {
  const { skip, limit } = await getPagination(req.query);
  const launches = await getAllLanuches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res, next) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid Launch date",
    });
  }
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res, next) {
  const launchId = Number(req.params.id);
  const existLaunch = await existsLaunchWithId(launchId);
  if (!existLaunch) {
    return res.status(404).json({
      error: "Launch not Found",
    });
  }

  // if launches does exist
  const aborted = await abortLaunchById(launchId);
  // if (!aborted) {
  //     res.status(400).json({
  //         error: 'Launch not aborted'
  //     })
  // }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  getAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
