require('dotenv').config();
const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

const { connectDB } = require('./services/mongo')
const { loadPlanetData } = require('../src/models/planets.model');
const { loadLaunchData } = require('../src/models/launches.model');


// const MONGO_URL = 'mongodb+srv://nasa-api:vNGo8bM3GZjy4GZT@cluster0.vob6gmm.mongodb.net/nasa?retryWrites=true&w=majority';
//127.0.0.1
// mongoose.connection.once('open',()=>{
//     console.log('MongoDB Creation ready!')
// })

// mongoose.connection.on('error',(err)=>{
//     console.error(err);
// })

// mongoose.connect(
//     "mongodb://localhost/testdb",
//     () => console.log('connected'), //every single time it will create
//     (e) => console.log(e)
// );



async function startServer() {
    await connectDB();
    await loadPlanetData();
    await loadLaunchData();
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    });
}

startServer();