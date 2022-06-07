const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();


const whitelist = ['http://localhost:3000']; // list of allow domain

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (whitelist.indexOf(origin) === -1) {
      let msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}


app.use(cors(corsOptions));

app.use(express.static('./dist/tfmApp'));

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: 'dist/tfmApp' })
})

app.listen(process.env.PORT || 8080);
