const express = require('express');
const path = require('path');
const api = require('./routes/api')
const cors = require('cors');
const morgan = require('morgan')
const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('combined')); // log
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', api);


app.get('/*', (req, res) => {
    res.sendFile(express.static(path.join(__dirname, '..', 'public', 'index.html')))
})
module.exports = app;