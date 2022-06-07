const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();


const whitelist = ['https://open-money-tools-front.herokuapp.com', 'https://open-money-tools.herokuapp.com', "http://openmoney.tools"]; // list of allow domain

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (whitelist.indexOf(origin) === -1) {
      console.log(origin);
      let msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}


app.use(cors(corsOptions));

app.options('*', cors());

app.use(express.static('./dist/tfmApp'));

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: 'dist/tfmApp' })
})

app.listen(process.env.PORT || 8080);
