// const mongoose = require('mongoose');

// async function connectDB() {
//     try {
//         const conn = await mongoose.connect(`mongodb://127.0.0.1:27017/nasa`, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(error.message);
//         process.exit(1);
//     }
// }

// async function mongoDisconnect() {
//     await mongoose.disconnect();
// }

// module.exports = {
//     connectDB,
//     mongoDisconnect
// };

//mongodb+srv://kumbharsunil9821:8dnjcJASaaWE0PvF@nasa.iokscpd.mongodb.net/

const mongoose = require("mongoose");

require('dotenv').config();

// Update below to match your own MongoDB connection string.
// const MONGO_URL =
//   "mongodb+srv://kumbharsunil9821:8dnjcJASaaWE0PvF@nasa.iokscpd.mongodb.net/";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  connectDB,
  mongoDisconnect,
};
