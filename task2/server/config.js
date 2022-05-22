exports.corsOptions = {
    origin: '*'
}

exports.serverOpt = {
    PORT: process.env.PORT || 3001
}

exports.dbOpt = {
    user: 'postgres',
    password: 'z8',
    host: 'localhost',
    port: 5432,
    database: 'test'
}
