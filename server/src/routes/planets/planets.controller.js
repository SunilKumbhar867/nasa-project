const { getAllPlantes1 } = require('../../models/planets.model')

const getAllPlantes = async (req, res, next) => {
    // console.log(planets)
    return res.status(200).json(await getAllPlantes1());
}

module.exports = {
    getAllPlantes
}