const express = require('express');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/studentRoutes');
const groupRoutes = require('./routes/groupRoutes');
const cors = require('cors');
const {
    corsOptions,
    serverOpt
} = require('./config');

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/student', studentRoutes);
app.use('/group', groupRoutes);

const start = async () => {
    try {
        app.listen(serverOpt.PORT, () => {
            console.log(`start on port ${serverOpt.PORT}`);
        })
    } catch (e) {
        console.log(e);
    }

}

start();


