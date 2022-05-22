const {dbOpt} = require("../config");
const Pool = require('pg').Pool;

const pool = new Pool(dbOpt)

module.exports = pool;
