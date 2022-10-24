const express = require('express');
const MainRouter = require('../routes/index')

const app = express();

app.use( express.json() );
app.use( express.urlencoded( {extended: true} ) );

app.use( '/api', MainRouter );

module.exports = app;
